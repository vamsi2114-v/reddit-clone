import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const communities = await prisma.community.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
  return NextResponse.json(communities)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, description } = await req.json()
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '')

    if (!slug || slug.length < 3) {
      return NextResponse.json({ error: 'Name must be at least 3 characters' }, { status: 400 })
    }

    const exists = await prisma.community.findUnique({ where: { slug } })
    if (exists) return NextResponse.json({ error: 'Community already exists' }, { status: 409 })

    const community = await prisma.community.create({
      data: { name: slug, slug, description },
    })

    return NextResponse.json(community, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
