'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { pusherClient } from '@/lib/pusher'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/app/actions/notification'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  message: string
  link?: string | null
  read: boolean
  createdAt: Date
  type: string
}

export default function NotificationDropdown({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch initial notifications
  useEffect(() => {
    getNotifications().then(data => {
        setNotifications(data.map(n => ({
            ...n,
            createdAt: new Date(n.createdAt)
        })))
    })
  }, [])

  // Subscribe to Pusher
  useEffect(() => {
    if (!userId) return

    const channel = pusherClient.subscribe(`user-${userId}`)
    
    channel.bind('notification', (data: any) => {
      const newNoti: Notification = {
          id: `temp-${Date.now()}`, 
          message: data.message,
          link: data.link,
          read: false,
          createdAt: new Date(),
          type: 'LIKE'
      }
      
      setNotifications(prev => [newNoti, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      pusherClient.unsubscribe(`user-${userId}`)
    }
  }, [userId])

  // Count unread
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    await markAllNotificationsAsRead()
  }

  const handleNotificationClick = async (noti: Notification) => {
      if (!noti.read) {
          if (!noti.id.startsWith('temp')) {
             await markNotificationAsRead(noti.id)
          }
           setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, read: true } : n))
      }
      setIsOpen(false)
      if (noti.link) router.push(noti.link)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:bg-gray-100 outline-none"
      >
        <Bell size={20} className="text-gray-500" />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 max-h-[400px] overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="font-bold text-gray-900 text-sm">알림</h3>
            {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-blue-600 font-semibold hover:underline">
                    모두 읽음
                </button>
            )}
          </div>
          
          {notifications.length > 0 ? (
             <div className="py-2">
               {notifications.map(noti => (
                 <div 
                   key={noti.id}
                   onClick={() => handleNotificationClick(noti)}
                   className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 flex flex-col gap-1 ${noti.read ? 'border-transparent opacity-60' : 'border-blue-500 bg-blue-50/10'}`}
                 >
                    <p className="text-sm text-gray-800 font-medium leading-snug">{noti.message}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">
                        {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </p>
                 </div>
               ))}
             </div>
          ) : (
             <div className="py-12 text-center text-gray-400 text-sm flex flex-col items-center">
                 <Bell size={24} className="mb-2 opacity-20" />
                 새로운 알림이 없습니다
             </div>
          )}
        </div>
      )}
    </div>
  )
}
