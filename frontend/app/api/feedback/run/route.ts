// Cron: Weekly feedback loop — LLM pattern mining
// Runs every Monday at 9am (vercel.json: 0 9 * * 1)
// Analyzes last 30 days of metrics, extracts winning patterns, writes to patterns table
import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@backend/supabase/service";
import { createPattern } from "@backend/queries/patterns";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || process.env.STUDIO_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();

  // Get metrics + reel data from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentMetrics, error } = await supabase
    .from("metrics")
    .select(`
      *,
      reel:reels(
        id,
        topic,
        channel_id,
        brief:briefs(payload)
      )
    `)
    .gte("captured_at", thirtyDaysAgo.toISOString())
    .order("captured_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!recentMetrics || recentMetrics.length === 0) {
    return NextResponse.json({
      patterns: 0,
      message: "No metrics data for analysis",
    });
  }

  // Group metrics by reel and compute aggregates
  const reelAggregates = new Map<
    string,
    {
      reelId: string;
      channelId: string;
      topic: string;
      cluster: string;
      totalReach: number;
      avgHookRate: number;
      totalSaves: number;
      metricCount: number;
    }
  >();

  for (const m of recentMetrics) {
    const reel = m.reel as any;
    if (!reel) continue;

    const existing = reelAggregates.get(reel.id);
    const cluster =
      reel.brief?.payload?.cluster || "uncategorized";

    if (existing) {
      existing.totalReach += m.reach || 0;
      existing.avgHookRate =
        (existing.avgHookRate * existing.metricCount + (m.hook_rate || 0)) /
        (existing.metricCount + 1);
      existing.totalSaves += m.saves || 0;
      existing.metricCount++;
    } else {
      reelAggregates.set(reel.id, {
        reelId: reel.id,
        channelId: reel.channel_id,
        topic: reel.topic,
        cluster,
        totalReach: m.reach || 0,
        avgHookRate: m.hook_rate || 0,
        totalSaves: m.saves || 0,
        metricCount: 1,
      });
    }
  }

  // Group by cluster and find winners / losers
  const clusterStats = new Map<
    string,
    {
      cluster: string;
      reelIds: string[];
      channelIds: Set<string>;
      avgHookRate: number;
      avgSaveRate: number;
      totalReach: number;
      count: number;
    }
  >();

  const allReels = Array.from(reelAggregates.values());
  const globalAvgHook =
    allReels.reduce((s, r) => s + r.avgHookRate, 0) / allReels.length || 1;

  for (const reel of allReels) {
    const existing = clusterStats.get(reel.cluster);
    const saveRate =
      reel.totalReach > 0 ? (reel.totalSaves / reel.totalReach) * 100 : 0;

    if (existing) {
      existing.reelIds.push(reel.reelId);
      existing.channelIds.add(reel.channelId);
      existing.avgHookRate =
        (existing.avgHookRate * existing.count + reel.avgHookRate) /
        (existing.count + 1);
      existing.avgSaveRate =
        (existing.avgSaveRate * existing.count + saveRate) /
        (existing.count + 1);
      existing.totalReach += reel.totalReach;
      existing.count++;
    } else {
      clusterStats.set(reel.cluster, {
        cluster: reel.cluster,
        reelIds: [reel.reelId],
        channelIds: new Set([reel.channelId]),
        avgHookRate: reel.avgHookRate,
        avgSaveRate: saveRate,
        totalReach: reel.totalReach,
        count: 1,
      });
    }
  }

  // Generate patterns for clusters with significant data
  let patternsCreated = 0;
  const patternResults: { cluster: string; kind: string; lift: number }[] = [];

  for (const [, stats] of clusterStats) {
    if (stats.count < 3) continue; // Need at least 3 reels per cluster

    const hookLift =
      ((stats.avgHookRate - globalAvgHook) / globalAvgHook) * 100;

    const kind: "hook" | "format" | "topic" =
      Math.abs(hookLift) > 15 ? "hook" : "topic";

    const summary =
      hookLift > 0
        ? `"${stats.cluster}" cluster outperforming avg by ${hookLift.toFixed(1)}% hook rate across ${stats.count} reels`
        : `"${stats.cluster}" cluster underperforming avg by ${Math.abs(hookLift).toFixed(1)}% — consider throttling`;

    // Pick a representative channel_id (first one)
    const channelId = Array.from(stats.channelIds)[0];

    try {
      await createPattern({
        channelId,
        kind,
        summary,
        liftPct: Math.round(hookLift * 100) / 100,
        evidenceReelIds: stats.reelIds.slice(0, 5),
      });
      patternsCreated++;
      patternResults.push({ cluster: stats.cluster, kind, lift: hookLift });
    } catch {
      // Pattern creation may fail if schema doesn't match; log but continue
    }
  }

  return NextResponse.json({
    patterns: patternsCreated,
    totalClusters: clusterStats.size,
    totalReels: reelAggregates.size,
    details: patternResults,
  });
}
