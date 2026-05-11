import { renderToBuffer } from "@react-pdf/renderer"
import { z } from "zod"
import { reelBriefSchema } from "@backend/schemas/reel-brief"
import { ReelBriefPdf } from "@/components/pdf/reel-brief-pdf"
import { createReelBriefPdfFilename } from "@/components/pdf/pdf-utils"

export const runtime = "nodejs"
export const maxDuration = 60

const exportRequestSchema = z.object({
  brief: reelBriefSchema,
  channelHandle: z.string().min(1).max(80),
  generatedAt: z.string().datetime().optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = exportRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid reel brief export payload", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const generatedAt = parsed.data.generatedAt ? new Date(parsed.data.generatedAt) : new Date()
  const filename = createReelBriefPdfFilename(parsed.data.channelHandle, generatedAt)

  let pdfBuffer: Buffer

  try {
    pdfBuffer = await renderToBuffer(
      ReelBriefPdf({
        brief: parsed.data.brief,
        channelHandle: parsed.data.channelHandle,
        generatedAt,
      }),
    )
  } catch (error) {
    console.error("Failed to render reel brief PDF", error)
    return Response.json({ error: "Failed to render reel brief PDF" }, { status: 500 })
  }

  return new Response(pdfBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdfBuffer.byteLength),
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store",
    },
  })
}
