/**
 * prisma/seed.ts
 * Seeds all default content into Neon PostgreSQL.
 * Run with: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
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
} from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding Mechaura content to Neon PostgreSQL…");

  // ── Company ──────────────────────────────────────────────────────────
  await prisma.company.upsert({
    where: { id: "main" },
    create: {
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
    },
    update: {},
  });
  console.log("  ✓ Company");

  // ── Hero Section ────────────────────────────────────────────────────────
  await prisma.heroSection.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      badgeText: "UAE-Based Industrial Supplier · Est. 2019",
      showBadge: true,
      headline: "Your Industrial Partner for Quality, Speed & Support",
      subheadline:
        "UAE-based industrial supplier delivering high-quality industrial equipment, tools, and specialized brushes across the GCC.",
      ctaPrimaryText: "Request a Quote",
      ctaPrimaryHref: "/contact",
      ctaSecondaryText: "Browse Products",
      ctaSecondaryHref: "/products",
      backgroundImage: "/images/hero/hero-bg.png",
      overlayOpacity: 0.55,
      showStats: true,
    },
    update: {},
  });
  console.log("  ✓ Hero Section");

  // ── Hero Stats ────────────────────────────────────────────────────────
  for (let i = 0; i < seedStats.length; i++) {
    const s = seedStats[i];
    await prisma.heroStat.upsert({
      where: { id: s.id },
      create: { id: s.id, value: s.value, suffix: s.suffix, label: s.label, order: i },
      update: {},
    });
  }
  console.log("  ✓ Hero Stats");

  // ── Values ────────────────────────────────────────────────────────────
  for (let i = 0; i < seedValues.length; i++) {
    const v = seedValues[i];
    await prisma.value.upsert({
      where: { id: v.id },
      create: { id: v.id, title: v.title, description: v.description, icon: v.icon, order: i },
      update: {},
    });
  }
  console.log("  ✓ Values");

  // ── Services ──────────────────────────────────────────────────────────
  for (let i = 0; i < seedServices.length; i++) {
    const sv = seedServices[i];
    await prisma.service.upsert({
      where: { id: sv.id },
      create: {
        id: sv.id,
        number: sv.number,
        title: sv.title,
        summary: sv.summary,
        description: sv.description,
        features: sv.features,
        icon: sv.icon,
        image: sv.image,
        order: i,
      },
      update: {},
    });
  }
  console.log("  ✓ Services");

  // ── Products ──────────────────────────────────────────────────────────
  for (let i = 0; i < seedProducts.length; i++) {
    const p = seedProducts[i];
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
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
      },
      update: {},
    });
  }
  console.log("  ✓ Products");

  // ── Industries ────────────────────────────────────────────────────────
  for (let i = 0; i < seedIndustries.length; i++) {
    const ind = seedIndustries[i];
    await prisma.industry.upsert({
      where: { id: ind.id },
      create: {
        id: ind.id,
        slug: ind.slug,
        name: ind.name,
        description: ind.description,
        icon: ind.icon,
        order: i,
      },
      update: {},
    });
  }
  console.log("  ✓ Industries");

  // ── Why Choose Us ─────────────────────────────────────────────────────
  for (let i = 0; i < seedWhyChooseUs.length; i++) {
    const w = seedWhyChooseUs[i];
    await prisma.whyChooseUsItem.upsert({
      where: { id: w.id },
      create: { id: w.id, title: w.title, description: w.description, icon: w.icon, order: i },
      update: {},
    });
  }
  console.log("  ✓ Why Choose Us");

  // ── Process Steps ─────────────────────────────────────────────────────
  for (let i = 0; i < seedProcessSteps.length; i++) {
    const ps = seedProcessSteps[i];
    await prisma.processStep.upsert({
      where: { id: ps.id },
      create: {
        id: ps.id,
        number: ps.number,
        title: ps.title,
        description: ps.description,
        order: i,
      },
      update: {},
    });
  }
  console.log("  ✓ Process Steps");

  // ── Testimonials ──────────────────────────────────────────────────────
  for (let i = 0; i < seedTestimonials.length; i++) {
    const t = seedTestimonials[i];
    await prisma.testimonial.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        quote: t.quote,
        name: t.name,
        company: t.company,
        initials: t.initials,
        order: i,
      },
      update: {},
    });
  }
  console.log("  ✓ Testimonials");

  // ── Insights ──────────────────────────────────────────────────────────
  for (let i = 0; i < seedInsights.length; i++) {
    const ins = seedInsights[i];
    await prisma.insightPost.upsert({
      where: { id: ins.id },
      create: {
        id: ins.id,
        title: ins.title,
        excerpt: ins.excerpt,
        category: ins.category,
        readTime: ins.readTime,
        date: ins.date,
        image: ins.image,
        order: i,
      },
      update: {},
    });
  }
  console.log("  ✓ Insights");

  console.log("\n✅  Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
