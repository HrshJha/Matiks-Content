import type { ArchitectureOutput, BlueprintOutput, ReconOutput } from "@/lib/schemas/teardown"

export const CONTENT_QUEUE_SQL = `CREATE TABLE content_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text NOT NULL,
  status text NOT NULL CHECK (
    status IN ('ideation', 'scripting', 'asset_gen', 'qa', 'scheduled', 'posted', 'analyzed', 'failed')
  ),
  retry_count int DEFAULT 0,
  error_log text,
  provider_used text,
  qa_flagged boolean DEFAULT false,
  scheduled_for timestamptz,
  hook_primitive_id text REFERENCES hook_primitives(id),
  script_payload jsonb,
  render_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hook_primitives (
  id text PRIMARY KEY,
  label text NOT NULL,
  pattern text NOT NULL,
  evidence_count int DEFAULT 0,
  last_seen_at timestamptz
);

CREATE TABLE teardown_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_a text NOT NULL,
  entity_b text NOT NULL,
  recon_output jsonb,
  architecture_output jsonb,
  blueprint_output jsonb,
  created_at timestamptz DEFAULT now()
);`

export const STATUS_FLOW = [
  { from: "ideation", to: "scripting", transition: "winner selected" },
  { from: "scripting", to: "asset_gen", transition: "script_payload valid" },
  { from: "asset_gen", to: "qa", transition: "render_url ready" },
  { from: "qa", to: "scheduled", transition: "qa passed" },
  { from: "scheduled", to: "posted", transition: "publish window" },
  { from: "posted", to: "analyzed", transition: "metrics synced" },
  { from: "qa", to: "failed", transition: "policy or render defect" },
  { from: "asset_gen", to: "failed", transition: "provider timeout" },
] satisfies ArchitectureOutput["automationArchitecture"]

export const STATIC_RECON: ReconOutput = {
  entities: [
    {
      entity: "Entity A",
      contentFingerprint: [
        {
          text: "Repeating short-form templates reveal a factory-style grammar: hook, compressed proof, payoff, CTA.",
          evidenceTier: "INFERRED",
          confidence: "HIGH",
        },
        {
          text: "Visual system depends on fast captions, stock or generated b-roll, and hard-coded pacing rules.",
          evidenceTier: "INFERRED",
          confidence: "MEDIUM",
        },
        {
          text: "Channel positioning is likely optimized around a narrow niche promise rather than a named creator identity.",
          evidenceTier: "SPECULATIVE",
          confidence: "MEDIUM",
        },
      ],
      engagementSignals: [
        {
          text: "Save triggers are likely concentrated around lists, contrarian advice, and reusable frameworks.",
          evidenceTier: "INFERRED",
          confidence: "MEDIUM",
        },
        {
          text: "Comment prompts probably function as lightweight feedback labels for the next ideation run.",
          evidenceTier: "SPECULATIVE",
          confidence: "LOW",
        },
      ],
    },
    {
      entity: "Entity B",
      contentFingerprint: [
        {
          text: "Performance creative likely uses a brief-to-variation matrix: audience, pain point, offer, avatar, proof.",
          evidenceTier: "INFERRED",
          confidence: "HIGH",
        },
        {
          text: "Real product clips are the grounding asset that prevents synthetic actor fatigue.",
          evidenceTier: "INFERRED",
          confidence: "MEDIUM",
        },
        {
          text: "The page likely rotates winning actor/voice combinations after conversion data accumulates.",
          evidenceTier: "SPECULATIVE",
          confidence: "MEDIUM",
        },
      ],
      engagementSignals: [
        {
          text: "Thumb-stop moments likely come from first-person pain claims and quick visual proof cuts.",
          evidenceTier: "INFERRED",
          confidence: "MEDIUM",
        },
        {
          text: "Engagement may be less important than downstream conversion, so creative learning happens outside platform metrics.",
          evidenceTier: "SPECULATIVE",
          confidence: "HIGH",
        },
      ],
    },
  ],
  anomalyLog: [
    {
      text: "A sudden shift from synthetic visuals to real footage usually signals fatigue, compliance pressure, or a new asset bank.",
      evidenceTier: "INFERRED",
      confidence: "MEDIUM",
    },
    {
      text: "Outlier posts should be checked for paid amplification before treating them as organic signal.",
      evidenceTier: "SPECULATIVE",
      confidence: "MEDIUM",
    },
  ],
  hypotheses: [
    {
      text: "The queue is the actual product: every post is an object moving through ideation, scripting, assets, QA, publish, and feedback.",
      evidenceTier: "INFERRED",
      confidence: "HIGH",
    },
    {
      text: "Humans are mostly exception handlers, taste calibrators, and compliance reviewers.",
      evidenceTier: "INFERRED",
      confidence: "HIGH",
    },
  ],
}

export const STATIC_ARCHITECTURE: ArchitectureOutput = {
  pipelineReconstruction: [
    ["01", "Ingest", "Scrape high-performing reels, ads, comments, and trend surfaces into a normalized queue.", "Scraping layer + warehouse", "FULL", "EXCEPTION", "Source layout changes or rate limits break ingestion."],
    ["02", "Select", "Cluster hooks and select candidate ideas based on recent engagement or conversion lift.", "LLM router + vector index", "PARTIAL", "EXCEPTION", "Model overweights stale patterns and amplifies sameness."],
    ["03", "Research", "Attach claims, examples, product constraints, and compliance guardrails to each candidate.", "Search/API enrichment", "PARTIAL", "REQUIRED", "Unsupported claims slip into scripts."],
    ["04", "Script", "Generate structured script_payload with hook, beats, caption, visual notes, and CTA.", "LLM inference", "FULL", "EXCEPTION", "JSON shape fails or the hook becomes generic."],
    ["05", "Voice", "Convert script to TTS or avatar speech and capture word-level timing.", "TTS/avatar API", "FULL", "NONE", "Voice drift, pronunciation errors, or cadence fatigue."],
    ["06", "Assets", "Retrieve or generate b-roll, product clips, screenshots, and overlays.", "Stock + generative media", "PARTIAL", "EXCEPTION", "Asset starvation or uncanny synthetic visuals."],
    ["07", "Assemble", "Programmatically stitch timeline, captions, cuts, audio levels, and brand rules.", "Render worker", "FULL", "NONE", "Render timeout or caption overflow."],
    ["08", "QA", "Run policy, audio, text-fit, visual, and claim checks; route rejects to humans.", "Automated QA judge", "PARTIAL", "EXCEPTION", "False negatives let policy risk through."],
    ["09", "Publish", "Schedule approved renders and post through platform APIs.", "Scheduler + social API", "FULL", "EXCEPTION", "API auth expires or post window misses."],
    ["10", "Feedback", "Pull 24-72h metrics and feed winners into hook primitives.", "Analytics cron", "FULL", "NONE", "Attribution noise teaches the wrong lesson."],
  ].map(([id, name, operation, tool, automationLevel, humanInvolvement, primaryFailureMode]) => ({
    id,
    name,
    operation,
    tool: { name: tool, evidenceTier: "INFERRED", confidence: "HIGH" },
    automationLevel: automationLevel as "FULL" | "PARTIAL" | "MANUAL",
    humanInvolvement: humanInvolvement as "NONE" | "EXCEPTION" | "REQUIRED",
    primaryFailureMode,
  })),
  toolingStack: [
    { layer: "Ingest", likelyTool: "Apify/custom scraper", evidenceTier: "INFERRED", confidence: "MEDIUM", whyThisToolFits: "Repeated pattern mining needs bulk capture.", replacementRisk: "Low" },
    { layer: "Reasoning", likelyTool: "Claude/Gemini/OpenAI", evidenceTier: "INFERRED", confidence: "HIGH", whyThisToolFits: "Structured classification and script generation.", replacementRisk: "Medium" },
    { layer: "Voice", likelyTool: "ElevenLabs or provider TTS", evidenceTier: "INFERRED", confidence: "MEDIUM", whyThisToolFits: "Stable channel voice and timecodes.", replacementRisk: "Low" },
    { layer: "Video", likelyTool: "Creatomate/Remotion/FFmpeg", evidenceTier: "INFERRED", confidence: "MEDIUM", whyThisToolFits: "Template rendering at queue scale.", replacementRisk: "Medium" },
    { layer: "State", likelyTool: "Postgres/Supabase", evidenceTier: "INFERRED", confidence: "HIGH", whyThisToolFits: "Queue status and retries need relational state.", replacementRisk: "Low" },
  ],
  automationArchitecture: STATUS_FLOW,
  teamStructure: {
    requiredRoles: ["Operator/editorial lead", "Automation engineer", "Compliance reviewer"],
    optionalRoles: ["Motion designer", "Performance marketer", "Data analyst"],
    notes: "The minimum viable team is small because most work is queue routing, exception handling, and taste calibration.",
  },
  confidenceMap: {
    evidenceBacked: ["Repeated formats indicate templated production.", "Feedback loops explain why winning hooks recur.", "Real assets remain a bottleneck for product-led creative."],
    speculative: ["Exact provider choices are inferred from industry-fit, not private telemetry.", "Team size may vary if paid media and organic teams are separated."],
  },
}

export const STATIC_BLUEPRINT: BlueprintOutput = {
  techStack: [
    { layer: "App", primary: "Next.js", fallback: "Remix", cost: "$20-$100/mo", integrationComplexity: "Low", why: "Fast dashboard, API routes, streaming UI." },
    { layer: "State", primary: "Supabase Postgres", fallback: "Neon + S3", cost: "$25-$250/mo", integrationComplexity: "Low", why: "Queue, logs, retries, and operator review in one data layer." },
    { layer: "LLM", primary: "Claude via AI Gateway", fallback: "Gemini 2.5 Flash", cost: "Usage based", integrationComplexity: "Medium", why: "Strong analysis and structured content generation." },
    { layer: "Voice", primary: "ElevenLabs", fallback: "OpenAI/Gemini TTS", cost: "$22-$330/mo", integrationComplexity: "Medium", why: "Consistent voices and production-ready output." },
    { layer: "Render", primary: "Remotion/FFmpeg worker", fallback: "Creatomate", cost: "$50-$500/mo", integrationComplexity: "High", why: "Template rendering and deterministic captions." },
    { layer: "Publish", primary: "Platform APIs", fallback: "Buffer/manual queue", cost: "$0-$100/mo", integrationComplexity: "Medium", why: "Scheduled publishing and metric sync." },
  ],
  databaseSchema: CONTENT_QUEUE_SQL,
  sopLibrary: [
    { id: "SOP-01", title: "Trend intake", trigger: "Daily at 08:00 or when a cluster spikes.", timeEstimate: "20 minutes", steps: ["Pull top posts and ads.", "Cluster hooks into primitives.", "Mark duplicates and stale patterns.", "Promote 5-10 candidates into ideation."] },
    { id: "SOP-02", title: "Script and asset generation", trigger: "content_queue.status enters scripting.", timeEstimate: "8 minutes per batch", steps: ["Generate script_payload.", "Validate JSON.", "Resolve voice and visual plan.", "Request assets and write provider_used."] },
    { id: "SOP-03", title: "QA exception handling", trigger: "qa_flagged is true or status enters failed.", timeEstimate: "3-6 minutes per reject", steps: ["Read error_log.", "Check policy and text fit.", "Patch script or asset selection.", "Retry once before human rewrite."] },
    { id: "SOP-04", title: "Feedback loop calibration", trigger: "24h and 72h metric sync.", timeEstimate: "30 minutes weekly", steps: ["Rank by hook and save rate.", "Promote winning primitives.", "Throttle fatigued formats.", "Update channel guardrails."] },
  ],
  scalingRoadmap: {
    phases: [
      { name: "MVP", description: "One operator, three channels, mostly manual QA.", throughput: "3-6 reels/day" },
      { name: "Intermediate", description: "Automated QA, reusable templates, provider retries.", throughput: "12-30 reels/day" },
      { name: "Industrial", description: "Multi-channel queue, experiments, automated learning loop.", throughput: "50+ reels/day" },
    ],
    softwareProviderCosts: [
      { item: "LLM", mvp: "$50", intermediate: "$300", industrial: "$1,500+" },
      { item: "Voice/video", mvp: "$80", intermediate: "$600", industrial: "$3,000+" },
      { item: "Infra/storage", mvp: "$50", intermediate: "$250", industrial: "$1,000+" },
    ],
    humanOperatingCosts: [
      { item: "Operator", mvp: "0.25 FTE", intermediate: "1 FTE", industrial: "2-3 FTE" },
      { item: "Compliance/editorial", mvp: "Ad hoc", intermediate: "0.5 FTE", industrial: "1-2 FTE" },
      { item: "Engineering", mvp: "Build sprint", intermediate: "0.5 FTE", industrial: "1 FTE" },
    ],
  },
  riskRegister: [
    { risk: "Synthetic content detection", probability: "Medium", impact: "High", detectionSignal: "Reach drops across AI-heavy formats.", mitigation: "Blend real footage, diversify voices, and cap generated visual share.", highlight: true },
    { risk: "Compliance claims", probability: "Medium", impact: "High", detectionSignal: "QA flags claims or platform rejects ads.", mitigation: "Require evidence fields and human review for regulated niches." },
    { risk: "Provider outages", probability: "High", impact: "Medium", detectionSignal: "Retries and failed render jobs spike.", mitigation: "Fallback providers and idempotent queue retries." },
    { risk: "Narrative entropy", probability: "High", impact: "High", detectionSignal: "Hook rate decays despite stable output volume.", mitigation: "Introduce proprietary sources and taste-led review." },
  ],
  moatAnalysis: [
    { question: "Q1: What becomes commoditized?", answer: "Raw generation, captions, TTS, and basic avatar creative become cheap and interchangeable." },
    { question: "Q2: What becomes defensible?", answer: "Private ingestion, calibrated taste, compliance data, asset libraries, and feedback history." },
    { question: "Q3: What would make this system compound?", answer: "Every published artifact must update hook primitives, channel guardrails, and future routing decisions." },
  ],
}
