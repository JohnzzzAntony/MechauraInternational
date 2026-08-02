/**
 * /api/content/values
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedValues } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.value.count();
  if (count === 0) {
    await db.value.createMany({
      data: seedValues.map((v, i) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        icon: v.icon,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.value.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/values] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const maxOrder = await db.value.aggregate({ _max: { order: true } });
    const row = await db.value.upsert({
      where: { id },
      create: { id, ...data, order: (maxOrder._max.order ?? -1) + 1 },
      update: data,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/values] POST error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const row = await db.value.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/values] PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.value.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/values] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
