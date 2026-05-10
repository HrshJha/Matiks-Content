import { createServiceSupabaseClient } from "../supabase/service";
import { createChannelSchema, updateChannelSchema } from "../schemas/channel";
import { z } from "zod";

export async function getChannelsByOwner(ownerId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChannelById(channelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("id", channelId)
    .single();

  if (error) throw error;
  return data;
}

export async function createChannel(input: z.infer<typeof createChannelSchema>) {
  const supabase = createServiceSupabaseClient();
  
  const validated = createChannelSchema.parse(input);
  
  const { data, error } = await supabase
    .from("channels")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChannel(
  channelId: string,
  input: z.infer<typeof updateChannelSchema>
) {
  const supabase = createServiceSupabaseClient();
  
  const validated = updateChannelSchema.parse(input);
  
  const { data, error } = await supabase
    .from("channels")
    .update(validated)
    .eq("id", channelId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChannel(channelId: string) {
  const supabase = createServiceSupabaseClient();
  
  const { error } = await supabase
    .from("channels")
    .delete()
    .eq("id", channelId);

  if (error) throw error;
  return true;
}