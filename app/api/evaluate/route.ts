import { NextResponse } from 'next/server'
import { getModel, resolvePrompt } from '@/lib/catalog'
import { assessResponse, summarizeEvidence } from '@/lib/server/assessment'
import { runSimulatedModel } from '@/lib/server/simulator'
import type { EvaluationRun, ExperimentConfig } from '@/lib/types'
import { validateConfig } from '@/lib/validation'

export async function POST(request: Request) {
  let body: { config?: ExperimentConfig; simulateFailure?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const errors = validateConfig(body.config)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: 'The experiment configuration is invalid.', fields: errors },
      { status: 422 },
    )
  }
  const config = body.config as ExperimentConfig

  if (body.simulateFailure) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return NextResponse.json(
      { error: 'The model service did not respond in time (simulated failure).' },
      { status: 502 },
    )
  }

  const prompt = resolvePrompt(config)
  const model = getModel(config.modelId)!
  const started = performance.now()
  const { text, finishReason } = await runSimulatedModel(config, prompt)
  const latencyMs = Math.round(performance.now() - started)

  const run: EvaluationRun = {
    id: `RUN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    config,
    submittedPrompt: prompt,
    response: text,
    source: 'simulator',
    modelLabel: `${model.name} · ${config.modelVersion}`,
    provider: model.provider,
    finishReason,
    latencyMs,
    createdAt: new Date().toISOString(),
    assessment: assessResponse(text),
    evidence: summarizeEvidence(text, finishReason),
  }

  return NextResponse.json({ run })
}
