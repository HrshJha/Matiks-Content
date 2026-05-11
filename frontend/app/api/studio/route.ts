// Live AI generation endpoint for Frame OS · /studio
// Streams a structured "reel brief" — the unit the rest of the pipeline consumes.
import { streamText, Output } from "ai"
import { reelBriefSchema } from "@backend/schemas/reel-brief"
import { studioRequestSchema } from "@backend/schemas/studio-request"
import { checkStudioRateLimit } from "@backend/auth/ratelimit"

export const maxDuration = 60

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
  const parsed = studioRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid studio request", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { niche, format, trend, channelHandle, language } = parsed.data

  const system = `You are the scripting service inside Frame OS — an autonomous media infrastructure layer that runs 10+ Instagram Reels channels at 2+ reels/day each. You output structured reel briefs that the rest of the pipeline (voiceover, asset gen, caption, scheduler) consumes directly.

Style rules:
- Sound like a human who actually posts on Reels in 2026. Avoid LinkedIn-isms ("game-changer", "unlock", "leverage").
- Hooks must earn the first 3 seconds. Curiosity gap > clickbait. No "POV:", no "Here's why...", no listicle openers.
- Never invent statistics. If a number is needed, frame it as "research suggests" or generic.
- Match the language: ${language}. If HI, write romanized Hindi (Hinglish) the way creators actually speak it.
- Match the channel voice — keep it tight.
- Output exactly 3 hooks.
- Output 3 or 4 script beats.
- Output 5-10 lowercase hashtags without the # symbol.
- Keep caption at or under 220 characters.

Channel: @${channelHandle}
Niche: ${niche}
Format: ${format}
Angle: ${trend}
Output language: ${language}

Return only the structured object — no preamble.`

  const { google } = await import("@ai-sdk/google")

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system,
    prompt: `Generate one production-ready reel brief for @${channelHandle} (niche: ${niche}). Format: ${format}. Lean into the angle: ${trend}.`,
    output: Output.object({ schema: reelBriefSchema }),
  })

  return result.toTextStreamResponse()
}
