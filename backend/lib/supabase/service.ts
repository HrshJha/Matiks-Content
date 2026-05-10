import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
}

function getServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
}

export function createServiceSupabaseClient() {
  return createClient(
    getSupabaseUrl(),
    getServiceKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}