'use client'

import { signIn } from '@/app/actions/auth'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      // Pass 'google' as the provider
      await signIn('google')
    } catch (error) {
      console.error('Login failed:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 relative z-10">
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors text-sm font-semibold mb-6">
                <ArrowLeft size={16} className="mr-1" />
                홈으로 돌아가기
            </Link>
            
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">로그인</h1>
            <p className="text-gray-500 font-medium">FairShare와 함께 공정한 창작 생태계를 만들어가세요.</p>
        </div>

        <div className="space-y-4">
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold rounded-2xl transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm group"
            >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                    <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="group-hover:text-gray-900">Google로 시작하기</span>
                    </>
                )}
            </button>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
                로그인 시 <Link href="/terms" className="underline hover:text-gray-600">이용약관</Link> 및 <Link href="/privacy" className="underline hover:text-gray-600">개인정보처리방침</Link>에 동의하게 됩니다.
            </p>
        </div>
      </div>
    </div>
  )
}
