'use client'

import { Archive, FilterX, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NativeSelect, controlClass } from '@/components/form-fields'
import { PreviewNotice } from '@/components/preview-notice'
import { EmptyState, VerdictBadge, formatDateTime } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { CATEGORIES, LANGUAGES, MODELS, VERDICTS, VERDICT_ORDER, getCategory, getLanguage } from '@/lib/catalog'
import { useSession } from '@/lib/session-store'
import { cn } from '@/lib/utils'
import { RecordSheet } from './record-sheet'

const EMPTY_FILTERS = { q: '', language: '', model: '', verdict: '', category: '' }

export function HistoryView() {
  const { records } = useSession()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return [...records]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter(
        (r) =>
          (!filters.language || r.run.config.language === filters.language) &&
          (!filters.model || r.run.config.modelId === filters.model) &&
          (!filters.verdict || r.verdict === filters.verdict) &&
          (!filters.category || r.run.config.categoryId === filters.category) &&
          (!q ||
            [r.id, r.reviewer, r.run.submittedPrompt, r.run.response, r.justification]
              .join(' ')
              .toLowerCase()
              .includes(q)),
      )
  }, [records, filters])

  const openRecord = records.find((r) => r.id === openId) ?? null
  const hasFilters = Object.values(filters).some(Boolean)

  if (records.length === 0) {
    return (
      <EmptyState
        icon={Archive}
        title="No audit records yet"
        description="Saved evaluations appear here. Preview records live in this browser session and reset on reload."
        action={{ href: '/evaluate', label: 'Run your first evaluation' }}
      />
    )
  }

  const set = (key: keyof typeof EMPTY_FILTERS) => (e: { target: { value: string } }) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }))

  return (
    <>
      <PreviewNotice className="mb-6">
        Showing {records.length} record{records.length === 1 ? '' : 's'} from in-memory preview storage. Reloading clears them.
      </PreviewNotice>

      <div role="search" className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)_auto]">
        <label className="relative">
          <span className="sr-only">Search records</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={filters.q}
            onChange={set('q')}
            placeholder="Search prompt, response, reviewer…"
            className={cn(controlClass, 'pl-9')}
          />
        </label>
        {(
          [
            ['language', 'All languages', LANGUAGES.map((l) => [l.code, l.name])],
            ['model', 'All models', MODELS.map((m) => [m.id, m.name])],
            ['verdict', 'All verdicts', VERDICT_ORDER.map((v) => [v, VERDICTS[v].label])],
            ['category', 'All categories', CATEGORIES.map((c) => [c.id, c.name])],
          ] as const
        ).map(([key, all, options]) => (
          <NativeSelect key={key} aria-label={`Filter by ${key}`} value={filters[key]} onChange={set(key)}>
            <option value="">{all}</option>
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        ))}
        <Button variant="ghost" disabled={!hasFilters} onClick={() => setFilters(EMPTY_FILTERS)} className="h-11 rounded-full">
          <FilterX data-icon="inline-start" aria-hidden="true" />
          Clear
        </Button>
      </div>

      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} of {records.length} records
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No records match these filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Record</th>
                <th scope="col" className="px-4 py-3 font-semibold">Prompt</th>
                <th scope="col" className="px-4 py-3 font-semibold">Model</th>
                <th scope="col" className="px-4 py-3 font-semibold">Language</th>
                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                <th scope="col" className="px-4 py-3 font-semibold">Verdict</th>
                <th scope="col" className="px-4 py-3 font-semibold">Saved</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(r.id)}
                      className="rounded font-mono text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                    >
                      {r.id}
                    </button>
                  </td>
                  <td className="max-w-64 px-4 py-3">
                    <p dir="auto" className="truncate">{r.run.submittedPrompt}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.run.modelLabel}</td>
                  <td className="px-4 py-3">{getLanguage(r.run.config.language)?.name}</td>
                  <td className="px-4 py-3">{getCategory(r.run.config.categoryId)?.name}</td>
                  <td className="px-4 py-3">
                    <VerdictBadge verdict={r.verdict} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDateTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RecordSheet record={openRecord} onClose={() => setOpenId(null)} />
    </>
  )
}
