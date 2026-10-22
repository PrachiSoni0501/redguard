'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

const NAV = [
  { href: '/', label: 'Overview', match: (p: string) => p === '/' || p === '/introduction' },
  { href: '/evaluate', label: 'New Evaluation', short: 'Evaluate', match: (p: string) => p.startsWith('/evaluate') },
  { href: '/history', label: 'Audit History', short: 'History', match: (p: string) => p.startsWith('/history') },
  { href: '/analytics', label: 'Analytics', match: (p: string) => p.startsWith('/analytics') },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" aria-label="RedTeam Audit home" className="w-fit rounded-lg">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="-mx-1 overflow-x-auto">
          <ul className="flex items-center gap-0.5 px-1 sm:gap-1">
            {NAV.map((item) => {
              const active = item.match(pathname)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-full px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:px-3.5 sm:text-sm',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {'short' in item && item.short ? (
                      <>
                        <span className="sm:hidden">{item.short}</span>
                        <span className="hidden sm:inline">{item.label}</span>
                      </>
                    ) : (
                      item.label
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
