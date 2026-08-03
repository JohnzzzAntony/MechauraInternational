/**
 * Mechaura CMS Data — Server-side cached data fetching helpers
 *
 * All functions use Next.js unstable_cache with tag-based revalidation.
 * Call these ONLY from Server Components or generateMetadata().
 * The admin panel's Zustand store continues to handle client-side optimistic
 * updates; these helpers power the public-facing SSR pages.
 */

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  seedCompany,
  seedStats,
  seedValues,
  seedServices,
  seedProducts,
  seedIndustries,
  seedWhyChooseUs,
  seedProcessSteps,
  seedTestimonials,
  seedInsights,
  seedPartnerBrands,
} from "@/lib/content";

// ─── Hero Section ────────────────────────────────────────────────────────────

export const getHeroSection = unstable_cache(
  async () => {
    try {
      return await db.heroSection.findUnique({ where: { id: "main" } });
    } catch {
      return null;
    }
  },
  ["hero"],
  { tags: ["hero"] }
);

export const heroDefaults = {
  id: "main",
  headline: "Your Industrial Partner for Quality, Speed & Support",
  subheadline:
    "UAE-based industrial supplier delivering high-quality industrial equipment, tools, and specialized brushes across the GCC.",
  ctaPrimaryText: "Request a Quote",
  ctaPrimaryHref: "/contact",
  ctaSecondaryText: "Browse Products",
  ctaSecondaryHref: "/products",
  backgroundImage: "/images/hero/hero-bg.png",
  overlayOpacity: 0.55,
};

// ─── Section Config ──────────────────────────────────────────────────────────

export const getSections = unstable_cache(
  async () => {
    try {
      const rows = await db.sectionConfig.findMany({ orderBy: { order: "asc" } });
      return rows;
    } catch {
      return [];
    }
  },
  ["sections"],
  { tags: ["sections"] }
);

// ─── Company ─────────────────────────────────────────────────────────────────

export const getCompany = unstable_cache(
  async () => {
    try {
      const row = await db.company.findUnique({ where: { id: "main" } });
      if (!row) return null;
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
    } catch {
      return null;
    }
  },
  ["company"],
  { tags: ["company"] }
);

// ─── Hero Stats ───────────────────────────────────────────────────────────────

export const getHeroStats = unstable_cache(
  async () => {
    try {
      const rows = await db.heroStat.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedStats;
    } catch {
      return seedStats;
    }
  },
  ["hero-stats"],
  { tags: ["hero-stats"] }
);

// ─── Values ──────────────────────────────────────────────────────────────────

export const getValues = unstable_cache(
  async () => {
    try {
      const rows = await db.value.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedValues;
    } catch {
      return seedValues;
    }
  },
  ["values"],
  { tags: ["values"] }
);

// ─── Services ────────────────────────────────────────────────────────────────

export const getServices = unstable_cache(
  async () => {
    try {
      const rows = await db.service.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedServices;
    } catch {
      return seedServices;
    }
  },
  ["services"],
  { tags: ["services"] }
);

// ─── Products ────────────────────────────────────────────────────────────────

export const getProducts = unstable_cache(
  async () => {
    try {
      const rows = await db.product.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedProducts;
    } catch {
      return seedProducts;
    }
  },
  ["products"],
  { tags: ["products"] }
);

export const getProduct = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        return await db.product.findUnique({ where: { slug } });
      } catch {
        return null;
      }
    },
    [`product-${slug}`],
    { tags: ["products"] }
  )();

// ─── Industries ──────────────────────────────────────────────────────────────

export const getIndustries = unstable_cache(
  async () => {
    try {
      const rows = await db.industry.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedIndustries;
    } catch {
      return seedIndustries;
    }
  },
  ["industries"],
  { tags: ["industries"] }
);

// ─── Why Choose Us ───────────────────────────────────────────────────────────

export const getWhyChooseUs = unstable_cache(
  async () => {
    try {
      const rows = await db.whyChooseUsItem.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedWhyChooseUs;
    } catch {
      return seedWhyChooseUs;
    }
  },
  ["why-choose-us"],
  { tags: ["why-choose-us"] }
);

// ─── Process Steps ───────────────────────────────────────────────────────────

export const getProcessSteps = unstable_cache(
  async () => {
    try {
      const rows = await db.processStep.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedProcessSteps;
    } catch {
      return seedProcessSteps;
    }
  },
  ["process-steps"],
  { tags: ["process-steps"] }
);

// ─── Testimonials ────────────────────────────────────────────────────────────

export const getTestimonials = unstable_cache(
  async () => {
    try {
      const rows = await db.testimonial.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedTestimonials;
    } catch {
      return seedTestimonials;
    }
  },
  ["testimonials"],
  { tags: ["testimonials"] }
);

// ─── Insights ────────────────────────────────────────────────────────────────

export const getInsights = unstable_cache(
  async () => {
    try {
      const rows = await db.insightPost.findMany({ orderBy: { order: "asc" } });
      return rows.length > 0 ? rows : seedInsights;
    } catch {
      return seedInsights;
    }
  },
  ["insights"],
  { tags: ["insights"] }
);

// ─── Page SEO ────────────────────────────────────────────────────────────────

const SEO_DEFAULTS: Record<string, { title: string; description: string }> = {
  home: {
    title: "Mechaura International | Industrial Supplier UAE — Tools, Brushes & Equipment",
    description:
      "UAE-based industrial supplier delivering high-quality tools, specialized brushes, and industrial equipment across the GCC. Competitive pricing. On-time delivery.",
  },
  about: {
    title: "About Mechaura International | Industrial Partner in Ajman Free Zone",
    description:
      "Learn about Mechaura International FZE LLC — your trusted industrial partner based in Ajman Free Zone, UAE.",
  },
  products: {
    title: "Industrial Products | Brushes, Bearings, Cutting Tools — Mechaura International",
    description:
      "Browse Mechaura International's product catalog: abrasive brushes, bearings, hydraulic hose, bandsaw blades, elevator accessories, and more.",
  },
  services: {
    title: "Industrial Services | Tools, Equipment & Brush Supply — Mechaura International",
    description:
      "Explore our industrial services: precision tool supply, specialized brush solutions, and equipment sourcing.",
  },
  industries: {
    title: "Industries Served | Manufacturing, Oil & Gas, Construction — Mechaura International",
    description:
      "Mechaura International serves manufacturing, automotive, construction, oil & gas, and facility management industries.",
  },
  insights: {
    title: "Industrial Insights & Technical Articles — Mechaura International",
    description:
      "Practical guides on abrasive brush selection, bearing lubrication, hydraulic hose maintenance from our technical team.",
  },
  contact: {
    title: "Contact Mechaura International | Get a Quote for Industrial Supplies",
    description:
      "Contact Mechaura International for industrial supply inquiries, product quotations, and technical guidance.",
  },
};

export const getPageSeo = (page: string) =>
  unstable_cache(
    async () => {
      try {
        const row = await db.pageSeo.findUnique({ where: { id: page } });
        if (row) return row;
      } catch {}
      const d = SEO_DEFAULTS[page] ?? { title: "Mechaura International", description: "" };
      return {
        id: page,
        ...d,
        ogImage: "/images/og/og-image.png",
        canonicalUrl: "",
        noIndex: false,
        structuredData: "",
        updatedAt: new Date(),
      };
    },
    [`seo-${page}`],
    { tags: [`seo-${page}`] }
  )();

// ─── Partner Brands ───────────────────────────────────────────────────────────

export const getPartnerBrands = unstable_cache(
  async () => {
    try {
      const row = await db.company.findUnique({
        where: { id: "main" },
        select: { partnerBrands: true },
      });
      return row?.partnerBrands ?? seedPartnerBrands;
    } catch {
      return seedPartnerBrands;
    }
  },
  ["company"],
  { tags: ["company"] }
);
