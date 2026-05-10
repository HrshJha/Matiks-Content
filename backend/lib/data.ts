// Matiks Content OS — mock operational data.
// Structured the way a real ops backend (Postgres + a queue) would model it.

export type Channel = {
  id: string
  handle: string
  niche: string
  language: "EN" | "HI" | "EN/HI"
  voice: string
  format: string
  cadence: string // posts/day
  followers: number
  d7Reach: number
  engineStack: string[]
  ownerAgent: "Atlas" | "Ravi" | "Kira" | "Nexus"
  status: "live" | "ramping" | "paused"
  hookRate: number // % viewers past 3s
  saveRate: number // % saves / views
}

export const CHANNELS: Channel[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    handle: "ai.money.engine",
    niche: "Personal finance × AI tools",
    language: "EN",
    voice: "Direct · Male 28 · NYC",
    format: "Talking-head AI avatar + B-roll",
    cadence: "2/day",
    followers: 184_220,
    d7Reach: 2_410_000,
    engineStack: ["GPT-5 (script)", "Arcads (avatar)", "ElevenLabs (vo)", "Submagic (caption)"],
    ownerAgent: "Atlas",
    status: "live",
    hookRate: 71,
    saveRate: 6.2,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    handle: "solo.builder.diary",
    niche: "Indie hacker journals",
    language: "EN",
    voice: "Reflective · Female 31 · LDN",
    format: "Screen-rec + voiceover",
    cadence: "2/day",
    followers: 92_410,
    d7Reach: 1_120_000,
    engineStack: ["Claude Opus 4.6 (script)", "ElevenLabs (vo)", "Captions.ai (edit)"],
    ownerAgent: "Atlas",
    status: "live",
    hookRate: 64,
    saveRate: 8.1,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    handle: "ceo.deepcuts",
    niche: "Founder interview clips",
    language: "EN",
    voice: "Source-accurate (clip)",
    format: "Podcast clipper + b-roll",
    cadence: "3/day",
    followers: 311_900,
    d7Reach: 4_870_000,
    engineStack: ["Whisper-v3 (asr)", "GPT-5 (clip-pick)", "Opus Clip (cut)", "Submagic"],
    ownerAgent: "Ravi",
    status: "live",
    hookRate: 78,
    saveRate: 4.4,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    handle: "neon.recipes",
    niche: "60-second recipes",
    language: "EN",
    voice: "Warm · Female 26 · LA",
    format: "Stock food b-roll + AI vo",
    cadence: "2/day",
    followers: 421_700,
    d7Reach: 6_140_000,
    engineStack: ["GPT-5 (script)", "ElevenLabs (vo)", "Pexels API", "Creatomate (render)"],
    ownerAgent: "Kira",
    status: "live",
    hookRate: 69,
    saveRate: 12.1,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    handle: "midnight.history",
    niche: "Dark history facts",
    language: "EN",
    voice: "Cinematic · Male 42 · UK",
    format: "AI archival + Veo cinematic",
    cadence: "2/day",
    followers: 612_300,
    d7Reach: 8_220_000,
    engineStack: ["GPT-5 (research)", "Veo 3 (cinematic)", "ElevenLabs (vo)", "Runway (motion)"],
    ownerAgent: "Ravi",
    status: "live",
    hookRate: 81,
    saveRate: 5.8,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    handle: "quiet.therapy",
    niche: "Soft journaling prompts",
    language: "EN",
    voice: "Whisper · Female 24 · TOR",
    format: "Slow b-roll + ambient vo",
    cadence: "2/day",
    followers: 88_140,
    d7Reach: 980_000,
    engineStack: ["Claude Opus (script)", "ElevenLabs (vo)", "Pexels", "Captions.ai"],
    ownerAgent: "Kira",
    status: "ramping",
    hookRate: 58,
    saveRate: 14.2,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    handle: "iron.philosophy",
    niche: "Stoic / mindset",
    language: "EN",
    voice: "Authoritative · Male 50 · UK",
    format: "AI avatar + statue b-roll",
    cadence: "2/day",
    followers: 503_900,
    d7Reach: 7_010_000,
    engineStack: ["GPT-5 (script)", "HeyGen (avatar)", "ElevenLabs (vo)", "Submagic"],
    ownerAgent: "Atlas",
    status: "live",
    hookRate: 74,
    saveRate: 9.4,
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    handle: "paisa.product",
    niche: "DTC product reviews (Hindi)",
    language: "HI",
    voice: "Conversational · Male 27 · MUM",
    format: "AI UGC actor unboxing",
    cadence: "2/day",
    followers: 71_500,
    d7Reach: 640_000,
    engineStack: ["GPT-5 (Hindi script)", "Arcads (UGC actor)", "ElevenLabs Multilingual", "Submagic"],
    ownerAgent: "Nexus",
    status: "ramping",
    hookRate: 55,
    saveRate: 3.2,
  },
  {
    id: "00000000-0000-0000-0000-000000000009",
    handle: "dev.dispatch",
    niche: "Daily dev news",
    language: "EN",
    voice: "Crisp · Male 29 · SF",
    format: "Code screencast + vo",
    cadence: "3/day",
    followers: 142_800,
    d7Reach: 1_840_000,
    engineStack: ["GPT-5 (news cluster)", "ElevenLabs (vo)", "Carbon (code)", "Captions.ai"],
    ownerAgent: "Nexus",
    status: "live",
    hookRate: 62,
    saveRate: 7.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000010",
    handle: "fit.protocol",
    niche: "Fitness science 90s",
    language: "EN",
    voice: "Coach · Male 34 · AUS",
    format: "AI avatar + workout b-roll",
    cadence: "2/day",
    followers: 256_600,
    d7Reach: 3_310_000,
    engineStack: ["Claude Opus (research)", "HeyGen (avatar)", "ElevenLabs (vo)", "Submagic"],
    ownerAgent: "Atlas",
    status: "live",
    hookRate: 67,
    saveRate: 8.8,
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    handle: "vault.creators",
    niche: "Creator economy data",
    language: "EN",
    voice: "Analyst · Female 30 · SF",
    format: "Data viz reels",
    cadence: "1/day",
    followers: 49_300,
    d7Reach: 410_000,
    engineStack: ["GPT-5 + Recharts", "ElevenLabs (vo)", "Creatomate"],
    ownerAgent: "Kira",
    status: "ramping",
    hookRate: 60,
    saveRate: 11.3,
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    handle: "luxe.cars.daily",
    niche: "Supercar facts + B-roll",
    language: "EN",
    voice: "Cool narrator · Male 33",
    format: "Veo cinematic + caption",
    cadence: "2/day",
    followers: 388_400,
    d7Reach: 5_220_000,
    engineStack: ["GPT-5 (fact)", "Veo 3 (B-roll)", "ElevenLabs (vo)", "Submagic"],
    ownerAgent: "Ravi",
    status: "live",
    hookRate: 70,
    saveRate: 4.1,
  },
]

export type PipelineStage =
  | "idea"
  | "research"
  | "script"
  | "asset_gen"
  | "qa"
  | "scheduled"
  | "posted"
  | "analyzed"

export const STAGES: { id: PipelineStage; label: string; sla: string; owner: string }[] = [
  { id: "idea", label: "Idea", sla: "auto · 5m", owner: "Trend Bot" },
  { id: "research", label: "Research", sla: "auto · 8m", owner: "Researcher" },
  { id: "script", label: "Script", sla: "auto · 4m", owner: "Writer LLM" },
  { id: "asset_gen", label: "Asset Gen", sla: "queue · 6–14m", owner: "Render Farm" },
  { id: "qa", label: "QA", sla: "human · 30s", owner: "Operator" },
  { id: "scheduled", label: "Scheduled", sla: "auto", owner: "Scheduler" },
  { id: "posted", label: "Posted", sla: "—", owner: "Graph API" },
  { id: "analyzed", label: "Analyzed", sla: "+24h", owner: "Feedback Bot" },
]

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
  thumb?: string // emoji or short label as placeholder
  scoreInbound?: number // predicted virality score 0-100
}

export const REELS: Reel[] = [
  // Idea
  { id: "00000000-0000-0000-0000-000000000201", channelId: "00000000-0000-0000-0000-000000000001", hook: "The 3-account system that lets AI move money for you while you sleep", stage: "idea", niche: "finance", scoreInbound: 84 },
  { id: "00000000-0000-0000-0000-000000000202", channelId: "00000000-0000-0000-0000-000000000005", hook: "Why every clock in the British Empire was set wrong on purpose", stage: "idea", niche: "history", scoreInbound: 91 },
  { id: "00000000-0000-0000-0000-000000000203", channelId: "00000000-0000-0000-0000-000000000009", hook: "The one-line Postgres setting that 10× our checkout", stage: "idea", niche: "dev", scoreInbound: 78 },
  { id: "00000000-0000-0000-0000-000000000204", channelId: "00000000-0000-0000-0000-000000000012", hook: "This 1992 supercar still beats a Tesla Plaid in a straight line", stage: "idea", niche: "cars", scoreInbound: 80 },

  // Research
  { id: "00000000-0000-0000-0000-000000000211", channelId: "00000000-0000-0000-0000-000000000003", hook: "Sam Altman on what he was wrong about in 2024", stage: "research", niche: "interviews", scoreInbound: 88 },
  { id: "00000000-0000-0000-0000-000000000212", channelId: "00000000-0000-0000-0000-000000000007", hook: "Marcus Aurelius wrote one paragraph that destroys 'productivity'", stage: "research", niche: "stoic", scoreInbound: 76 },

  // Script
  { id: "00000000-0000-0000-0000-000000000221", channelId: "00000000-0000-0000-0000-000000000004", hook: "30-second pasta that fooled an Italian chef", stage: "script", niche: "recipes", scoreInbound: 73 },
  { id: "00000000-0000-0000-0000-000000000222", channelId: "00000000-0000-0000-0000-000000000010", hook: "The 4-rep set that builds more muscle than 12", stage: "script", niche: "fitness", scoreInbound: 81 },
  { id: "00000000-0000-0000-0000-000000000223", channelId: "00000000-0000-0000-0000-000000000002", hook: "Day 19 of building in public — first $1k MRR", stage: "script", niche: "indie", scoreInbound: 69 },

  // Asset Gen
  { id: "00000000-0000-0000-0000-000000000231", channelId: "00000000-0000-0000-0000-000000000001", hook: "I asked GPT-5 to manage my emergency fund. Here's what happened.", stage: "asset_gen", niche: "finance", scoreInbound: 86 },
  { id: "00000000-0000-0000-0000-000000000232", channelId: "00000000-0000-0000-0000-000000000007", hook: "Stop trying to be productive. Try this 1779 trick instead.", stage: "asset_gen", niche: "stoic", scoreInbound: 82 },
  { id: "00000000-0000-0000-0000-000000000233", channelId: "00000000-0000-0000-0000-000000000008", hook: "₹399 ka product, ₹3000 ka kaam karta hai", stage: "asset_gen", niche: "dtc-hi", scoreInbound: 64 },

  // QA
  { id: "00000000-0000-0000-0000-000000000241", channelId: "00000000-0000-0000-0000-000000000005", hook: "The Library of Alexandria didn't burn — it was sold", stage: "qa", niche: "history", blocked: "lip-sync drift @ 00:11", scoreInbound: 89 },
  { id: "00000000-0000-0000-0000-000000000242", channelId: "00000000-0000-0000-0000-000000000004", hook: "3-ingredient breakfast that hits 40g protein", stage: "qa", niche: "recipes", scoreInbound: 75 },

  // Scheduled
  { id: "00000000-0000-0000-0000-000000000251", channelId: "00000000-0000-0000-0000-000000000009", hook: "The git command 90% of senior devs use wrong", stage: "scheduled", niche: "dev", scheduledFor: "Today · 7:42 PM IST", scoreInbound: 79 },
  { id: "00000000-0000-0000-0000-000000000252", channelId: "00000000-0000-0000-0000-000000000011", hook: "MrBeast's 2026 RPM is lower than your nano-channel's", stage: "scheduled", niche: "creator", scheduledFor: "Today · 9:10 PM IST", scoreInbound: 72 },
  { id: "00000000-0000-0000-0000-000000000253", channelId: "00000000-0000-0000-0000-000000000006", hook: "If you can't sleep, write the sentence you're avoiding", stage: "scheduled", niche: "therapy", scheduledFor: "Tomorrow · 6:30 AM IST", scoreInbound: 68 },

  // Posted
  { id: "00000000-0000-0000-0000-000000000261", channelId: "00000000-0000-0000-0000-000000000003", hook: "Jensen Huang: 'we should have hired the third-best person'", stage: "posted", niche: "interviews", views: 412_000, saveRate: 5.1 },
  { id: "00000000-0000-0000-0000-000000000262", channelId: "00000000-0000-0000-0000-000000000012", hook: "The Bugatti you can legally drive in India for ₹0 in tax", stage: "posted", niche: "cars", views: 1_240_000, saveRate: 3.8 },
  { id: "00000000-0000-0000-0000-000000000263", channelId: "00000000-0000-0000-0000-000000000001", hook: "I let AI decide my groceries for 30 days", stage: "posted", niche: "finance", views: 312_000, saveRate: 7.2 },

  // Analyzed
  { id: "00000000-0000-0000-0000-000000000271", channelId: "00000000-0000-0000-0000-000000000005", hook: "Cleopatra was closer in time to the iPhone than to the Pyramids", stage: "analyzed", niche: "history", views: 4_120_000, saveRate: 9.4 },
  { id: "00000000-0000-0000-0000-000000000272", channelId: "00000000-0000-0000-0000-000000000007", hook: "Read this when you feel behind", stage: "analyzed", niche: "stoic", views: 2_310_000, saveRate: 11.1 },
]

export function getChannel(id: string) {
  return CHANNELS.find((c) => c.id === id)
}

// Niches you can pick in the studio
export const NICHES = [
  "personal finance × AI tools",
  "indie hacker journal",
  "founder interview clip",
  "60-second recipe",
  "dark history fact",
  "soft therapy / journaling",
  "stoic / mindset",
  "DTC product review (Hindi)",
  "daily dev news",
  "fitness science",
  "creator economy data",
  "supercar / luxury car",
] as const

export const FORMATS = [
  "AI avatar talking-head",
  "AI UGC actor (Arcads-style)",
  "Veo 3 cinematic b-roll + voiceover",
  "Podcast clipper + captions",
  "Stock b-roll + voiceover",
  "Screen-rec + voiceover",
] as const

// Daily ticker events (used on the home page)
export const TICKER = [
  "00000000-0000-0000-0000-000000000271 hit 4.1M views · save-rate 9.4% · cluster: shock-stat-historical",
  "Render farm queue: 14 jobs · avg wait 6m 12s",
  "Arcads actor 'Maya-IN' booked for 11 reels in next 24h",
  "Veo 3 minute-credits used today: 142 / 600",
  "ElevenLabs concurrency: 7 / 12",
  "00000000-0000-0000-0000-000000000006 quiet.therapy entering ramp phase · 7-day reach +312%",
  "Trend bot ingested 4,812 reels · 38 promoted to Idea stage",
  "Scheduler queue across 12 channels: 27 reels lined up next 48h",
]
