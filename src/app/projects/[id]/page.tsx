import { getProject, getRelatedProjects } from '@/app/actions/project'
import ProjectCard from '@/components/ProjectCard'
import ShareButtons from '@/components/ShareButtons'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ExternalLink, Eye, BarChart2, Heart } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  // Note: In a real app we might want to cache this fetch or use a separate lighter fetch
  const project = await getProject(id)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | FairShare`,
    description: project.description.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
      images: [project.thumbnailUrl],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description.substring(0, 160),
      images: [project.thumbnailUrl],
    }
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(project.id, project.category)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
       <div className="max-w-5xl w-full">
           <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100 mb-12">
              
              {/* Header Image */}
              <div className="w-full aspect-[2/1] bg-gray-100 relative group">
                 {project.thumbnailUrl ? (
                    <Image 
                      src={project.thumbnailUrl} 
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                 ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                 )}
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                 <Link href="/" className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-gray-800 hover:bg-white transition-all shadow-lg flex items-center gap-2">
                    &larr; Back to Fair List
                 </Link>
                 
                 <div className="absolute bottom-6 left-6 md:left-10 text-white">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
                      {project.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2 drop-shadow-lg">
                      {project.title}
                    </h1>
                 </div>
              </div>
    
              <div className="p-8 md:p-12">
                 <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3">
                       <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {project.user.name?.[0] || 'A'}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900">{project.user.name || 'Anonymous'}</p>
                                <p className="text-xs">Creator</p>
                             </div>
                          </div>
                          <span className="h-4 w-px bg-gray-300 mx-2"></span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                       </div>
    
                       <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                         About this project
                       </h3>
                       <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                          {project.description}
                       </div>
                    </div>
    
                    <div className="lg:w-1/3 space-y-6">
                       {project.projectUrl && (
                          <a 
                            href={project.projectUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group block w-full bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                          >
                             <div className="flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-transparent group-hover:border-blue-400/30">
                                <span className="font-bold text-lg">Visit Project</span>
                                <ExternalLink size={20} />
                             </div>
                          </a>
                       )}
    
                       <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                             <BarChart2 size={14} />
                             Fairness Stats
                          </h3>
                          
                          <div className="grid grid-cols-3 gap-3">
                             <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-gray-400 mb-1 flex justify-center"><Eye size={20}/></div>
                                <span className="block text-2xl font-black text-gray-900">{project.viewCount.toLocaleString()}</span>
                                <span className="text-xs font-medium text-gray-500">Views</span>
                             </div>
                             
                             <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-blue-300 mb-1 flex justify-center"><BarChart2 size={20}/></div>
                                <span className="block text-2xl font-black text-blue-600">{project.impressionCount.toLocaleString()}</span>
                                <span className="text-xs font-medium text-gray-500">Impressions</span>
                             </div>

                             <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-red-400 mb-1 flex justify-center"><Heart size={20} className="fill-red-400"/></div>
                                <span className="block text-2xl font-black text-red-600">{project.likeCount.toLocaleString()}</span>
                                <span className="text-xs font-medium text-gray-500">Likes</span>
                             </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-200">
                             <p className="text-xs text-center text-gray-400">
                                This project is getting fair exposure based on visibility metrics.
                             </p>
                          </div>
                       </div>

                       <ShareButtons 
                         title={project.title}
                         url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/projects/${project.id}`}
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Related / Recommended Section */}
           {relatedProjects.length > 0 && (
             <div className="mb-12">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                   <span className="text-blue-600">Fair</span> Recommendations
                 </h2>
                 <Link href={`/?category=${project.category}`} className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                   See more {project.category} &rarr;
                 </Link>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {relatedProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
               </div>
             </div>
           )}
       </div>
    </div>
  )
}
