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
        <div className="p-5 flex flex-col flex-1">
           <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
             {project.title}
           </h3>
           
           <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 font-medium mb-1">Created by</span>
               <span className="text-sm text-gray-700 font-semibold truncate max-w-[120px]">
                 {project.user.name || 'Anonymous'}
               </span>
             </div>
             
             <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 font-medium mb-1">Impressions</span>
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
