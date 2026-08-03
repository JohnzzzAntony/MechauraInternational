/**
 * /api/content/hero
 * GET  → Returns the single HeroSection row (creates default if missing)
 * PUT  → Upserts and revalidates the Next.js "hero" cache tag
 */
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

const DEFAULTS = {
  id: "main",
  badgeText: "UAE-Based Industrial Supplier · Est. 2019",
  showBadge: true,
  headline: "Your Industrial Partner for Quality, Speed & Support",
  subheadline:
    "UAE-based industrial supplier delivering high-quality industrial equipment, tools, and specialized brushes across the GCC.",
  ctaPrimaryText: "Request a Quote",
  ctaPrimaryHref: "/contact",
  ctaSecondaryText: "Browse Products",
  ctaSecondaryHref: "/products",
  backgroundImage: "/images/hero/hero-bg.png",
  overlayOpacity: 0.55,
  showStats: true,
};

export async function GET() {
  try {
    let row = await db.heroSection.findUnique({ where: { id: "main" } });
    if (!row) {
      row = await db.heroSection.create({ data: DEFAULTS });
    }
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/hero] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch hero section" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id: _id, updatedAt: _u, ...data } = body;

    const row = await db.heroSection.upsert({
      where: { id: "main" },
      create: { ...DEFAULTS, ...data },
      update: data,
    });

    revalidateTag("hero");
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/hero] PUT error:", err);
    return NextResponse.json({ error: "Failed to update hero section" }, { status: 500 });
  }
}
