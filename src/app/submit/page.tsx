'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { FileText, Image, Link } from 'lucide-react'
import { cn } from '@/lib/utils'

type PostType = 'TEXT' | 'IMAGE' | 'LINK'
type Community = { id: string; name: string; slug: string }

export default function SubmitPage() {
  const searchParams = useSearchParams()
  const [type, setType] = useState<PostType>('TEXT')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [communitySlug, setCommunitySlug] = useState(searchParams.get('community') ?? '')
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/communities').then((r) => r.json()).then(setCommunities)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!communitySlug) { toast.error('Pick a community'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, linkUrl, imageUrl, type, communitySlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      toast.success('Post created!')
      router.push(`/post/${data.id}`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tabs: { type: PostType; label: string; icon: React.ReactNode }[] = [
    { type: 'TEXT', label: 'Text', icon: <FileText size={15} /> },
    { type: 'IMAGE', label: 'Image', icon: <Image size={15} /> },
    { type: 'LINK', label: 'Link', icon: <Link size={15} /> },
  ]

  return (
    <div className="max-w-2xl mt-6">
      <h1 className="text-xl font-bold mb-4">Create a Post</h1>

      <form onSubmit={submit} className="space-y-3">
        {/* Community picker */}
        <div className="card p-3">
          <label className="label">Community</label>
          <select
            className="input"
            value={communitySlug}
            onChange={(e) => setCommunitySlug(e.target.value)}
            required
          >
            <option value="">Choose a community…</option>
            {communities.map((c) => (
              <option key={c.id} value={c.slug}>r/{c.name}</option>
            ))}
          </select>
        </div>

        {/* Post content */}
        <div className="card overflow-hidden">
          {/* Type tabs */}
          <div className="flex border-b border-reddit-border">
            {tabs.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setType(t.type)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                  type === t.type
                    ? 'border-reddit-blue text-reddit-blue'
                    : 'border-transparent text-reddit-muted hover:text-gray-700'
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-3">
            <input
              className="input font-medium"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={300}
            />

            {type === 'TEXT' && (
              <textarea
                className="input resize-none"
                placeholder="Text (optional)"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            )}

            {type === 'LINK' && (
              <input
                className="input"
                placeholder="https://..."
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />
            )}

            {type === 'IMAGE' && (
              <input
                className="input"
                placeholder="Image URL (https://...)"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Posting…' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
