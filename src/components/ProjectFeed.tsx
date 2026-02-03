'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { getFairProjects } from '@/app/actions/project'
import ProjectCard from './ProjectCard'
import { Project, User } from '@/generated/prisma/client'
import { Search, X } from 'lucide-react'

type ProjectWithUser = Project & { user: User }

interface ProjectFeedProps {
  initialProjects: ProjectWithUser[]
  category: string
}

export default function ProjectFeed({ initialProjects, category }: ProjectFeedProps) {
  const [projects, setProjects] = useState<ProjectWithUser[]>(initialProjects)
  const [query, setQuery] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const { ref, inView } = useInView()
  
  const isLoadingRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return
    isLoadingRef.current = true
    setLoading(true)

    try {
      const excludeIds = projects.map(p => p.id)
      
      const newProjects = await getFairProjects({
        limit: 12,
        excludeIds,
        query,
        category
      }) as ProjectWithUser[]

      if (newProjects.length === 0) {
        setHasMore(false)
      } else {
        setProjects(prev => {
            const existingIds = new Set(prev.map(p => p.id))
            const uniqueNew = newProjects.filter(p => !existingIds.has(p.id))
            if (uniqueNew.length < 12) {
               // If we got fewer than requested, likely no more
            }
            return [...prev, ...uniqueNew]
        })
      }
    } catch (error) {
      console.error('Failed to load more projects:', error)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [hasMore, projects, query, category])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  useEffect(() => {
    const timer = setTimeout(async () => {
        if (query === '' && projects === initialProjects) return 
        
        isLoadingRef.current = true
        setLoading(true)
        
        try {
           const results = await getFairProjects({
             limit: 12,
             query,
             category: category
           }) as ProjectWithUser[]
           
           setProjects(results)
           setHasMore(true)
        } finally {
           setLoading(false)
           isLoadingRef.current = false
        }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, category])

  useEffect(() => {
      setProjects(initialProjects)
      setQuery('')
      setHasMore(true)
  }, [category, initialProjects])

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8 relative z-30">
        <div className="relative group">
          <input
            type="text"
            placeholder="관심있는 프로젝트를 검색해보세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-20 pr-14 py-5 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-blue-900/5 focus:shadow-2xl focus:shadow-blue-500/10 focus:border-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-lg font-bold text-gray-800 placeholder:text-gray-300"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-focus-within:bg-blue-500 group-focus-within:text-white transition-colors duration-300">
             <Search size={20} className="stroke-[3px]" />
          </div>
          
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center transition-colors z-10"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
             <Search size={48} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500 font-medium">다른 검색어로 찾아보세요</p>
        </div>
      )}

      {/* Loading Sentinel */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-12">
            {loading && (
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600"></div>
            )}
        </div>
      )}
    </div>
  )
}
