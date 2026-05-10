import { z } from "zod";

export const patternSchema = z.object({
  id: z.string().uuid().optional(),
  channelId: z.string().uuid().optional(),
  kind: z.enum(["hook", "format", "topic"]),
  summary: z.string().min(1),
  liftPct: z.number().optional(),
  evidenceReelIds: z.array(z.string().uuid()).default([]),
});

export type Pattern = z.infer<typeof patternSchema>;

export const createPatternSchema = patternSchema.omit({ id: true });

export type CreatePattern = z.infer<typeof createPatternSchema>;