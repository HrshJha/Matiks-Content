import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { CHANNELS, REELS, STAGES } from "@backend/data"
import { ArrowUpRight, ArrowRight, Cpu, Mic, Wand2, Camera, Calendar, BarChart3 } from "lucide-react"

function Stat({
  label,
  value,
  delta,
  hint,
}: { label: string; value: string; delta?: string; hint?: string }) {
  return (
    <div className="px-5 py-4 border-r border-border last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl leading-none">{value}</p>
      {(delta || hint) && (
        <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
          {delta && <span className="text-foreground font-mono">{delta}</span>}
          {hint}
        </p>
      )}
    </div>
  )
}

export default function HomePage() {
  const livePosts = REELS.filter((r) => r.stage === "posted").length
  const inFlight = REELS.filter(
    (r) => !["posted", "analyzed"].includes(r.stage),
  ).length
  const top = [...REELS]
    .filter((r) => r.views)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3)

  return (
    <AppShell active="/">
      {/* Hero */}
      <section className="border-b border-border px-6 sm:px-10 py-12 sm:py-16 hairline">
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Operator Command Center · 10/05/2026
          </p>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl leading-[1.05] tracking-tight text-balance">
            One operator. <span className="text-accent">Twelve channels.</span>{" "}
            Twenty-six reels a day. Zero burnout.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Matiks Content OS is the workflow we&apos;d run if we were hiring{" "}
            <em>ourselves</em> for this role. It treats AI short-form like a
            distributed system: ideation, research, scripting, generation,
            QA, posting, and feedback are services — not chores. Operators
            review exceptions; the pipeline runs itself.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90"
            >
              Open Studio (live AI) <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/teardown"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-card/60"
            >
              Read the teardown (Part 1)
            </Link>
            <Link
              href="/architecture"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-card/60"
            >
              System diagram
            </Link>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-b border-border bg-card/40">
        <div className="grid grid-cols-2 md:grid-cols-5">
          <Stat label="Channels live" value="12" delta="+2 ramping" hint="across 8 niches" />
          <Stat label="Reels / 24h" value="26" delta="2.16/ch" hint="2× target met" />
          <Stat label="In-flight" value={String(inFlight)} delta="0 blocked >2h" hint="across 8 stages" />
          <Stat label="Posts (7d)" value={String(livePosts * 7)} delta="+18% w/w" hint="auto-posted" />
          <Stat label="Operator hrs / day" value="1.8" delta="-92% vs manual" hint="approvals + audits" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Today's queue */}
        <section className="lg:col-span-2 border-b lg:border-r border-border p-6 sm:p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Today
              </p>
              <h2 className="font-serif text-2xl mt-1">What the system is shipping</h2>
            </div>
            <Link
              href="/pipeline"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Open pipeline <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STAGES.slice(0, 8).map((s) => {
              const count = REELS.filter((r) => r.stage === s.id).length
              return (
                <div
                  key={s.id}
                  className="rounded-md border border-border bg-card px-3 py-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="font-serif text-3xl mt-1.5 leading-none">{count}</p>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                    {s.sla} · {s.owner}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Stack health
            </p>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Writer · GPT-5 / Opus 4.6", icon: Cpu, val: "OK", sub: "p50 4.1s" },
                { label: "Voice · ElevenLabs", icon: Mic, val: "OK", sub: "7/12 conc." },
                { label: "Avatar · Arcads + HeyGen", icon: Wand2, val: "OK", sub: "queue 14" },
                { label: "Cinematic · Veo 3", icon: Camera, val: "Ramp", sub: "142/600 min" },
                { label: "Captions · Submagic", icon: Calendar, val: "OK", sub: "auto" },
                { label: "Posting · Graph API ×12", icon: BarChart3, val: "OK", sub: "0 errors" },
                { label: "Trend bot · Apify+Hex", icon: ArrowRight, val: "OK", sub: "4,812 reels in" },
                { label: "Feedback bot · cron", icon: ArrowRight, val: "OK", sub: "next +12m" },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="rounded-md border border-border bg-card px-3 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="size-3.5 text-muted-foreground" />
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest ${
                          s.val === "OK" ? "text-foreground" : "text-accent"
                        }`}
                      >
                        ● {s.val}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-tight">{s.label}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{s.sub}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Right rail */}
        <aside className="p-6 sm:p-8 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Top performers · 7d
          </p>
          <h3 className="font-serif text-xl mt-1">Feedback loop says</h3>
          <ul className="mt-5 space-y-5">
            {top.map((r) => {
              const ch = CHANNELS.find((c) => c.id === r.channelId)!
              return (
                <li key={r.id} className="border-l-2 border-foreground pl-3">
                  <p className="text-sm leading-snug text-pretty">{r.hook}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    @{ch.handle} ·{" "}
                    {r.views!.toLocaleString()} views · save {r.saveRate}%
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Loop instruction · auto-issued
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              <span className="font-mono text-accent">+4.1M view</span> on{" "}
              <em>history shock-stat</em> cluster. Trend bot has cloned the
              hook structure into <span className="font-mono">7 idea
              variants</span> across <em>midnight.history</em>,{" "}
              <em>luxe.cars.daily</em>, <em>iron.philosophy</em>.
            </p>
            <Link
              href="/analytics"
              className="mt-3 inline-flex items-center gap-1 text-xs underline underline-offset-4 hover:text-accent"
            >
              See the feedback loop <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </aside>
      </div>

      {/* Channels strip */}
      <section className="border-b border-border p-6 sm:p-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Portfolio
            </p>
            <h2 className="font-serif text-2xl mt-1">12 channels, 4 owner-agents</h2>
          </div>
          <Link
            href="/channels"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            All channels <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {CHANNELS.slice(0, 8).map((c) => (
            <div
              key={c.id}
              className="rounded-md border border-border bg-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs">@{c.handle}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.niche}</p>
                </div>
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    c.status === "live"
                      ? "bg-foreground text-background"
                      : c.status === "ramping"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-auto">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    foll
                  </p>
                  <p className="font-serif text-base">
                    {(c.followers / 1000).toFixed(0)}k
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    hook %
                  </p>
                  <p className="font-serif text-base">{c.hookRate}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    save %
                  </p>
                  <p className="font-serif text-base">{c.saveRate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-10 text-xs text-muted-foreground font-mono">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p>matiks · content-os · prototype</p>
            <p className="mt-1">
              built with next.js 16 · ai sdk 6 · vercel ai gateway · openai gpt-5-mini
            </p>
          </div>
          <p className="max-w-md text-right">
            this is the prototype submitted for the Matiks operator hiring
            assignment. ↗ part 1 lives at <span className="text-foreground">/teardown</span>.
            part 2 lives in <span className="text-foreground">/studio</span> — and runs.
          </p>
        </div>
      </footer>
    </AppShell>
  )
}
