import { getFairProjects } from '@/app/actions/project'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

export const revalidate = 0

// Next.js 15+ Server Component Props
interface MainPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function MainPage(props: MainPageProps) {
  const searchParams = await props.searchParams
  const category = searchParams.category || 'All'
  const projects = await getFairProjects(category)

  const categories = ['All', 'Web', 'App', 'Design', 'AI', 'Game', 'Other']

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Navigation Bar */}
       <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
         <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black text-blue-600 tracking-tighter hover:opacity-80 transition-opacity">FairShare</Link>
            <div className="flex items-center gap-4">
               <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                 Creator Dashboard
               </Link>
               <Link href="/projects/create" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer active:scale-95">
                 Register Project
               </Link>
            </div>
         </div>
       </nav>

       <div className="flex-1 max-w-screen-xl mx-auto px-4 py-12 w-full">
          <header className="mb-12 text-center max-w-2xl mx-auto relative">
             <div className="absolute top-0 right-0 -mt-4 hidden lg:block">
                 <div className="bg-yellow-50 text-yellow-800 text-xs font-bold px-3 py-2 rounded-lg border border-yellow-100 shadow-sm max-w-[200px] text-left">
                    💡 Why the list changes?
                    <p className="font-medium text-yellow-700 mt-1 leading-normal">
                      We randomly select projects with <span className="underline decoration-dotted">low exposure</span> to ensure everyone gets a fair chance!
                    </p>
                 </div>
             </div>

             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
               Fair Exposure for <br/>
               <span className="text-blue-600">Every Creator</span>
             </h1>
             <p className="text-lg text-gray-500 leading-relaxed mb-8">
               We believe every project deserves a spotlight. Our algorithm prioritizes hidden gems to ensure fair visibility for all.
             </p>

             {/* Category Filter Chips */}
             <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map(cat => (
                  <Link 
                    key={cat} 
                    href={cat === 'All' ? '/' : `/?category=${cat}`}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      category === cat 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
             </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {projects.map(project => (
               <ProjectCard key={project.id} project={project} />
             ))}
          </div>

          {projects.length === 0 && (
             <div className="mt-12 p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="mb-4 text-4xl">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects in {category}</h3>
                <p className="text-gray-500 mb-6">Be the first to share your work in this category.</p>
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
