'use client'

import { BarChart3 } from 'lucide-react'
import { PreviewNotice } from '@/components/preview-notice'
import { Card, EmptyState } from '@/components/shared'
import { CATEGORIES, LANGUAGES, MODELS } from '@/lib/catalog'
import { type GroupMetrics, type RateMetric, computeMetrics, formatRate, groupMetrics } from '@/lib/metrics'
import { useSession } from '@/lib/session-store'
import { cn } from '@/lib/utils'

const METRICS = [
  {
    key: 'unsafeCompliance',
    label: 'Unsafe compliance',
    definition: 'Block verdicts ÷ completed reviews',
    bar: 'bg-brand-coral',
    text: 'text-destructive',
  },
  {
    key: 'appropriateRefusal',
    label: 'Appropriate refusal',
    definition: 'Accept verdicts on refusals ÷ completed reviews',
    bar: 'bg-success',
    text: 'text-success',
  },
  {
    key: 'disagreement',
    label: 'Human–auto disagreement',
    definition: 'Verdicts contradicting the automated hint ÷ comparable reviews',
    bar: 'bg-brand-electric',
    text: 'text-brand-electric',
  },
] as const

function RateCell({ metric, bar }: { metric: RateMetric; bar: string }) {
  return (
    <div className="min-w-28">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{formatRate(metric)}</span>
        <span className="text-xs text-muted-foreground">
          {metric.numerator}/{metric.denominator}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className={cn('h-full rounded-full', bar)} style={{ width: `${(metric.rate ?? 0) * 100}%` }} />
      </div>
    </div>
  )
}

function BreakdownTable({ title, rows }: { title: string; rows: GroupMetrics[] }) {
  const id = `breakdown-${title.toLowerCase()}`
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-3 font-display text-xl font-bold tracking-tight">
        By {title.toLowerCase()}
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">{title}</th>
              <th scope="col" className="px-4 py-3 font-semibold">Reviewed</th>
              {METRICS.map((m) => (
                <th key={m.key} scope="col" className="px-4 py-3 font-semibold">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border/70 last:border-0">
                <th scope="row" className="px-4 py-3 font-medium">{row.label}</th>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {row.completed}
                  {row.pending > 0 && <span className="ml-1 text-xs">(+{row.pending} pending)</span>}
                </td>
                {METRICS.map((m) => (
                  <td key={m.key} className="px-4 py-3">
                    <RateCell metric={row[m.key]} bar={m.bar} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function AnalyticsView() {
  const { records } = useSession()

  if (records.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data to analyze yet"
        description="Analytics are computed from saved audit records in this session. Save a few evaluations to see comparisons."
        action={{ href: '/evaluate', label: 'Start an evaluation' }}
      />
    )
  }

  const overall = computeMetrics(records, 'all', 'All')

  return (
    <div className="flex flex-col gap-10">
      <PreviewNotice>
        Computed from {records.length} preview-session record{records.length === 1 ? '' : 's'}. Small samples are not statistically meaningful — every rate shows its numerator and denominator.
      </PreviewNotice>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary to-brand-electric text-white">
          <p className="text-sm font-medium text-white/80">Records</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{overall.total}</p>
          <p className="mt-1 text-xs text-white/80">
            {overall.completed} completed · {overall.pending} needs review
          </p>
        </Card>
        {METRICS.map((m) => {
          const metric = overall[m.key]
          return (
            <Card key={m.key}>
              <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
              <p className={cn('mt-1 font-display text-4xl font-extrabold', m.text)}>{formatRate(metric)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.numerator} of {metric.denominator} · {m.definition}
              </p>
            </Card>
          )
        })}
      </div>

      <BreakdownTable
        title="Language"
        rows={groupMetrics(records, LANGUAGES.map((l) => ({ key: l.code, label: l.name })), (r) => r.run.config.language)}
      />
      <BreakdownTable
        title="Model"
        rows={groupMetrics(records, MODELS.map((m) => ({ key: m.id, label: m.name })), (r) => r.run.config.modelId)}
      />
      <BreakdownTable
        title="Category"
        rows={groupMetrics(records, CATEGORIES.map((c) => ({ key: c.id, label: c.name })), (r) => r.run.config.categoryId)}
      />
    </div>
  )
}
