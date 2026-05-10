import { createClient } from "@supabase/supabase-js";
import { CHANNELS, REELS } from "../lib/data";
import * as dotenv from "dotenv";
import { join } from "path";

// Load environment variables from the frontend directory since that's where .env is usually kept in this monorepo
dotenv.config({ path: join(__dirname, "../../frontend/.env") });
dotenv.config({ path: join(__dirname, "../../frontend/.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env");
  process.exit(1);
}

// Use service role key to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// We need a dummy owner_id since we bypass auth for seeding
const DEMO_OWNER_ID = "00000000-0000-0000-0000-000000000001";

async function main() {
  console.log("🌱 Starting Matiks Content OS Data Seed...");

  // 1. Seed Channels
  console.log("\\n📦 Seeding Channels...");
  for (const channel of CHANNELS) {
    const { error } = await supabase
      .from("channels")
      .upsert({
        id: channel.id,
        owner_id: DEMO_OWNER_ID,
        handle: channel.handle,
        niche: channel.niche,
        language: channel.language,
        status: channel.status === "live" ? "active" : channel.status === "ramping" ? "warming" : "paused",
        followers: channel.followers,
        d7_reach: channel.d7Reach,
        hook_rate: channel.hookRate,
        save_rate: channel.saveRate,
        voice_id: channel.voice,
        ig_user_id: "demo_ig_" + channel.handle,
        access_token_enc: "encrypted_dummy_token",
      });

    if (error) {
      console.error("❌ Failed to seed channel " + channel.handle + ":", error.message);
    } else {
      console.log("✅ Seeded channel " + channel.handle);
    }
  }

  // 2. Seed Reels
  console.log("\\n🎞️ Seeding Reels...");
  for (const reel of REELS) {
    const { error } = await supabase
      .from("reels")
      .upsert({
        id: reel.id,
        channel_id: reel.channelId,
        brief_id: null,
        stage: reel.stage,
        topic: reel.hook,
        scheduled_for: (reel.stage as string) === "queued" ? new Date(Date.now() + 86400000).toISOString() : null,
        posted_at: (reel.stage as string) === "posted" ? new Date(Date.now() - 86400000).toISOString() : null,
        ig_media_id: (reel.stage as string) === "posted" ? "demo_ig_media_" + reel.id : null,
        updated_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 172800000).toISOString(),
      });

    if (error) {
      console.error("❌ Failed to seed reel " + reel.id + ":", error.message);
    } else {
      console.log("✅ Seeded reel " + reel.id + " (" + reel.stage + ")");
    }

    // 3. Seed Metrics for posted (analyzed) reels
    if (reel.stage === "analyzed" && reel.views) {
      const channel = CHANNELS.find(c => c.id === reel.channelId);
      const { error: metricError } = await supabase
        .from("metrics")
        .upsert({
          reel_id: reel.id,
          reach: Math.floor(reel.views * 1.1),
          plays: reel.views,
          likes: Math.floor(reel.views * 0.05),
          saves: Math.floor(reel.views * ((reel.saveRate || 5) / 100)),
          shares: Math.floor(reel.views * 0.02),
          comments: Math.floor(reel.views * 0.005),
          follows: Math.floor(reel.views * 0.01),
          hook_rate: channel?.hookRate || 65,
          captured_at: new Date().toISOString(),
        });

      if (metricError) {
        console.error("❌ Failed to seed metrics for reel " + reel.id + ":", metricError.message);
      }
    }
  }

  console.log("\\n✨ Seeding completed successfully!");
}

main().catch(console.error);
