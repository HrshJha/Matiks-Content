import { z } from "zod";

export const REEL_STAGES = [
  "idea",
  "research",
  "scripted",
  "voiceover",
  "assets",
  "rendered",
  "queued",
  "analyzed",
] as const;

export const reelSchema = z.object({
  id: z.string().uuid().optional(),
  channelId: z.string().uuid(),
  briefId: z.string().uuid().optional(),
  topic: z.string().min(1),
  stage: z.enum(REEL_STAGES).default("idea"),
  score: z.number().int().min(0).max(100).optional(),
  scheduledFor: z.string().datetime().optional(),
  postedAt: z.string().datetime().optional(),
  igMediaId: z.string().optional(),
});

export type Reel = z.infer<typeof reelSchema>;

export const createReelSchema = reelSchema.omit({ id: true, postedAt: true });

export type CreateReel = z.infer<typeof createReelSchema>;

export const updateReelStageSchema = z.object({
  stage: z.enum(REEL_STAGES),
});

export type UpdateReelStage = z.infer<typeof updateReelStageSchema>;

export const STAGE_TRANSITIONS: Record<string, string[]> = {
  idea: ["research"],
  research: ["scripted"],
  scripted: ["voiceover"],
  voiceover: ["assets"],
  assets: ["rendered"],
  rendered: ["queued"],
  queued: ["analyzed"],
  analyzed: [],
};

export function isValidStageTransition(
  from: string,
  to: string
): boolean {
  return STAGE_TRANSITIONS[from]?.includes(to) ?? false;
}