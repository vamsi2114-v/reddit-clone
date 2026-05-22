import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const communitySlug = searchParams.get('community')
  const sort = searchParams.get('sort') === 'top' ? 'top' : 'new'

  const posts = await prisma.post.findMany({
    where: communitySlug ? { community: { slug: communitySlug } } : undefined,
    include: {
      author: { select: { username: true } },
      community: { select: { name: true, slug: true } },
      votes: true,
      _count: { select: { comments: true } },
    },
    orderBy: sort === 'top' ? { votes: { _count: 'desc' } } : { createdAt: 'desc' },
    take: 25,
  })

  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, content, linkUrl, imageUrl, type, communitySlug } = await req.json()

    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const community = await prisma.community.findUnique({ where: { slug: communitySlug } })
    if (!community) return NextResponse.json({ error: 'Community not found' }, { status: 404 })

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        linkUrl: linkUrl || null,
        imageUrl: imageUrl || null,
        type: type ?? 'TEXT',
        communityId: community.id,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic' 
