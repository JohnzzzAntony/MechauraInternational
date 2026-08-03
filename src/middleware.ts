import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting store (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("mechaura_admin_session");
    // If not present, we allow request through and let client-side session gate render the login view
  }

  // Security: Prevent access to sensitive files
  if (request.nextUrl.pathname.startsWith("/.env") ||
      request.nextUrl.pathname.startsWith("/.git") ||
      request.nextUrl.pathname.includes("node_modules")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};