'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const session = await auth()
  if (!session?.user?.id) return []

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return notifications
  } catch (error) {
    console.error('Failed to get notifications:', error)
    return []
  }
}

export async function markNotificationAsRead(id: string) {
   const session = await auth()
   if (!session?.user?.id) return

   try {
     await prisma.notification.update({
       where: { 
         id,
         userId: session.user.id
       },
       data: { read: true }
     })
     revalidatePath('/')
   } catch (error) {
     console.error('Failed to read notification:', error)
   }
}

export async function markAllNotificationsAsRead() {
   const session = await auth()
   if (!session?.user?.id) return

   try {
     await prisma.notification.updateMany({
       where: { 
         userId: session.user.id,
         read: false
       },
       data: { read: true }
     })
     revalidatePath('/')
   } catch (error) {
     console.error('Failed to read all notifications:', error)
   }
}
