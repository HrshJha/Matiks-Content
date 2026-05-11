import { createServiceSupabaseClient } from "../supabase/service";
import { createChannelSchema, updateChannelSchema } from "../schemas/channel";
import { z } from "zod";

type CreateChannelInput = z.infer<typeof createChannelSchema>;
type UpdateChannelInput = z.infer<typeof updateChannelSchema>;

type ChannelDbRow = {
  id: string;
  owner_id: string;
  handle: string;
  niche: string;
  language: string;
  status: string;
  followers: number;
  d7_reach: number | string | null;
  hook_rate: number | string | null;
  save_rate: number | string | null;
  voice_id?: string | null;
  posting_window?: string | null;
  queue_depth?: number | null;
  ig_user_id?: string | null;
  access_token_enc?: string | null;
  proxy_id?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ChannelRecord = {
  id: string;
  ownerId: string;
  handle: string;
  niche: string;
  language: string;
  status: string;
  followers: number;
  d7Reach: number;
  hookRate: number;
  saveRate: number;
  voiceId?: string;
  postingWindow?: string;
  queueDepth: number;
  igUserId?: string;
  accessTokenEnc?: string;
  proxyId?: string;
  createdAt?: string;
  updatedAt?: string;
  voice?: string;
  format?: string;
  cadence?: string;
  engineStack?: string[];
  ownerAgent?: string;
  [key: string]: unknown;
};

function fromChannelRow(row: ChannelDbRow): ChannelRecord {
  return {
    ...row,
    ownerId: row.owner_id,
    d7Reach: Number(row.d7_reach ?? 0),
    hookRate: Number(row.hook_rate ?? 0),
    saveRate: Number(row.save_rate ?? 0),
    voiceId: row.voice_id ?? undefined,
    postingWindow: row.posting_window ?? undefined,
    queueDepth: Number(row.queue_depth ?? 0),
    igUserId: row.ig_user_id ?? undefined,
    accessTokenEnc: row.access_token_enc ?? undefined,
    proxyId: row.proxy_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toChannelInsert(input: CreateChannelInput) {
  return {
    owner_id: input.ownerId,
    handle: input.handle,
    niche: input.niche,
    language: input.language,
    status: input.status,
    followers: input.followers,
    d7_reach: input.d7Reach,
    hook_rate: input.hookRate,
    save_rate: input.saveRate,
    voice_id: input.voiceId || null,
    posting_window: input.postingWindow || null,
    queue_depth: input.queueDepth,
    ig_user_id: input.igUserId || null,
  };
}

function toChannelUpdate(input: UpdateChannelInput) {
  return {
    ...(input.handle !== undefined ? { handle: input.handle } : {}),
    ...(input.niche !== undefined ? { niche: input.niche } : {}),
    ...(input.language !== undefined ? { language: input.language } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.followers !== undefined ? { followers: input.followers } : {}),
    ...(input.d7Reach !== undefined ? { d7_reach: input.d7Reach } : {}),
    ...(input.hookRate !== undefined ? { hook_rate: input.hookRate } : {}),
    ...(input.saveRate !== undefined ? { save_rate: input.saveRate } : {}),
    ...(input.voiceId !== undefined ? { voice_id: input.voiceId || null } : {}),
    ...(input.postingWindow !== undefined
      ? { posting_window: input.postingWindow || null }
      : {}),
    ...(input.queueDepth !== undefined ? { queue_depth: input.queueDepth } : {}),
    ...(input.igUserId !== undefined ? { ig_user_id: input.igUserId || null } : {}),
  };
}

export async function getChannelsByOwner(ownerId: string): Promise<ChannelRecord[]> {
  try {
    const supabase = createServiceSupabaseClient();
    
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(fromChannelRow);
  } catch (error) {
    // Detailed error logging for debugging
    console.error("❌ Supabase query failed:", error);
    console.warn("⚠️ Falling back to mock channels.");
    const { CHANNELS } = await import("../data");
    return CHANNELS as ChannelRecord[];
  }
}

export async function getChannelById(channelId: string): Promise<ChannelRecord | null> {
  const supabase = createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("id", channelId)
    .single();

  if (error) throw error;
  return data ? fromChannelRow(data) : data;
}

export async function createChannel(input: CreateChannelInput): Promise<ChannelRecord> {
  const supabase = createServiceSupabaseClient();
  
  const validated = createChannelSchema.parse(input);
  const row = toChannelInsert(validated);
  
  const { data, error } = await supabase
    .from("channels")
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return fromChannelRow(data);
}

export async function updateChannel(
  channelId: string,
  input: UpdateChannelInput
): Promise<ChannelRecord> {
  const supabase = createServiceSupabaseClient();
  
  const validated = updateChannelSchema.parse(input);
  const row = toChannelUpdate(validated);
  
  const { data, error } = await supabase
    .from("channels")
    .update(row)
    .eq("id", channelId)
    .select()
    .single();

  if (error) throw error;
  return fromChannelRow(data);
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
