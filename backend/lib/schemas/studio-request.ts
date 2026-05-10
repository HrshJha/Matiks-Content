import { z } from "zod";

export const studioRequestSchema = z.object({
  channelHandle: z.string().min(1),
  niche: z.string().min(1),
  format: z.string().min(1),
  trend: z.string().min(1),
  language: z.enum(["EN", "HI"]),
});

export type StudioRequest = z.infer<typeof studioRequestSchema>;