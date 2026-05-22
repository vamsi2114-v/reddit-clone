import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PostCard } from '@/components/post/PostCard'
import { SortTabs } from '@/components/post/SortTabs'
import Link from 'next/link'
import { Users, Plus } from 'lucide-react'

type Props = {
  params: { slug: string }
  searchParams: { sort?: string }
}

export default async function CommunityPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions)
  const sort = searchParams.sort === 'top' ? 'top' : 'new'

  const community = await prisma.community.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { members: true, posts: true } } },
  })

  if (!community) notFound()

  const posts = await prisma.post.findMany({
    where: { communityId: community.id },
    include: {
      author: { select: { username: true } },
      community: { select: { name: true, slug: true } },
      votes: true,
      _count: { select: { comments: true } },
    },
    orderBy: sort === 'top' ? { votes: { _count: 'desc' } } : { createdAt: 'desc' },
    take: 25,
  })

  return (
    <div className="flex gap-6 mt-4">
      <div className="flex-1 min-w-0">
        {/* Community banner */}
        <div className="card mb-4 overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500" />
          <div className="p-4 flex items-end gap-3 -mt-6">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white bg-gradient-to-br from-orange-400 to-pink-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold">r/{community.name}</h1>
              <p className="text-reddit-muted text-sm flex items-center gap-3">
                <span className="flex items-center gap-1"><Users size={13} />{community._count.members} members</span>
                <span>{community._count.posts} posts</span>
              </p>
            </div>
            {session && (
              <Link href={`/submit?community=${community.slug}`} className="btn-primary text-sm shrink-0">
                <Plus size={14} /> Create Post
              </Link>
            )}
          </div>
          {community.description && (
            <div className="px-4 pb-4 text-sm text-gray-600">{community.description}</div>
          )}
        </div>

        <SortTabs current={sort} />

        <div className="flex flex-col gap-2 mt-3">
          {posts.length === 0 ? (
            <div className="card p-12 text-center text-reddit-muted">
              <p className="font-medium mb-1">No posts in r/{community.name} yet</p>
              {session && (
                <Link href={`/submit?community=${community.slug}`} className="btn-primary inline-flex mt-3 text-sm">
                  Create the first post
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={session?.user.id} />
            ))
          )}
        </div>
      </div>

      {/* Community info sidebar */}
      <aside className="w-72 shrink-0 hidden lg:block">
        <div className="card p-4">
          <h3 className="font-semibold mb-2 text-sm">About r/{community.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{community.description ?? 'A community for everyone.'}</p>
          <div className="flex justify-between text-sm border-t border-reddit-border pt-3">
            <div className="text-center">
              <p className="font-semibold">{community._count.members}</p>
              <p className="text-reddit-muted text-xs">Members</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{community._count.posts}</p>
              <p className="text-reddit-muted text-xs">Posts</p>
            </div>
          </div>
          {session && (
            <Link href={`/submit?community=${community.slug}`} className="btn-primary w-full justify-center mt-4 text-sm">
              <Plus size={14} /> Create Post
            </Link>
          )}
        </div>
      </aside>
    </div>
  )
}
export const dynamic = 'force-dynamic' 
