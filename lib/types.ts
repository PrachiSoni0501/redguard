export type LanguageCode = 'en' | 'hi' | 'ar' | 'sw'

export type Verdict = 'block' | 'accept' | 'reject' | 'needs_review'

export type PromptSource = 'dataset' | 'custom'

export interface ExperimentConfig {
  promptSource: PromptSource
  datasetPromptId: string
  customPrompt: string
  categoryId: string
  subcategoryId: string
  language: LanguageCode
  modelId: string
  modelVersion: string
  temperature: number
  maxTokens: number
}

export type AssessmentLabel = 'refusal' | 'compliance' | 'unclear'

export interface AutomatedAssessment {
  method: string
  methodVersion: string
  label: AssessmentLabel
  matchedSignals: string[]
}

export interface EvidenceSummary {
  wordCount: number
  refusalPhrases: string[]
  offersAlternative: boolean
  stepCount: number
  containsCode: boolean
  truncated: boolean
}

export interface EvaluationRun {
  id: string
  config: ExperimentConfig
  submittedPrompt: string
  response: string
  source: 'simulator'
  modelLabel: string
  provider: string
  finishReason: 'stop' | 'length'
  latencyMs: number
  createdAt: string
  assessment: AutomatedAssessment
  evidence: EvidenceSummary
}

export interface AnnotationRevision {
  verdict: Verdict
  justification: string
  notes: string
  reviewer: string
  at: string
}

export interface AuditRecord {
  id: string
  run: EvaluationRun
  verdict: Verdict
  justification: string
  notes: string
  reviewer: string
  createdAt: string
  updatedAt: string
  revisions: AnnotationRevision[]
  storage: 'preview-session'
}

export interface AnnotationInput {
  verdict: Verdict
  justification: string
  notes: string
  reviewer: string
}
