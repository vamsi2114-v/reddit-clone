'use client'
import { useState } from 'react'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

type Props = {
  postId: string
  score: number
  userVote?: 'UP' | 'DOWN'
  currentUserId?: string
}

export function VoteButtons({ postId, score, userVote, currentUserId }: Props) {
  const [optimisticScore, setOptimisticScore] = useState(score)
  const [optimisticVote, setOptimisticVote] = useState(userVote)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function vote(type: 'UP' | 'DOWN') {
    if (!currentUserId) {
      toast.error('Log in to vote')
      return
    }
    if (loading) return

    // Optimistic update
    const prev = { score: optimisticScore, vote: optimisticVote }
    let delta = 0
    if (optimisticVote === type) {
      // toggle off
      delta = type === 'UP' ? -1 : 1
      setOptimisticVote(undefined)
    } else {
      delta = type === 'UP' ? (optimisticVote === 'DOWN' ? 2 : 1) : (optimisticVote === 'UP' ? -2 : -1)
      setOptimisticVote(type)
    }
    setOptimisticScore((s) => s + delta)

    setLoading(true)
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, type }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      // Revert
      setOptimisticScore(prev.score)
      setOptimisticVote(prev.vote)
      toast.error('Vote failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-10 shrink-0 pt-2 pb-2 gap-0.5">
      <button
        onClick={() => vote('UP')}
        className={cn(
          'p-0.5 rounded hover:bg-orange-100 transition-colors',
          optimisticVote === 'UP' ? 'text-reddit-orange' : 'text-reddit-muted hover:text-reddit-orange'
        )}
        aria-label="Upvote"
      >
        <ArrowBigUp size={20} strokeWidth={1.5} fill={optimisticVote === 'UP' ? 'currentColor' : 'none'} />
      </button>

      <span
        className={cn(
          'text-xs font-bold',
          optimisticVote === 'UP' && 'text-reddit-orange',
          optimisticVote === 'DOWN' && 'text-blue-500',
          !optimisticVote && 'text-gray-700'
        )}
      >
        {optimisticScore}
      </span>

      <button
        onClick={() => vote('DOWN')}
        className={cn(
          'p-0.5 rounded hover:bg-blue-100 transition-colors',
          optimisticVote === 'DOWN' ? 'text-blue-500' : 'text-reddit-muted hover:text-blue-500'
        )}
        aria-label="Downvote"
      >
        <ArrowBigDown size={20} strokeWidth={1.5} fill={optimisticVote === 'DOWN' ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
