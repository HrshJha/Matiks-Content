import { gateway } from "@ai-sdk/gateway"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { z } from "zod"
import { TEARDOWN_PROTOCOL } from "@/lib/teardown-protocol"

export const maxDuration = 60

const teardownRequestSchema = z.object({
  entityA: z.string().min(1),
  entityB: z.string().min(1),
  phase: z.enum(["A", "B", "C"]),
  priorOutput: z.string().optional(),
})

const PHASE_CONFIG = {
  A: { maxOutputTokens: 1500, prompt: TEARDOWN_PROTOCOL.promptA },
  B: { maxOutputTokens: 2500, prompt: TEARDOWN_PROTOCOL.promptB },
  C: { maxOutputTokens: 2500, prompt: TEARDOWN_PROTOCOL.promptC },
} as const

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = teardownRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid teardown request", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { entityA, entityB, phase, priorOutput = "" } = parsed.data
  const phaseConfig = PHASE_CONFIG[phase]
  const system = injectPrompt(phaseConfig.prompt, entityA, entityB, priorOutput)
  const model = getTeardownModel()

  const result = streamText({
    model,
    system: `${TEARDOWN_PROTOCOL.globalRules}\n\n${system}`,
    prompt: `Run teardown phase ${phase} for Entity A: ${entityA} and Entity B: ${entityB}.`,
    maxOutputTokens: phaseConfig.maxOutputTokens,
  })

  return result.toTextStreamResponse()
}

function injectPrompt(prompt: string, entityA: string, entityB: string, priorOutput: string) {
  return prompt
    .replaceAll("{{ENTITY_A}}", entityA)
    .replaceAll("{{ENTITY_B}}", entityB)
    .replaceAll("{{PRIOR_OUTPUT}}", priorOutput || "No prior output supplied.")
}

function getTeardownModel() {
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY) {
    return gateway(process.env.TEARDOWN_CLAUDE_MODEL || "anthropic/claude-sonnet-4.5")
  }

  return google(process.env.TEARDOWN_GOOGLE_MODEL || "gemini-2.5-flash")
}
