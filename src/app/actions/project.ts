'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function getFairProjects(category?: string) {
  // Strategy:
  // 1. Fetch a pool of projects with the lowest impression counts
  // 2. Randomly select a subset to display
  // 3. Increment impression counts for the displayed projects
  
  const POOL_SIZE = 50
  const DISPLAY_COUNT = 12

  try {
    const whereClause = category && category !== 'All' ? { category } : {}

    // 1. Fetch pool
    const candidates = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        impressionCount: 'asc',
      },
      take: POOL_SIZE,
      include: {
        user: true, // Need creator info
      },
    })

    if (candidates.length === 0) {
      return []
    }

    // 2. Shuffle and Select
    // A simple shuffle
    const shuffled = candidates.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, DISPLAY_COUNT)

    // 3. Increment Impressions
    // We update in background or await. Await ensures accuracy but adds latency.
    // Given the requirement "when exposed... increment", doing it here is correct.
    const ids = selected.map((p: { id: string }) => p.id)
    
    if (ids.length > 0) {
      await prisma.project.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          impressionCount: {
            increment: 1,
          },
        },
      })
    }

    return selected
  } catch (error) {
    console.error('Failed to fetch fair projects:', error)
    return []
  }
}



// ... (previous code)

export async function getProject(id: string) {
  const session = await auth()
  const userId = session?.user?.id

  try {
    // First, get the project
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!project) {
      return null
    }

    // Then handle view counting
    if (userId) {
      // Logged in user - count once per user
      try {
        await prisma.$transaction(async (tx) => {
          const existingView = await tx.viewLog.findUnique({
            where: {
              userId_projectId: {
                userId,
                projectId: id
              }
            }
          })

          if (!existingView) {
            await tx.viewLog.create({
              data: { userId, projectId: id }
            })
            await tx.project.update({
              where: { id },
              data: { viewCount: { increment: 1 } }
            })
          }
        })
      } catch (viewError) {
        // Ignore unique constraint errors (race condition)
        // The view was already counted, which is fine
        console.log('View already counted for this user')
      }
    }
    // For anonymous users, we don't count views to prevent abuse
    // Only logged-in members get counted as per requirement

    return project
  } catch (error) {
    console.error('Failed to get project:', error)
    return null
  }
}


export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  const projectUrl = formData.get('projectUrl') as string
  const category = formData.get('category') as string || 'Web'

  if (!title || !description || !thumbnailUrl) {
     throw new Error('Missing required fields')
  }

  // Create Project linked to authenticated user
  await prisma.project.create({
    data: {
      title,
      description,
      thumbnailUrl,
      projectUrl,
      category,
      userId: session.user.id,
      // Default viewCount, impressionCount is 0
    }
  })

  // 3. Revalidate and Redirect
  revalidatePath('/')
  redirect('/')
}

export async function getCreatorStats() {
  const session = await auth()
  
  if (!session?.user?.id) return null

  try {
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            projects: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!user) return null

    return user.projects
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return null
  }
}

export async function getRelatedProjects(currentProjectId: string, category: string) {
  try {
    const related = await prisma.project.findMany({
      where: {
        AND: [
          { category: category }, // Try to match category
          { id: { not: currentProjectId } } // Exclude current
        ]
      },
      orderBy: {
        impressionCount: 'asc' // Prioritize fairness
      },
      take: 3,
      include: {
        user: true
      }
    })

    // If not enough related projects, fill with any fair projects
    if (related.length < 3) {
       const others = await prisma.project.findMany({
          where: {
             AND: [
                { id: { notIn: [currentProjectId, ...related.map(p => p.id)] } }
             ]
          },
          orderBy: { impressionCount: 'asc' },
          take: 3 - related.length,
          include: { user: true }
       })
       return [...related, ...others]
    }

    return related
  } catch (error) {
    console.error('Failed to fetch related projects', error)
    return []
  }
}

export async function likeProject(projectId: string) {
  const session = await auth()
    
  if (!session?.user?.id) {
     return // Or throw error
  }
  
  const userId = session.user.id

  try {
    // Transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
       const existingLike = await tx.likeLog.findUnique({
         where: {
           userId_projectId: {
             userId,
             projectId
           }
         }
       })

       if (existingLike) {
         // Already liked. Toggle off? Or just do nothing?
         // Usually "like" is a toggle. Let's make it a toggle (Like/Unlike) or just ignore duplicates?
         // Request says "count 1". Usually implies duplicate prevention.
         // Let's implement TOGGLE behavior for better UX.
         await tx.likeLog.delete({
            where: {
                userId_projectId: { userId, projectId }
            }
         })
         await tx.project.update({
            where: { id: projectId },
            data: { likeCount: { decrement: 1 } }
         })
       } else {
         // New like
         await tx.likeLog.create({
            data: { userId, projectId }
         })
         await tx.project.update({
            where: { id: projectId },
            data: { likeCount: { increment: 1 } }
         })
       }
    })

    revalidatePath('/')
    revalidatePath(`/projects/${projectId}`)
  } catch (error) {
    console.error('Failed to like project:', error)
  }
}
