'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Flame, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SortTabs({ current }: { current: string }) {
  return (
    <div className="card flex items-center gap-1 p-2">
      <Link
        href="/?sort=new"
        className={cn(
          'btn text-sm',
          current === 'new' ? 'bg-reddit-light text-reddit-orange font-semibold' : 'text-reddit-muted hover:bg-reddit-light'
        )}
      >
        <Clock size={16} /> New
      </Link>
      <Link
        href="/?sort=top"
        className={cn(
          'btn text-sm',
          current === 'top' ? 'bg-reddit-light text-reddit-orange font-semibold' : 'text-reddit-muted hover:bg-reddit-light'
        )}
      >
        <Flame size={16} /> Top
      </Link>
    </div>
  )
}
