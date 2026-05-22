import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PostCard } from '@/components/post/PostCard'
import { CommentSection } from '@/components/comment/CommentSection'

type Props = { params: { id: string } }

export default async function PostPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { username: true } },
      community: { select: { name: true, slug: true } },
      votes: true,
      _count: { select: { comments: true } },
    },
  })

  if (!post) notFound()

  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mt-4">
      <PostCard post={post} currentUserId={session?.user.id} compact={false} />
      <CommentSection
        postId={post.id}
        comments={comments}
        currentUser={session?.user}
      />
    </div>
  )
}
export const dynamic = 'force-dynamic' 
