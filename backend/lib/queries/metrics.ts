import { createServiceSupabaseClient } from "../supabase/service";
import { createMetricSchema } from "../schemas/metric";
import { z } from "zod";

export async function getMetricsByReel(reelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("reel_id", reelId)
    .order("captured_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getLatestMetric(reelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("reel_id", reelId)
    .order("captured_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createMetric(input: z.infer<typeof createMetricSchema>) {
  const supabase = createServiceSupabaseClient();
  
  const validated = createMetricSchema.parse(input);
  
  const { data, error } = await supabase
    .from("metrics")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChannelMetrics(
  channelId: string,
  days = 7
) {
  const supabase = createServiceSupabaseClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from("metrics")
    .select(`
      *,
      reel:reels(topic, stage)
    `)
    .eq("reels.channel_id", channelId)
    .gte("captured_at", startDate.toISOString())
    .order("captured_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAggregateMetrics(ownerId: string) {
  const supabase = createServiceSupabaseClient();
  
  // Get all metrics for the last 7 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  const { data, error } = await supabase
    .from("metrics")
    .select(`
      *,
      reel:reels(
        channel:channels(owner_id)
      )
    `)
    .gte("captured_at", startDate.toISOString());

  if (error) throw error;
  return data;
}