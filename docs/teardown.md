# Teardown

## Source Files
- `frontend/app/teardown/page.tsx` — Teardown page component, helper components, all case-study copy, process tables, bottlenecks, and code snippets.
- `frontend/components/app-shell.tsx` — Shared app shell visible around the page: top bar, live ticker, sidebar navigation, agents list, and bottom sidebar card.
- `frontend/components/command-menu.tsx` — Command palette trigger and navigation command labels.
- `frontend/components/theme-toggle.tsx` — Theme toggle labels, aria-labels, and localStorage key.
- `frontend/components/ui/command.tsx` — Command dialog default title, description, empty state wrapper, and command component slots.
- `frontend/components/ui/dialog.tsx` — Dialog primitive wrappers and close button screen-reader label.
- `backend/lib/data.ts` — Shared `TICKER` strings consumed by `AppShell`.
- `backend/lib/utils.ts` — `cn(...inputs)` class-name merge helper consumed by shared UI primitives.
- `frontend/app/layout.tsx` — Root metadata, viewport, fonts, theme bootstrap script, and production analytics wrapper.
- `frontend/styles/globals.css` — Global theme tokens and chart/color variables used by the rendered page.
- `frontend/.next/types/routes.d.ts` — Generated Next route map including `/teardown`.
- `frontend/.next/types/validator.ts` — Generated Next validator referencing `../../app/teardown/page.tsx`.
- `frontend/.next/dev/types/routes.d.ts` — Generated dev route map including `/teardown`.
- `frontend/.next/dev/types/validator.ts` — Generated dev validator referencing `../../../app/teardown/page.tsx`.

## Full Content

### Shared App Shell

#### Top Bar
- Logo alt text: `Frame OS Logo`
- Brand text: `Frame OS`
- Org/version text: `org.frame · operator: harsh@ · v0.7.3`
- Theme toggle:
  - aria-label when dark: `Switch to light mode`
  - aria-label when light: `Switch to dark mode`
  - visible label when dark: `light`
  - visible label when light: `dark`
- Command trigger visible label: `K`
- Channels pill: `12 channels live`

#### Live Ticker
- Section label: `live · ops feed`
- `00000000-0000-0000-0000-000000000271 hit 4.1M views · save-rate 9.4% · cluster: shock-stat-historical`
- `Render farm queue: 14 jobs · avg wait 6m 12s`
- `Arcads actor 'Maya-IN' booked for 11 reels in next 24h`
- `Veo 3 minute-credits used today: 142 / 600`
- `ElevenLabs concurrency: 7 / 12`
- `00000000-0000-0000-0000-000000000106 quiet.therapy entering ramp phase · 7-day reach +312%`
- `Trend bot ingested 4,812 reels · 38 promoted to Idea stage`
- `Scheduler queue across 12 channels: 27 reels lined up next 48h`

#### Sidebar Navigation
- Section label: `Operator`
- `01` · `Overview` · `/`
- `02` · `Teardown` · `/teardown`
- `03` · `Channels` · `/channels`
- `04` · `Pipeline` · `/pipeline`
- `05` · `Studio` · `/studio` · live badge: `ai`
- `06` · `Analytics` · `/analytics`
- `07` · `Architecture` · `/architecture`
- `08` · `Settings` · `/settings`
- `09` · `Sign In` · `/sign-in`

#### Agents
- Section label: `Agents`
- `Atlas` — `EN · finance + mindset`
- `Ravi` — `EN · history + interviews`
- `Kira` — `EN · soft + recipes`
- `Nexus` — `HI/EN · DTC + dev`

#### Sidebar Card
Autonomous media infrastructure.
Twelve channels. Zero overhead.

One operator · 12 channels · 26 reels/day.

#### Command Palette
- Default dialog title: `Command Palette`
- Default dialog description: `Search for a command to run...`
- Input placeholder: `Type a command or search...`
- Empty state: `No results found.`
- Group heading: `Navigation`
- Items: `Overview`, `Teardown`, `Channels`, `Pipeline`, `Studio`, `Analytics`, `Architecture`, `Settings`
- Dialog close screen-reader label: `Close`

### Page Header

#### Part 1 · Reverse-engineering

### Reverse-engineering the modern content factory.

If you look closely at how modern AI-native media companies operate, you realize something pretty fast: they aren't creators. They're workflow systems. The "content" is just an output artifact of a continuous job queue. I spent a few weeks pulling apart two common archetypes to see what's actually running under the hood. Not the marketing pitch—the actual routing logic, the queue structures, and the exact spots where humans are still forced to intervene.

#### Table of Contents
- `A` — `Faceless page architecture`
- `B` — `AI-UGC DTC brands`
- `C` — `How I'd actually build this`

### Case A: Faceless AI Pages

### Case A — Faceless AI pages (the finance/tech bro archetype)

These are everywhere. The standard Reels template right now is a faceless finance or tech page churning out 3 posts a day. The visual grammar is identical across accounts: heavy burned-in captions, generic AI b-roll, that same synthetic cadence. Every hook is some variation of "Stop doing X right now." It feels repetitive because it is. And because it's repetitive, it's trivial to automate.

#### Inferred workflow · pipeline

| Step | Title | Detail | Tools |
|---|---|---|---|
| Ingest | Mining for topics | It usually starts with a daily scrape. They'll pull a few hundred high-performing reels, maybe mix in some Reddit threads. The goal isn't to copy the video, but to extract the underlying hook structure and dump it into a database. | Data scraping layer; Relational DB |
| Select | Hook clustering | An LLM looks at the scrape and clusters the hooks into reusable primitives—things like 'the hidden cost' or 'the contrarian take'. Then it maps today's trending topics onto those primitives. You end up with a queue of idea cards. | LLM router; Vector index |
| Script | Writing with strict constraints | The writing step is totally rigid. Hook under 7 seconds, 3 beats of context, quick CTA. They force the LLM to spit out structured JSON so the next node in the pipeline can read it without failing. | LLM inference; JSON schema |
| Voice | TTS generation | A standard TTS call. They lock a specific voice ID to the channel profile so it always sounds like the same 'person'. The script gets converted to audio, and they extract the word-level timecodes to sync the captions later. | Voice synthesis |
| Assets | B-roll fetching | This is where most pages get lazy. They hit a stock footage API, or worse, lean entirely on generative video. The heavy use of AI b-roll is why these pages feel uncanny after a few seconds. | Stock retrieval; Video generation |
| Assemble | Putting it together | Everything gets stitched programmatically. Audio track, cuts, and those massive burned-in captions. The styling rules are hardcoded. I'd bet 90% of these render out without a human ever checking the timeline. | Programmatic editor |
| QA | The human exception loop | Humans are just exception handlers here. An automated judge might flag a render if the audio peaks or the text runs off-screen. If it passes, it goes straight to the outbox. The operator only looks at the rejects. | Automated QA; Heuristics |
| Post | Publishing and feedback | They hit the social APIs, publish, and wait. The smart setups have a cron job that pulls the 24-hour metrics, finds the winning hooks, and feeds them right back into the ingest layer for tomorrow. | Social APIs; Analytics cron |

#### Bottleneck

##### Audience saturation
The audience catches on. Hearing the same TTS voice read the same 'Stop doing X' template causes a massive drop in retention over time.

Fix: Introduce variance logic. Cycle through different voice profiles and enforce a cooldown period on overused hook templates.

##### Generative video fatigue
Uncanny valley kicks in hard. Leaning entirely on generative video tanks your save and share metrics, even if the hook gets them to watch the first 3 seconds.

Fix: Hard-cap generative video usage. Fall back to high-quality stock matched by semantic search for the bulk of the timeline.

#### The failure state
The failure state: A lot of these faceless pages collapse once the content factory outruns the feedback loop. They scale output volume infinitely, but they don't scale taste calibration. Eventually, the channel just pumps out pure noise, the audience drops off, and the algorithm chokes it entirely.

### Case B: AI-UGC Brands

### Case B — AI-UGC brands (the performance marketing archetype)

This is the performance marketing playbook right now. Instead of paying influencers for endless ad variations, DTC brands are using synthetic actors. It looks exactly like a real person holding a supplement bottle, but it's generated. The advantage is scale—you can take one brief and spin up two thousand programmatic variations to see what converts.

#### Inferred workflow · pipeline

| Step | Title | Detail | Tools |
|---|---|---|---|
| Brief | The initial spec | A performance marketer writes a raw brief. Target audience, the core pain point, and the offer. That's the only real manual input. | Issue tracker; Webhook |
| Angles | Multiplying the idea | The system expands that single brief into a massive matrix of angles. It mixes tones, awareness levels, and hook structures. One idea becomes fifty rows in a database. | LLM expansion |
| Script | Writing for avatars | These aren't normal scripts. They're written explicitly for synthetic actors, including metadata for stage directions like 'slight smile' or 'point down'. The pacing is brutal to optimize for thumb-stops. | Script generator |
| Actor | Synthesizing the video | The script hits an avatar API. Brands usually lock in a roster of specific synthetic actors that historically convert well for their demographic. It returns a clean video of a 'person' talking. | Synthetic video layer |
| Demo | Splicing in reality | You still need real product shots to sell physical goods. They usually bank a ton of human-shot b-roll once a quarter, and the system programmatically splices those clips over the synthetic actor to ground the ad in reality. | Asset assembly |

I probably wouldn't start with full multi-agent orchestration if I were building this internally. Operational simplicity matters way more than theoretical autonomy at this scale. Having five agents negotiating with each other in the background sounds cool, but it's a nightmare to debug when a live ad hallucinates an FDA-violating health claim.

The real bottleneck here isn't the video generation—it's compliance and asset starvation. The whole pipeline starves if you don't have fresh, real-world product clips to splice over the avatar. It creates a very physical constraint in an otherwise entirely digital system.

### Case C: How I'd Actually Build This

### Case C — How I'd actually build this

Zoom out, and both of those archetypes are the exact same machine. The queue is the actual product. Content just moves through processing nodes, and humans only exist to handle exceptions. That's the core thesis of Frame OS.

#### Flow
Ideation → Scripting → Asset Gen → QA / Human → Scheduled

* Every transition writes a log to the database. If any node fails, the state machine rolls back and increments `retry_count`.

#### The Queue State Schema

If I were building this from scratch today, I'd start entirely with the data model. No video rendering, no LLM calls until the state machine is perfectly defined. Here is roughly what the core Supabase table looks like to drive the entire factory:

```sql
public.content_queue

CREATE TABLE content_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text NOT NULL,

  -- The core state machine transitions
  status text NOT NULL CHECK (
    status IN ('ideation', 'scripting', 'asset_gen', 'qa', 'scheduled', 'failed')
  ),

  -- Core operational state
  retry_count int DEFAULT 0,
  error_log text,
  provider_used text,
  qa_flagged boolean DEFAULT false,
  scheduled_for timestamptz,

  -- Ties back to the winning structural pattern
  hook_primitive_id text REFERENCES hook_primitives(id),

  -- The structured beats parsed by the video compiler
  script_payload jsonb,

  -- Media artifact pointers
  render_url text,

  created_at timestamptz DEFAULT now()
);
```

Most of this architecture probably just becomes debugging provider inconsistencies and retry logic. Having an LLM write a script is trivial. Handling what happens when the video rendering API silently times out after 14 minutes, locks the queue row, and orphans the state machine is the actual engineering work. Webhook retries and failed state recovery are always more annoying than the generation itself.

#### The Queue Worker (Node.js)

This is the only thing that actually runs on a cron. A dumb loop that picks up the next stale job, locks the row so we don't double-render, and hands it to the right execution module.

```ts
workers/queue-processor.ts

async function processQueue() {
  // 1. Lock the next available job to prevent race conditions
  const job = await db.raw(`
    UPDATE content_queue
    SET status = 'processing', updated_at = now()
    WHERE id = (
      SELECT id FROM content_queue
      WHERE status = 'ideation' AND retry_count < 3
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    ) RETURNING *;
  `);

  if (!job) return; // Queue is empty

  try {
    const payload = await generateScript(job.channel_id);

    await db.update('content_queue', {
      status: 'scripting',
      script_payload: payload
    }).where('id', job.id);

  } catch (error) {
    // 2. The reality of API integrations: things break.
    await db.raw(`
      UPDATE content_queue 
      SET status = 'failed', 
          error_log = ?,
          retry_count = retry_count + 1
      WHERE id = ?
    `, [error.message, job.id]);
  }
}
```

#### Principles

##### 1. Channels are configuration, not headcount.
An Instagram account should just be a database row. You give it a niche, a voice profile, and posting rules. Scaling up your media presence means adding a row to a table, not hiring another social media manager.

##### 2. Treat it like a distributed system.
Every reel is just an object moving through transitions: Idea, Script, Asset, QA. Make the workers modular. If a cheaper video model drops tomorrow, you just swap the endpoint. The queue doesn't care.

##### 3. LLMs execute. Humans curate.
Stop using humans for raw execution. Let the models mine the trends and write the captions. The operator's only job is to define the taste—setting guardrails, tuning blocklists, and checking the anomaly queue when a render fails.

##### 4. Keep the stack boring.
Don't overcomplicate the plumbing. Postgres for state, a rock-solid background job runner, and standard object storage. Keep your internal logic simple and let the external providers do the heavy compute.

#### The Narrative Entropy Problem

The actual bottleneck in modern media isn't generation quality anymore. It's narrative entropy.

Once every channel optimizes the exact same hook structures from the exact same dataset, audiences stop emotionally distinguishing between creators. The system eats itself. The only moats left in this space are proprietary data ingestion (scraping things that aren't already optimized for social media) and highly calibrated human taste.

## Data Structures

### `H2` Props
```ts
{ children: React.ReactNode; num: string }
```

### `StepRow` Props
```ts
{
  step: string
  title: string
  detail: string
  tools: string[]
}
```

### `Bottleneck` Props
```ts
{ title: string; detail: string; fix: string }
```

### `content_queue` Shape
- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `channel_id text NOT NULL`
- `status text NOT NULL CHECK status IN ('ideation', 'scripting', 'asset_gen', 'qa', 'scheduled', 'failed')`
- `retry_count int DEFAULT 0`
- `error_log text`
- `provider_used text`
- `qa_flagged boolean DEFAULT false`
- `scheduled_for timestamptz`
- `hook_primitive_id text REFERENCES hook_primitives(id)`
- `script_payload jsonb`
- `render_url text`
- `created_at timestamptz DEFAULT now()`

### Generated Route Types
- `AppRoutes`: `/`, `/analytics`, `/architecture`, `/channels`, `/channels/[id]`, `/pipeline`, `/settings`, `/sign-in`, `/studio`, `/teardown`
- `AppRouteHandlerRoutes`: `/api/briefs`, `/api/channels`, `/api/events`, `/api/feedback/run`, `/api/metrics/sync`, `/api/post/run`, `/api/reels`, `/api/render/webhook`, `/api/studio`
- `ParamMap["/teardown"]`: `{}`

## Config & Constants

### Route
- AppShell active route: `/teardown`
- Section anchors: `#case-A`, `#case-B`, `#case-C`

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

### Viewport
- themeColor: `#F4F0E6`
- width: `device-width`
- initialScale: `1`

### Fonts
- `Geist` subsets: `["latin"]`, variable: `--font-geist-sans`
- `Geist_Mono` subsets: `["latin"]`, variable: `--font-geist-mono`
- `Instrument_Serif` subsets: `["latin"]`, weight: `400`, variable: `--font-instrument-serif`

### Theme Script
```js
(function(){try{var t=localStorage.getItem('frame-theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}})();
```

### Theme Storage
- localStorage key: `frame-theme`
- values written: `dark`, `light`

### Global CSS Tokens Used
- Light `--accent`: `oklch(0.72 0.19 45)`
- Light `--chart-1`: `oklch(0.646 0.222 41.116)`
- Light `--chart-2`: `oklch(0.6 0.118 184.704)`
- Light `--chart-3`: `oklch(0.398 0.07 227.392)`
- Light `--chart-4`: `oklch(0.828 0.189 84.429)`
- Light `--chart-5`: `oklch(0.769 0.188 70.08)`
- Dark `--accent`: `oklch(0.72 0.19 45)`
- Dark `--chart-1`: `oklch(0.488 0.243 264.376)`
- Dark `--chart-2`: `oklch(0.696 0.17 162.48)`
- Dark `--chart-3`: `oklch(0.769 0.188 70.08)`
- Dark `--chart-4`: `oklch(0.627 0.265 303.9)`
- Dark `--chart-5`: `oklch(0.645 0.246 16.439)`
- radius: `0.625rem`

## Notes
- The Teardown page is static React content. It does not fetch from an API or database.
- Runtime shell content is shared through `AppShell`; the live ticker uses the static `TICKER` array from `backend/lib/data.ts`.
- The theme label is dynamic based on `document.documentElement.classList.contains("dark")`.
- Vercel Analytics renders only when `process.env.NODE_ENV === "production"`.
- The generated `.next` route files confirm `/teardown` has an empty route param shape: `{}`.
