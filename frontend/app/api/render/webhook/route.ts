// Webhook: Render provider completion callback
// POST /api/render/webhook
// Called by Creatomate / HeyGen / Arcads when a render job completes
import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@backend/supabase/service";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Verify webhook signature if provider supplies one
  const signature = req.headers.get("x-webhook-signature");
  // In production, verify signature against provider secret

  const supabase = createServiceSupabaseClient();

  const {
    external_id,
    status,
    output_url,
    error: renderError,
    provider,
  } = body;

  if (!external_id) {
    return NextResponse.json(
      { error: "external_id is required" },
      { status: 400 }
    );
  }

  // Update render job status
  const { data: job, error: updateError } = await supabase
    .from("render_jobs")
    .update({
      status: status === "completed" ? "succeeded" : "failed",
      output_url: output_url || null,
      error: renderError || null,
      updated_at: new Date().toISOString(),
    })
    .eq("external_id", external_id)
    .select(`
      *,
      brief:briefs(id, channel_id)
    `)
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  // If render succeeded, create a "final" asset and advance the reel
  if (status === "completed" && output_url && job) {
    const brief = job.brief as any;

    // Create the final asset record
    await supabase.from("assets").insert({
      brief_id: job.brief_id,
      kind: "final",
      provider: provider || job.provider,
      storage_path: output_url,
      status: "ready",
    });

    // Find the reel linked to this brief and advance to "rendered"
    if (brief?.id) {
      await supabase
        .from("reels")
        .update({ stage: "rendered" })
        .eq("brief_id", brief.id)
        .eq("stage", "assets");
    }
  }

  return NextResponse.json({
    ok: true,
    jobId: job?.id,
    status: job?.status,
  });
}
