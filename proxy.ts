import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/sign-in", "/api/health", "/api/render/webhook", "/api/events"];
const PUBLIC_API_PREFIXES = ["/api/health", "/api/render/webhook"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API prefixes
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check for studio secret (cron jobs, webhooks)
  const authHeader = request.headers.get("authorization");
  if (pathname.startsWith("/api/") && authHeader) {
    if (authHeader === `Bearer ${process.env.STUDIO_SECRET}`) {
      return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};