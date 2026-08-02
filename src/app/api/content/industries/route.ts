export const dynamic = "force-dynamic";
/**
 * /api/content/industries
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedIndustries } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.industry.count();
  if (count === 0) {
    await db.industry.createMany({
      data: seedIndustries.map((ind, i) => ({
        id: ind.id,
        slug: ind.slug,
        name: ind.name,
        description: ind.description,
        icon: ind.icon,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.industry.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/industries] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const maxOrder = await db.industry.aggregate({ _max: { order: true } });
    const row = await db.industry.upsert({
      where: { id },
      create: { id, ...data, order: (maxOrder._max.order ?? -1) + 1 },
      update: data,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/industries] POST error:", err);
    return NextResponse.json({ error: "Failed to save industry" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const row = await db.industry.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/industries] PUT error:", err);
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.industry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/industries] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}

