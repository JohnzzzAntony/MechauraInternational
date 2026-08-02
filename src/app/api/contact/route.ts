import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  company: z.string().max(100).optional().or(z.literal("")),
  productCategory: z.string().optional(),
  message: z.string().min(10).max(2000),
});

// In-memory inquiry store (persists for the lifetime of the dev server).
// In a production deployment this would be replaced with Prisma + PostgreSQL.
type Inquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  productCategory: string;
  message: string;
  receivedAt: string;
  status: "new" | "read" | "archived";
};

declare global {
  var __mechauraInquiries: Inquiry[] | undefined;
}

function getStore(): Inquiry[] {
  if (!globalThis.__mechauraInquiries) {
    globalThis.__mechauraInquiries = [];
  }
  return globalThis.__mechauraInquiries;
}

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
    const inquiry: Inquiry = {
      id: `inq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || "",
      productCategory: data.productCategory || "",
      message: data.message,
      receivedAt: new Date().toISOString(),
      status: "new",
    };

    getStore().unshift(inquiry);

    console.log("[contact] New inquiry received:", {
      reference: inquiry.reference,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      productCategory: inquiry.productCategory || null,
      messageLength: inquiry.message.length,
      timestamp: inquiry.receivedAt,
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
  return NextResponse.json({
    ok: true,
    inquiries: getStore(),
    count: getStore().length,
  });
}
