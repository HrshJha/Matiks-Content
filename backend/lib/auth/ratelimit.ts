import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful fallback for local development without Upstash credentials
const isUpstashConfigured = () => {
  return process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
};

// Create a new ratelimiter, that allows 10 requests per 10 seconds per IP
export const aiStudioRateLimit = isUpstashConfigured() 
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute for AI generation
      analytics: true,
      prefix: "@upstash/ratelimit",
    })
  : null;

export async function checkStudioRateLimit(identifier: string) {
  if (!aiStudioRateLimit) {
    // If not configured, allow bypass
    return { success: true, limit: 10, remaining: 9, reset: Date.now() + 60000 };
  }
  
  const { success, limit, remaining, reset } = await aiStudioRateLimit.limit(identifier);
  
  return {
    success,
    limit,
    remaining,
    reset
  };
}
