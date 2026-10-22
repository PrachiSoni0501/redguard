'use client'

import { useSyncExternalStore } from 'react'
import { DEFAULT_CONFIG } from './catalog'
import type { AnnotationInput, AuditRecord, EvaluationRun, ExperimentConfig } from './types'

interface SessionState {
  draft: ExperimentConfig
  currentRun: EvaluationRun | null
  records: AuditRecord[]
}

const initialState: SessionState = { draft: DEFAULT_CONFIG, currentRun: null, records: [] }
let state = initialState
const listeners = new Set<() => void>()

function setState(updater: (prev: SessionState) => SessionState) {
  state = updater(state)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSession() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  )
}

export function updateDraft(patch: Partial<ExperimentConfig>) {
  setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }))
}

export function setCurrentRun(run: EvaluationRun | null) {
  setState((s) => ({ ...s, currentRun: run }))
}

const writeDelay = () => new Promise((resolve) => setTimeout(resolve, 500))

function newRecordId() {
  return `AR-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`
}

/** Preview persistence adapter: writes to in-memory session state only, never to a database. */
export async function saveAuditRecord(run: EvaluationRun, input: AnnotationInput) {
  await writeDelay()
  const now = new Date().toISOString()
  const record: AuditRecord = {
    id: newRecordId(),
    run,
    ...input,
    createdAt: now,
    updatedAt: now,
    revisions: [{ ...input, at: now }],
    storage: 'preview-session',
  }
  setState((s) => ({ ...s, records: [record, ...s.records], currentRun: null }))
  return record
}

export async function updateAuditRecord(id: string, input: AnnotationInput) {
  await writeDelay()
  const existing = state.records.find((r) => r.id === id)
  if (!existing) throw new Error('This audit record no longer exists in the preview session.')
  const now = new Date().toISOString()
  const updated: AuditRecord = {
    ...existing,
    ...input,
    updatedAt: now,
    revisions: [...existing.revisions, { ...input, at: now }],
  }
  setState((s) => ({ ...s, records: s.records.map((r) => (r.id === id ? updated : r)) }))
  return updated
}
