import Link from 'next/link'
import { Project, User } from '@/generated/prisma/client'
import LikeButton from './LikeButton'

interface ProjectCardProps {
  project: Project & { user: User }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isNewToday = new Date(project.createdAt).toDateString() === new Date().toDateString()

  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col relative">
        
        {/* Like Button positioned absolutely */}
        <div className="absolute top-3 right-3 z-20">
           <LikeButton projectId={project.id} initialLikes={project.likeCount} />
        </div>

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
           <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              View details
           </div>
        </div>
        <div className="p-5 flex flex-col flex-1 relative">
           {/* Badges Container */}
           <div className="absolute -top-3 left-5 flex flex-col gap-1 items-start z-10">
               {isNewToday && (
                 <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-pink-200 border-2 border-white flex items-center gap-1.5 ring-1 ring-pink-50">
                    <span>🔥</span> TODAY
                 </span>
               )}
               
               {project.impressionCount < 10 && !isNewToday && (
                 <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-200 border-2 border-white flex items-center gap-1.5 ring-1 ring-blue-50">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                   </span>
                   신규 지원 (Spotlight)
                 </span>
               )}
           </div>

           <div className="flex flex-wrap gap-2 mb-3 mt-2">
              <span className="px-2.5 py-1 bg-gray-50 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wide border border-gray-100">
                {project.category}
              </span>
           </div>

           <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
             {project.title}
           </h3>
           
           <div className="mt-auto pt-5 border-t border-gray-50/80">
             <div className="flex items-center justify-between gap-4 mb-3">
               <div className="flex flex-col">
                 <span className="text-[10px] text-gray-400 font-semibold mb-0.5">Created by</span>
                 <span className="text-xs text-gray-800 font-bold truncate max-w-[100px]">
                   {project.user.name || 'Anonymous'}
                 </span>
               </div>
               
               <div className="flex gap-2">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-medium mb-0.5">노출 횟수</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold font-mono">
                      {project.impressionCount.toLocaleString()}
                    </span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-medium mb-0.5">조회수</span>
                    <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs font-bold font-mono">
                      {project.viewCount.toLocaleString()}
                    </span>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </Link>
  )
}
