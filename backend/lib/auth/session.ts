import { createServerSupabaseClient } from "../supabase/server";

const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";
};

export async function getSession() {
  // Bypass auth if Supabase isn't configured (dev mode)
  if (!isSupabaseConfigured()) {
    return {
      user: { id: "dev-user-001" },
      expires_at: Date.now() + 86400000,
    } as any;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}

export async function requireSession() {
  const session = await getSession();
  
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function getUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}

export async function requireUserId() {
  const session = await requireSession();
  if (!session.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
}