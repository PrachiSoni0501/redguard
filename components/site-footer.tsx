import { FlaskConical } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>RedTeam Audit · Multilingual AI safety research</p>
        <p className="flex items-center gap-1.5">
          <FlaskConical className="size-4 text-brand-orange" aria-hidden="true" />
          Design preview — simulated models, session-only records
        </p>
      </div>
    </footer>
  )
}
