import { createServiceSupabaseClient } from "../supabase/service";
import { createReelSchema, updateReelStageSchema, isValidStageTransition } from "../schemas/reel";
import { z } from "zod";

export async function getReelsByChannel(channelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("reels")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReelsByOwner(ownerId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("reels")
    .select(`
      *,
      channel:channels(handle, niche)
    `)
    .eq("channels.owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReelsByStage(stage: string, ownerId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("reels")
    .select(`
      *,
      channel:channels(handle, niche)
    `)
    .eq("stage", stage)
    .eq("channels.owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReelById(reelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("reels")
    .select(`
      *,
      channel:channels(handle, niche),
      brief:briefs(payload)
    `)
    .eq("id", reelId)
    .single();

  if (error) throw error;
  return data;
}

export async function createReel(input: z.infer<typeof createReelSchema>) {
  const supabase = createServiceSupabaseClient();
  
  const validated = createReelSchema.parse(input);
  
  const { data, error } = await supabase
    .from("reels")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReelStage(
  reelId: string,
  input: z.infer<typeof updateReelStageSchema>
) {
  const supabase = createServiceSupabaseClient();
  
  // Get current stage
  const { data: reel } = await supabase
    .from("reels")
    .select("stage")
    .eq("id", reelId)
    .single();
  
  if (!reel) throw new Error("REEL_NOT_FOUND");
  
  // Validate transition
  if (!isValidStageTransition(reel.stage, input.stage)) {
    throw new Error(`INVALID_STAGE_TRANSITION: ${reel.stage} -> ${input.stage}`);
  }
  
  const validated = updateReelStageSchema.parse(input);
  
  const { data, error } = await supabase
    .from("reels")
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reelId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function scheduleReel(reelId: string, scheduledFor: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("reels")
    .update({
      scheduled_for: scheduledFor,
      stage: "queued",
    })
    .eq("id", reelId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReel(reelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { error } = await supabase
    .from("reels")
    .delete()
    .eq("id", reelId);

  if (error) throw error;
  return true;
}