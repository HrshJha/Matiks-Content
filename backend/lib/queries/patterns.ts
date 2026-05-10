import { createServiceSupabaseClient } from "../supabase/service";
import { createPatternSchema } from "../schemas/pattern";
import { z } from "zod";

export async function getPatternsByChannel(channelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("patterns")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getGlobalPatterns() {
  const supabase = createServiceSupabaseClient();
  
  // Get patterns that are channel-agnostic
  const { data, error } = await supabase
    .from("patterns")
    .select("*")
    .is("channel_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPattern(input: z.infer<typeof createPatternSchema>) {
  const supabase = createServiceSupabaseClient();
  
  const validated = createPatternSchema.parse(input);
  
  const { data, error } = await supabase
    .from("patterns")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTopPatterns(ownerId: string, limit = 3) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("patterns")
    .select(`
      *,
      channel:channels(handle)
    `)
    .eq("channels.owner_id", ownerId)
    .not("lift_pct", "is", null)
    .order("lift_pct", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}