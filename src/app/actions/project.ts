'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getFairProjects() {
  // Strategy:
  // 1. Fetch a pool of projects with the lowest impression counts
  // 2. Randomly select a subset to display
  // 3. Increment impression counts for the displayed projects
  
  const POOL_SIZE = 50
  const DISPLAY_COUNT = 12

  try {
    // 1. Fetch pool
    const candidates = await prisma.project.findMany({
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



export async function getProject(id: string) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      },
      include: {
        user: true
      }
    })
    return project
  } catch (error) {
    return null
  }
}

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  const projectUrl = formData.get('projectUrl') as string

  if (!title || !description || !thumbnailUrl) {
    throw new Error('Missing required fields')
  }

  // 1. Get or Create Dummy User (No Auth in requirements)
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'creator@fairshare.com',
        name: 'Early Creator',
      }
    })
  }

  // 2. Create Project
  await prisma.project.create({
    data: {
      title,
      description,
      thumbnailUrl,
      projectUrl,
      userId: user.id,
      // Default viewCount, impressionCount is 0
    }
  })

  // 3. Revalidate and Redirect
  revalidatePath('/')
  redirect('/')
}

