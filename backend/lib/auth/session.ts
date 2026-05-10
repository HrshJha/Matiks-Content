// Resilient session handling with developer bypass/fallback for the demo prototype.
// This ensures the dashboard is accessible even if Supabase Auth is not fully configured.

export async function getSession() {
  try {
    // In a real production app, we would use:
    // const supabase = createServerSupabaseClient()
    // const { data: { session } } = await supabase.auth.getSession()
    // return session

    // FOR DEMO PURPOSES: We return a consistent, valid UUID-based user session.
    // This UUID matches the owner_id used in the seeding scripts.
    return {
      user: { 
        id: "00000000-0000-0000-0000-000000000001", 
        email: "demo@matiks.ai" 
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    }
  } catch (error) {
    console.warn("Session retrieval failed, falling back to demo user.");
    return {
      user: { 
        id: "00000000-0000-0000-0000-000000000001", 
        email: "demo@matiks.ai" 
      },
    }
  }
}

export async function requireUserId() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: No session found");
  }
  return session.user.id;
}