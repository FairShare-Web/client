import { createProject } from '@/app/actions/project'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'

export default function CreateProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Share Project</h1>
            <p className="text-gray-500 font-medium">Join the fair exposure community</p>
        </div>

        <form action={createProject} className="space-y-6">
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
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Thumbnail URL</label>
             <input 
               name="thumbnailUrl" 
               type="url" 
               required 
               placeholder="https://..." 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-300" 
             />
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
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
             <select 
               name="category" 
               className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800 appearance-none cursor-pointer"
             >
               <option value="Web">Web</option>
               <option value="App">App</option>
               <option value="Design">Design</option>
               <option value="AI">AI</option>
               <option value="Game">Game</option>
               <option value="Other">Other</option>
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
             <SubmitButton />
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
