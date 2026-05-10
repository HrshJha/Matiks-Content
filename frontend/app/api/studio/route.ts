// Live AI generation endpoint for Matiks Content OS · /studio
// Streams a structured "reel brief" — the unit the rest of the pipeline consumes.
import { streamText, Output } from "ai"
import * as z from "zod"

export const maxDuration = 60

export const reelBriefSchema = z.object({
  cluster: z
    .string()
    .describe(
      "Hook template / cluster name in 1-3 words, like 'shock-stat-historical' or 'invisible-cost'.",
    ),
  hooks: z
    .array(z.string())
    .describe(
      "Three radically different ≤14-word hook lines for the same idea. Each must work as the first 3 seconds of an Instagram Reel. No emojis. No 'POV:'. No clichés. Output exactly 3.",
    ),
  script: z.object({
    hook: z.string().describe("Opening 6-8 seconds, picks/refines the strongest hook above."),
    context: z.string().describe("Build, 6-10 seconds, sets the stakes."),
    beats: z
      .array(
        z.object({
          line: z.string().describe("Voiceover line, ≤22 words."),
          broll: z
            .string()
            .describe(
              "B-roll prompt — concise. Either a stock query like 'pexels: man at desk laptop' or a generative prompt like 'veo: slow dolly into a 1990s television'.",
            ),
        }),
      )
      .describe("3-4 beats, each ≤8 seconds. Together ~30 seconds total. Output 3 or 4."),
    cta: z.string().describe("Closing 3-5 seconds. Save / follow / comment trigger."),
  }),
  caption: z
    .string()
    .describe(
      "Instagram caption (≤220 chars). 1 line, no hashtag spam, ends with hook reiteration or a question.",
    ),
  hashtags: z
    .array(z.string())
    .describe("5-10 lowercase hashtags without the # symbol."),
  voiceDirection: z
    .string()
    .describe(
      "One sentence on how the ElevenLabs voice should perform this — pace, energy, tone breaks.",
    ),
  thumbnailPrompt: z
    .string()
    .describe("A single image prompt for the cover frame. Vivid, single subject, high contrast."),
  riskNotes: z
    .string()
    .describe(
      "Brand-safety / factual-claim risks for QA. Use the literal string 'none' if clean.",
    ),
})

export type ReelBrief = z.infer<typeof reelBriefSchema>

import { checkStudioRateLimit } from "@backend/auth/ratelimit"

export async function POST(req: Request) {
  // Use IP for rate limiting, fallback to generic "studio-req"
  const ip = req.headers.get("x-forwarded-for") ?? "studio-req"
  const { success } = await checkStudioRateLimit(ip)
  
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a minute before generating again." }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    })
  }

  const body = await req.json().catch(() => ({}))
  const niche: string = body.niche || "personal finance × AI tools"
  const format: string = body.format || "AI avatar talking-head"
  const trend: string = body.trend || "use a contrarian shock stat"
  const channelHandle: string = body.channelHandle || "ai.money.engine"
  const language: string = body.language || "EN"

  const system = `You are the scripting service inside Matiks Content OS — a system that runs 10+ Instagram Reels channels with 2+ reels/day each. You output structured reel briefs that the rest of the pipeline (voiceover, asset gen, caption, scheduler) consumes directly.

Style rules:
- Sound like a human who actually posts on Reels in 2026. Avoid LinkedIn-isms ("game-changer", "unlock", "leverage").
- Hooks must earn the first 3 seconds. Curiosity gap > clickbait. No "POV:", no "Here's why...", no listicle openers.
- Never invent statistics. If a number is needed, frame it as "research suggests" or generic.
- Match the language: ${language}. If HI, write romanized Hindi (Hinglish) the way creators actually speak it.
- Match the channel voice — keep it tight.

Channel: @${channelHandle}
Niche: ${niche}
Format: ${format}
Angle: ${trend}
Output language: ${language}

Return only the structured object — no preamble.`

  const result = streamText({
    model: "openai/gpt-5-mini",
    system,
    prompt: `Generate one production-ready reel brief for @${channelHandle} (niche: ${niche}). Format: ${format}. Lean into the angle: ${trend}.`,
    output: Output.object({ schema: reelBriefSchema }),
  })

  return result.toTextStreamResponse()
}
