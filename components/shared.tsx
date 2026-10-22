import { Ban, CircleCheck, CircleHelp, CircleX, FlaskConical, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { VERDICTS } from '@/lib/catalog'
import type { Verdict } from '@/lib/types'
import { cn } from '@/lib/utils'

export const ctaClass = 'h-11 rounded-full px-5 text-sm font-semibold'

export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <main className={cn('mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10', className)}>{children}</main>
}

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-brand-electric uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Card({
  children,
  className,
  as: Tag = 'section',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'aside' | 'article' | 'fieldset'
  disabled?: boolean
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn('rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardTitle({ children, icon: Icon }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
      {Icon && <Icon className="size-4.5 text-brand-electric" aria-hidden="true" />}
      {children}
    </h2>
  )
}

export function SimulatedTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-warning px-2.5 py-0.5 text-xs font-semibold text-warning-foreground',
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      Simulated
    </span>
  )
}

const VERDICT_STYLE: Record<Verdict, { icon: LucideIcon; className: string; dot: string }> = {
  block: { icon: Ban, className: 'bg-brand-coral/12 text-destructive ring-brand-coral/30', dot: 'bg-brand-coral' },
  accept: { icon: CircleCheck, className: 'bg-success/12 text-success ring-success/30', dot: 'bg-success' },
  reject: { icon: CircleX, className: 'bg-brand-orange/15 text-warning-foreground ring-brand-orange/40', dot: 'bg-brand-orange' },
  needs_review: {
    icon: CircleHelp,
    className: 'bg-brand-electric/10 text-brand-electric ring-brand-electric/30',
    dot: 'bg-brand-electric',
  },
}

export const verdictStyle = (v: Verdict) => VERDICT_STYLE[v]

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const style = VERDICT_STYLE[verdict]
  const Icon = style.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset',
        style.className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {VERDICTS[verdict].label}
    </span>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: ReactNode
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md leading-relaxed text-pretty text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href} className={cn(buttonVariants(), ctaClass, 'mt-6')}>
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function MetaList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 truncate font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
