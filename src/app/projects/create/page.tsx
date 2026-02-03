'use client'

import { createProject } from '@/app/actions/project'
import { useUploadThing } from '@/lib/uploadthing'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function CreateProjectPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const { startUpload } = useUploadThing("imageUploader")

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
        setThumbnailUrl(res[0].url)
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
    
    const formData = new FormData(e.currentTarget)
    if (thumbnailUrl) {
      formData.set('thumbnailUrl', thumbnailUrl)
    }
    
    try {
      await createProject(formData)
      router.push('/')
      router.refresh() // Optional: Ensure data is fresh
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('프로젝트 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">프로젝트 공유</h1>
            <p className="text-gray-500 font-medium">공정한 노출의 기회를 잡으세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">프로젝트 제목</label>
             <input 
               name="title" 
               required 
               placeholder="예: 멋진 웹사이트" 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-gray-800 placeholder:text-gray-300" 
             />
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
               썸네일 이미지 <span className="text-gray-300 font-normal lowercase">(선택)</span>
             </label>
             
             {previewUrl ? (
               <div className="relative">
                 <img 
                   src={previewUrl} 
                   alt="Preview" 
                   className="w-full h-48 object-cover rounded-2xl border-2 border-gray-200"
                 />
                 <button
                   type="button"
                   onClick={() => {
                     setPreviewUrl('')
                     setThumbnailUrl('')
                   }}
                   className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                 >
                   <X size={16} />
                 </button>
                 {uploading && (
                   <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                     <div className="text-white font-bold">업로드 중...</div>
                   </div>
                 )}
               </div>
             ) : (
               <label className="w-full h-48 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all">
                 <ImageIcon size={40} className="text-gray-400 mb-2" />
                 <span className="text-sm font-bold text-gray-500">클릭하여 이미지 업로드</span>
                 <span className="text-xs text-gray-400 mt-1">미입력 시 기본 이미지가 적용됩니다</span>
                 <input 
                   type="file"
                   accept="image/*"
                   onChange={handleImageChange}
                   className="hidden"
                 />
               </label>
             )}
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">프로젝트 링크 (선택)</label>
             <input 
               name="projectUrl" 
               type="url" 
               placeholder="https://..." 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-300" 
             />
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">카테고리</label>
             <select 
               name="category" 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 appearance-none cursor-pointer"
             >
               <option value="Web">웹</option>
               <option value="App">앱</option>
               <option value="AI">AI</option>
               <option value="Game">게임</option>
               <option value="Design">디자인</option>
               <option value="Other">기타</option>
             </select>
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">설명</label>
             <textarea 
               name="description" 
               required 
               rows={4} 
               placeholder="프로젝트에 대해 설명해주세요..." 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-300 resize-none" 
             />
           </div>

           <div className="pt-4">
             <button
               type="submit"
               disabled={uploading}
               className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {uploading ? '업로드 중...' : '등록하기'}
             </button>
           </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            피드로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
