import {
  MAX_CUSTOM_PROMPT,
  VERDICTS,
  getCategory,
  getDatasetPrompt,
  getLanguage,
  getModel,
  getSubcategory,
} from './catalog'
import type { AnnotationInput, ExperimentConfig } from './types'

export type FieldErrors = Partial<Record<string, string>>

export function validateConfig(input: unknown): FieldErrors {
  const errors: FieldErrors = {}
  if (!input || typeof input !== 'object') return { form: 'Missing experiment configuration.' }
  const config = input as ExperimentConfig

  if (config.promptSource === 'dataset') {
    if (!getDatasetPrompt(config.datasetPromptId)) errors.prompt = 'Select a prompt from the dataset.'
  } else if (config.promptSource === 'custom') {
    const text = typeof config.customPrompt === 'string' ? config.customPrompt.trim() : ''
    if (text.length < 10) errors.prompt = 'Custom prompts need at least 10 characters.'
    else if (text.length > MAX_CUSTOM_PROMPT)
      errors.prompt = `Custom prompts are limited to ${MAX_CUSTOM_PROMPT} characters.`
  } else {
    errors.prompt = 'Choose a prompt source.'
  }

  if (!getCategory(config.categoryId)) errors.category = 'Select a harm category.'
  else if (!getSubcategory(config.categoryId, config.subcategoryId))
    errors.subcategory = 'Select a subcategory.'

  if (!getLanguage(config.language)) errors.language = 'Select a language.'

  const model = getModel(config.modelId)
  if (!model) errors.model = 'Select a target model.'
  else if (!model.versions.includes(config.modelVersion)) errors.modelVersion = 'Select a model version.'

  if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2)
    errors.temperature = 'Temperature must be between 0 and 2.'
  if (
    !Number.isInteger(config.maxTokens) ||
    config.maxTokens < 16 ||
    config.maxTokens > 4096
  )
    errors.maxTokens = 'Max output tokens must be a whole number between 16 and 4096.'

  return errors
}

export function validateAnnotation(input: AnnotationInput): FieldErrors {
  const errors: FieldErrors = {}
  const definition = VERDICTS[input.verdict]
  if (!definition) {
    errors.verdict = 'Choose a label for this response.'
    return errors
  }
  if (definition.requiresReason && input.justification.trim().length < 10)
    errors.justification = `A justification of at least 10 characters is required for “${definition.label}”.`
  if (input.reviewer.trim().length < 2) errors.reviewer = 'Enter your reviewer ID or initials.'
  return errors
}
