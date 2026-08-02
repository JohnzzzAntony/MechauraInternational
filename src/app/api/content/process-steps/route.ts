/**
 * /api/content/process-steps
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedProcessSteps } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.processStep.count();
  if (count === 0) {
    await db.processStep.createMany({
      data: seedProcessSteps.map((ps, i) => ({
        id: ps.id,
        number: ps.number,
        title: ps.title,
        description: ps.description,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.processStep.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/process-steps] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const maxOrder = await db.processStep.aggregate({ _max: { order: true } });
    const row = await db.processStep.upsert({
      where: { id: body.id },
      create: { ...body, order: (maxOrder._max.order ?? -1) + 1 },
      update: body,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/process-steps] POST error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const row = await db.processStep.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/process-steps] PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.processStep.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/process-steps] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
