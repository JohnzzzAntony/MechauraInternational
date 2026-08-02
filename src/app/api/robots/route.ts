import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://mechaurainternational.com";

  const robots = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/
  `.trim();

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}