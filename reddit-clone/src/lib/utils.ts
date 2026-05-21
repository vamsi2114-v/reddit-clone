import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function voteCount(votes: { type: string }[]) {
  return votes.reduce((acc, v) => acc + (v.type === 'UP' ? 1 : -1), 0)
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}
