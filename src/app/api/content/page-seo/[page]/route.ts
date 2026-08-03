/**
 * /api/content/page-seo/[page]
 * GET  → Returns PageSeo for a given page slug (creates default if missing)
 * PUT  → Upserts and revalidates the "seo-{page}" cache tag
 *
 * Valid page slugs: home | about | products | services | industries | insights | contact
 */
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

const DEFAULTS: Record<string, { title: string; description: string }> = {
  home: {
    title: "Mechaura International | Industrial Supplier UAE — Tools, Brushes & Equipment",
    description:
      "UAE-based industrial supplier delivering high-quality tools, specialized brushes, and industrial equipment across the GCC. Competitive pricing. On-time delivery.",
  },
  about: {
    title: "About Mechaura International | Industrial Partner in Ajman Free Zone",
    description:
      "Learn about Mechaura International FZE LLC — your trusted industrial partner based in Ajman Free Zone, UAE. Quality supply, fast delivery across the GCC.",
  },
  products: {
    title: "Industrial Products | Brushes, Bearings, Cutting Tools — Mechaura International",
    description:
      "Browse Mechaura International's product catalog: abrasive brushes, bearings, hydraulic hose, bandsaw blades, elevator accessories, and more.",
  },
  services: {
    title: "Industrial Services | Tools, Equipment & Brush Supply — Mechaura International",
    description:
      "Explore our industrial services: precision tool supply, specialized brush solutions, and equipment sourcing for manufacturing and engineering sectors in the UAE.",
  },
  industries: {
    title: "Industries Served | Manufacturing, Oil & Gas, Construction — Mechaura International",
    description:
      "Mechaura International serves manufacturing, automotive, construction, oil & gas, and facility management industries across the UAE and GCC.",
  },
  insights: {
    title: "Industrial Insights & Technical Articles — Mechaura International",
    description:
      "Read practical guides on abrasive brush selection, bearing lubrication, hydraulic hose maintenance, and more from Mechaura International's technical team.",
  },
  contact: {
    title: "Contact Mechaura International | Get a Quote for Industrial Supplies",
    description:
      "Contact Mechaura International for industrial supply inquiries, product quotations, and technical guidance. Based in Ajman Free Zone, UAE.",
  },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  try {
    let row = await db.pageSeo.findUnique({ where: { id: page } });
    if (!row) {
      const defaults = DEFAULTS[page] ?? {
        title: `Mechaura International | ${page}`,
        description: "Industrial supplier based in Ajman Free Zone, UAE.",
      };
      row = await db.pageSeo.create({
        data: {
          id: page,
          ...defaults,
          ogImage: "/images/og/og-image.png",
          canonicalUrl: "",
          noIndex: false,
          structuredData: "",
        },
      });
    }
    return NextResponse.json(row);
  } catch (err) {
    console.error(`[api/content/page-seo/${page}] GET error:`, err);
    return NextResponse.json({ error: "Failed to fetch page SEO" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  try {
    const body = await request.json();
    const { id: _id, updatedAt: _u, ...data } = body;

    const defaults = DEFAULTS[page] ?? { title: "", description: "" };
    const row = await db.pageSeo.upsert({
      where: { id: page },
      create: {
        id: page,
        ...defaults,
        ogImage: "/images/og/og-image.png",
        canonicalUrl: "",
        noIndex: false,
        structuredData: "",
        ...data,
      },
      update: data,
    });

    revalidateTag(`seo-${page}`);
    return NextResponse.json(row);
  } catch (err) {
    console.error(`[api/content/page-seo/${page}] PUT error:`, err);
    return NextResponse.json({ error: "Failed to update page SEO" }, { status: 500 });
  }
}
