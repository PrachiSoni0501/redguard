'use client'

import { LoaderCircle, RotateCcw, Save } from 'lucide-react'
import { useId, useState } from 'react'
import { ErrorAlert, Field, controlClass, describedBy } from '@/components/form-fields'
import { ctaClass, verdictStyle } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { VERDICTS, VERDICT_ORDER } from '@/lib/catalog'
import type { AnnotationInput, Verdict } from '@/lib/types'
import { cn } from '@/lib/utils'
import { type FieldErrors, validateAnnotation } from '@/lib/validation'

export function AnnotationForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: AnnotationInput
  submitLabel: string
  onSubmit: (input: AnnotationInput) => Promise<void>
  onCancel?: () => void
}) {
  const uid = useId()
  const [verdict, setVerdict] = useState<Verdict | null>(initial?.verdict ?? null)
  const [justification, setJustification] = useState(initial?.justification ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [reviewer, setReviewer] = useState(initial?.reviewer ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const requiresReason = verdict ? VERDICTS[verdict].requiresReason : false

  async function submit() {
    const input = { verdict: verdict as Verdict, justification, notes, reviewer }
    const nextErrors = verdict ? validateAnnotation(input) : { verdict: 'Choose a label for this response.' }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSaving(true)
    setSaveError(null)
    try {
      await onSubmit({
        verdict: input.verdict,
        justification: justification.trim(),
        notes: notes.trim(),
        reviewer: reviewer.trim(),
      })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'The record could not be saved.')
      setSaving(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex flex-col gap-5"
    >
      <fieldset disabled={saving} className="flex flex-col gap-5">
        <div>
          <legend className="mb-2 text-sm font-medium">Verdict</legend>
          <div role="radiogroup" aria-label="Verdict" aria-describedby={errors.verdict ? `${uid}-verdict-error` : undefined} className="grid gap-2">
            {VERDICT_ORDER.map((v) => {
              const style = verdictStyle(v)
              const Icon = style.icon
              const selected = verdict === v
              return (
                <label
                  key={v}
                  className={cn(
                    'flex cursor-pointer gap-3 rounded-xl border p-3 transition-all has-focus-visible:ring-3 has-focus-visible:ring-ring/30',
                    selected ? 'border-primary bg-accent/60 shadow-sm' : 'border-border hover:border-ring/40',
                  )}
                >
                  <input
                    type="radio"
                    name={`${uid}-verdict`}
                    className="sr-only"
                    checked={selected}
                    onChange={() => {
                      setVerdict(v)
                      setErrors((e) => ({ ...e, verdict: undefined }))
                    }}
                  />
                  <span className={cn('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset', style.className)}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{VERDICTS[v].label}</span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">{VERDICTS[v].definition}</span>
                  </span>
                </label>
              )
            })}
          </div>
          {errors.verdict && (
            <p id={`${uid}-verdict-error`} className="mt-1.5 text-xs font-medium text-destructive">
              {errors.verdict}
            </p>
          )}
        </div>

        <Field
          id={`${uid}-justification`}
          label={
            <>
              Justification{' '}
              <span className="font-normal text-muted-foreground">{requiresReason ? '(required)' : '(optional)'}</span>
            </>
          }
          error={errors.justification}
          hint="Cite the specific part of the response that supports your label."
        >
          <textarea
            id={`${uid}-justification`}
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            aria-invalid={!!errors.justification}
            aria-describedby={describedBy(`${uid}-justification`, errors.justification, true)}
            className={cn(controlClass, 'resize-y')}
          />
        </Field>

        <Field id={`${uid}-notes`} label={<>Reviewer notes <span className="font-normal text-muted-foreground">(optional)</span></>}>
          <textarea
            id={`${uid}-notes`}
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={cn(controlClass, 'resize-y')}
          />
        </Field>

        <Field id={`${uid}-reviewer`} label="Reviewer ID" error={errors.reviewer}>
          <input
            id={`${uid}-reviewer`}
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            autoComplete="off"
            placeholder="e.g. R-07 or initials"
            aria-invalid={!!errors.reviewer}
            aria-describedby={describedBy(`${uid}-reviewer`, errors.reviewer)}
            className={controlClass}
          />
        </Field>
      </fieldset>

      {saveError && (
        <ErrorAlert
          title="Save failed"
          action={
            <Button type="submit" variant="outline" className="shrink-0">
              <RotateCcw data-icon="inline-start" aria-hidden="true" />
              Retry
            </Button>
          }
        >
          {saveError}
        </ErrorAlert>
      )}

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button type="submit" disabled={saving} className={cn(ctaClass, 'flex-1')}>
          {saving ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            <>
              <Save data-icon="inline-start" aria-hidden="true" />
              {submitLabel}
            </>
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" disabled={saving} onClick={onCancel} className={ctaClass}>
            Cancel
          </Button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {saving ? 'Saving audit record.' : ''}
      </p>
    </form>
  )
}
