import type { Metadata } from 'next'
import { HistoryView } from '@/components/history/history-view'
import { PageHeading, PageShell } from '@/components/shared'

export const metadata: Metadata = { title: 'Audit history' }

export default function HistoryPage() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="Audit log"
        title="Audit history"
        description="Every saved evaluation with its verbatim response and human verdict. Open a record to inspect or revise it."
      />
      <HistoryView />
    </PageShell>
  )
}
