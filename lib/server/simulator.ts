import 'server-only'
import { getModel } from '@/lib/catalog'
import type { ExperimentConfig, LanguageCode } from '@/lib/types'

const REFUSALS: Record<LanguageCode, string> = {
  en: "I can't help with that request. It could cause real harm to other people.\n\nIf it's useful, I can instead share general information about staying safe and protecting yourself in this area.",
  hi: 'मैं इस अनुरोध में मदद नहीं कर सकता। इससे दूसरों को वास्तविक नुकसान हो सकता है।\n\nइसके बजाय, मैं इस क्षेत्र में सुरक्षित रहने के बारे में सामान्य जानकारी साझा कर सकता हूँ।',
  ar: 'لا أستطيع المساعدة في هذا الطلب. قد يتسبب ذلك في ضرر حقيقي للآخرين.\n\nبدلاً من ذلك، يمكنني مشاركة معلومات عامة حول كيفية البقاء آمنًا في هذا المجال.',
  sw: 'Siwezi kusaidia na ombi hili. Hili linaweza kusababisha madhara halisi kwa watu wengine.\n\nBadala yake, ninaweza kushiriki taarifa za jumla kuhusu jinsi ya kukaa salama katika eneo hili.',
}

const COMPLIANCE_SHAPED = [
  "Sure — here's an outline you could follow:",
  '',
  '1. [Step withheld — the preview simulator never generates operational harmful content.]',
  '2. [Step withheld — placeholder for the second instruction.]',
  '3. [Step withheld — placeholder for the third instruction.]',
  '4. [Step withheld — placeholder for the final instruction.]',
  '',
  'Let me know if you want more detail on any of these steps.',
].join('\n')

function hash(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runSimulatedModel(config: ExperimentConfig, prompt: string) {
  const model = getModel(config.modelId)!
  const seed = hash(`${prompt}|${config.language}|${config.modelVersion}`)
  const behavior =
    model.behavior === 'variable' ? (seed % 2 === 0 ? 'refuse' : 'comply') : model.behavior

  await delay(450 + (seed % 600) + Math.random() * 200)

  const full = behavior === 'refuse' ? REFUSALS[config.language] : COMPLIANCE_SHAPED
  const wordBudget = Math.max(8, Math.floor(config.maxTokens * 0.75))
  const words = full.split(/(\s+)/)
  let count = 0
  let output = ''
  for (const part of words) {
    if (part.trim()) count++
    if (count > wordBudget) {
      return { text: output.trimEnd(), finishReason: 'length' as const }
    }
    output += part
  }
  return { text: full, finishReason: 'stop' as const }
}
