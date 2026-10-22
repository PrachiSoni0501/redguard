import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-7', className)}>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="55%" stopColor="var(--electric)" />
          <stop offset="100%" stopColor="var(--cyan)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      <path
        d="M8 21c3-8 6-10 8-10s3 3 5 3 3-2 3-2"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="12" r="2.4" fill="var(--orange)" stroke="white" strokeWidth="1.2" />
    </svg>
  )
}

export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'xl' }) {
  if (size === 'xl') {
    return (
      <span className="font-display text-6xl leading-[0.9] font-extrabold tracking-tight text-balance sm:text-7xl lg:text-8xl">
        <span className="text-primary">RedTeam</span>{' '}
        <span className="bg-gradient-to-r from-brand-electric via-brand-cyan to-brand-orange bg-clip-text text-transparent">
          Audit
        </span>
      </span>
    )
  }
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight">
        <span className="text-primary">RedTeam</span> <span className="text-brand-electric">Audit</span>
      </span>
    </span>
  )
}
