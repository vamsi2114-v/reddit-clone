import Link from 'next/link'
import { Users, Plus } from 'lucide-react'

type Community = {
  id: string
  name: string
  slug: string
  _count: { members: number }
}

export function CommunitySidebar({ communities }: { communities: Community[] }) {
  return (
    <aside className="w-72 shrink-0 hidden lg:block space-y-4">
      {/* Top communities */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3">Top Communities</h3>
        <div className="space-y-2">
          {communities.map((c, i) => (
            <Link
              key={c.id}
              href={`/r/${c.slug}`}
              className="flex items-center gap-2 text-sm hover:text-reddit-blue group"
            >
              <span className="text-reddit-muted text-xs w-4">{i + 1}</span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shrink-0" />
              <span className="font-medium group-hover:underline">r/{c.name}</span>
              <span className="ml-auto text-reddit-muted text-xs flex items-center gap-0.5">
                <Users size={10} /> {c._count.members}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/r/create" className="btn-primary w-full justify-center mt-4 text-sm">
          <Plus size={14} /> Create Community
        </Link>
      </div>

      {/* Create post CTA */}
      <div className="card p-4 text-center">
        <p className="text-sm text-gray-600 mb-3">Create a post and share with the community</p>
        <Link href="/submit" className="btn-primary w-full justify-center text-sm">
          <Plus size={14} /> Create Post
        </Link>
      </div>
    </aside>
  )
}
