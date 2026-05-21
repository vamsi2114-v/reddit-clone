import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'react-hot-toast'

const font = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Reddit Clone',
  description: 'A community platform built with Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="bg-reddit-light min-h-screen font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 pt-4 pb-12">{children}</main>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
