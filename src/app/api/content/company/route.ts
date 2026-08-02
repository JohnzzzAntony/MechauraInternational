/**
 * /api/content/company
 * GET  → Returns current company settings + partner brands
 * PUT  → Update company settings + partner brands
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedCompany, seedPartnerBrands } from "@/lib/content";

const DEFAULT_COMPANY = {
  id: "main",
  name: seedCompany.name,
  shortName: seedCompany.shortName,
  legalEntity: seedCompany.legalEntity,
  tagline: seedCompany.tagline,
  description: seedCompany.description,
  foundedYear: seedCompany.foundedYear,
  headquarters: seedCompany.headquarters,
  phone: seedCompany.phone,
  phoneRaw: seedCompany.phoneRaw,
  email: seedCompany.email,
  hours: seedCompany.hours,
  linkedinUrl: seedCompany.social.linkedin,
  instagramUrl: seedCompany.social.instagram,
  facebookUrl: seedCompany.social.facebook,
  whatsappUrl: seedCompany.social.whatsapp,
  partnerBrands: seedPartnerBrands,
};

export async function GET() {
  try {
    const row = await db.company.findUnique({ where: { id: "main" } });
    if (!row) {
      // Auto-seed on first request
      const created = await db.company.create({ data: DEFAULT_COMPANY });
      return NextResponse.json(toClient(created));
    }
    return NextResponse.json(toClient(row));
  } catch (err) {
    console.error("[api/content/company] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const row = await db.company.upsert({
      where: { id: "main" },
      create: { ...DEFAULT_COMPANY, ...flattenForDB(body) },
      update: flattenForDB(body),
    });
    return NextResponse.json(toClient(row));
  } catch (err) {
    console.error("[api/content/company] PUT error:", err);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

// Convert nested social object → flat DB columns
function flattenForDB(body: any) {
  const out: any = { ...body };
  if (body.social) {
    out.linkedinUrl = body.social.linkedin;
    out.instagramUrl = body.social.instagram;
    out.facebookUrl = body.social.facebook;
    out.whatsappUrl = body.social.whatsapp;
    delete out.social;
  }
  return out;
}

// Convert flat DB row → nested client shape
function toClient(row: any) {
  return {
    name: row.name,
    shortName: row.shortName,
    legalEntity: row.legalEntity,
    tagline: row.tagline,
    description: row.description,
    foundedYear: row.foundedYear,
    headquarters: row.headquarters,
    phone: row.phone,
    phoneRaw: row.phoneRaw,
    email: row.email,
    hours: row.hours,
    social: {
      linkedin: row.linkedinUrl,
      instagram: row.instagramUrl,
      facebook: row.facebookUrl,
      whatsapp: row.whatsappUrl,
    },
    partnerBrands: row.partnerBrands,
  };
}
