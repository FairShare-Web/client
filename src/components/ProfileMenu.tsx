'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'

interface ProfileMenuProps {
  user: {
    id: string
    name?: string | null
    image?: string | null
    username?: string | null
  }
  onSignOut: () => void
}

export default function ProfileMenu({ user, onSignOut }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
          {user.image ? (
            <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-blue-600" />
          )}
        </div>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm">{user.name || '익명'}</p>
            <p className="text-xs text-gray-500">@{user.username || user.id.slice(0, 8)}</p>
          </div>

          <Link
            href={`/profile/${user.username || user.id}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <User size={18} />
            프로필
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <LayoutDashboard size={18} />
            대시보드
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-sm font-medium text-red-600 w-full"
            >
              <LogOut size={18} />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
