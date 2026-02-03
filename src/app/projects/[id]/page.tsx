import { getProject } from '@/app/actions/project'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
       <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100">
          
          {/* Header Image */}
          <div className="w-full aspect-video bg-gray-100 relative">
             {project.thumbnailUrl ? (
                <img 
                  src={project.thumbnailUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover" 
                />
             ) : (
                <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
             )}
             
             <Link href="/" className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-gray-800 hover:bg-white transition-all shadow-sm flex items-center gap-2">
                &larr; Back
             </Link>
          </div>

          <div className="p-8 md:p-12">
             <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
                <div>
                   <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                     {project.title}
                   </h1>
                   <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1">
                        By <span className="text-gray-900 font-bold">{project.user.name || 'Anonymous'}</span>
                      </span>
                      <span>•</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>

                <div className="flex gap-3">
                   {project.projectUrl && (
                      <a 
                        href={project.projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
                      >
                         Visit Project
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                   )}
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">About this project</h3>
                   <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Stats</h3>
                      
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-gray-600 font-medium">Views</span>
                         <span className="text-2xl font-black text-gray-900">{project.viewCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <span className="text-gray-600 font-medium">Fair Impressions</span>
                         <span className="text-2xl font-black text-blue-600">{project.impressionCount.toLocaleString()}</span>
                      </div>
                   </div>

                   <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
                      <p className="text-blue-900 text-sm italic">
                         "This project is gaining visibility thanks to FairShare's exposure algorithm."
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
