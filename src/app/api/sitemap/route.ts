import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://mechaurainternational.com";

  try {
    // Fetch dynamic routes from database
    const [products, industries, insights] = await Promise.all([
      db.product.findMany({ select: { slug: true, updatedAt: true } }),
      db.industry.findMany({ select: { slug: true, updatedAt: true } }),
      db.insightPost.findMany({ select: { id: true, updatedAt: true } }),
    ]);

    const staticPages: { url: string; priority: number; changefreq: string; lastmod?: string }[] = [
      { url: "", priority: 1.0, changefreq: "weekly" },
      { url: "/about", priority: 0.8, changefreq: "monthly" },
      { url: "/services", priority: 0.8, changefreq: "monthly" },
      { url: "/products", priority: 0.9, changefreq: "weekly" },
      { url: "/industries", priority: 0.7, changefreq: "monthly" },
      { url: "/insights", priority: 0.8, changefreq: "weekly" },
      { url: "/contact", priority: 0.7, changefreq: "monthly" },
      { url: "/why-us", priority: 0.6, changefreq: "monthly" },
    ];

    const productUrls = products.map((p) => ({
      url: `/products/${p.slug}`,
      priority: 0.8,
      changefreq: "weekly",
      lastmod: p.updatedAt.toISOString().split("T")[0],
    }));

    const industryUrls = industries.map((i) => ({
      url: `/industries/${i.slug}`,
      priority: 0.6,
      changefreq: "monthly",
      lastmod: i.updatedAt.toISOString().split("T")[0],
    }));

    const insightUrls = insights.map((ins) => ({
      url: `/insights/${ins.id}`,
      priority: 0.7,
      changefreq: "monthly",
      lastmod: ins.updatedAt.toISOString().split("T")[0],
    }));

    const allUrls = [
      ...staticPages,
      ...productUrls,
      ...industryUrls,
      ...insightUrls,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("[sitemap] Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}