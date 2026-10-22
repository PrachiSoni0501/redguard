'use client'

import { History, Pencil } from 'lucide-react'
import { useState } from 'react'
import { AnnotationForm } from '@/components/review/annotation-form'
import { AssessmentCard, MetadataCard, PromptCard, ResponseCard } from '@/components/review/run-details'
import { Card, CardTitle, VerdictBadge, formatDateTime } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { updateAuditRecord } from '@/lib/session-store'
import type { AuditRecord } from '@/lib/types'

export function RecordSheet({ record, onClose }: { record: AuditRecord | null; onClose: () => void }) {
  const [editing, setEditing] = useState(false)

  return (
    <Sheet
      open={!!record}
      onOpenChange={(open) => {
        if (!open) {
          setEditing(false)
          onClose()
        }
      }}
    >
      <SheetContent className="w-full overflow-y-auto bg-background data-[side=right]:sm:max-w-3xl">
        {record && (
          <>
            <SheetHeader className="border-b border-border bg-card">
              <div className="flex flex-wrap items-center gap-2">
                <VerdictBadge verdict={record.verdict} />
                <span className="font-mono text-xs text-muted-foreground">{record.id}</span>
              </div>
              <SheetTitle className="font-display text-xl">{record.run.modelLabel}</SheetTitle>
              <SheetDescription>
                Reviewed by {record.reviewer} · {formatDateTime(record.updatedAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4 pb-8">
              <Card>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold">Human annotation</h2>
                  {!editing && (
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => setEditing(true)}>
                      <Pencil data-icon="inline-start" aria-hidden="true" />
                      Edit
                    </Button>
                  )}
                </div>
                {editing ? (
                  <AnnotationForm
                    key={record.updatedAt}
                    initial={record}
                    submitLabel="Save changes"
                    onCancel={() => setEditing(false)}
                    onSubmit={async (input) => {
                      await updateAuditRecord(record.id, input)
                      setEditing(false)
                    }}
                  />
                ) : (
                  <dl className="flex flex-col gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Justification</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap">{record.justification || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Notes</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap">{record.notes || '—'}</dd>
                    </div>
                  </dl>
                )}
              </Card>

              {record.revisions.length > 0 && (
                <Card>
                  <CardTitle icon={History}>Revision history</CardTitle>
                  <ol className="flex flex-col gap-3">
                    {[...record.revisions].reverse().map((rev) => (
                      <li key={rev.at} className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <VerdictBadge verdict={rev.verdict} />
                          <span className="text-xs text-muted-foreground">
                            {rev.reviewer} · replaced {formatDateTime(rev.at)}
                          </span>
                        </div>
                        {rev.justification && <p className="text-muted-foreground">{rev.justification}</p>}
                      </li>
                    ))}
                  </ol>
                </Card>
              )}

              <PromptCard run={record.run} />
              <ResponseCard run={record.run} />
              <div className="grid gap-5 md:grid-cols-2">
                <MetadataCard run={record.run} />
                <AssessmentCard run={record.run} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
