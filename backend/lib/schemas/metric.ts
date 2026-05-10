import { z } from "zod";

export const metricSchema = z.object({
  id: z.string().uuid().optional(),
  reelId: z.string().uuid(),
  capturedAt: z.string().datetime().default(() => new Date().toISOString()),
  reach: z.number().int().min(0).default(0),
  plays: z.number().int().min(0).default(0),
  likes: z.number().int().min(0).default(0),
  saves: z.number().int().min(0).default(0),
  shares: z.number().int().min(0).default(0),
  comments: z.number().int().min(0).default(0),
  follows: z.number().int().min(0).default(0),
  hookRate: z.number().min(0).max(100).default(0),
});

export type Metric = z.infer<typeof metricSchema>;

export const createMetricSchema = metricSchema.omit({ id: true });

export type CreateMetric = z.infer<typeof createMetricSchema>;