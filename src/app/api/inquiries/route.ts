import { NextResponse } from "next/server";

// Reuses the same in-memory store as /api/contact
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

export async function GET() {
  const list = getStore();
  return NextResponse.json({
    ok: true,
    inquiries: list,
    count: list.length,
    newCount: list.filter((i) => i.status === "new").length,
  });
}
