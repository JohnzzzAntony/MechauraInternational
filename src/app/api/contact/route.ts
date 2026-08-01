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

    // In a production deployment this would:
    //   1. Persist the inquiry to PostgreSQL via Prisma
    //   2. Dispatch a notification email to info@mechaurainternational.com
    //   3. Trigger a confirmation email to the submitter
    //   4. Optionally post to CRM / WhatsApp Business API
    //
    // For this preview environment we log a sanitized summary so the
    // flow is verifiable end-to-end without external credentials.
    console.log("[contact] New inquiry received:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      productCategory: data.productCategory || null,
      messageLength: data.message.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Inquiry received. Our team will respond within one business day.",
      reference: `MCH-${Date.now().toString(36).toUpperCase()}`,
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
