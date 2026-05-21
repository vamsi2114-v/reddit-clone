import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/post/PostCard'
import { SortTabs } from '@/components/post/SortTabs'
import { CommunitySidebar } from '@/components/community/CommunitySidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

type Props = { searchParams: { sort?: string } }

export default async function HomePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  const sort = searchParams.sort === 'top' ? 'top' : 'new'

  const posts = await prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      community: { select: { name: true, slug: true } },
      votes: true,
      _count: { select: { comments: true } },
    },
    orderBy:
      sort === 'top'
        ? { votes: { _count: 'desc' } }
        : { createdAt: 'desc' },
    take: 25,
  })

  const communities = await prisma.community.findMany({
    take: 5,
    orderBy: { posts: { _count: 'desc' } },
    include: { _count: { select: { members: true } } },
  })

  return (
    <div className="flex gap-6 mt-4">
      {/* Main feed */}
      <div className="flex-1 min-w-0">
        {/* Create post bar */}
        {session && (
          <div className="card flex items-center gap-2 p-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-reddit-light border border-reddit-border flex items-center justify-center text-reddit-muted text-xs font-bold">
              {session.user.username[0].toUpperCase()}
            </div>
            <Link href="/submit" className="input text-sm text-reddit-muted cursor-pointer hover:border-reddit-blue">
              Create Post
            </Link>
          </div>
        )}

        <SortTabs current={sort} />

        <div className="flex flex-col gap-2 mt-3">
          {posts.length === 0 ? (
            <div className="card p-12 text-center text-reddit-muted">
              <p className="text-lg font-medium mb-1">No posts yet</p>
              <p className="text-sm">Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={session?.user.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <CommunitySidebar communities={communities} />
    </div>
  )
}
