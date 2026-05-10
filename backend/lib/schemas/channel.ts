import { z } from "zod";

export const channelSchema = z.object({
  id: z.string().uuid().optional(),
  handle: z.string().min(1).max(50),
  niche: z.string().min(1).max(100),
  language: z.enum(["EN", "HI", "ES", "PT"]).default("EN"),
  status: z.enum(["active", "paused", "warming"]).default("warming"),
  followers: z.number().int().min(0).default(0),
  d7Reach: z.number().int().min(0).default(0),
  hookRate: z.number().min(0).max(100).default(0),
  saveRate: z.number().min(0).max(100).default(0),
  voiceId: z.string().optional(),
  postingWindow: z.string().optional(),
  queueDepth: z.number().int().min(0).default(0),
  igUserId: z.string().optional(),
});

export type Channel = z.infer<typeof channelSchema>;

export const createChannelSchema = channelSchema.omit({ id: true }).extend({
  ownerId: z.string().uuid(),
});

export type CreateChannel = z.infer<typeof createChannelSchema>;

export const updateChannelSchema = channelSchema.partial().omit({ id: true });

export type UpdateChannel = z.infer<typeof updateChannelSchema>;