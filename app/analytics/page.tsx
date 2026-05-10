"use client"

import { AppShell } from "@/components/app-shell"
import { CHANNELS, REELS, getChannel } from "@/lib/data"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Bar,
  BarChart,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from "lucide-react"

// 30-day reach trend (mock, deterministic)
function generateTrend() {
  const days = 30
  const data: Record<string, number | string>[] = []
  for (let d = 0; d < days; d++) {
    const row: Record<string, number | string> = {
      day: `D${d + 1}`,
    }
    CHANNELS.slice(0, 6).forEach((c, i) => {
      // smooth growth curve with small noise, deterministic per channel
      const base = c.d7Reach / 7
      const seed = (d * 17 + i * 31) % 11
      const wave = Math.sin((d / days) * Math.PI * 1.6) * 0.18
      const noise = (seed - 5) * 0.012
      row[c.handle] = Math.round(base * (1 + wave + noise))
    })
    data.push(row)
  }
  return data
}

const TREND = generateTrend()

const SCATTER = CHANNELS.map((c) => ({
  hookRate: c.hookRate,
  saveRate: c.saveRate,
  followers: c.followers,
  handle: c.handle,
  niche: c.niche,
}))

// Stack cost performance — cost per 1M reach
const STACK_PERF = [
  { stack: "GPT-5 + ElevenLabs + Submagic", costPerM: 38, share: 41, status: "winner" },
  { stack: "Claude Opus + ElevenLabs + Captions", costPerM: 47, share: 14, status: "ok" },
  { stack: "GPT-5 + Veo 3 + ElevenLabs", costPerM: 112, share: 22, status: "premium" },
  { stack: "GPT-5 + Arcads UGC + Submagic", costPerM: 64, share: 10, status: "ok" },
  { stack: "Whisper + GPT-5 + Opus Clip", costPerM: 22, share: 13, status: "winner" },
]

// Feedback loop — what the analyzer agent learned in last 7d
const FEEDBACK = [
  {
    cluster: "shock-stat-historical",
    insight: "Hooks that lead with a wrong-by-default common belief outperform list hooks by 2.3×",
    confidence: 0.92,
    appliedTo: ["midnight.history", "iron.philosophy"],
    delta: "+38% hook rate",
  },
  {
    cluster: "first-person-experiment",
    insight: "‘I let AI do X for 30 days’ pattern saturating — switch to ‘I asked AI to ___ and this is what broke’",
    confidence: 0.78,
    appliedTo: ["ai.money.engine", "solo.builder.diary"],
    delta: "−14% saves before pivot",
  },
  {
    cluster: "save-trigger-utility",
    insight: "Recipes with on-screen ingredient list at 0:00–0:02 lift save-rate by 4.1pp",
    confidence: 0.87,
    appliedTo: ["neon.recipes"],
    delta: "+4.1pp save rate",
  },
  {
    cluster: "lipsync-defect",
    insight: "HeyGen avatars drift on words ending in plosives at >170wpm — cap pace at 158wpm in QA",
    confidence: 0.95,
    appliedTo: ["iron.philosophy", "fit.protocol"],
    delta: "QA reject −62%",
  },
]

const TOP_REELS = REELS.filter((r) => r.views && r.views > 0)
  .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  .slice(0, 6)

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K"
  return n.toString()
}

export default function AnalyticsPage() {
  const totalReach = CHANNELS.reduce((s, c) => s + c.d7Reach, 0)
  const avgHook = (CHANNELS.reduce((s, c) => s + c.hookRate, 0) / CHANNELS.length).toFixed(1)
  const avgSave = (CHANNELS.reduce((s, c) => s + c.saveRate, 0) / CHANNELS.length).toFixed(1)

  return (
    <AppShell active="/analytics">
      <div className="px-4 sm:px-8 py-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              06 · Analytics
            </p>
            <h1 className="font-serif text-4xl mt-2 leading-tight text-pretty">
              The feedback loop is the moat.
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl text-pretty">
              Every reel that posts becomes training data for the next one. We measure hook-rate,
              save-rate, and cost-per-million reach &mdash; then route winners to more channels and
              kill losing patterns within 48 hours.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            window · last 30 days
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mt-8">
          {[
            {
              label: "7-day reach (network)",
              value: fmt(totalReach),
              delta: "+18.4%",
              up: true,
              sub: "vs prev 7d",
            },
            {
              label: "Avg hook rate",
              value: `${avgHook}%`,
              delta: "+2.1pp",
              up: true,
              sub: "viewers past 3s",
            },
            {
              label: "Avg save rate",
              value: `${avgSave}%`,
              delta: "−0.4pp",
              up: false,
              sub: "saves / views",
            },
            {
              label: "Cost / 1M reach",
              value: "$54",
              delta: "−$11",
              up: true,
              sub: "blended across stacks",
            },
          ].map((k) => (
            <div key={k.label} className="bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {k.label}
              </p>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="font-serif text-3xl">{k.value}</span>
                <span
                  className={`flex items-center gap-0.5 font-mono text-[11px] ${
                    k.up ? "text-foreground" : "text-destructive"
                  }`}
                >
                  {k.up ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {k.delta}
                </span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Reach trend */}
        <section className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Daily reach · top 6 channels
              </p>
              <h2 className="font-serif text-2xl mt-1">Compounding curve</h2>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground hidden sm:block">
              y · viewers / day &nbsp;·&nbsp; x · last 30 days
            </p>
          </div>
          <div className="h-72 border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  {CHANNELS.slice(0, 6).map((c, i) => (
                    <linearGradient key={c.handle} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={
                          i === 0
                            ? "var(--accent)"
                            : `var(--chart-${((i % 5) + 1) as 1 | 2 | 3 | 4 | 5})`
                        }
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          i === 0
                            ? "var(--accent)"
                            : `var(--chart-${((i % 5) + 1) as 1 | 2 | 3 | 4 | 5})`
                        }
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => fmt(v as number)}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                  formatter={(v: number) => fmt(v)}
                />
                {CHANNELS.slice(0, 6).map((c, i) => (
                  <Area
                    key={c.handle}
                    type="monotone"
                    dataKey={c.handle}
                    stackId="1"
                    stroke={
                      i === 0
                        ? "var(--accent)"
                        : `var(--chart-${((i % 5) + 1) as 1 | 2 | 3 | 4 | 5})`
                    }
                    strokeWidth={i === 0 ? 1.5 : 1}
                    fill={`url(#g${i})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 font-mono text-[10px] text-muted-foreground">
            {CHANNELS.slice(0, 6).map((c, i) => (
              <span key={c.handle} className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-sm"
                  style={{
                    background:
                      i === 0
                        ? "var(--accent)"
                        : `var(--chart-${((i % 5) + 1) as 1 | 2 | 3 | 4 | 5})`,
                  }}
                />
                @{c.handle}
              </span>
            ))}
          </div>
        </section>

        {/* Two-up: scatter + stack cost */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Scatter */}
          <div className="lg:col-span-3 border border-border bg-card p-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Hook-rate vs save-rate
                </p>
                <h2 className="font-serif text-xl mt-1">The good quadrant is top-right</h2>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">
                bubble · followers
              </p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                  <XAxis
                    type="number"
                    dataKey="hookRate"
                    name="Hook rate"
                    unit="%"
                    domain={[40, 90]}
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="saveRate"
                    name="Save rate"
                    unit="%"
                    domain={[0, 16]}
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <ZAxis type="number" dataKey="followers" range={[60, 600]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                    formatter={(v: number, name: string) => {
                      if (name === "followers") return fmt(v)
                      return `${v}%`
                    }}
                    labelFormatter={() => ""}
                  />
                  <Scatter
                    data={SCATTER}
                    fill="var(--foreground)"
                    fillOpacity={0.7}
                    stroke="var(--accent)"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stack performance */}
          <div className="lg:col-span-2 border border-border bg-card p-4 flex flex-col">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Cost per 1M reach · by stack
            </p>
            <h2 className="font-serif text-xl mt-1 mb-3">Where the money actually wins</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={STACK_PERF} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="stack"
                    width={140}
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                    formatter={(v: number) => [`$${v}`, "cost / 1M"]}
                  />
                  <Bar dataKey="costPerM" radius={[0, 2, 2, 0]}>
                    {STACK_PERF.map((s, i) => (
                      <rect
                        key={i}
                        fill={s.status === "winner" ? "var(--accent)" : "var(--foreground)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-2">
              orange · winning stacks &nbsp;·&nbsp; ink · acceptable
            </p>
          </div>
        </section>

        {/* Top reels + Feedback loop */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 border border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Top reels · last 7d
              </p>
              <TrendingUp className="size-3.5 text-muted-foreground" />
            </div>
            <ul className="divide-y divide-border">
              {TOP_REELS.map((r, i) => {
                const ch = getChannel(r.channelId)
                return (
                  <li key={r.id} className="px-4 py-3 flex items-start gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground mt-0.5 w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug line-clamp-2 text-pretty">
                        {r.hook}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">
                        @{ch?.handle} · save {r.saveRate}%
                      </p>
                    </div>
                    <span className="font-serif text-sm whitespace-nowrap">
                      {fmt(r.views ?? 0)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Feedback loop */}
          <div className="lg:col-span-3 border border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Feedback loop · agent insights last 7d
              </p>
              <span className="font-mono text-[10px] text-muted-foreground">
                4 patterns &nbsp;·&nbsp; 17 channels affected
              </span>
            </div>
            <ul className="divide-y divide-border">
              {FEEDBACK.map((f) => (
                <li key={f.cluster} className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      cluster
                    </span>
                    <span className="font-mono text-[11px] text-foreground">{f.cluster}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      conf {(f.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-pretty">{f.insight}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground">
                    <span>applied · {f.appliedTo.join(", ")}</span>
                    <span className="text-accent">{f.delta}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t border-border flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="size-3.5" />
              <p className="font-mono text-[10px]">
                Insights below 60% confidence are queued for human review before propagation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
