'use client'

import { updateProfile, getCurrentUserProfile } from '@/app/actions/profile'
import { useUploadThing } from '@/lib/uploadthing'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, X } from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const { startUpload } = useUploadThing("imageUploader")

  useEffect(() => {
    getCurrentUserProfile().then(user => {
      if (!user) {
        router.push('/login')
        return
      }
      setProfile(user)
      if (user.image) {
        setImageUrl(user.image)
        setPreviewUrl(user.image)
      }
      setLoading(false)
    })
  }, [router])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Uploadthing
    setUploading(true)
    try {
      const res = await startUpload([file])
      if (res && res[0]) {
        setImageUrl(res[0].url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    if (imageUrl) {
      formData.set('image', imageUrl)
    }
    
    try {
      await updateProfile(formData)
      const username = formData.get('username') as string
      router.push(`/profile/${username || profile.id}`)
    } catch (err: any) {
      setError(err.message || '프로필 수정에 실패했습니다')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">프로필 수정</h1>
          <p className="text-gray-500 font-medium">공개 정보를 수정하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              프로필 이미지
            </label>
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('')
                      setImageUrl('')
                    }}
                    className="absolute top-0 right-0 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs font-bold">업로드 중...</div>
                  </div>
                )}
              </div>
              
              <label className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer transition-colors">
                이미지 선택
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              이름
            </label>
            <input 
              name="name" 
              defaultValue={profile?.name || ''}
              placeholder="이름" 
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-gray-800 placeholder:text-gray-300" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              아이디
            </label>
            <input 
              name="username" 
              defaultValue={profile?.username || ''}
              placeholder="username" 
              pattern="[a-zA-Z0-9_-]+"
              title="영문, 숫자, 밑줄, 하이픈만 사용할 수 있습니다"
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-gray-800 placeholder:text-gray-300" 
            />
            <p className="text-xs text-gray-400 ml-1">
              프로필 주소: fairshare.com/profile/아이디
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              소개
            </label>
            <textarea 
              name="bio" 
              defaultValue={profile?.bio || ''}
              rows={4} 
              placeholder="자신을 소개해보세요..." 
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-300 resize-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              웹사이트
            </label>
            <input 
              name="website" 
              type="url"
              defaultValue={profile?.website || ''}
              placeholder="https://yourwebsite.com" 
              className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-300" 
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>

            <Link 
              href={`/profile/${profile?.username || profile?.id}`}
              className="block w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-center rounded-2xl transition-all"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
