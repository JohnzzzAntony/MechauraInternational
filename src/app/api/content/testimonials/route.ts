/**
 * /api/content/testimonials
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedTestimonials } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.testimonial.count();
  if (count === 0) {
    await db.testimonial.createMany({
      data: seedTestimonials.map((t, i) => ({
        id: t.id,
        quote: t.quote,
        name: t.name,
        company: t.company,
        initials: t.initials,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/testimonials] GET error:", err);
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
    const maxOrder = await db.testimonial.aggregate({ _max: { order: true } });
    const row = await db.testimonial.upsert({
      where: { id },
      create: { id, ...data, order: (maxOrder._max.order ?? -1) + 1 },
      update: data,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/testimonials] POST error:", err);
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
    const row = await db.testimonial.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/testimonials] PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/testimonials] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
