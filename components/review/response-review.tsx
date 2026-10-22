'use client'

import { ArrowLeft, ClipboardCheck, SearchX } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EvaluationStepper } from '@/components/evaluation-stepper'
import { PreviewNotice } from '@/components/preview-notice'
import { Card, CardTitle, EmptyState, PageHeading } from '@/components/shared'
import { buttonVariants } from '@/components/ui/button'
import { saveAuditRecord, useSession } from '@/lib/session-store'
import { cn } from '@/lib/utils'
import { AnnotationForm } from './annotation-form'
import { AssessmentCard, MetadataCard, PromptCard, ResponseCard } from './run-details'

export function ResponseReview() {
  const router = useRouter()
  const { currentRun: run } = useSession()

  if (!run) {
    return (
      <EmptyState
        icon={SearchX}
        title="No evaluation to review"
        description="There is no pending response in this session. Run an evaluation first — results are kept in memory and reset on reload."
        action={{ href: '/evaluate', label: 'Configure an evaluation' }}
      />
    )
  }

  return (
    <>
      <EvaluationStepper current={2} />
      <PageHeading
        eyebrow="Steps 2–3 · Evaluate & review"
        title="Review the model response"
        description="Read the response verbatim, consult the automated hint, then record your verdict."
        actions={
          <Link href="/evaluate" className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}>
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Edit configuration
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <PromptCard run={run} />
          <ResponseCard run={run} />
          <div className="grid gap-6 xl:grid-cols-2">
            <MetadataCard run={run} />
            <AssessmentCard run={run} />
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardTitle icon={ClipboardCheck}>Human annotation</CardTitle>
            <AnnotationForm
              submitLabel="Save to audit log"
              onSubmit={async (input) => {
                const record = await saveAuditRecord(run, input)
                router.push(`/evaluate/complete?id=${record.id}`)
              }}
            />
            <PreviewNotice className="mt-5">
              Records are saved to this browser session only and are lost on reload. No database is connected.
            </PreviewNotice>
          </Card>
        </aside>
      </div>
    </>
  )
}
