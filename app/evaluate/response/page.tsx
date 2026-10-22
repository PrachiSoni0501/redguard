import type { Metadata } from 'next'
import { ResponseReview } from '@/components/review/response-review'
import { PageShell } from '@/components/shared'

export const metadata: Metadata = { title: 'Review response' }

export default function ResponsePage() {
  return (
    <PageShell>
      <ResponseReview />
    </PageShell>
  )
}
