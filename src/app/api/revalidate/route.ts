/**
 * /api/revalidate
 * POST { tag: string } with X-Revalidate-Secret header → purge a Next.js cache tag
 * Used by the admin panel or external webhooks to force ISR re-generation.
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const VALID_TAGS = [
  "hero", "sections", "company", "hero-stats",
  "values", "services", "products", "industries",
  "why-choose-us", "process-steps", "testimonials",
  "insights", "seo-home", "seo-about", "seo-products",
  "seo-services", "seo-industries", "seo-insights", "seo-contact",
];

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    // In development without secret configured, allow all revalidations
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 500 });
    }
  } else if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tag, tags } = body as { tag?: string; tags?: string[] };

    const toRevalidate: string[] = [];
    if (tag && VALID_TAGS.includes(tag)) toRevalidate.push(tag);
    if (tags) toRevalidate.push(...tags.filter((t) => VALID_TAGS.includes(t)));

    if (toRevalidate.length === 0) {
      return NextResponse.json({ error: "No valid tags provided" }, { status: 400 });
    }

    toRevalidate.forEach(revalidateTag);

    return NextResponse.json({
      revalidated: true,
      tags: toRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[api/revalidate] error:", err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
