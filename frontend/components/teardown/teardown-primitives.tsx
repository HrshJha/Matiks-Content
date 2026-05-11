import { AlertTriangle } from "lucide-react"
import type { ConfidenceLevel, EvidenceTier } from "@/lib/schemas/teardown"

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="font-serif text-2xl leading-tight">{title}</h2>
      {description && <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

export function EvidenceBadge({ tier }: { tier: EvidenceTier }) {
  const cls =
    tier === "CONFIRMED"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      : tier === "INFERRED"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
        : "border-border bg-muted/30 text-muted-foreground"

  return (
    <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${cls}`}>
      {tier}
    </span>
  )
}

export function ConfidenceBadge({ confidence }: { confidence?: ConfidenceLevel }) {
  if (!confidence) return null

  const cls =
    confidence === "HIGH"
      ? "border-emerald-500/30 text-emerald-300"
      : confidence === "MEDIUM"
        ? "border-amber-500/30 text-amber-300"
        : "border-red-500/30 text-red-300"

  return (
    <span className={`rounded border bg-background px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${cls}`}>
      {confidence}
    </span>
  )
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "accent" | "green" | "amber"
}) {
  const cls =
    tone === "accent"
      ? "border-accent/50 text-accent"
      : tone === "green"
        ? "border-emerald-500/40 text-emerald-300"
        : tone === "amber"
          ? "border-amber-500/40 text-amber-300"
          : "border-border text-muted-foreground"

  return <span className={`rounded border bg-background px-2 py-1 font-mono text-[10px] uppercase ${cls}`}>{children}</span>
}

export function ClaimCard({
  text,
  evidenceTier,
  confidence,
}: {
  text: string
  evidenceTier: EvidenceTier
  confidence?: ConfidenceLevel
}) {
  return (
    <div className="rounded-md border border-border bg-card/60 p-3">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <EvidenceBadge tier={evidenceTier} />
        {evidenceTier !== "CONFIRMED" && <ConfidenceBadge confidence={confidence} />}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  )
}

export function StreamPanel({ title, text }: { title: string; text?: string }) {
  if (!text) return null

  return (
    <div className="mb-6 rounded-md border border-accent/30 bg-accent/5 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{title}</p>
      <pre className="mt-3 max-h-[360px] whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90">
        {text}
      </pre>
    </div>
  )
}

export function WarningLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-amber-300">
      <AlertTriangle className="size-3.5" />
      {children}
    </div>
  )
}
