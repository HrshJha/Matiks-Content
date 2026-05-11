# Architecture

## Source Files
- `frontend/app/architecture/page.tsx` — Architecture page component and all stack, data model, risk, roadmap, and closing-note content.
- `frontend/components/output-examples.tsx` — Reusable generated output examples gallery with playable local MP4 sample render assets.
- `frontend/components/app-shell.tsx` — Shared app shell visible around the page.
- `frontend/components/command-menu.tsx` — Command palette labels and navigation routes.
- `frontend/components/theme-toggle.tsx` — Theme toggle labels, aria-labels, and localStorage key.
- `frontend/components/ui/command.tsx` — Command dialog primitives, default labels, and empty state text.
- `frontend/components/ui/dialog.tsx` — Dialog primitive wrappers and close button screen-reader text.
- `backend/lib/data.ts` — `TICKER` data consumed by `AppShell`.
- `frontend/public/examples/*.mp4` and `frontend/public/examples/*.jpg` — Local sample render videos and posters used by the output examples gallery.
- `backend/lib/utils.ts` — `cn(...inputs)` class-name merge helper consumed by shared UI primitives.
- `frontend/app/layout.tsx` — Root metadata, viewport, fonts, theme bootstrap script, and production analytics wrapper.
- `frontend/styles/globals.css` — Global color and chart tokens used by shell and page styling.
- `frontend/.next/types/routes.d.ts` — Generated Next route map including `/architecture`.
- `frontend/.next/types/validator.ts` — Generated Next validator referencing `../../app/architecture/page.tsx`.
- `frontend/.next/dev/types/routes.d.ts` — Generated dev route map including `/architecture`.
- `frontend/.next/dev/types/validator.ts` — Generated dev validator referencing `../../../app/architecture/page.tsx`.

## Full Content

### Shared App Shell

#### Top Bar
- Logo alt text: `Frame OS Logo`
- Brand text: `Frame OS`
- Org/version text: `org.frame · operator: harsh@ · v0.7.3`
- Theme toggle aria-labels: `Switch to light mode`, `Switch to dark mode`
- Theme toggle visible labels: `light`, `dark`
- Command trigger visible label: `K`
- Channels pill: `12 channels live`

#### Live Ticker
- `live · ops feed`
- `00000000-0000-0000-0000-000000000271 hit 4.1M views · save-rate 9.4% · cluster: shock-stat-historical`
- `Render farm queue: 14 jobs · avg wait 6m 12s`
- `Arcads actor 'Maya-IN' booked for 11 reels in next 24h`
- `Veo 3 minute-credits used today: 142 / 600`
- `ElevenLabs concurrency: 7 / 12`
- `00000000-0000-0000-0000-000000000106 quiet.therapy entering ramp phase · 7-day reach +312%`
- `Trend bot ingested 4,812 reels · 38 promoted to Idea stage`
- `Scheduler queue across 12 channels: 27 reels lined up next 48h`

#### Sidebar Navigation
- `Operator`
- `01` · `Overview`
- `02` · `Teardown`
- `03` · `Channels`
- `04` · `Pipeline`
- `05` · `Studio` · `ai`
- `06` · `Analytics`
- `07` · `Architecture`
- `08` · `Settings`
- `09` · `Sign In`

#### Agents
- `Agents`
- `Atlas` — `EN · finance + mindset`
- `Ravi` — `EN · history + interviews`
- `Kira` — `EN · soft + recipes`
- `Nexus` — `HI/EN · DTC + dev`

#### Sidebar Card
Autonomous media infrastructure.
Twelve channels. Zero overhead.

One operator · 12 channels · 26 reels/day.

#### Command Palette
- `Command Palette`
- `Search for a command to run...`
- `Type a command or search...`
- `No results found.`
- `Navigation`
- `Overview`
- `Teardown`
- `Channels`
- `Pipeline`
- `Studio`
- `Analytics`
- `Architecture`
- `Settings`
- `Close`

### Page Header

#### 07 · Architecture

### One operator. Twelve channels. A pipeline that runs while we sleep.

This is the system I would actually build at Matiks. Each layer is a separate Postgres table and a separate queue — failures are isolated, costs are tracked per call, and every reel is a single row that mutates through eight stages.

### System Flow

#### Layer Cards
| id | name | purpose preview displayed in flow | cost |
|---|---|---|---|
| 01 | Trend ingestion | Pull last-24h Reels & TikToks across our niches; cluster by hook pattern; surface 30–80 candidates / day. | $420 / mo |
| 02 | Idea + Research | An LLM agent picks 6–10 winning patterns per channel per day, runs research (search + vector recall), and writes a one-line hook. | $280 / mo |
| 03 | Script generation | Hook + body + CTA, voice-tuned per channel (mono persona, vocab list, banned phrases). | $190 / mo |
| 04 | Asset generation | Avatar / UGC actor / cinematic b-roll + voice + captions. | $2,140 / mo |
| 05 | QA + safety | Automated lip-sync drift detection, profanity / claim flagging, brand-style check. | $70 / mo |
| 06 | Distribution | Schedule + post across 12 IG accounts via Graph API + a residential mobile farm fallback for accounts that can’t use API. | $310 / mo |
| 07 | Feedback loop | Pull post-level metrics back, cluster what won/lost, update per-channel system prompt + ‘banned hook’ list automatically every 24h. | $45 / mo |

#### Summary Metrics
- `Stack run-rate` — `$3,455 / mo`
- `Per reel (blended)` — `~$4.30`
- `Per 1M reach (blended)` — `$54`
- `Channels supported` — `12 (linear scale to 50)`

### Stack · What Runs Where

### Each layer is independently swappable

#### layer 01 — Trend ingestion
- Cost: `$420 / mo`
- Purpose: Pull last-24h Reels & TikToks across our niches; cluster by hook pattern; surface 30–80 candidates / day.
- Tools:
  - `Apify (TikTok / IG scrapers)`
  - `Whisper-v3 (transcribe)`
  - `GPT-5 (cluster + score)`
  - `Postgres (raw_clips, clusters)`

#### layer 02 — Idea + Research
- Cost: `$280 / mo`
- Purpose: An LLM agent picks 6–10 winning patterns per channel per day, runs research (search + vector recall), and writes a one-line hook.
- Tools:
  - `OpenAI gpt-5 (writer)`
  - `Perplexity API (research)`
  - `Vector store (pgvector — past hooks per channel)`
  - `Linear-style ‘Idea’ table`

#### layer 03 — Script generation
- Cost: `$190 / mo`
- Purpose: Hook + body + CTA, voice-tuned per channel (mono persona, vocab list, banned phrases). Output is a structured JSON the renderer consumes.
- Tools:
  - `Anthropic claude-opus-4.6 (long-form)`
  - `OpenAI gpt-5 (hook variants)`
  - `Zod schema validation`
  - `Per-channel system prompt registry`

#### layer 04 — Asset generation
- Cost: `$2,140 / mo`
- Purpose: Avatar / UGC actor / cinematic b-roll + voice + captions. Most expensive layer — also the highest-signal differentiator.
- Tools:
  - `ElevenLabs (voice, multilingual)`
  - `Arcads (UGC actors)`
  - `HeyGen (talking heads)`
  - `Veo 3 / Runway (cinematic b-roll)`
  - `Submagic / Captions.ai (captioning)`
  - `Creatomate (programmatic render)`

#### layer 05 — QA + safety
- Cost: `$70 / mo`
- Purpose: Automated lip-sync drift detection, profanity / claim flagging, brand-style check. Falls back to human (operator) for borderline cases.
- Tools:
  - `Custom CV model (lip-sync delta)`
  - `GPT-5-mini (claim / risk classifier)`
  - `Operator UI (this dashboard)`

#### layer 06 — Distribution
- Cost: `$310 / mo`
- Purpose: Schedule + post across 12 IG accounts via Graph API + a residential mobile farm fallback for accounts that can’t use API.
- Tools:
  - `Meta Graph API (Reels)`
  - `Buffer / Later (cross-post YouTube Shorts, TikTok)`
  - `Mobile farm (BrowserStack-style) for fallback`
  - `Postgres scheduler + BullMQ`

#### layer 07 — Feedback loop
- Cost: `$45 / mo`
- Purpose: Pull post-level metrics back, cluster what won/lost, update per-channel system prompt + ‘banned hook’ list automatically every 24h.
- Tools:
  - `Graph API insights`
  - `GPT-5 (analyzer agent)`
  - `Postgres + materialized views`
  - `Slack digest to operator at 8am IST`

### Generated Output Examples

The Architecture page now includes a playable output gallery wired to `OUTPUT_EXAMPLES` in `backend/lib/data.ts`.

Displayed examples:

| Channel | Hook | Status | Asset |
|---|---|---|---|
| `@midnight.history` | `The Library of Alexandria didn't burn — it was sold` | `QA hold` | `/examples/midnight-history-sample.mp4` |
| `@neon.recipes` | `3-ingredient breakfast that hits 40g protein` | `rendered` | `/examples/neon-recipes-sample.mp4` |
| `@ai.money.engine` | `I asked GPT-5 to manage my emergency fund. Here's what happened.` | `sample render` | `/examples/ai-money-sample.mp4` |

These are local MP4 sample render assets that exercise the same `render_url` / `output_url` surface filled by the render webhook once real Creatomate, Arcads, HeyGen, or Veo jobs complete.

### Data Model Cards

#### channels
- `id (pk)`
- `handle`
- `niche`
- `language`
- `voice_persona_json`
- `system_prompt`
- `ig_account_id`
- `status`

One row per faceless brand. ‘voice_persona_json’ is what makes a channel feel human.

#### agents
- `id (pk)`
- `name`
- `model`
- `instructions`
- `owner_channels[]`

Atlas / Ravi / Kira / Nexus — each owns 2–4 channels, has its own writing style.

#### reels
- `id (pk)`
- `channel_id (fk)`
- `stage (enum)`
- `hook`
- `script_json`
- `render_url`
- `ig_post_id`
- `scheduled_for`
- `blocked_reason`

Single row, mutated through stages — same record from idea → analyzed.

#### metrics
- `reel_id (fk)`
- `captured_at`
- `views`
- `reach`
- `saves`
- `shares`
- `hook_rate_3s`
- `watch_through`

Time-series, partitioned by week. Powers the analytics page.

#### patterns
- `id (pk)`
- `cluster_label`
- `hook_template`
- `lift_observed`
- `confidence`
- `applied_to[]`

What the analyzer agent has learned. Becomes input for tomorrow’s ideas.

#### render_jobs
- `id (pk)`
- `reel_id (fk)`
- `vendor (enum: heygen, arcads, veo3…)`
- `cost_cents`
- `duration_s`
- `status`

Every external API call is logged with its $ cost — that’s how unit economics get computed.

### Risk Register

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| IG account ban / shadowban | med | high | 12 channels × residential IPs × no cross-posting same audio. Maintain a 14-day cold spare per agent. |
| Vendor outage (ElevenLabs / Arcads down) | med | med | Multi-vendor abstraction in render layer — every voice / avatar request can fail-over to a 2nd provider within 90s. |
| AI-generated content gets de-prioritized by algo | high | high | Editorial layer: 1 human-recorded VO insert per reel (3–5 sec). Hook-rate stays >60% even when reach softens. |
| Hallucinated facts in finance / health niches | med | high | Claim classifier blocks publication on those niches without 2 cited sources stored in script_json. |
| Cost runaway from Veo 3 minute-credits | low | med | Daily $ budget per channel, hard cap in render queue. Veo only used on top-3 cinematic channels. |

### 90-Day Roadmap

#### Days 1–14 — One channel proven end-to-end — phase 01
- Spin up midnight.history as the seed channel
- Fully manual operator-in-the-loop pipeline
- Goal: 2 reels / day, ≥60% hook rate, ≥3% save rate by D14

#### Days 15–35 — Pipeline ↔ database, 3 channels — phase 02
- Postgres schema + ‘reels’ stage machine
- Studio (script generator) goes live as the operator UI
- Add ai.money.engine and ceo.deepcuts — 6 reels / day total

#### Days 36–60 — Render farm + scheduler, 7 channels — phase 03
- Multi-vendor render abstraction (HeyGen, Arcads, Veo, ElevenLabs)
- BullMQ scheduler + IG Graph API auto-posting
- First feedback-loop agent shipping insights into prompts

#### Days 61–90 — 12 channels, one operator, profitable — phase 04
- Onboarding playbook: new channel from zero in <4 hours
- Cost-per-million-reach dashboard (this page)
- Target: $54 blended CPM-reach, ~$11k / mo gross at 12 channels

### Why This Architecture Wins

#### Every step is a row, not a script.
A single ‘reels’ table mutated through 8 stages means every failure is recoverable, every cost is attributable, and every metric ties back to its source.

#### Multi-vendor by default.
Render layer is an interface, not a tool. ElevenLabs goes down → PlayHT picks up. Veo 3 quota hits → Runway. The operator never knows.

#### The loop is the moat.
Most ‘AI content’ teams ship reels. We ship learnings into prompts every 24h — that compounds. By month 3, no fresh competitor can catch up to channel-level voice.

## Data Structures

### `STACK_LAYERS`
```ts
{
  id: string
  name: string
  icon: LucideIcon
  purpose: string
  tools: string[]
  cost: string
}
```

### `DATA_MODEL`
```ts
{
  table: string
  columns: string[]
  note: string
}
```

### `RISKS`
```ts
{
  risk: string
  likelihood: "low" | "med" | "high"
  severity: "med" | "high"
  mitigation: string
}
```

### `ROADMAP`
```ts
{
  phase: string
  title: string
  work: string[]
}
```

### Generated Route Types
- `ParamMap["/architecture"]`: `{}`
- `AppRoutes` includes `/architecture`

## Config & Constants

### Route
- AppShell active route: `/architecture`

### `STACK_LAYERS`
| id | name | cost | tools |
|---|---|---|---|
| 01 | Trend ingestion | $420 / mo | Apify (TikTok / IG scrapers); Whisper-v3 (transcribe); GPT-5 (cluster + score); Postgres (raw_clips, clusters) |
| 02 | Idea + Research | $280 / mo | OpenAI gpt-5 (writer); Perplexity API (research); Vector store (pgvector — past hooks per channel); Linear-style ‘Idea’ table |
| 03 | Script generation | $190 / mo | Anthropic claude-opus-4.6 (long-form); OpenAI gpt-5 (hook variants); Zod schema validation; Per-channel system prompt registry |
| 04 | Asset generation | $2,140 / mo | ElevenLabs (voice, multilingual); Arcads (UGC actors); HeyGen (talking heads); Veo 3 / Runway (cinematic b-roll); Submagic / Captions.ai (captioning); Creatomate (programmatic render) |
| 05 | QA + safety | $70 / mo | Custom CV model (lip-sync delta); GPT-5-mini (claim / risk classifier); Operator UI (this dashboard) |
| 06 | Distribution | $310 / mo | Meta Graph API (Reels); Buffer / Later (cross-post YouTube Shorts, TikTok); Mobile farm (BrowserStack-style) for fallback; Postgres scheduler + BullMQ |
| 07 | Feedback loop | $45 / mo | Graph API insights; GPT-5 (analyzer agent); Postgres + materialized views; Slack digest to operator at 8am IST |

### `TOTAL_STACK_COST`
```ts
const TOTAL_STACK_COST = STACK_LAYERS.reduce((s, l) => {
  const n = parseInt(l.cost.replace(/[^0-9]/g, ""))
  return s + n
}, 0)
```
Computed value: `3455`

### Closing Notes Array
```ts
[
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
]
```

### Shared Navigation Constant
```ts
[
  { href: "/", label: "Overview", mono: "01" },
  { href: "/teardown", label: "Teardown", mono: "02" },
  { href: "/channels", label: "Channels", mono: "03" },
  { href: "/pipeline", label: "Pipeline", mono: "04" },
  { href: "/studio", label: "Studio", mono: "05", live: true },
  { href: "/analytics", label: "Analytics", mono: "06" },
  { href: "/architecture", label: "Architecture", mono: "07" },
  { href: "/settings", label: "Settings", mono: "08" },
  { href: "/sign-in", label: "Sign In", mono: "09" }
]
```

### Root Metadata
- title: `Frame OS — Operator Command Center`
- description: `Autonomous AI media infrastructure. Twelve channels. Continuous throughput. Zero overhead.`
- generator: `v0.app`
- viewport themeColor: `#F4F0E6`

### Theme Storage
- localStorage key: `frame-theme`
- values written: `dark`, `light`

### Global CSS Tokens Used
- Light `--accent`: `oklch(0.72 0.19 45)`
- Dark `--accent`: `oklch(0.72 0.19 45)`
- `--radius`: `0.625rem`
- `--sidebar`: light `oklch(0.97 0 0)`, dark `oklch(0.205 0 0)`
- `--sidebar-border`: light `oklch(0.88 0 0)`, dark `oklch(0.269 0 0)`

## Notes
- The Architecture page is static React content. It does not fetch from an API or database.
- `TOTAL_STACK_COST` is computed at module load from the numeric parts of the layer cost strings.
- The flow card purpose preview uses `layer.purpose.split(".")[0] + "."`, so rows with more than one sentence display only the first sentence in the flow diagram while the full purpose appears in the detail table.
- The shared app shell uses static `TICKER` data from `backend/lib/data.ts`.
- Vercel Analytics renders only in production through `frontend/app/layout.tsx`.
