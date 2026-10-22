import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Configure', 'Evaluate', 'Review', 'Audit'] as const

export function EvaluationStepper({ current }: { current: 0 | 1 | 2 | 3 }) {
  return (
    <nav aria-label="Evaluation progress" className="mb-8">
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((step, index) => {
          const done = index < current
          const active = index === current
          return (
            <li key={step} aria-current={active ? 'step' : undefined} className="flex flex-col gap-2">
              <span
                className={cn(
                  'h-1.5 rounded-full transition-colors',
                  done && 'bg-primary',
                  active && 'bg-gradient-to-r from-primary via-brand-electric to-brand-cyan',
                  !done && !active && 'bg-border',
                )}
              />
              <span
                className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold sm:text-sm',
                  active ? 'text-foreground' : done ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'hidden size-5 items-center justify-center rounded-full text-[11px] sm:flex',
                    done && 'bg-primary text-primary-foreground',
                    active && 'bg-brand-electric text-white',
                    !done && !active && 'bg-muted text-muted-foreground',
                  )}
                >
                  {done ? <Check className="size-3" aria-hidden="true" /> : index + 1}
                </span>
                {step}
                {done && <span className="sr-only">(completed)</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
