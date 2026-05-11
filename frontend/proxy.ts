import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@backend/auth/session";

const PUBLIC_PATHS = ["/sign-in", "/api/health", "/api/render/webhook", "/api/events"];
const PUBLIC_API_PREFIXES = ["/api/health", "/api/render/webhook"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;

  // 1. Handle Supabase session refreshing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co") {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    await supabase.auth.getUser();
  }

  // 2. Routing logic
  
  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return response;
  }

  // Allow public API prefixes
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return response;
  }

  // Check for studio secret (cron jobs, webhooks)
  const authHeader = request.headers.get("authorization");
  if (pathname.startsWith("/api/") && authHeader) {
    if (authHeader === `Bearer ${process.env.STUDIO_SECRET}`) {
      return response;
    }
  }

  // Check session for all other routes
  const session = await getSession();
  
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
