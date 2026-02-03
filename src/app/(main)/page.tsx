import { auth } from '@/auth'
import { getFairProjects } from '@/app/actions/project'
import ProjectCard from '@/components/ProjectCard'
import Navigation from '@/components/Navigation'
import ProjectFeed from '@/components/ProjectFeed'
import Link from 'next/link'

export const revalidate = 0

// Next.js 15+ Server Component Props
interface MainPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function MainPage(props: MainPageProps) {
  const session = await auth()
  const searchParams = await props.searchParams
  const category = searchParams.category || 'All'
  const initialProjects = await getFairProjects({ category, limit: 12 })

  const categoryMap: Record<string, string> = {
    'All': '전체',
    'Web': '웹',
    'App': '앱',
    'AI': 'AI',
    'Game': '게임',
    'Design': '디자인',
    'Other': '기타'
  }

  // categoryLabel is used but was omitted in the broken file
  // const categoryLabel = categoryMap[category] || category

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Navigation Bar */}
       <Navigation session={session} />

       <div className="flex-1 max-w-screen-xl mx-auto px-4 py-12 w-full">
          <header className="mb-12 text-center max-w-2xl mx-auto relative">
             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
               Fair Exposure for <br/>
               <span className="text-blue-600">Every Creator</span>
             </h1>

             <p className="text-lg text-gray-500 leading-relaxed mb-8">
               모든 프로젝트는 주목받을 자격이 있습니다. <br className="hidden md:inline"/>
               우리는 숨겨진 명작을 찾아내어 공평한 기회를 제공합니다.
             </p>

             {/* Category Filter Chips */}
             <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {Object.entries(categoryMap).map(([key, label]) => (
                  <Link 
                    key={key} 
                    href={key === 'All' ? '/' : `/?category=${key}`}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap flex-shrink-0 ${
                      category === key 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
             </div>
          </header>

           <ProjectFeed initialProjects={initialProjects as any} category={category} />
       </div>

       <footer className="bg-white border-t border-gray-100 py-8 mt-20">
         <div className="max-w-screen-xl mx-auto px-4 text-center text-gray-400 text-sm">
           &copy; {new Date().getFullYear()} FairShare. built for fairness.
         </div>
       </footer>
    </div>
  )
}
