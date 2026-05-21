const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', username: 'alice', passwordHash },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', username: 'bob', passwordHash },
  })

  const communities = [
    { name: 'technology', slug: 'technology', description: 'All things tech' },
    { name: 'programming', slug: 'programming', description: 'Code, projects, and programming discussion' },
    { name: 'webdev', slug: 'webdev', description: 'Web development news and projects' },
  ]

  for (const c of communities) {
    const community = await prisma.community.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })

    await prisma.post.create({
      data: {
        title: `Welcome to r/${community.name}!`,
        content: `This is the first post in r/${community.name}. Share your thoughts!`,
        type: 'TEXT',
        communityId: community.id,
        authorId: user1.id,
      },
    })
  }

  console.log('Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
