export const dynamic = "force-dynamic";
/**
 * /api/content/services
 * GET    → All services ordered by `order`
 * POST   → Create or upsert a service
 * PUT    → Update a service (requires id in body)
 * DELETE → Delete a service (requires id in body)
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedServices } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.service.count();
  if (count === 0) {
    await db.service.createMany({
      data: seedServices.map((s, i) => ({
        id: s.id,
        number: s.number,
        title: s.title,
        summary: s.summary,
        description: s.description,
        features: s.features,
        icon: s.icon,
        image: s.image,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.service.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/services] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const maxOrder = await db.service.aggregate({ _max: { order: true } });
    const row = await db.service.upsert({
      where: { id },
      create: { id, ...data, order: (maxOrder._max.order ?? -1) + 1 },
      update: data,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/services] POST error:", err);
    return NextResponse.json({ error: "Failed to save service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const row = await db.service.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/services] PUT error:", err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/services] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}

