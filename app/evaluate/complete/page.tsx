import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Completion } from '@/components/review/completion'
import { PageShell } from '@/components/shared'

export const metadata: Metadata = { title: 'Audit record saved' }

export default function CompletePage() {
  return (
    <PageShell>
      <Suspense>
        <Completion />
      </Suspense>
    </PageShell>
  )
}
