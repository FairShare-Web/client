'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getUserProfile(usernameOrId: string) {
  try {
    // Try to find by username first, then by id
    let user = await prisma.user.findUnique({
      where: { username: usernameOrId },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // If not found by username, try by ID
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: usernameOrId },
        include: {
          projects: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    }

    if (!user) return null

    const totalLikes = user.projects.reduce((acc, p) => acc + p.likeCount, 0)
    const totalViews = user.projects.reduce((acc, p) => acc + p.viewCount, 0)
    const totalImpressions = user.projects.reduce((acc, p) => acc + p.impressionCount, 0)

    return {
      user,
      stats: {
        totalProjects: user.projects.length,
        totalLikes,
        totalViews,
        totalImpressions
      }
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const website = formData.get('website') as string
  const username = formData.get('username') as string
  const image = formData.get('image') as string

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        website,
        username: username || null,
        image: image || undefined
      }
    })

    revalidatePath(`/profile/${username}`)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('Username already taken')
    }
    throw new Error('Failed to update profile')
  }
}

export async function getCurrentUserProfile() {
  const session = await auth()
  if (!session?.user?.id) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    return user
  } catch (error) {
    return null
  }
}
