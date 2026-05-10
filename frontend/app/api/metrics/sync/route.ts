// Cron: Sync Instagram Insights metrics
// Runs every hour (vercel.json: 0 * * * *)
// Pulls reach, plays, saves, shares, hook_rate for posted reels
import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@backend/supabase/service";
import { createMetric } from "@backend/queries/metrics";
import { decrypt } from "@backend/auth/encrypt";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || process.env.STUDIO_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();

  // Get posted reels from the last 7 days that have an ig_media_id
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: postedReels, error } = await supabase
    .from("reels")
    .select(`
      id,
      ig_media_id,
      posted_at,
      channel:channels(ig_user_id, access_token_enc)
    `)
    .in("stage", ["posted", "analyzed"])
    .not("ig_media_id", "is", null)
    .gte("posted_at", sevenDaysAgo.toISOString())
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!postedReels || postedReels.length === 0) {
    return NextResponse.json({ synced: 0, message: "No reels to sync" });
  }

  let synced = 0;
  const errors: string[] = [];

  for (const reel of postedReels) {
    const channel = reel.channel as any;

    if (!channel?.access_token_enc || !reel.ig_media_id) continue;

    try {
      const accessToken = await decrypt(channel.access_token_enc);

      // Pull insights from IG Graph API
      const insightsResponse = await fetch(
        `https://graph.facebook.com/v21.0/${reel.ig_media_id}/insights?metric=reach,plays,saved,shares&access_token=${accessToken}`
      );

      if (!insightsResponse.ok) {
        errors.push(`Failed to fetch insights for ${reel.id}`);
        continue;
      }

      const insightsData = await insightsResponse.json();
      const metrics: Record<string, number> = {};

      for (const metric of insightsData.data || []) {
        metrics[metric.name] = metric.values?.[0]?.value || 0;
      }

      // Calculate hook rate (3s retention) from plays vs reach
      const hookRate =
        metrics.reach > 0
          ? Math.round((metrics.plays / metrics.reach) * 100 * 100) / 100
          : 0;

      // Save to metrics table
      await createMetric({
        reelId: reel.id,
        reach: metrics.reach || 0,
        plays: metrics.plays || 0,
        saves: metrics.saved || 0,
        shares: metrics.shares || 0,
        hookRate,
      });

      synced++;
    } catch (err) {
      errors.push(
        `Error syncing ${reel.id}: ${err instanceof Error ? err.message : "Unknown"}`
      );
    }
  }

  return NextResponse.json({
    synced,
    total: postedReels.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
