import type { Metadata } from 'next'
import { AnalyticsView } from '@/components/analytics/analytics-view'
import { PageHeading, PageShell } from '@/components/shared'

export const metadata: Metadata = { title: 'Analytics' }

export default function AnalyticsPage() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="Analytics"
        title="Safety across languages"
        description="Compare how models handle the same harmful requests by language, model, and harm category."
      />
      <AnalyticsView />
    </PageShell>
  )
}
