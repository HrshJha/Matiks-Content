import { z } from "zod";

export const reelBriefSchema = z.object({
  cluster: z.string().describe("Hook template / cluster name in 1-3 words"),
  hooks: z
    .array(z.string())
    .length(3)
    .describe("Three radically different ≤14-word hook lines"),
  script: z.object({
    hook: z.string().describe("Opening 6-8 seconds"),
    context: z.string().describe("Build, 6-10 seconds"),
    beats: z
      .array(
        z.object({
          line: z.string().describe("Voiceover line, ≤22 words"),
          broll: z.string().describe("B-roll prompt"),
        }),
      )
      .min(3)
      .max(4),
    cta: z.string().describe("Closing 3-5 seconds"),
  }),
  caption: z.string().max(220).describe("Instagram caption"),
  hashtags: z
    .array(z.string())
    .min(5)
    .max(10)
    .describe("5-10 lowercase hashtags"),
  voiceDirection: z.string().describe("Voice performance direction"),
  thumbnailPrompt: z.string().describe("Thumbnail image prompt"),
  riskNotes: z.string().describe("QA risk notes"),
});

export type ReelBrief = z.infer<typeof reelBriefSchema>;