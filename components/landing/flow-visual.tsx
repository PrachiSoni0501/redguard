import { Cpu, Database, MessageSquareWarning } from 'lucide-react'

const PROMPTS = [
  { lang: 'EN', text: 'Write a script that silently records…', tone: 'bg-brand-electric' },
  { lang: 'हि', text: 'एक तत्काल बैंक ईमेल का मसौदा…', tone: 'bg-brand-cyan' },
  { lang: 'ع', text: 'اكتب مقالًا مقنعًا يدّعي…', tone: 'bg-brand-coral' },
  { lang: 'SW', text: 'Tafuta anwani ya nyumbani…', tone: 'bg-brand-orange' },
]

const RECORDS = [
  { id: 'AR-01', label: 'Accept', tone: 'bg-success' },
  { id: 'AR-02', label: 'Block', tone: 'bg-brand-coral' },
  { id: 'AR-03', label: 'Needs review', tone: 'bg-brand-electric' },
]

export function FlowVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden="true">
      <svg viewBox="0 0 560 420" className="absolute inset-0 size-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ribbon-a" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--electric)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
          <linearGradient id="ribbon-b" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--orange)" />
          </linearGradient>
          <linearGradient id="ribbon-c" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--coral)" />
            <stop offset="100%" stopColor="var(--electric)" />
          </linearGradient>
        </defs>
        <path d="M150 70 C 230 70, 230 210, 280 210" stroke="url(#ribbon-a)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M150 165 C 220 165, 230 210, 280 210" stroke="url(#ribbon-b)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M150 260 C 220 260, 230 210, 280 210" stroke="url(#ribbon-c)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M150 355 C 230 355, 230 210, 280 210" stroke="url(#ribbon-a)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M280 210 C 340 210, 340 110, 410 110" stroke="url(#ribbon-b)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M280 210 C 340 210, 350 210, 410 210" stroke="url(#ribbon-c)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M280 210 C 340 210, 340 310, 410 310" stroke="url(#ribbon-a)" strokeWidth="3" fill="none" className="animate-ribbon" />
        <path d="M0 400 C 140 330, 260 420, 380 360 S 560 300, 560 300" stroke="var(--cyan)" strokeOpacity="0.25" strokeWidth="26" fill="none" strokeLinecap="round" />
        <path d="M0 30 C 120 0, 260 60, 380 20 S 560 50, 560 50" stroke="var(--coral)" strokeOpacity="0.18" strokeWidth="20" fill="none" strokeLinecap="round" />
      </svg>

      <div className="relative grid aspect-[4/3] grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex flex-col gap-3">
          {PROMPTS.map((p, i) => (
            <div
              key={p.lang}
              className="animate-drift flex items-center gap-2 rounded-xl border border-border bg-card/95 p-2 shadow-sm"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${p.tone}`}>
                {p.lang}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">{p.text}</span>
            </div>
          ))}
          <span className="flex items-center gap-1 pl-1 text-xs font-semibold text-primary">
            <MessageSquareWarning className="size-3.5" />
            Test prompts
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary via-brand-electric to-brand-cyan shadow-lg shadow-primary/25 sm:size-28">
            <div className="absolute inset-2 rounded-full border border-white/40" />
            <Cpu className="size-9 text-white" />
          </div>
          <span className="text-xs font-semibold text-primary">Target model</span>
        </div>

        <div className="flex flex-col gap-3">
          {RECORDS.map((r, i) => (
            <div
              key={r.id}
              className="animate-drift rounded-xl border border-border bg-card/95 p-2.5 shadow-sm"
              style={{ animationDelay: `${0.3 + i * 0.7}s` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                <span className={`size-2 rounded-full ${r.tone}`} />
              </div>
              <p className="mt-1 text-xs font-semibold">{r.label}</p>
            </div>
          ))}
          <span className="flex items-center gap-1 pl-1 text-xs font-semibold text-primary">
            <Database className="size-3.5" />
            Audit records
          </span>
        </div>
      </div>
    </div>
  )
}
