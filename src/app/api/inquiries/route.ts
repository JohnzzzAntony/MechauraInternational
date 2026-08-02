/**
 * /api/content/inquiries
 * GET    → All inquiries (ordered newest first)
 * PUT    → Update inquiry status { id, status }
 * DELETE → Delete an inquiry { id }
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const inquiries = await db.inquiry.findMany({
      orderBy: { receivedAt: "desc" },
    });
    return NextResponse.json({
      ok: true,
      inquiries,
      count: inquiries.length,
      newCount: inquiries.filter((i) => i.status === "new").length,
    });
  } catch (err) {
    console.error("[api/content/inquiries] GET error:", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const row = await db.inquiry.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true, inquiry: row });
  } catch (err) {
    console.error("[api/content/inquiries] PUT error:", err);
    return NextResponse.json({ ok: false, error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.inquiry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/content/inquiries] DELETE error:", err);
    return NextResponse.json({ ok: false, error: "Failed to delete inquiry" }, { status: 500 });
  }
}
