import { z } from "zod";

export const briefSchema = z.object({
  id: z.string().uuid().optional(),
  channelId: z.string().uuid(),
  signalId: z.string().uuid().optional(),
  schemaVersion: z.number().int().default(1),
  payload: z.record(z.unknown()),
  model: z.string(),
  promptTokens: z.number().int().optional(),
  completionTokens: z.number().int().optional(),
  costUsd: z.number().optional(),
});

export type Brief = z.infer<typeof briefSchema>;

export const createBriefSchema = briefSchema.omit({ id: true });

export type CreateBrief = z.infer<typeof createBriefSchema>;