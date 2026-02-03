'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { pusherServer } from '@/lib/pusher'

interface GetProjectsOptions {
  limit?: number
  excludeIds?: string[]
  query?: string
  category?: string
}

export async function getFairProjects(options: GetProjectsOptions = {}) {
  const session = await auth()
  const { limit = 12, excludeIds = [], query = '', category = 'All' } = options

  // Strategy:
  // 1. Fetch a pool of projects based on query and category, excluding seen IDs
  // 2. Sort by impressionCount for fairness
  // 3. Randomly select specific number from the top pool to ensure variety within the fair tier
  // 4. Increment impression counts

  const POOL_SIZE = Math.max(50, limit * 2)

  try {
    const whereClause: any = {
      id: { notIn: excludeIds }
    }

    if (category && category !== 'All') {
      whereClause.category = category
    }

    if (query) {
      const searchTerms = query.trim().split(/\s+/).join(' & ')
      whereClause.OR = [
        // Full-text search (Postgres)
        { title: { search: searchTerms } },
        { description: { search: searchTerms } },
        // Fallback/Partial match
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    // 1. Fetch pool
    const candidates = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        impressionCount: 'asc',
      },
      take: POOL_SIZE,
      include: {
        user: true, 
      },
    })

    if (candidates.length === 0) {
      return []
    }

    // 2. Shuffle and Select (Fairness + Variety)
    // If we have few results (e.g. search), just return them.
    // If we have many, pick randomly from the "fairest" pool to avoid strict deterministic order always showing same projects
    let selected = candidates
    if (candidates.length > limit) {
        const shuffled = candidates.sort(() => 0.5 - Math.random())
        selected = shuffled.slice(0, limit)
    }

    // 3. Increment Impressions (Background-ish)
    const ids = selected.map((p) => p.id)
    
    if (ids.length > 0) {
      // Use wait to ensure data consistency for tests/fast reloads, though could be fire-and-forget in prod
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

    if (session?.user?.id) {
        const userLikes = await prisma.likeLog.findMany({
            where: {
                userId: session.user.id,
                projectId: { in: ids }
            }
        })
        const likedSet = new Set(userLikes.map(l => l.projectId))
        return selected.map(p => ({ ...p, isLiked: likedSet.has(p.id) }))
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

    let isLiked = false
    if (userId) {
        const like = await prisma.likeLog.findUnique({
            where: { userId_projectId: { userId, projectId: id } }
        })
        isLiked = !!like
    }

    return { ...project, isLiked }
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
  const session = await auth()
  try {
    const related = await prisma.project.findMany({
      where: {
        AND: [
          { category: category }, 
          { id: { not: currentProjectId } } 
        ]
      },
      orderBy: { impressionCount: 'asc' },
      take: 3,
      include: { user: true }
    })

    let finalProjects = related

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
       finalProjects = [...related, ...others]
    }

    if (session?.user?.id) {
        const userLikes = await prisma.likeLog.findMany({
            where: {
                userId: session.user.id,
                projectId: { in: finalProjects.map(p => p.id) }
            },
            select: { projectId: true }
        })
        const likedSet = new Set(userLikes.map(l => l.projectId))
        return finalProjects.map(p => ({ ...p, isLiked: likedSet.has(p.id) }))
    }

    return finalProjects
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
    let notificationData: { userId: string, message: string, link: string } | null = null

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
         // Already liked. Toggle off
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

         // Create Notification
         const project = await tx.project.findUnique({
             where: { id: projectId }
         })

         if (project && project.userId !== userId) {
             const message = `Someone liked your project "${project.title}"`
             await tx.notification.create({
                 data: {
                     userId: project.userId,
                     type: 'LIKE',
                     message,
                     link: `/projects/${projectId}`
                 }
             })
             notificationData = {
                 userId: project.userId,
                 message,
                 link: `/projects/${projectId}`
             }
         }
       }
    })

    if (notificationData) {
        try {
            // @ts-ignore
            await pusherServer.trigger(`user-${notificationData.userId}`, 'notification', notificationData)
        } catch (pusherError) {
            console.warn('Failed to send realtime notification. Check Pusher config in .env:', pusherError)
        }
    }

    revalidatePath('/')
    revalidatePath(`/projects/${projectId}`)
  } catch (error) {
    console.error('Failed to like project:', error)
  }
}
