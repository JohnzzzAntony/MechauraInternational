/**
 * /api/content/why-choose-us
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedWhyChooseUs } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.whyChooseUsItem.count();
  if (count === 0) {
    await db.whyChooseUsItem.createMany({
      data: seedWhyChooseUs.map((w, i) => ({
        id: w.id,
        title: w.title,
        description: w.description,
        icon: w.icon,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.whyChooseUsItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/why-choose-us] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const maxOrder = await db.whyChooseUsItem.aggregate({ _max: { order: true } });
    const row = await db.whyChooseUsItem.upsert({
      where: { id: body.id },
      create: { ...body, order: (maxOrder._max.order ?? -1) + 1 },
      update: body,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/why-choose-us] POST error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const row = await db.whyChooseUsItem.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/why-choose-us] PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.whyChooseUsItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/why-choose-us] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
