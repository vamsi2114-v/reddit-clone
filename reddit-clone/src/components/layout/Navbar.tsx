'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogIn, LogOut, Plus, User } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-reddit-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-reddit-orange shrink-0">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="10"/>
            <path fill="white" d="M16.67 10c0-.9-.73-1.63-1.63-1.63-.43 0-.82.17-1.11.44-1.1-.76-2.6-1.25-4.26-1.32l.72-3.4 2.36.5c.03.59.52 1.07 1.12 1.07.62 0 1.13-.5 1.13-1.13 0-.62-.5-1.12-1.13-1.12-.44 0-.82.25-1.02.62l-2.64-.56c-.08-.02-.16.04-.18.12l-.81 3.8c-1.68.06-3.2.55-4.31 1.32-.29-.27-.68-.44-1.11-.44C3.26 8.37 2.5 9.1 2.5 10c0 .65.37 1.21.9 1.5-.03.18-.04.36-.04.55 0 2.6 3.05 4.72 6.8 4.72 3.75 0 6.8-2.11 6.8-4.72 0-.19-.01-.37-.04-.55.54-.29.9-.85.9-1.5h-.15zM7 11c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm5.58 2.72c-.65.65-1.9.7-2.25.7-.35 0-1.6-.05-2.25-.7-.1-.1-.1-.27 0-.37.1-.1.27-.1.37 0 .42.42 1.32.57 1.88.57.56 0 1.46-.15 1.88-.57.1-.1.27-.1.37 0 .1.1.1.27 0 .37zm-.2-1.72c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
          <span className="hidden sm:block text-sm">reddit</span>
        </Link>

        {/* Search placeholder */}
        <div className="flex-1 max-w-sm hidden md:block">
          <input
            className="input text-sm py-1.5 bg-reddit-light text-sm"
            placeholder="Search Reddit"
            disabled
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <Link href="/submit" className="btn-primary text-xs">
                <Plus size={14} /> Create Post
              </Link>
              <span className="text-sm text-reddit-muted hidden sm:flex items-center gap-1">
                <User size={14} /> {session.user.username}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-ghost text-xs"
              >
                <LogOut size={14} />
                <span className="hidden sm:block">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline text-xs">
                <LogIn size={14} /> Log In
              </Link>
              <Link href="/register" className="btn-primary text-xs">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
