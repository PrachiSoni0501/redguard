'use client'

import { ArrowRight, FileText, Languages, LoaderCircle, Pencil, RotateCcw, Settings2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Field, ErrorAlert, NativeSelect, controlClass, describedBy } from '@/components/form-fields'
import { Card, CardTitle, ctaClass } from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  CATEGORIES,
  DATASET_PROMPTS,
  LANGUAGES,
  MAX_CUSTOM_PROMPT,
  MODELS,
  getCategory,
  getDatasetPrompt,
  getLanguage,
  getModel,
  getSubcategory,
  resolvePrompt,
} from '@/lib/catalog'
import { setCurrentRun, updateDraft, useSession } from '@/lib/session-store'
import type { EvaluationRun, PromptSource } from '@/lib/types'
import { cn } from '@/lib/utils'
import { type FieldErrors, validateConfig } from '@/lib/validation'

type RunState = { status: 'idle' } | { status: 'running' } | { status: 'error'; message: string }

export function ConfigForm() {
  const router = useRouter()
  const { draft } = useSession()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showErrors, setShowErrors] = useState(false)
  const [runState, setRunState] = useState<RunState>({ status: 'idle' })
  const [simulateFailure, setSimulateFailure] = useState(false)

  const model = getModel(draft.modelId)
  const category = getCategory(draft.categoryId)
  const language = getLanguage(draft.language)!
  const prompt = resolvePrompt(draft)
  const fromDataset = draft.promptSource === 'dataset'
  const running = runState.status === 'running'
  const visibleErrors = showErrors ? errors : {}

  function patch(next: Parameters<typeof updateDraft>[0]) {
    updateDraft(next)
    if (showErrors) setErrors(validateConfig({ ...draft, ...next }))
  }

  function setSource(source: PromptSource) {
    if (source === 'dataset') {
      const p = getDatasetPrompt(draft.datasetPromptId) ?? DATASET_PROMPTS[0]
      patch({ promptSource: source, datasetPromptId: p.id, categoryId: p.categoryId, subcategoryId: p.subcategoryId })
    } else {
      patch({ promptSource: source })
    }
  }

  async function run() {
    const nextErrors = validateConfig(draft)
    setErrors(nextErrors)
    setShowErrors(true)
    if (Object.keys(nextErrors).length > 0) {
      setRunState({ status: 'idle' })
      document.getElementById('config-errors')?.focus()
      return
    }
    setRunState({ status: 'running' })
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: draft, simulateFailure }),
      })
      const data = (await res.json().catch(() => ({}))) as { run?: EvaluationRun; error?: string; fields?: FieldErrors }
      if (!res.ok || !data.run) {
        if (data.fields) setErrors(data.fields)
        throw new Error(data.error ?? `The model service returned status ${res.status}.`)
      }
      setCurrentRun(data.run)
      router.push('/evaluate/response')
    } catch (error) {
      setRunState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error — the request did not complete.',
      })
    }
  }

  const errorCount = Object.keys(visibleErrors).length

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        run()
      }}
      className="grid gap-6 lg:grid-cols-[1fr_22rem]"
    >
      <div className="flex min-w-0 flex-col gap-6">
        {errorCount > 0 && (
          <div id="config-errors" tabIndex={-1} className="outline-none">
            <ErrorAlert title={`Fix ${errorCount} ${errorCount === 1 ? 'issue' : 'issues'} before running`}>
              <ul className="list-disc pl-4">
                {Object.values(visibleErrors).map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </ErrorAlert>
          </div>
        )}

        <Card as="fieldset" disabled={running} className="min-w-0">
          <legend className="sr-only">Prompt</legend>
          <CardTitle icon={FileText}>Prompt</CardTitle>
          <div role="radiogroup" aria-label="Prompt source" className="mb-5 inline-flex rounded-full bg-muted p-1">
            {(
              [
                ['dataset', 'From dataset', FileText],
                ['custom', 'Custom prompt', Pencil],
              ] as const
            ).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={draft.promptSource === value}
                onClick={() => setSource(value)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  draft.promptSource === value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {fromDataset ? (
            <div role="radiogroup" aria-label="Dataset prompts" aria-invalid={!!visibleErrors.prompt} className="grid gap-3 sm:grid-cols-2">
              {DATASET_PROMPTS.map((p) => {
                const selected = draft.datasetPromptId === p.id
                const cat = getCategory(p.categoryId)
                return (
                  <label
                    key={p.id}
                    className={cn(
                      'cursor-pointer rounded-xl border p-4 transition-all has-focus-visible:ring-3 has-focus-visible:ring-ring/30',
                      selected ? 'border-primary bg-accent/60 shadow-sm' : 'border-border hover:border-ring/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="dataset-prompt"
                      className="sr-only"
                      checked={selected}
                      onChange={() => patch({ datasetPromptId: p.id, categoryId: p.categoryId, subcategoryId: p.subcategoryId })}
                    />
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {cat?.name}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed">{p.text.en}</span>
                  </label>
                )
              })}
            </div>
          ) : (
            <Field
              id="custom-prompt"
              label="Custom prompt"
              error={visibleErrors.prompt}
              hint={`Submitted verbatim in the language you write it in · ${draft.customPrompt.length}/${MAX_CUSTOM_PROMPT}`}
            >
              <textarea
                id="custom-prompt"
                rows={5}
                maxLength={MAX_CUSTOM_PROMPT}
                value={draft.customPrompt}
                onChange={(e) => patch({ customPrompt: e.target.value })}
                aria-invalid={!!visibleErrors.prompt}
                aria-describedby={describedBy('custom-prompt', visibleErrors.prompt, true)}
                dir="auto"
                placeholder="Write the test prompt exactly as it should be sent to the model…"
                className={cn(controlClass, 'resize-y leading-relaxed')}
              />
            </Field>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              id="category"
              label="Harm category"
              error={visibleErrors.category}
              hint={fromDataset ? 'Set by the dataset item' : undefined}
            >
              <NativeSelect
                id="category"
                value={draft.categoryId}
                disabled={fromDataset}
                aria-invalid={!!visibleErrors.category}
                onChange={(e) => {
                  const next = getCategory(e.target.value)
                  patch({ categoryId: e.target.value, subcategoryId: next?.subcategories[0]?.id ?? '' })
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field id="subcategory" label="Subcategory" error={visibleErrors.subcategory}>
              <NativeSelect
                id="subcategory"
                value={draft.subcategoryId}
                disabled={fromDataset}
                aria-invalid={!!visibleErrors.subcategory}
                onChange={(e) => patch({ subcategoryId: e.target.value })}
              >
                {category?.subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
        </Card>

        <Card as="fieldset" disabled={running} className="min-w-0">
          <legend className="sr-only">Language</legend>
          <CardTitle icon={Languages}>Language</CardTitle>
          <div role="radiogroup" aria-label="Evaluation language" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LANGUAGES.map((l) => {
              const selected = draft.language === l.code
              return (
                <label
                  key={l.code}
                  className={cn(
                    'cursor-pointer rounded-xl border p-3.5 text-center transition-all has-focus-visible:ring-3 has-focus-visible:ring-ring/30',
                    selected ? 'border-primary bg-accent/60 shadow-sm' : 'border-border hover:border-ring/40',
                  )}
                >
                  <input
                    type="radio"
                    name="language"
                    className="sr-only"
                    checked={selected}
                    onChange={() => patch({ language: l.code })}
                  />
                  <span lang={l.code} dir={l.dir} className="block font-display text-lg font-semibold">
                    {l.native}
                  </span>
                  <span className="text-xs text-muted-foreground">{l.name}</span>
                </label>
              )
            })}
          </div>
          {fromDataset && draft.language !== 'en' && (
            <p className="mt-3 text-xs text-muted-foreground">
              Dataset translations are preview translations — verify with a native speaker before study use.
            </p>
          )}
        </Card>

        <Card as="fieldset" disabled={running} className="min-w-0">
          <legend className="sr-only">Model and settings</legend>
          <CardTitle icon={Settings2}>Target model</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="model" label="Model" error={visibleErrors.model} hint={model?.provider}>
              <NativeSelect
                id="model"
                value={draft.modelId}
                aria-invalid={!!visibleErrors.model}
                onChange={(e) => {
                  const m = getModel(e.target.value)
                  patch({ modelId: e.target.value, modelVersion: m?.versions[0] ?? '' })
                }}
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field id="model-version" label="Version" error={visibleErrors.modelVersion}>
              <NativeSelect
                id="model-version"
                value={draft.modelVersion}
                aria-invalid={!!visibleErrors.modelVersion}
                onChange={(e) => patch({ modelVersion: e.target.value })}
              >
                {model?.versions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              id="temperature"
              label={
                <span className="flex justify-between">
                  Temperature
                  <span className="font-mono text-muted-foreground">{draft.temperature.toFixed(1)}</span>
                </span>
              }
              error={visibleErrors.temperature}
              hint={model?.supportsTemperature ? '0 = deterministic, 2 = most varied' : 'Not supported by this model'}
            >
              <input
                id="temperature"
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={draft.temperature}
                disabled={!model?.supportsTemperature}
                onChange={(e) => patch({ temperature: Number(e.target.value) })}
                aria-describedby="temperature-hint"
                className="h-10 w-full accent-primary disabled:opacity-40"
              />
            </Field>
            <Field
              id="max-tokens"
              label="Max output tokens"
              error={visibleErrors.maxTokens}
              hint={model?.supportsMaxTokens ? '16 – 4096' : 'Not supported by this model'}
            >
              <input
                id="max-tokens"
                type="number"
                inputMode="numeric"
                min={16}
                max={4096}
                value={Number.isNaN(draft.maxTokens) ? '' : draft.maxTokens}
                disabled={!model?.supportsMaxTokens}
                aria-invalid={!!visibleErrors.maxTokens}
                aria-describedby={describedBy('max-tokens', visibleErrors.maxTokens, true)}
                onChange={(e) => patch({ maxTokens: e.target.valueAsNumber })}
                className={controlClass}
              />
            </Field>
          </div>
        </Card>

        <Card className="min-w-0">
          <h2 className="mb-1 font-display text-lg font-semibold">Exact prompt to be submitted</h2>
          <p className="mb-3 text-sm text-muted-foreground">This text is sent to the model byte-for-byte.</p>
          <pre
            lang={language.code}
            dir={fromDataset ? language.dir : 'auto'}
            className="max-h-60 overflow-auto rounded-xl border border-border bg-muted/60 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap"
          >
            {prompt || <span className="text-muted-foreground italic">No prompt yet.</span>}
          </pre>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="flex flex-col gap-5">
          <h2 className="font-display text-lg font-semibold">Experiment summary</h2>
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ['Prompt', fromDataset ? draft.datasetPromptId : 'Custom'],
              ['Category', `${category?.name ?? '—'} · ${getSubcategory(draft.categoryId, draft.subcategoryId)?.name ?? '—'}`],
              ['Language', language.name],
              ['Model', model ? `${model.name} ${draft.modelVersion}` : '—'],
              ['Temperature', model?.supportsTemperature ? draft.temperature.toFixed(1) : 'n/a'],
              ['Max tokens', model?.supportsMaxTokens ? String(draft.maxTokens || '—') : 'n/a'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border/70 pb-2 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <label className="flex items-start gap-2 rounded-xl bg-muted/70 p-3 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <span>
              <span className="font-semibold text-foreground">Preview tool:</span> simulate a model service failure to test the error and retry states.
            </span>
          </label>

          {runState.status === 'error' && (
            <ErrorAlert
              title="Evaluation failed"
              action={
                <Button type="submit" variant="outline" className="shrink-0">
                  <RotateCcw data-icon="inline-start" aria-hidden="true" />
                  Retry
                </Button>
              }
            >
              {runState.message}
            </ErrorAlert>
          )}

          <Button type="submit" disabled={running} className={cn(ctaClass, 'h-12 w-full text-base')}>
            {running ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Running evaluation…
              </>
            ) : (
              <>
                Run Evaluation
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="sr-only" aria-live="polite">
            {running ? 'Running evaluation, waiting for the model response.' : ''}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Runs on the server. Preview models are simulators and never return real model output.
          </p>
        </Card>
      </aside>
    </form>
  )
}
