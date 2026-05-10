import { createClient } from "@supabase/supabase-js";
import { CHANNELS, REELS } from "../lib/data";
import * as dotenv from "dotenv";
import { join } from "path";

// Load environment variables from the frontend directory
dotenv.config({ path: join(__dirname, "../../frontend/.env") });
dotenv.config({ path: join(__dirname, "../../frontend/.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env");
  process.exit(1);
}

// Use service role key to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Synchronized Demo Owner UUID
const DEMO_OWNER_ID = "00000000-0000-0000-0000-000000000001";

async function main() {
  console.log("🌱 Starting Matiks Content OS Production-Grade Data Seed...");
  
  let successCount = 0;
  let failureCount = 0;

  // 0. Clean up dirty state
  console.log("\n🧹 Cleaning up existing demo data to prevent conflicts...");
  const handles = CHANNELS.map(c => c.handle);
  const { error: cleanupError } = await supabase
    .from("channels")
    .delete()
    .in("handle", handles);

  if (cleanupError) {
    console.warn("⚠️ Cleanup encountered an issue (can safely ignore if tables are empty):", cleanupError.message);
  } else {
    console.log("✅ Cleared old channels (and cascaded to reels/metrics).");
  }

  // 1. Seed Channels
  console.log("\n📦 Seeding Channels (Upserting)...");
  for (const channel of CHANNELS) {
    const { error } = await supabase
      .from("channels")
      .upsert(
        {
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
        },
        { onConflict: "owner_id,handle" }
      );

    if (error) {
      console.error(`❌ Failed to seed channel ${channel.handle}:`, error.message);
      failureCount++;
    } else {
      console.log(`✅ Seeded/Updated channel: ${channel.handle}`);
      successCount++;
    }
  }

  // 2. Seed Reels
  console.log("\n🎞️ Seeding Reels (Upserting)...");
  for (const reel of REELS) {
    const { error } = await supabase
      .from("reels")
      .upsert(
        {
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
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error(`❌ Failed to seed reel ${reel.id}:`, error.message);
      failureCount++;
    } else {
      console.log(`✅ Seeded/Updated reel: ${reel.id} (${reel.stage})`);
      successCount++;
    }

    // 3. Seed Metrics for analyzed reels
    if (reel.stage === "analyzed" && reel.views) {
      const { error: metricError } = await supabase
        .from("metrics")
        .insert({
          reel_id: reel.id,
          reach: Math.floor(reel.views * 1.1),
          plays: reel.views,
          likes: Math.floor(reel.views * 0.05),
          saves: Math.floor(reel.views * ((reel.saveRate || 5) / 100)),
          shares: Math.floor(reel.views * 0.02),
          comments: Math.floor(reel.views * 0.005),
          follows: Math.floor(reel.views * 0.01),
          hook_rate: 65,
          captured_at: new Date().toISOString(),
        });

      if (metricError) {
        console.error(`❌ Failed to seed metrics for reel ${reel.id}:`, metricError.message);
        failureCount++;
      }
    }
  }

  console.log("\n--- SEED SUMMARY ---");
  console.log(`✅ Successful Inserts: ${successCount}`);
  console.log(`❌ Failed Inserts:     ${failureCount}`);
  console.log("---------------------\n");

  if (failureCount > 0) {
    console.error("🛑 SEED FAILED: One or more inserts failed. Check logs above.");
    process.exit(1);
  } else {
    console.log("✨ SEED COMPLETED SUCCESSFULLY!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("🔥 UNHANDLED ERROR DURING SEED:", err);
  process.exit(1);
});
