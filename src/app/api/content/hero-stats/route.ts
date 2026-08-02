/**
 * /api/content/hero-stats
 * GET → All stats
 * PUT → Update a stat (id + patch in body)
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedStats } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.heroStat.count();
  if (count === 0) {
    await db.heroStat.createMany({
      data: seedStats.map((s, i) => ({
        id: s.id,
        value: s.value,
        suffix: s.suffix,
        label: s.label,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.heroStat.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/hero-stats] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const row = await db.heroStat.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/hero-stats] PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
