// Cron: Post scheduled reels via IG Graph API
// Runs every 15 minutes (vercel.json: */15 * * * *)
// Checks for reels in "queued" stage with scheduled_for <= now()
import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@backend/supabase/service";
import { igGraphClient } from "@backend/providers/ig-graph";
import { decrypt } from "@backend/auth/encrypt";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // Verify cron secret or internal caller
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || process.env.STUDIO_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const now = new Date().toISOString();

  // Get all reels ready to post
  const { data: dueReels, error } = await supabase
    .from("reels")
    .select(`
      *,
      channel:channels(handle, ig_user_id, access_token_enc),
      brief:briefs(payload)
    `)
    .eq("stage", "queued")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!dueReels || dueReels.length === 0) {
    return NextResponse.json({ posted: 0, message: "No reels due" });
  }

  const results: { reelId: string; status: string; mediaId?: string; error?: string }[] = [];

  for (const reel of dueReels) {
    const channel = reel.channel as any;
    const brief = reel.brief as any;

    // Skip if channel doesn't have IG credentials
    if (!channel?.ig_user_id || !channel?.access_token_enc) {
      results.push({
        reelId: reel.id,
        status: "skipped",
        error: "Missing IG credentials",
      });
      continue;
    }

    try {
      // Decrypt access token
      const accessToken = await decrypt(channel.access_token_enc);

      // Build caption from brief payload
      const payload = brief?.payload || {};
      const caption = payload.caption || reel.topic;
      const hashtags = payload.hashtags || [];

      // Get the final render URL (from assets table)
      const { data: finalAsset } = await supabase
        .from("assets")
        .select("storage_path")
        .eq("brief_id", reel.brief_id)
        .eq("kind", "final")
        .eq("status", "ready")
        .single();

      if (!finalAsset?.storage_path) {
        results.push({
          reelId: reel.id,
          status: "skipped",
          error: "No final render available",
        });
        continue;
      }

      // Post via IG Graph API
      const postResult = await igGraphClient.call({
        accessToken,
        igUserId: channel.ig_user_id,
        videoUrl: finalAsset.storage_path,
        caption,
        hashtags,
      });

      if (postResult.success && postResult.data) {
        // Update reel to "posted" stage
        await supabase
          .from("reels")
          .update({
            stage: "analyzed" as any,
            posted_at: now,
            ig_media_id: postResult.data.mediaId,
          })
          .eq("id", reel.id);

        results.push({
          reelId: reel.id,
          status: "posted",
          mediaId: postResult.data.mediaId,
        });
      } else {
        results.push({
          reelId: reel.id,
          status: "failed",
          error: postResult.error?.message || "Unknown posting error",
        });
      }
    } catch (err) {
      results.push({
        reelId: reel.id,
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    posted: results.filter((r) => r.status === "posted").length,
    total: results.length,
    results,
  });
}
