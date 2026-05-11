export const TEARDOWN_PROTOCOL = {
  globalRules: `AI CONTENT MACHINE - PRECISION INTELLIGENCE PROTOCOL v3.0

GLOBAL RULES
- Compare two entities as competing content systems, not as personalities.
- Separate evidence-backed observations from inference and speculation.
- Every inferred or speculative claim must carry a confidence level.
- Prefer operational specificity: queues, tools, roles, failure modes, cadence, asset flow, and feedback loops.
- Do not invent private facts. If a claim cannot be observed directly, label it INFERRED or SPECULATIVE.
- Return concise, structured markdown that can be streamed directly into an operator dashboard.`,
  promptA: `PROMPT A - RECON

You are running Recon for the AI Content Machine - Precision Intelligence Protocol v3.0.

Entities:
Entity A: {{ENTITY_A}}
Entity B: {{ENTITY_B}}

Analyze both entities side by side as content production systems.

Return sections 1-4:

1. Content Fingerprint
- Posting format patterns
- Hook language
- Visual grammar
- Editing style
- Cadence
- Channel positioning

2. Engagement Signals
- Retention signals
- Save/share triggers
- Comment bait or community loops
- Repetition patterns that likely explain performance

3. Anomaly Log
- Outlier posts or formats
- Sudden shifts in cadence or style
- Claims that require caution
- Evidence gaps

4. Hypotheses
- The likely production workflow
- The likely feedback loop
- The likely operational bottleneck
- The likely moat

Evidence protocol:
- Tag every finding as CONFIRMED, INFERRED, or SPECULATIVE.
- CONFIRMED means directly observable from public artifacts.
- INFERRED means strongly implied by repeatable patterns.
- SPECULATIVE means plausible but weakly evidenced.
- Every INFERRED or SPECULATIVE claim must include confidence: LOW, MEDIUM, or HIGH.

Keep output near 1500 tokens.`,
  promptB: `PROMPT B - ARCHITECTURE

You are running Architecture for the AI Content Machine - Precision Intelligence Protocol v3.0.

Entities:
Entity A: {{ENTITY_A}}
Entity B: {{ENTITY_B}}

Prior Recon output:
{{PRIOR_OUTPUT}}

Reconstruct the operating architecture behind the observed content systems.

Return sections 1-5:

1. Pipeline Reconstruction
Provide 10 stages:
01 Ingest
02 Select
03 Research
04 Script
05 Voice
06 Assets
07 Assemble
08 QA
09 Publish
10 Feedback

For each stage include:
- What happens operationally
- Tool or tool category with evidence tier and confidence
- Automation level: FULL, PARTIAL, or MANUAL
- Human involvement: NONE, EXCEPTION, or REQUIRED
- Primary failure mode

2. Tooling Stack
Return a table with:
- Layer
- Likely tool
- Evidence tier
- Confidence
- Why this tool fits
- Replacement risk

3. Automation Architecture
Describe the content_queue status flow as a state machine with labeled transitions.
Use statuses: ideation, scripting, asset_gen, qa, scheduled, posted, analyzed, failed.

4. Team Structure
Estimate the smallest team that could operate this system.
Separate required roles from optional roles.

5. Confidence Map
Split claims into Evidence-Backed and Speculative.

Keep output near 2500 tokens.`,
  promptC: `PROMPT C - BLUEPRINT

You are running Blueprint for the AI Content Machine - Precision Intelligence Protocol v3.0.

Entities:
Entity A: {{ENTITY_A}}
Entity B: {{ENTITY_B}}

Prior Architecture output:
{{PRIOR_OUTPUT}}

Convert the reconstructed architecture into a buildable system blueprint.

Return sections 1-6:

1. Tech Stack
Return a table with:
- Layer
- Primary
- Fallback
- Cost
- Integration complexity
- Why

2. Database Schema
Render the full SQL schema verbatim:

CREATE TABLE content_queue (
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
);

3. SOP Library
Provide SOP-01 through SOP-04:
SOP-01 Trend intake
SOP-02 Script and asset generation
SOP-03 QA exception handling
SOP-04 Feedback loop calibration

Each SOP needs:
- Trigger
- Time estimate
- Step-by-step procedure

4. Scaling Roadmap
Provide phases:
- MVP
- Intermediate
- Industrial

Also include two cost breakdown tables:
- Monthly software/provider cost
- Human operating cost

5. Risk Register
Return a table with:
- Risk
- Probability
- Impact
- Detection signal
- Mitigation

Include a synthetic content detection row.

6. Moat Analysis
Answer:
Q1: What becomes commoditized?
Q2: What becomes defensible?
Q3: What would make this system compound?

Keep output near 2500 tokens.`,
} as const

export type TeardownProtocol = typeof TEARDOWN_PROTOCOL
