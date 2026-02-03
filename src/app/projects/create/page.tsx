'use client'

import { createProject } from '@/app/actions/project'
import { useUploadThing } from '@/lib/uploadthing'
import Link from 'next/link'
import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function CreateProjectPage() {
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
      alert('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!thumbnailUrl) {
      alert('Please upload a thumbnail image')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('thumbnailUrl', thumbnailUrl)
    
    try {
      await createProject(formData)
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Share Project</h1>
            <p className="text-gray-500 font-medium">Join the fair exposure community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Project Title</label>
             <input 
               name="title" 
               required 
               placeholder="e.g. Super Cool App" 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-gray-800 placeholder:text-gray-300" 
             />
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Thumbnail Image</label>
             
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
                     <div className="text-white font-bold">Uploading...</div>
                   </div>
                 )}
               </div>
             ) : (
               <label className="w-full h-48 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all">
                 <ImageIcon size={40} className="text-gray-400 mb-2" />
                 <span className="text-sm font-bold text-gray-500">Click to upload image</span>
                 <span className="text-xs text-gray-400 mt-1">Max 4MB</span>
                 <input 
                   type="file"
                   accept="image/*"
                   onChange={handleImageChange}
                   className="hidden"
                   required
                 />
               </label>
             )}
           </div>

           <div className="space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Project Link (Optional)</label>
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
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
             <textarea 
               name="description" 
               required 
               rows={4} 
               placeholder="Describe your masterpiece..." 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-300 resize-none" 
             />
           </div>

           <div className="pt-4">
             <button
               type="submit"
               disabled={uploading || !thumbnailUrl}
               className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {uploading ? 'Uploading...' : 'Create Project'}
             </button>
           </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Feed
          </Link>
        </div>
      </div>
    </div>
  )
}
