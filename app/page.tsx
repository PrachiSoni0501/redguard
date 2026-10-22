import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FlowVisual } from '@/components/landing/flow-visual'
import { ctaClass } from '@/components/shared'
import { buttonVariants } from '@/components/ui/button'
import { Wordmark } from '@/components/wordmark'
import { LANGUAGES } from '@/lib/catalog'
import { cn } from '@/lib/utils'

const HIGHLIGHTS = [
  { value: '4', label: 'languages per study', tone: 'text-brand-electric' },
  { value: '4', label: 'human review labels', tone: 'text-brand-coral' },
  { value: '1', label: 'structured audit trail', tone: 'text-brand-orange' },
]

export default function WelcomePage() {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-brand-cyan/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 size-[32rem] rounded-full bg-brand-coral/12 blur-3xl"
      />

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-24">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-xs">
            <span className="size-2 rounded-full bg-brand-orange" aria-hidden="true" />
            Multilingual AI red-teaming platform
          </p>
          <div className="mb-8">
            <Wordmark size="xl" />
          </div>
          <h1 className="font-display text-2xl leading-snug font-semibold text-balance sm:text-3xl">
            Probe the model. Understand the response. Strengthen AI safety.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Safety behaviour that holds in English often weakens in other languages. RedTeam Audit
            lets researchers run the same categorized harmful test prompts across four languages,
            inspect every response verbatim, and record a human verdict in a structured audit log.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/evaluate" className={cn(buttonVariants(), ctaClass, 'h-12 px-6 text-base')}>
              Start an evaluation
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
            <Link
              href="/introduction"
              className={cn(buttonVariants({ variant: 'outline' }), ctaClass, 'h-12 px-6 text-base')}
            >
              Explore how it works
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Supported languages">
            {LANGUAGES.map((l) => (
              <li
                key={l.code}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm shadow-xs"
              >
                <span lang={l.code} dir={l.dir} className="font-medium">
                  {l.native}
                </span>
                {l.code !== 'en' && <span className="ml-1.5 text-muted-foreground">{l.name}</span>}
              </li>
            ))}
          </ul>
        </div>
        <FlowVisual />
      </section>

      <section className="relative border-t border-border/70 bg-card/60">
        <dl className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex items-baseline gap-3">
              <dt className="sr-only">{h.label}</dt>
              <dd className={cn('font-display text-5xl font-extrabold', h.tone)}>{h.value}</dd>
              <span className="text-muted-foreground" aria-hidden="true">
                {h.label}
              </span>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
