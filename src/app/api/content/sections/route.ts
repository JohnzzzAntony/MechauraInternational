/**
 * /api/content/sections
 * GET  → Returns all SectionConfig rows ordered by `order`
 * PUT  → Batch upsert for reordering + visibility updates
 */
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export const SECTION_DEFAULTS: Array<{
  id: string;
  label: string;
  order: number;
  visible: boolean;
}> = [
  { id: "hero",          label: "Hero Banner",      order: 0,  visible: true },
  { id: "about",         label: "About Us",          order: 1,  visible: true },
  { id: "services",      label: "Services",          order: 2,  visible: true },
  { id: "products",      label: "Products",          order: 3,  visible: true },
  { id: "industries",    label: "Industries",        order: 4,  visible: true },
  { id: "why-choose-us", label: "Why Choose Us",     order: 5,  visible: true },
  { id: "process",       label: "Our Process",       order: 6,  visible: true },
  { id: "brands",        label: "Partner Brands",    order: 7,  visible: true },
  { id: "testimonials",  label: "Testimonials",      order: 8,  visible: true },
  { id: "insights",      label: "Insights",          order: 9,  visible: true },
  { id: "cta",           label: "CTA Banner",        order: 10, visible: true },
  { id: "contact",       label: "Contact Form",      order: 11, visible: true },
];

async function ensureDefaults() {
  const existing = await db.sectionConfig.findMany();
  const existingIds = new Set(existing.map((s) => s.id));
  const missing = SECTION_DEFAULTS.filter((d) => !existingIds.has(d.id));
  if (missing.length > 0) {
    await db.sectionConfig.createMany({ data: missing, skipDuplicates: true });
  }
}

export async function GET() {
  try {
    await ensureDefaults();
    const sections = await db.sectionConfig.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sections);
  } catch (err) {
    console.error("[api/content/sections] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // body can be a single item { id, visible, order } or an array for batch reorder
    const items: Array<{ id: string; visible?: boolean; order?: number; label?: string }> =
      Array.isArray(body) ? body : [body];

    await Promise.all(
      items.map((item) =>
        db.sectionConfig.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            visible: item.visible ?? true,
            order: item.order ?? 0,
            label: item.label ?? item.id,
          },
          update: {
            ...(item.visible !== undefined ? { visible: item.visible } : {}),
            ...(item.order !== undefined ? { order: item.order } : {}),
            ...(item.label !== undefined ? { label: item.label } : {}),
          },
        })
      )
    );

    revalidateTag("sections");
    const sections = await db.sectionConfig.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(sections);
  } catch (err) {
    console.error("[api/content/sections] PUT error:", err);
    return NextResponse.json({ error: "Failed to update sections" }, { status: 500 });
  }
}
