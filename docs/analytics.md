# Analytics

## Source Files
- `frontend/app/analytics/page.tsx` — Analytics page component, deterministic chart data generation, KPI strip, charts, top reels, and feedback loop content.
- `backend/lib/data.ts` — `CHANNELS`, `REELS`, `getChannel`, and `TICKER` data consumed by the Analytics page and shared shell.
- `frontend/components/app-shell.tsx` — Shared app shell visible around the page.
- `frontend/components/command-menu.tsx` — Command palette labels and navigation routes.
- `frontend/components/theme-toggle.tsx` — Theme toggle labels, aria-labels, and localStorage key.
- `frontend/components/ui/command.tsx` — Command dialog primitives, default labels, and empty state text.
- `frontend/components/ui/dialog.tsx` — Dialog primitive wrappers and close button screen-reader text.
- `backend/lib/utils.ts` — `cn(...inputs)` class-name merge helper consumed by shared UI primitives.
- `frontend/app/layout.tsx` — Root metadata, viewport, fonts, theme bootstrap script, and production analytics wrapper.
- `frontend/styles/globals.css` — Global color and chart tokens used by the charts.
- `frontend/.next/types/routes.d.ts` — Generated Next route map including `/analytics`.
- `frontend/.next/types/validator.ts` — Generated Next validator referencing `../../app/analytics/page.tsx`.
- `frontend/.next/dev/types/routes.d.ts` — Generated dev route map including `/analytics`.
- `frontend/.next/dev/types/validator.ts` — Generated dev validator referencing `../../../app/analytics/page.tsx`.

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

#### 06 · Analytics

### The feedback loop is the moat.

Every reel that posts becomes training data for the next one. We measure hook-rate, save-rate, and cost-per-million reach — then route winners to more channels and kill losing patterns within 48 hours.

`window · last 30 days`

### KPI Strip

| Label | Value | Delta | Subtext | Direction |
|---|---:|---|---|---|
| 7-day reach (network) | 42.2M | +18.4% | vs prev 7d | up |
| Avg hook rate | 67.4% | +2.1pp | viewers past 3s | up |
| Avg save rate | 7.9% | −0.4pp | saves / views | down |
| Cost / 1M reach | $54 | −$11 | blended across stacks | up |

### Daily Reach · Top 6 Channels

#### Compounding curve
`y · viewers / day · x · last 30 days`

Legend:
- `@ai.money.engine`
- `@solo.builder.diary`
- `@ceo.deepcuts`
- `@neon.recipes`
- `@midnight.history`
- `@quiet.therapy`

#### Generated TREND Data
| day | ai.money.engine | solo.builder.diary | ceo.deepcuts | neon.recipes | midnight.history | quiet.therapy |
|---|---:|---:|---:|---:|---:|---:|
| D1 | 323629 | 167680 | 712411 | 877143 | 1146103 | 133280 |
| D2 | 358752 | 162883 | 691553 | 850845 | 1265902 | 147563 |
| D3 | 348140 | 179071 | 761944 | 939592 | 1229707 | 143247 |
| D4 | 382404 | 173875 | 739346 | 911102 | 1346572 | 157180 |
| D5 | 370385 | 168289 | 806894 | 996265 | 1305579 | 152293 |
| D6 | 402734 | 183323 | 780429 | 962898 | 1260908 | 165447 |
| D7 | 388347 | 176637 | 843191 | 1042027 | 1366844 | 159597 |
| D8 | 417941 | 190390 | 811158 | 1001640 | 1312776 | 171631 |
| D9 | 400488 | 182279 | 775891 | 1072960 | 1408255 | 164534 |
| D10 | 426792 | 194503 | 829044 | 1024191 | 1342966 | 156750 |
| D11 | 405918 | 184802 | 786863 | 1086792 | 1426774 | 166742 |
| D12 | 383317 | 195419 | 833027 | 1029212 | 1349688 | 157552 |
| D13 | 404491 | 184139 | 783979 | 967374 | 1421906 | 166162 |
| D14 | 378648 | 193249 | 823591 | 1017316 | 1333762 | 155653 |
| D15 | 396825 | 180577 | 768490 | 947845 | 1395762 | 163045 |
| D16 | 368317 | 167328 | 802716 | 990997 | 1298527 | 151452 |
| D17 | 384235 | 174725 | 743047 | 915767 | 1197812 | 157925 |
| D18 | 353935 | 160644 | 773652 | 954354 | 1249470 | 145604 |
| D19 | 368579 | 167450 | 711410 | 875880 | 1144412 | 151558 |
| D20 | 337559 | 153034 | 648727 | 912634 | 1193617 | 138945 |
| D21 | 352058 | 159772 | 678026 | 833791 | 1088065 | 126361 |
| D22 | 321473 | 145558 | 616220 | 871650 | 1138749 | 132403 |
| D23 | 291526 | 152761 | 647540 | 795354 | 1036607 | 120226 |
| D24 | 307924 | 139261 | 588842 | 721349 | 1092537 | 126894 |
| D25 | 280010 | 147409 | 624270 | 766016 | 997330 | 115543 |
| D26 | 298880 | 135058 | 570566 | 698307 | 1061690 | 123216 |
| D27 | 273807 | 123406 | 611734 | 750211 | 976171 | 113020 |
| D28 | 295806 | 133630 | 564355 | 690477 | 896201 | 121966 |
| D29 | 274065 | 123526 | 612256 | 750869 | 977052 | 113126 |
| D30 | 299505 | 135349 | 571829 | 699899 | 908816 | 123470 |

### Hook-Rate vs Save-Rate

#### The good quadrant is top-right
`bubble · followers`

| handle | niche | hookRate | saveRate | followers |
|---|---|---:|---:|---:|
| ai.money.engine | Personal finance × AI tools | 71 | 6.2 | 184220 |
| solo.builder.diary | Indie hacker journals | 64 | 8.1 | 92410 |
| ceo.deepcuts | Founder interview clips | 78 | 4.4 | 311900 |
| neon.recipes | 60-second recipes | 69 | 12.1 | 421700 |
| midnight.history | Dark history facts | 81 | 5.8 | 612300 |
| quiet.therapy | Soft journaling prompts | 58 | 14.2 | 88140 |
| iron.philosophy | Stoic / mindset | 74 | 9.4 | 503900 |
| paisa.product | DTC product reviews (Hindi) | 55 | 3.2 | 71500 |
| dev.dispatch | Daily dev news | 62 | 7 | 142800 |
| fit.protocol | Fitness science 90s | 67 | 8.8 | 256600 |
| vault.creators | Creator economy data | 60 | 11.3 | 49300 |
| luxe.cars.daily | Supercar facts + B-roll | 70 | 4.1 | 388400 |

### Cost Per 1M Reach · By Stack

#### Where the money actually wins

| stack | costPerM | share | status |
|---|---:|---:|---|
| GPT-5 + ElevenLabs + Submagic | 38 | 41 | winner |
| Claude Opus + ElevenLabs + Captions | 47 | 14 | ok |
| GPT-5 + Veo 3 + ElevenLabs | 112 | 22 | premium |
| GPT-5 + Arcads UGC + Submagic | 64 | 10 | ok |
| Whisper + GPT-5 + Opus Clip | 22 | 13 | winner |

`orange · winning stacks · ink · acceptable`

### Top Reels · Last 7d

| Rank | Hook | Channel | Save Rate | Views |
|---|---|---|---:|---:|
| 01 | Cleopatra was closer in time to the iPhone than to the Pyramids | @midnight.history | 9.4% | 4.1M |
| 02 | Read this when you feel behind | @iron.philosophy | 11.1% | 2.3M |
| 03 | The Bugatti you can legally drive in India for ₹0 in tax | @luxe.cars.daily | 3.8% | 1.2M |
| 04 | Jensen Huang: 'we should have hired the third-best person' | @ceo.deepcuts | 5.1% | 412K |
| 05 | I let AI decide my groceries for 30 days | @ai.money.engine | 7.2% | 312K |

### Feedback Loop · Agent Insights Last 7d

`4 patterns · 17 channels affected`

| cluster | insight | confidence | applied | delta |
|---|---|---:|---|---|
| shock-stat-historical | Hooks that lead with a wrong-by-default common belief outperform list hooks by 2.3× | 92% | midnight.history, iron.philosophy | +38% hook rate |
| first-person-experiment | ‘I let AI do X for 30 days’ pattern saturating — switch to ‘I asked AI to ___ and this is what broke’ | 78% | ai.money.engine, solo.builder.diary | −14% saves before pivot |
| save-trigger-utility | Recipes with on-screen ingredient list at 0:00–0:02 lift save-rate by 4.1pp | 87% | neon.recipes | +4.1pp save rate |
| lipsync-defect | HeyGen avatars drift on words ending in plosives at >170wpm — cap pace at 158wpm in QA | 95% | iron.philosophy, fit.protocol | QA reject −62% |

Insights below 60% confidence are queued for human review before propagation.

## Data Structures

### `Channel`
```ts
export type Channel = {
  id: string
  handle: string
  niche: string
  language: "EN" | "HI" | "EN/HI"
  voice: string
  format: string
  cadence: string
  followers: number
  d7Reach: number
  engineStack: string[]
  ownerAgent: "Atlas" | "Ravi" | "Kira" | "Nexus"
  status: "live" | "ramping" | "paused"
  hookRate: number
  saveRate: number
}
```

### `PipelineStage`
```ts
export type PipelineStage =
  | "idea"
  | "research"
  | "scripted"
  | "voiceover"
  | "assets"
  | "rendered"
  | "queued"
  | "analyzed"
```

### `Reel`
```ts
export type Reel = {
  id: string
  channelId: string
  hook: string
  stage: PipelineStage
  niche: string
  blocked?: string
  views?: number
  saveRate?: number
  scheduledFor?: string
  thumb?: string
  scoreInbound?: number
}
```

### `SCATTER` Shape
```ts
{
  hookRate: c.hookRate,
  saveRate: c.saveRate,
  followers: c.followers,
  handle: c.handle,
  niche: c.niche,
}
```

### `STACK_PERF` Shape
```ts
{ stack: string; costPerM: number; share: number; status: "winner" | "ok" | "premium" }
```

### `FEEDBACK` Shape
```ts
{
  cluster: string
  insight: string
  confidence: number
  appliedTo: string[]
  delta: string
}
```

### Generated Route Types
- `ParamMap["/analytics"]`: `{}`
- `AppRoutes` includes `/analytics`

## Config & Constants

### Route
- AppShell active route: `/analytics`

### `generateTrend()`
- `days = 30`
- row day label: ``D${d + 1}``
- channels used: `CHANNELS.slice(0, 6)`
- `base = c.d7Reach / 7`
- `seed = (d * 17 + i * 31) % 11`
- `wave = Math.sin((d / days) * Math.PI * 1.6) * 0.18`
- `noise = (seed - 5) * 0.012`
- `row[c.handle] = Math.round(base * (1 + wave + noise))`

### `fmt(n)`
- If `n >= 1_000_000`: `(n / 1_000_000).toFixed(1) + "M"`
- If `n >= 1_000`: `(n / 1_000).toFixed(0) + "K"`
- Else: `n.toString()`

### Channel Source Data
| id | handle | niche | language | voice | format | cadence | followers | d7Reach | engineStack | ownerAgent | status | hookRate | saveRate |
|---|---|---|---|---|---|---|---:|---:|---|---|---|---:|---:|
| 00000000-0000-0000-0000-000000000101 | ai.money.engine | Personal finance × AI tools | EN | Direct · Male 28 · NYC | Talking-head AI avatar + B-roll | 2/day | 184220 | 2410000 | GPT-5 (script); Arcads (avatar); ElevenLabs (vo); Submagic (caption) | Atlas | live | 71 | 6.2 |
| 00000000-0000-0000-0000-000000000102 | solo.builder.diary | Indie hacker journals | EN | Reflective · Female 31 · LDN | Screen-rec + voiceover | 2/day | 92410 | 1120000 | Claude Opus 4.6 (script); ElevenLabs (vo); Captions.ai (edit) | Atlas | live | 64 | 8.1 |
| 00000000-0000-0000-0000-000000000103 | ceo.deepcuts | Founder interview clips | EN | Source-accurate (clip) | Podcast clipper + b-roll | 3/day | 311900 | 4870000 | Whisper-v3 (asr); GPT-5 (clip-pick); Opus Clip (cut); Submagic | Ravi | live | 78 | 4.4 |
| 00000000-0000-0000-0000-000000000104 | neon.recipes | 60-second recipes | EN | Warm · Female 26 · LA | Stock food b-roll + AI vo | 2/day | 421700 | 6140000 | GPT-5 (script); ElevenLabs (vo); Pexels API; Creatomate (render) | Kira | live | 69 | 12.1 |
| 00000000-0000-0000-0000-000000000105 | midnight.history | Dark history facts | EN | Cinematic · Male 42 · UK | AI archival + Veo cinematic | 2/day | 612300 | 8220000 | GPT-5 (research); Veo 3 (cinematic); ElevenLabs (vo); Runway (motion) | Ravi | live | 81 | 5.8 |
| 00000000-0000-0000-0000-000000000106 | quiet.therapy | Soft journaling prompts | EN | Whisper · Female 24 · TOR | Slow b-roll + ambient vo | 2/day | 88140 | 980000 | Claude Opus (script); ElevenLabs (vo); Pexels; Captions.ai | Kira | ramping | 58 | 14.2 |
| 00000000-0000-0000-0000-000000000107 | iron.philosophy | Stoic / mindset | EN | Authoritative · Male 50 · UK | AI avatar + statue b-roll | 2/day | 503900 | 7010000 | GPT-5 (script); HeyGen (avatar); ElevenLabs (vo); Submagic | Atlas | live | 74 | 9.4 |
| 00000000-0000-0000-0000-000000000108 | paisa.product | DTC product reviews (Hindi) | HI | Conversational · Male 27 · MUM | AI UGC actor unboxing | 2/day | 71500 | 640000 | GPT-5 (Hindi script); Arcads (UGC actor); ElevenLabs Multilingual; Submagic | Nexus | ramping | 55 | 3.2 |
| 00000000-0000-0000-0000-000000000109 | dev.dispatch | Daily dev news | EN | Crisp · Male 29 · SF | Code screencast + vo | 3/day | 142800 | 1840000 | GPT-5 (news cluster); ElevenLabs (vo); Carbon (code); Captions.ai | Nexus | live | 62 | 7 |
| 00000000-0000-0000-0000-000000000110 | fit.protocol | Fitness science 90s | EN | Coach · Male 34 · AUS | AI avatar + workout b-roll | 2/day | 256600 | 3310000 | Claude Opus (research); HeyGen (avatar); ElevenLabs (vo); Submagic | Atlas | live | 67 | 8.8 |
| 00000000-0000-0000-0000-000000000111 | vault.creators | Creator economy data | EN | Analyst · Female 30 · SF | Data viz reels | 1/day | 49300 | 410000 | GPT-5 + Recharts; ElevenLabs (vo); Creatomate | Kira | ramping | 60 | 11.3 |
| 00000000-0000-0000-0000-000000000112 | luxe.cars.daily | Supercar facts + B-roll | EN | Cool narrator · Male 33 | Veo cinematic + caption | 2/day | 388400 | 5220000 | GPT-5 (fact); Veo 3 (B-roll); ElevenLabs (vo); Submagic | Ravi | live | 70 | 4.1 |

### Reel Source Data
| id | channelId | hook | stage | niche | blocked | views | saveRate | scheduledFor | scoreInbound |
|---|---|---|---|---|---|---:|---:|---|---:|
| 00000000-0000-0000-0000-000000000201 | 00000000-0000-0000-0000-000000000101 | The 3-account system that lets AI move money for you while you sleep | idea | finance |  |  |  |  | 84 |
| 00000000-0000-0000-0000-000000000202 | 00000000-0000-0000-0000-000000000105 | Why every clock in the British Empire was set wrong on purpose | idea | history |  |  |  |  | 91 |
| 00000000-0000-0000-0000-000000000203 | 00000000-0000-0000-0000-000000000109 | The one-line Postgres setting that 10× our checkout | idea | dev |  |  |  |  | 78 |
| 00000000-0000-0000-0000-000000000204 | 00000000-0000-0000-0000-000000000112 | This 1992 supercar still beats a Tesla Plaid in a straight line | idea | cars |  |  |  |  | 80 |
| 00000000-0000-0000-0000-000000000211 | 00000000-0000-0000-0000-000000000103 | Sam Altman on what he was wrong about in 2024 | research | interviews |  |  |  |  | 88 |
| 00000000-0000-0000-0000-000000000212 | 00000000-0000-0000-0000-000000000107 | Marcus Aurelius wrote one paragraph that destroys 'productivity' | research | stoic |  |  |  |  | 76 |
| 00000000-0000-0000-0000-000000000221 | 00000000-0000-0000-0000-000000000104 | 30-second pasta that fooled an Italian chef | scripted | recipes |  |  |  |  | 73 |
| 00000000-0000-0000-0000-000000000222 | 00000000-0000-0000-0000-000000000110 | The 4-rep set that builds more muscle than 12 | scripted | fitness |  |  |  |  | 81 |
| 00000000-0000-0000-0000-000000000223 | 00000000-0000-0000-0000-000000000102 | Day 19 of building in public — first $1k MRR | scripted | indie |  |  |  |  | 69 |
| 00000000-0000-0000-0000-000000000231 | 00000000-0000-0000-0000-000000000101 | I asked GPT-5 to manage my emergency fund. Here's what happened. | assets | finance |  |  |  |  | 86 |
| 00000000-0000-0000-0000-000000000232 | 00000000-0000-0000-0000-000000000107 | Stop trying to be productive. Try this 1779 trick instead. | assets | stoic |  |  |  |  | 82 |
| 00000000-0000-0000-0000-000000000233 | 00000000-0000-0000-0000-000000000108 | ₹399 ka product, ₹3000 ka kaam karta hai | assets | dtc-hi |  |  |  |  | 64 |
| 00000000-0000-0000-0000-000000000241 | 00000000-0000-0000-0000-000000000105 | The Library of Alexandria didn't burn — it was sold | rendered | history | lip-sync drift @ 00:11 |  |  |  | 89 |
| 00000000-0000-0000-0000-000000000242 | 00000000-0000-0000-0000-000000000104 | 3-ingredient breakfast that hits 40g protein | rendered | recipes |  |  |  |  | 75 |
| 00000000-0000-0000-0000-000000000251 | 00000000-0000-0000-0000-000000000109 | The git command 90% of senior devs use wrong | queued | dev |  |  |  | Today · 7:42 PM IST | 79 |
| 00000000-0000-0000-0000-000000000252 | 00000000-0000-0000-0000-000000000111 | MrBeast's 2026 RPM is lower than your nano-channel's | queued | creator |  |  |  | Today · 9:10 PM IST | 72 |
| 00000000-0000-0000-0000-000000000253 | 00000000-0000-0000-0000-000000000106 | If you can't sleep, write the sentence you're avoiding | queued | therapy |  |  |  | Tomorrow · 6:30 AM IST | 68 |
| 00000000-0000-0000-0000-000000000261 | 00000000-0000-0000-0000-000000000103 | Jensen Huang: 'we should have hired the third-best person' | analyzed | interviews |  | 412000 | 5.1 |  |  |
| 00000000-0000-0000-0000-000000000262 | 00000000-0000-0000-0000-000000000112 | The Bugatti you can legally drive in India for ₹0 in tax | analyzed | cars |  | 1240000 | 3.8 |  |  |
| 00000000-0000-0000-0000-000000000263 | 00000000-0000-0000-0000-000000000101 | I let AI decide my groceries for 30 days | analyzed | finance |  | 312000 | 7.2 |  |  |
| 00000000-0000-0000-0000-000000000271 | 00000000-0000-0000-0000-000000000105 | Cleopatra was closer in time to the iPhone than to the Pyramids | analyzed | history |  | 4120000 | 9.4 |  |  |
| 00000000-0000-0000-0000-000000000272 | 00000000-0000-0000-0000-000000000107 | Read this when you feel behind | analyzed | stoic |  | 2310000 | 11.1 |  |  |

### Chart Configs
- AreaChart data: `TREND`
- AreaChart margin: `{ top: 10, right: 10, left: -10, bottom: 0 }`
- AreaChart stackId: `1`
- AreaChart stroke width: `1.5` for first channel, `1` for others
- Gradient ids: `g0` through `g5`
- Gradient offsets: `5%` opacity `0.35`, `95%` opacity `0`
- CartesianGrid stroke: `var(--border)`, strokeDasharray: `2 4`, vertical: `false`
- ScatterChart margin: `{ top: 10, right: 20, left: -10, bottom: 10 }`
- Scatter X axis: `hookRate`, name `Hook rate`, unit `%`, domain `[40, 90]`
- Scatter Y axis: `saveRate`, name `Save rate`, unit `%`, domain `[0, 16]`
- Scatter Z axis: `followers`, range `[60, 600]`
- Scatter fill: `var(--foreground)`, fillOpacity `0.7`, stroke `var(--accent)`
- BarChart data: `STACK_PERF`, layout `vertical`, margin `{ left: 0, right: 16 }`
- Bar X axis tick formatter: ``$${v}``
- Bar Y axis dataKey: `stack`, width `140`
- Bar radius: `[0, 2, 2, 0]`
- Bar fill: `var(--accent)` when `status === "winner"`, otherwise `var(--foreground)`

### Root Metadata
- title: `Frame OS — Operator Command Center`
- description: `Autonomous AI media infrastructure. Twelve channels. Continuous throughput. Zero overhead.`
- generator: `v0.app`
- viewport themeColor: `#F4F0E6`

## Notes
- The Analytics page is a client component (`"use client"`).
- It does not fetch from an API or database at runtime; it imports static `CHANNELS`, `REELS`, and `getChannel` from `@backend/data`.
- `TOP_REELS` is computed from `REELS.filter((r) => r.views && r.views > 0).sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 6)`. Only five reels have `views`, so five list rows render.
- `totalReach`, `avgHook`, and `avgSave` are computed from all 12 `CHANNELS`.
- The shared app shell uses static `TICKER` data from `backend/lib/data.ts`.
- Vercel Analytics renders only in production through `frontend/app/layout.tsx`.
