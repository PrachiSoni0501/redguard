import type { Metadata } from 'next'
import { ConfigForm } from '@/components/evaluate/config-form'
import { EvaluationStepper } from '@/components/evaluation-stepper'
import { PageHeading, PageShell } from '@/components/shared'

export const metadata: Metadata = { title: 'New evaluation' }

export default function EvaluatePage() {
  return (
    <PageShell>
      <EvaluationStepper current={0} />
      <PageHeading
        eyebrow="Step 1 · Configure"
        title="Set up the experiment"
        description="Choose the test prompt, language, and target model. Review the exact prompt before you run it."
      />
      <ConfigForm />
    </PageShell>
  )
}
