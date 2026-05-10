import { AppShell } from "@/components/app-shell"
import {
  Database,
  Workflow,
  Cpu,
  Cloud,
  Globe,
  Eye,
  Wrench,
  ShieldAlert,
  TrendingUp,
} from "lucide-react"

const STACK_LAYERS = [
  {
    id: "01",
    name: "Trend ingestion",
    icon: Eye,
    purpose:
      "Pull last-24h Reels & TikToks across our niches; cluster by hook pattern; surface 30–80 candidates / day.",
    tools: [
      "Apify (TikTok / IG scrapers)",
      "Whisper-v3 (transcribe)",
      "GPT-5 (cluster + score)",
      "Postgres (raw_clips, clusters)",
    ],
    cost: "$420 / mo",
  },
  {
    id: "02",
    name: "Idea + Research",
    icon: Workflow,
    purpose:
      "An LLM agent picks 6–10 winning patterns per channel per day, runs research (search + vector recall), and writes a one-line hook.",
    tools: [
      "OpenAI gpt-5 (writer)",
      "Perplexity API (research)",
      "Vector store (pgvector — past hooks per channel)",
      "Linear-style ‘Idea’ table",
    ],
    cost: "$280 / mo",
  },
  {
    id: "03",
    name: "Script generation",
    icon: Cpu,
    purpose:
      "Hook + body + CTA, voice-tuned per channel (mono persona, vocab list, banned phrases). Output is a structured JSON the renderer consumes.",
    tools: [
      "Anthropic claude-opus-4.6 (long-form)",
      "OpenAI gpt-5 (hook variants)",
      "Zod schema validation",
      "Per-channel system prompt registry",
    ],
    cost: "$190 / mo",
  },
  {
    id: "04",
    name: "Asset generation",
    icon: Cloud,
    purpose:
      "Avatar / UGC actor / cinematic b-roll + voice + captions. Most expensive layer — also the highest-signal differentiator.",
    tools: [
      "ElevenLabs (voice, multilingual)",
      "Arcads (UGC actors)",
      "HeyGen (talking heads)",
      "Veo 3 / Runway (cinematic b-roll)",
      "Submagic / Captions.ai (captioning)",
      "Creatomate (programmatic render)",
    ],
    cost: "$2,140 / mo",
  },
  {
    id: "05",
    name: "QA + safety",
    icon: ShieldAlert,
    purpose:
      "Automated lip-sync drift detection, profanity / claim flagging, brand-style check. Falls back to human (operator) for borderline cases.",
    tools: [
      "Custom CV model (lip-sync delta)",
      "GPT-5-mini (claim / risk classifier)",
      "Operator UI (this dashboard)",
    ],
    cost: "$70 / mo",
  },
  {
    id: "06",
    name: "Distribution",
    icon: Globe,
    purpose:
      "Schedule + post across 12 IG accounts via Graph API + a residential mobile farm fallback for accounts that can’t use API.",
    tools: [
      "Meta Graph API (Reels)",
      "Buffer / Later (cross-post YouTube Shorts, TikTok)",
      "Mobile farm (BrowserStack-style) for fallback",
      "Postgres scheduler + BullMQ",
    ],
    cost: "$310 / mo",
  },
  {
    id: "07",
    name: "Feedback loop",
    icon: TrendingUp,
    purpose:
      "Pull post-level metrics back, cluster what won/lost, update per-channel system prompt + ‘banned hook’ list automatically every 24h.",
    tools: [
      "Graph API insights",
      "GPT-5 (analyzer agent)",
      "Postgres + materialized views",
      "Slack digest to operator at 8am IST",
    ],
    cost: "$45 / mo",
  },
]

const TOTAL_STACK_COST = STACK_LAYERS.reduce((s, l) => {
  const n = parseInt(l.cost.replace(/[^0-9]/g, ""))
  return s + n
}, 0)

const DATA_MODEL = [
  {
    table: "channels",
    columns: [
      "id (pk)",
      "handle",
      "niche",
      "language",
      "voice_persona_json",
      "system_prompt",
      "ig_account_id",
      "status",
    ],
    note: "One row per faceless brand. ‘voice_persona_json’ is what makes a channel feel human.",
  },
  {
    table: "agents",
    columns: ["id (pk)", "name", "model", "instructions", "owner_channels[]"],
    note: "Atlas / Ravi / Kira / Nexus — each owns 2–4 channels, has its own writing style.",
  },
  {
    table: "reels",
    columns: [
      "id (pk)",
      "channel_id (fk)",
      "stage (enum)",
      "hook",
      "script_json",
      "render_url",
      "ig_post_id",
      "scheduled_for",
      "blocked_reason",
    ],
    note: "Single row, mutated through stages — same record from idea → analyzed.",
  },
  {
    table: "metrics",
    columns: [
      "reel_id (fk)",
      "captured_at",
      "views",
      "reach",
      "saves",
      "shares",
      "hook_rate_3s",
      "watch_through",
    ],
    note: "Time-series, partitioned by week. Powers the analytics page.",
  },
  {
    table: "patterns",
    columns: [
      "id (pk)",
      "cluster_label",
      "hook_template",
      "lift_observed",
      "confidence",
      "applied_to[]",
    ],
    note: "What the analyzer agent has learned. Becomes input for tomorrow’s ideas.",
  },
  {
    table: "render_jobs",
    columns: [
      "id (pk)",
      "reel_id (fk)",
      "vendor (enum: heygen, arcads, veo3…)",
      "cost_cents",
      "duration_s",
      "status",
    ],
    note: "Every external API call is logged with its $ cost — that’s how unit economics get computed.",
  },
]

const RISKS = [
  {
    risk: "IG account ban / shadowban",
    likelihood: "med",
    severity: "high",
    mitigation:
      "12 channels × residential IPs × no cross-posting same audio. Maintain a 14-day cold spare per agent.",
  },
  {
    risk: "Vendor outage (ElevenLabs / Arcads down)",
    likelihood: "med",
    severity: "med",
    mitigation:
      "Multi-vendor abstraction in render layer — every voice / avatar request can fail-over to a 2nd provider within 90s.",
  },
  {
    risk: "AI-generated content gets de-prioritized by algo",
    likelihood: "high",
    severity: "high",
    mitigation:
      "Editorial layer: 1 human-recorded VO insert per reel (3–5 sec). Hook-rate stays >60% even when reach softens.",
  },
  {
    risk: "Hallucinated facts in finance / health niches",
    likelihood: "med",
    severity: "high",
    mitigation:
      "Claim classifier blocks publication on those niches without 2 cited sources stored in script_json.",
  },
  {
    risk: "Cost runaway from Veo 3 minute-credits",
    likelihood: "low",
    severity: "med",
    mitigation:
      "Daily $ budget per channel, hard cap in render queue. Veo only used on top-3 cinematic channels.",
  },
]

const ROADMAP = [
  {
    phase: "Days 1–14",
    title: "One channel proven end-to-end",
    work: [
      "Spin up midnight.history as the seed channel",
      "Fully manual operator-in-the-loop pipeline",
      "Goal: 2 reels / day, ≥60% hook rate, ≥3% save rate by D14",
    ],
  },
  {
    phase: "Days 15–35",
    title: "Pipeline ↔ database, 3 channels",
    work: [
      "Postgres schema + ‘reels’ stage machine",
      "Studio (script generator) goes live as the operator UI",
      "Add ai.money.engine and ceo.deepcuts — 6 reels / day total",
    ],
  },
  {
    phase: "Days 36–60",
    title: "Render farm + scheduler, 7 channels",
    work: [
      "Multi-vendor render abstraction (HeyGen, Arcads, Veo, ElevenLabs)",
      "BullMQ scheduler + IG Graph API auto-posting",
      "First feedback-loop agent shipping insights into prompts",
    ],
  },
  {
    phase: "Days 61–90",
    title: "12 channels, one operator, profitable",
    work: [
      "Onboarding playbook: new channel from zero in <4 hours",
      "Cost-per-million-reach dashboard (this page)",
      "Target: $54 blended CPM-reach, ~$11k / mo gross at 12 channels",
    ],
  },
]

export default function ArchitecturePage() {
  return (
    <AppShell active="/architecture">
      <div className="px-4 sm:px-8 py-8 max-w-[1400px]">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            07 · Architecture
          </p>
          <h1 className="font-serif text-4xl mt-2 leading-tight text-pretty">
            One operator. Twelve channels. A pipeline that runs while we sleep.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl text-pretty">
            This is the system I would actually build at Matiks. Each layer is a separate Postgres
            table and a separate queue — failures are isolated, costs are tracked per call, and
            every reel is a single row that mutates through eight stages.
          </p>
        </div>

        {/* Flow diagram */}
        <section className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            System flow
          </p>
          <div className="border border-border bg-card hairline p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[820px] flex items-stretch gap-3 font-mono text-[11px]">
              {STACK_LAYERS.map((layer, i) => {
                const Icon = layer.icon
                return (
                  <div key={layer.id} className="flex items-stretch gap-3 flex-1">
                    <div className="flex-1 flex flex-col">
                      <div className="border border-border bg-background rounded-sm p-3 flex-1 flex flex-col min-h-[140px]">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{layer.id}</span>
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>
                        <p className="font-serif text-sm mt-2 leading-tight text-foreground">
                          {layer.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed line-clamp-4">
                          {layer.purpose.split(".")[0]}.
                        </p>
                        <p className="mt-auto pt-2 text-foreground">{layer.cost}</p>
                      </div>
                    </div>
                    {i < STACK_LAYERS.length - 1 && (
                      <div className="flex items-center text-muted-foreground/60">
                        <span className="text-base">→</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[10px] text-muted-foreground">
              <span>
                <span className="text-foreground">Stack run-rate</span> &nbsp; ${TOTAL_STACK_COST.toLocaleString()} / mo
              </span>
              <span>
                <span className="text-foreground">Per reel (blended)</span> &nbsp; ~$4.30
              </span>
              <span>
                <span className="text-foreground">Per 1M reach (blended)</span> &nbsp; $54
              </span>
              <span>
                <span className="text-foreground">Channels supported</span> &nbsp; 12 (linear scale to 50)
              </span>
            </div>
          </div>
        </section>

        {/* Layer detail table */}
        <section className="mt-10">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Stack · what runs where
              </p>
              <h2 className="font-serif text-2xl mt-1">Each layer is independently swappable</h2>
            </div>
          </div>
          <div className="border border-border bg-card divide-y divide-border">
            {STACK_LAYERS.map((layer) => {
              const Icon = layer.icon
              return (
                <div
                  key={layer.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 sm:px-6 py-5"
                >
                  <div className="md:col-span-3 flex items-start gap-3">
                    <div className="size-8 rounded-sm border border-border bg-background grid place-items-center mt-0.5">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        layer {layer.id}
                      </p>
                      <p className="font-serif text-lg leading-tight">{layer.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">
                        {layer.cost}
                      </p>
                    </div>
                  </div>
                  <p className="md:col-span-5 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {layer.purpose}
                  </p>
                  <div className="md:col-span-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      Tools
                    </p>
                    <ul className="space-y-1 font-mono text-[11px]">
                      {layer.tools.map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span className="size-1 rounded-full bg-foreground/60 mt-2 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Data model */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border border-border">
          {DATA_MODEL.map((t) => (
            <div key={t.table} className="bg-card p-5">
              <div className="flex items-center gap-2">
                <Database className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-[11px] text-foreground">{t.table}</span>
              </div>
              <ul className="mt-3 space-y-1 font-mono text-[10px] text-muted-foreground">
                {t.columns.map((c) => (
                  <li key={c} className="flex">
                    <span className="text-muted-foreground/60 mr-2">·</span>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground border-t border-border pt-3">
                {t.note}
              </p>
            </div>
          ))}
        </section>

        {/* Risk + roadmap */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Wrench className="size-3.5 text-muted-foreground" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Risk register
              </p>
            </div>
            <ul className="divide-y divide-border">
              {RISKS.map((r) => (
                <li key={r.risk} className="px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-serif text-base leading-tight">{r.risk}</p>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded-sm border border-border text-muted-foreground">
                        L · {r.likelihood}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border ${
                          r.severity === "high"
                            ? "border-accent text-accent"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        S · {r.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed text-pretty">
                    {r.mitigation}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <TrendingUp className="size-3.5 text-muted-foreground" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                90-day roadmap
              </p>
            </div>
            <ol className="divide-y divide-border">
              {ROADMAP.map((p, i) => (
                <li key={p.phase} className="px-4 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground w-16 shrink-0">
                      {p.phase}
                    </span>
                    <p className="font-serif text-lg leading-tight flex-1">{p.title}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      phase {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="mt-2 ml-[4.5rem] space-y-1 text-sm text-muted-foreground list-disc list-outside">
                    {p.work.map((w) => (
                      <li key={w} className="leading-relaxed text-pretty">
                        {w}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing note */}
        <section className="mt-12 border-t border-border pt-8 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Why this architecture wins
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                t: "Every step is a row, not a script.",
                d: "A single ‘reels’ table mutated through 8 stages means every failure is recoverable, every cost is attributable, and every metric ties back to its source.",
              },
              {
                t: "Multi-vendor by default.",
                d: "Render layer is an interface, not a tool. ElevenLabs goes down → PlayHT picks up. Veo 3 quota hits → Runway. The operator never knows.",
              },
              {
                t: "The loop is the moat.",
                d: "Most ‘AI content’ teams ship reels. We ship learnings into prompts every 24h — that compounds. By month 3, no fresh competitor can catch up to channel-level voice.",
              },
            ].map((c) => (
              <div key={c.t} className="border-l border-border pl-4">
                <p className="font-serif text-lg leading-tight text-pretty">{c.t}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
