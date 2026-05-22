import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { postId, type } = await req.json()
    if (!postId || !['UP', 'DOWN'].includes(type)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const existing = await prisma.vote.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    })

    if (existing) {
      if (existing.type === type) {
        // Toggle off: delete vote
        await prisma.vote.delete({ where: { id: existing.id } })
        return NextResponse.json({ action: 'removed' })
      } else {
        // Switch vote
        const vote = await prisma.vote.update({
          where: { id: existing.id },
          data: { type },
        })
        return NextResponse.json({ action: 'updated', vote })
      }
    }

    // New vote
    const vote = await prisma.vote.create({
      data: { type, userId: session.user.id, postId },
    })

    return NextResponse.json({ action: 'created', vote }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic' 
