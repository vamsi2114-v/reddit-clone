'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CreateCommunityPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!slug) return
    setLoading(true)
    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: slug, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      toast.success(`r/${slug} created!`)
      router.push(`/r/${slug}`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mt-6">
      <div className="card p-6">
        <h1 className="text-xl font-bold mb-1">Create a Community</h1>
        <p className="text-sm text-reddit-muted mb-6">Build your own corner of Reddit.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Community name</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-reddit-muted">r/</span>
              <input
                className="input pl-7"
                placeholder="communityname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={21}
              />
            </div>
            {name && (
              <p className="text-xs text-reddit-muted mt-1">
                Your community will be at <strong>r/{slug}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="label">Description <span className="text-reddit-muted">(optional)</span></label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!slug || loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Community'}
          </button>
        </form>
      </div>
    </div>
  )
}
