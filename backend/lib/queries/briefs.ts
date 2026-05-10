import { createServiceSupabaseClient } from "../supabase/service";
import { createBriefSchema } from "../schemas/brief";
import { z } from "zod";

export async function getBriefsByChannel(channelId: string, limit = 50) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getBriefById(briefId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("briefs")
    .select(`
      *,
      channel:channels(handle, niche)
    `)
    .eq("id", briefId)
    .single();

  if (error) throw error;
  return data;
}

export async function createBrief(input: z.infer<typeof createBriefSchema>) {
  const supabase = createServiceSupabaseClient();
  
  const validated = createBriefSchema.parse(input);
  
  const { data, error } = await supabase
    .from("briefs")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentBriefs(ownerId: string, limit = 10) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("briefs")
    .select(`
      *,
      channel:channels(handle)
    `)
    .eq("channels.owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}