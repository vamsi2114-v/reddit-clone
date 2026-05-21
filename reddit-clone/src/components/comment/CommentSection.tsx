'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { timeAgo } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

type Comment = {
  id: string
  content: string
  createdAt: Date | string
  author: { username: string }
}

type User = { id: string; username: string; email: string }

type Props = {
  postId: string
  comments: Comment[]
  currentUser?: User
}

export function CommentSection({ postId, comments, currentUser }: Props) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function submit() {
    if (!text.trim()) return
    if (!currentUser) { toast.error('Log in to comment'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: text.trim() }),
      })
      if (!res.ok) throw new Error()
      setText('')
      toast.success('Comment posted!')
      router.refresh()
    } catch {
      toast.error('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-3">
      {/* Comment input */}
      <div className="card p-4 mb-4">
        {currentUser ? (
          <>
            <p className="text-xs text-reddit-muted mb-2">
              Comment as <span className="text-reddit-blue font-medium">{currentUser.username}</span>
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What are your thoughts?"
              rows={4}
              className="input resize-none mb-2"
            />
            <div className="flex justify-end">
              <button
                onClick={submit}
                disabled={!text.trim() || submitting}
                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting…' : 'Comment'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-reddit-muted text-center py-2">
            <a href="/login" className="text-reddit-blue hover:underline">Log in</a> to leave a comment.
          </p>
        )}
      </div>

      {/* Comments list */}
      <div className="flex flex-col gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
          <MessageSquare size={15} />
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>
        {comments.map((c) => (
          <div key={c.id} className="card p-3 pl-4 border-l-2 border-reddit-border hover:border-reddit-orange">
            <div className="flex items-center gap-2 text-xs text-reddit-muted mb-1.5">
              <span className="font-medium text-gray-800">u/{c.author.username}</span>
              <span>•</span>
              <span>{timeAgo(c.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="card p-8 text-center text-reddit-muted text-sm">
            No comments yet. Be the first!
          </div>
        )}
      </div>
    </div>
  )
}
