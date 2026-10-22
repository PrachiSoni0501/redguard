'use client'

import { ArrowRight, CircleCheckBig, History, Plus, SearchX } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { EvaluationStepper } from '@/components/evaluation-stepper'
import { PreviewNotice } from '@/components/preview-notice'
import { Card, EmptyState, MetaList, VerdictBadge, ctaClass, formatDateTime } from '@/components/shared'
import { buttonVariants } from '@/components/ui/button'
import { getLanguage } from '@/lib/catalog'
import { useSession } from '@/lib/session-store'
import { cn } from '@/lib/utils'

export function Completion() {
  const id = useSearchParams().get('id')
  const { records } = useSession()
  const record = records.find((r) => r.id === id)

  if (!record) {
    return (
      <EmptyState
        icon={SearchX}
        title="Record not found"
        description="This audit record isn't in the current session. Preview records are cleared when the page reloads."
        action={{ href: '/history', label: 'Open audit history' }}
      />
    )
  }

  return (
    <>
      <EvaluationStepper current={3} />
      <div className="mx-auto max-w-2xl">
        <Card className="text-center">
          <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-success to-brand-cyan text-white shadow-lg shadow-success/20">
            <CircleCheckBig className="size-8" aria-hidden="true" />
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight">Audit record saved</h1>
          <p className="mt-2 text-muted-foreground">
            Record <span className="font-mono text-foreground">{record.id}</span> was added to this session&apos;s audit log.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-left">
            <div className="mb-4 flex items-center justify-between">
              <VerdictBadge verdict={record.verdict} />
              <span className="text-xs text-muted-foreground">{formatDateTime(record.createdAt)}</span>
            </div>
            <MetaList
              items={[
                { label: 'Model', value: record.run.modelLabel },
                { label: 'Language', value: getLanguage(record.run.config.language)?.name },
                { label: 'Reviewer', value: record.reviewer },
                { label: 'Storage', value: 'Preview session' },
              ]}
            />
          </div>
          <PreviewNotice className="mt-5 text-left">
            Saved to in-memory preview storage — not a database. Reloading the page clears it.
          </PreviewNotice>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/evaluate" className={cn(buttonVariants(), ctaClass)}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Start another evaluation
            </Link>
            <Link href="/history" className={cn(buttonVariants({ variant: 'outline' }), ctaClass)}>
              <History data-icon="inline-start" aria-hidden="true" />
              View audit history
            </Link>
            <Link href="/analytics" className={cn(buttonVariants({ variant: 'ghost' }), ctaClass)}>
              Analytics
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </div>
    </>
  )
}
