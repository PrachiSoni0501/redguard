import { ArrowRight, ClipboardCheck, Cpu, Database, Languages, Settings2, ShieldCheck, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, PageShell, VerdictBadge, ctaClass } from '@/components/shared'
import { buttonVariants } from '@/components/ui/button'
import { VERDICTS, VERDICT_ORDER } from '@/lib/catalog'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'How it works' }

const WORKFLOW = [
  { icon: Settings2, title: 'Configure', body: 'Pick a dataset prompt or write your own, set the harm category, language, and target model.', tone: 'from-primary to-brand-electric' },
  { icon: Cpu, title: 'Evaluate', body: 'The exact prompt is sent server-side to the model. The verbatim response and latency are captured.', tone: 'from-brand-electric to-brand-cyan' },
  { icon: ClipboardCheck, title: 'Review', body: 'A researcher reads the response against the criteria and applies one of four labels with a justification.', tone: 'from-brand-cyan to-brand-orange' },
  { icon: Database, title: 'Audit', body: 'The annotated result is written to the audit store and appears in history and analytics.', tone: 'from-brand-orange to-brand-coral' },
]

export default function IntroductionPage() {
  return (
    <PageShell className="max-w-5xl">
      <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-brand-electric uppercase">
        How it works
      </p>
      <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        Red teaming, in every language your users speak.
      </h1>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            What is red teaming?
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Red teaming deliberately tests a model with prompts it should refuse — requests for
            malware, fraud, misinformation, or privacy violations — to find where its safeguards
            fail before real users do.
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
            <Languages className="size-5 text-brand-electric" aria-hidden="true" />
            Why multilingual?
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Safety training is often concentrated in English. The same request in Hindi, Arabic, or
            Swahili can slip through. Comparing identical prompts across languages makes those
            gaps measurable.
          </p>
        </Card>
      </div>

      <section className="mt-14" aria-labelledby="workflow-heading">
        <h2 id="workflow-heading" className="font-display text-2xl font-bold tracking-tight">
          The workflow
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className={cn('mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white', step.tone)}>
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="text-xs font-semibold text-muted-foreground">Step {i + 1}</p>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              {i < WORKFLOW.length - 1 && (
                <ArrowRight
                  className="absolute top-1/2 -right-3.5 hidden size-5 -translate-y-1/2 text-brand-electric lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="labels-heading">
        <h2 id="labels-heading" className="font-display text-2xl font-bold tracking-tight">
          Human review labels
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {VERDICT_ORDER.map((v) => (
            <div key={v} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <VerdictBadge verdict={v} />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{VERDICTS[v].definition}</p>
              {VERDICTS[v].requiresReason && (
                <p className="mt-2 text-xs font-medium text-foreground/70">Requires a written justification.</p>
              )}
            </div>
          ))}
        </div>
        <Card className="mt-5 bg-accent/60">
          <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
            <Users className="size-5 text-primary" aria-hidden="true" />
            Why human judgment?
          </h3>
          <p className="leading-relaxed text-foreground/80">
            Automated classifiers miss partial leaks, culturally specific harms, and refusals that
            still hand over the dangerous part. Automated assessments are shown as hints, clearly
            labelled with the method that produced them — the recorded verdict is always the
            reviewer&apos;s.
          </p>
        </Card>
      </section>

      <div className="mt-12 flex justify-end">
        <Link href="/evaluate" className={cn(buttonVariants(), ctaClass, 'h-12 px-6 text-base')}>
          Continue to configuration
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </PageShell>
  )
}
