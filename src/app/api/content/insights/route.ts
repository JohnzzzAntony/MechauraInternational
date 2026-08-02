/**
 * /api/content/insights
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedInsights } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.insightPost.count();
  if (count === 0) {
    await db.insightPost.createMany({
      data: seedInsights.map((ins, i) => ({
        id: ins.id,
        title: ins.title,
        excerpt: ins.excerpt,
        category: ins.category,
        readTime: ins.readTime,
        date: ins.date,
        image: ins.image,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.insightPost.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/insights] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const maxOrder = await db.insightPost.aggregate({ _max: { order: true } });
    const row = await db.insightPost.upsert({
      where: { id: body.id },
      create: { ...body, order: (maxOrder._max.order ?? -1) + 1 },
      update: body,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/insights] POST error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const row = await db.insightPost.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/insights] PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.insightPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/insights] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
