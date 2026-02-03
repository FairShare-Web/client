import { getFairProjects } from '@/app/actions/project'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

export const revalidate = 0

export default async function MainPage() {
  const projects = await getFairProjects()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Navigation Bar Placeholder */}
       <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 bg-opacity-80 backdrop-blur-md">
         <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black text-blue-600 tracking-tighter">FairShare</Link>
            <Link href="/projects/create" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer">
              Register Project
            </Link>
         </div>
       </nav>

       <div className="flex-1 max-w-screen-xl mx-auto px-4 py-12 w-full">
          <header className="mb-12 text-center max-w-2xl mx-auto">
             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
               Fair Exposure for <br/>
               <span className="text-blue-600">Every Creator</span>
             </h1>
             <p className="text-lg text-gray-500 leading-relaxed">
               We believe every project deserves a spotlight. Our algorithm prioritizes hidden gems to ensure fair visibility for all.
             </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {projects.map(project => (
               <ProjectCard key={project.id} project={project} />
             ))}
          </div>

          {projects.length === 0 && (
             <div className="mt-12 p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="mb-4 text-4xl">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your work with the world.</p>
                <Link href="/projects/create" className="text-blue-600 font-semibold hover:underline">
                  Start your journey &rarr;
                </Link>
             </div>
          )}
       </div>

       <footer className="bg-white border-t border-gray-100 py-8 mt-20">
         <div className="max-w-screen-xl mx-auto px-4 text-center text-gray-400 text-sm">
           &copy; {new Date().getFullYear()} FairShare. built for fairness.
         </div>
       </footer>
    </div>
  )
}
