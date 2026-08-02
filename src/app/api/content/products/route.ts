export const dynamic = "force-dynamic";
/**
 * /api/content/products
 * GET    → All products ordered by `order`
 * POST   → Create or upsert a product
 * PUT    → Update a product (requires id in body)
 * DELETE → Delete a product (requires id in body)
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedProducts } from "@/lib/content";

async function ensureSeeded() {
  const count = await db.product.count();
  if (count === 0) {
    await db.product.createMany({
      data: seedProducts.map((p, i) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        applications: p.applications,
        typicalApplications: p.typicalApplications,
        subProducts: p.subProducts,
        materials: p.materials,
        brands: p.brands,
        icon: p.icon,
        image: p.image,
        order: i,
      })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.product.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[api/content/products] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const maxOrder = await db.product.aggregate({ _max: { order: true } });
    const row = await db.product.upsert({
      where: { id },
      create: { id, ...data, order: (maxOrder._max.order ?? -1) + 1 },
      update: data,
    });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/products] POST error:", err);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const row = await db.product.update({ where: { id }, data });
    return NextResponse.json(row);
  } catch (err) {
    console.error("[api/content/products] PUT error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/products] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

