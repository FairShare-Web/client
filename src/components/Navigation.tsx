'use client'

import { signIn, signOut } from '@/app/actions/auth'
import ProfileMenu from './ProfileMenu'
import Link from 'next/link'

interface NavigationProps {
  session: any
}

export default function Navigation({ session }: NavigationProps) {
  const handleSignOut = async () => {
    await signOut()
  }

  const handleSignIn = async () => {
    await signIn()
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-blue-600 tracking-tighter hover:opacity-80 transition-opacity">
          FairShare
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link 
                href="/projects/create" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer active:scale-95"
              >
                프로젝트 등록
              </Link>
              <ProfileMenu 
                user={{
                  id: session.user.id,
                  name: session.user.name,
                  image: session.user.image,
                  username: session.user.username
                }}
                onSignOut={handleSignOut}
              />
            </>
          ) : (
            <button 
              onClick={handleSignIn}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              로그인 / 시작하기
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
