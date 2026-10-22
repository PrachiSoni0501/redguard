import { Bot, Gauge, Microscope, ScrollText } from 'lucide-react'
import { Card, CardTitle, MetaList, SimulatedTag, formatDateTime } from '@/components/shared'
import { getCategory, getLanguage, getSubcategory } from '@/lib/catalog'
import type { EvaluationRun } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PromptCard({ run }: { run: EvaluationRun }) {
  const lang = getLanguage(run.config.language)!
  return (
    <Card>
      <CardTitle icon={ScrollText}>Submitted prompt</CardTitle>
      <pre
        lang={lang.code}
        dir={run.config.promptSource === 'dataset' ? lang.dir : 'auto'}
        className="rounded-xl border border-border bg-muted/60 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap"
      >
        {run.submittedPrompt}
      </pre>
    </Card>
  )
}

export function ResponseCard({ run }: { run: EvaluationRun }) {
  const lang = getLanguage(run.config.language)!
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Bot className="size-4.5 text-brand-electric" aria-hidden="true" />
          Model response
        </h2>
        <div className="flex items-center gap-2">
          {run.finishReason === 'length' && (
            <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">
              Truncated at token limit
            </span>
          )}
          <SimulatedTag />
        </div>
      </div>
      <pre
        lang={lang.code}
        dir="auto"
        className="max-h-[28rem] overflow-auto rounded-xl border border-brand-electric/20 bg-brand-electric/[0.04] p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap sm:text-base"
      >
        {run.response || <span className="text-muted-foreground italic">The model returned an empty response.</span>}
      </pre>
      <p className="mt-2 text-xs text-muted-foreground">
        Shown verbatim. Preview simulators replace any harmful instructions with placeholders.
      </p>
    </Card>
  )
}

export function MetadataCard({ run }: { run: EvaluationRun }) {
  const { config } = run
  return (
    <Card>
      <CardTitle icon={Gauge}>Run metadata</CardTitle>
      <MetaList
        items={[
          { label: 'Run ID', value: <span className="font-mono text-xs">{run.id}</span> },
          { label: 'Created', value: formatDateTime(run.createdAt) },
          { label: 'Model', value: run.modelLabel },
          { label: 'Provider', value: run.provider },
          { label: 'Language', value: getLanguage(config.language)?.name },
          { label: 'Prompt', value: config.promptSource === 'dataset' ? config.datasetPromptId : 'Custom' },
          { label: 'Category', value: getCategory(config.categoryId)?.name },
          { label: 'Subcategory', value: getSubcategory(config.categoryId, config.subcategoryId)?.name },
          { label: 'Temperature', value: config.temperature.toFixed(1) },
          { label: 'Max tokens', value: config.maxTokens },
          { label: 'Latency', value: `${run.latencyMs.toLocaleString()} ms` },
          { label: 'Finish reason', value: run.finishReason },
        ]}
      />
    </Card>
  )
}

const ASSESSMENT_TONE = {
  refusal: 'bg-success/12 text-success',
  compliance: 'bg-brand-coral/12 text-destructive',
  unclear: 'bg-muted text-muted-foreground',
}

export function AssessmentCard({ run }: { run: EvaluationRun }) {
  const { assessment, evidence } = run
  return (
    <Card>
      <CardTitle icon={Microscope}>Automated assessment</CardTitle>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', ASSESSMENT_TONE[assessment.label])}>
          Likely {assessment.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {assessment.method} v{assessment.methodVersion} · not a verdict
        </span>
      </div>
      {assessment.matchedSignals.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Matched signals:{' '}
          {assessment.matchedSignals.map((s) => (
            <code key={s} className="mr-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
              {s}
            </code>
          ))}
        </p>
      )}

      <h3 className="mt-5 mb-2 text-sm font-semibold">Evidence from the response</h3>
      <ul className="flex flex-col gap-1.5 text-sm">
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">Words</span>
          <span className="font-medium">{evidence.wordCount}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">Offers safe alternative</span>
          <span className="font-medium">{evidence.offersAlternative ? 'Yes' : 'No'}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">Numbered steps</span>
          <span className="font-medium">{evidence.stepCount}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">Truncated</span>
          <span className="font-medium">{evidence.truncated ? 'Yes' : 'No'}</span>
        </li>
      </ul>
      {evidence.refusalPhrases.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Refusal phrasing quoted from response</p>
          {evidence.refusalPhrases.map((q) => (
            <blockquote key={q} dir="auto" className="border-l-2 border-success pl-3 text-sm italic">
              {q}
            </blockquote>
          ))}
        </div>
      )}
    </Card>
  )
}
