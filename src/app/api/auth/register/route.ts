import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (exists) {
      return NextResponse.json({ error: 'Email or username already taken' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, username, passwordHash },
    })

    return NextResponse.json({ id: user.id, username: user.username })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
