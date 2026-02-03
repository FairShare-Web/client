'use client'

import { likeProject } from '@/app/actions/project'
import { Heart } from 'lucide-react'
import { useOptimistic, startTransition, useState } from 'react'

interface LikeButtonProps {
  projectId: string
  initialLikes: number
  initialLiked?: boolean
}

interface Particle {
  id: number
  style: React.CSSProperties
}

export default function LikeButton({ projectId, initialLikes, initialLiked = false }: LikeButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { count: initialLikes ?? 0, liked: initialLiked },
    (state, isLiked: boolean) => ({
      count: state.count + (isLiked ? 1 : -1),
      liked: isLiked
    })
  )

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation()

    const nextLikedState = !optimisticLikes.liked

    if (nextLikedState) {
       // Create particles only when liking
       const newParticles = Array.from({ length: 12 }).map((_, i) => {
         const angle = (Math.PI * 2 * i) / 12
         // Randomize distance lightly
         const distance = 30 + Math.random() * 15
         const tx = Math.cos(angle) * distance
         const ty = Math.sin(angle) * distance
         
         return {
           id: Date.now() + i,
           style: {
             '--tx': `${tx}px`,
             '--ty': `${ty}px`,
             position: 'absolute',
             left: '50%',
             top: '50%',
             width: '10px',
             height: '10px',
             pointerEvents: 'none'
           } as React.CSSProperties
         }
       })
       setParticles(newParticles)
       
       // Cleanup
       setTimeout(() => setParticles([]), 1000)
    }

    startTransition(() => {
      setOptimisticLikes(nextLikedState)
    })
    
    await likeProject(projectId)
  }

  return (
    <button 
      onClick={handleLike}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 shadow-sm group/btn z-20 overflow-visible ${
        optimisticLikes.liked 
          ? 'bg-red-50 border border-red-200 text-red-600 shadow-red-100 hover:bg-red-100' 
          : 'bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:scale-105'
      }`}
    >
      <div className="relative">
        <Heart 
          size={16} 
          className={`transition-all duration-300 ${
            optimisticLikes.liked 
              ? 'fill-red-500 text-red-500 scale-110' 
              : 'group-hover/btn:scale-110'
          }`} 
        />
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="pointer-events-none animate-float-out text-red-500 flex items-center justify-center absolute left-1/2 top-1/2 -ml-[5px] -mt-[5px]"
            style={p.style}
          >
             <Heart size={10} className="fill-red-500 opacity-80" />
          </div>
        ))}
      </div>
      
      <span className={`text-xs font-bold tabular-nums transition-colors ${
          optimisticLikes.liked ? 'text-red-600' : 'text-gray-600 group-hover/btn:text-red-500'
      }`}>
        {optimisticLikes.count.toLocaleString()}
      </span>
    </button>
  )
}
