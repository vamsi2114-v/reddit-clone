'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, ExternalLink } from 'lucide-react'
import { timeAgo, voteCount } from '@/lib/utils'
import { VoteButtons } from './VoteButtons'

type Post = {
  id: string
  title: string
  content?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  type: string
  createdAt: Date | string
  author: { username: string }
  community: { name: string; slug: string }
  votes: { type: string; userId: string }[]
  _count: { comments: number }
}

type Props = {
  post: Post
  currentUserId?: string
  compact?: boolean
}

export function PostCard({ post, currentUserId, compact = true }: Props) {
  const score = voteCount(post.votes)
  const userVote = post.votes.find((v) => v.userId === currentUserId)?.type

  return (
    <div className="card hover:border-gray-400 transition-colors flex">
      {/* Vote column */}
      <VoteButtons
        postId={post.id}
        score={score}
        userVote={userVote as 'UP' | 'DOWN' | undefined}
        currentUserId={currentUserId}
      />

      {/* Content */}
      <div className="flex-1 min-w-0 p-2 pt-2">
        {/* Meta */}
        <div className="flex items-center gap-1 text-xs text-reddit-muted mb-1 flex-wrap">
          <Link
            href={`/r/${post.community.slug}`}
            className="font-medium text-gray-800 hover:underline"
          >
            r/{post.community.name}
          </Link>
          <span>•</span>
          <span>Posted by u/{post.author.username}</span>
          <span>•</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <Link href={`/post/${post.id}`}>
          <h2 className="text-base font-medium text-gray-900 hover:text-reddit-blue leading-snug mb-2">
            {post.title}
          </h2>
        </Link>

        {/* Body */}
        {post.type === 'IMAGE' && post.imageUrl && (
          <div className="relative w-full max-h-80 overflow-hidden rounded mb-2">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={600}
              height={320}
              className="w-full object-cover"
            />
          </div>
        )}

        {post.type === 'LINK' && post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-reddit-blue hover:underline mb-2 truncate max-w-sm"
          >
            <ExternalLink size={12} />
            {post.linkUrl}
          </a>
        )}

        {post.type === 'TEXT' && post.content && compact && (
          <p className="text-sm text-gray-700 line-clamp-3 mb-2">{post.content}</p>
        )}

        {post.type === 'TEXT' && post.content && !compact && (
          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{post.content}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href={`/post/${post.id}`} className="btn-ghost text-xs">
            <MessageSquare size={14} />
            {post._count.comments} Comments
          </Link>
        </div>
      </div>
    </div>
  )
}
