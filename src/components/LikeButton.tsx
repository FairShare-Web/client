'use client'

import { likeProject } from '@/app/actions/project'
import { Heart } from 'lucide-react'
import { useOptimistic, startTransition } from 'react'

interface LikeButtonProps {
  projectId: string
  initialLikes: number
}

export default function LikeButton({ projectId, initialLikes }: LikeButtonProps) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    { count: initialLikes ?? 0, liked: false },
    (state, newLike: boolean) => ({
      count: state.count + 1,
      liked: true
    })
  )

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Link click prevention
    e.stopPropagation()

    if (optimisticLikes.liked) return // Prevent multiple clicks for demo

    startTransition(() => {
      addOptimisticLike(true)
    })
    
    await likeProject(projectId)
  }

  return (
    <button 
      onClick={handleLike}
      className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm border transition-all shadow-sm group/btn hover:scale-110 active:scale-95 z-20 ${
        optimisticLikes.liked 
          ? 'border-red-200 text-red-500' 
          : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
      }`}
    >
      <Heart 
        size={14} 
        className={`transition-all ${optimisticLikes.liked ? 'fill-red-500 scale-110' : 'group-hover/btn:scale-110'}`} 
      />
      <span className="text-xs font-bold tabular-nums">
        {optimisticLikes.count}
      </span>
    </button>
  )
}
