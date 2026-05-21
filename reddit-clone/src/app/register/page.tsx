'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Registration failed')

      await signIn('credentials', { email, password, redirect: false })
      toast.success('Welcome to Reddit!')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="card p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚀</div>
          <h1 className="text-xl font-bold">Join Reddit</h1>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              required
              minLength={3}
              maxLength={20}
              placeholder="letters, numbers, underscores"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 disabled:opacity-50">
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-reddit-muted mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-reddit-blue hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}
