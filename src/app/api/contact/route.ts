import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  company: z.string().max(100).optional().or(z.literal("")),
  productCategory: z.string().optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid submission. Please review the form and try again.",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const reference = `MCH-${Date.now().toString(36).toUpperCase()}`;
    const id = `inq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    // Persist to Neon PostgreSQL
    const inquiry = await db.inquiry.create({
      data: {
        id,
        reference,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || "",
        productCategory: data.productCategory || "",
        message: data.message,
        status: "new",
      },
    });

    console.log("[contact] New inquiry saved to DB:", {
      reference: inquiry.reference,
      name: inquiry.name,
      email: inquiry.email,
    });

    return NextResponse.json({
      ok: true,
      message: "Inquiry received. Our team will respond within one business day.",
      reference,
      inquiryId: inquiry.id,
    });
  } catch (err: any) {
    console.error("[contact] Submission error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't process your submission. Please try again or email us directly.",
      },
      { status: 500 },
    );
  }
}

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
    console.error("[contact] GET error:", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
