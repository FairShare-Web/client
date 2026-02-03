import Link from 'next/link'
import { Project, User } from '@/generated/prisma/client'

interface ProjectCardProps {
  project: Project & { user: User }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden relative">
           {project.thumbnailUrl ? (
             <img 
               src={project.thumbnailUrl} 
               alt={project.title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
           ) : (
             <div className="text-gray-300 font-medium">No Image</div>
           )}
           <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              View details
           </div>
        </div>
        <div className="p-5 flex flex-col flex-1 relative">
           {project.impressionCount < 10 && (
             <span className="absolute -top-3 left-5 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 border-2 border-white">
               NEW ARRIVAL
             </span>
           )}
           {project.impressionCount >= 10 && project.impressionCount < 50 && (
              <span className="absolute -top-3 left-5 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 border-2 border-white flex items-center gap-1">
                <span className="animate-pulse">✨</span> SPOTLIGHT
              </span>
           )}

           <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
             {project.title}
           </h3>
           
           <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                {project.category}
              </span>
           </div>
           
           <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 font-medium mb-1">Created by</span>
               <span className="text-sm text-gray-700 font-semibold truncate max-w-[120px]">
                 {project.user.name || 'Anonymous'}
               </span>
             </div>
             
             <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                  Exposure
                  <div className="group/tooltip relative">
                    <svg className="w-3 h-3 text-gray-300 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="absolute bottom-full right-0 mb-2 w-32 bg-gray-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 text-center font-normal">
                      Times displayed to fair users
                    </span>
                  </div>
                </span>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold">
                  {project.impressionCount.toLocaleString()}
                </span>
             </div>
           </div>
        </div>
      </div>
    </Link>
  )
}
