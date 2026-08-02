"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  Layers,
  Package,
  Sparkles,
  Tag,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { MobileCTA } from "@/components/mobile-cta";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedProducts } from "@/lib/content";

export default function ProductsPage() {
  const hydrated = useHydrated();
  const storeProducts = useContentStore((s) => s.products);
  const products = hydrated ? storeProducts : seedProducts;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMaterial, setSelectedMaterial] = React.useState<string>("all");

  // Extract unique materials
  const allMaterials = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.materials.forEach((m) => set.add(m)));
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subProducts.some((sub) => sub.toLowerCase().includes(q)) ||
        p.applications.some((app) => app.toLowerCase().includes(q));

      const matchesMaterial =
        selectedMaterial === "all" ||
        p.materials.some((m) => m.toLowerCase() === selectedMaterial.toLowerCase());

      return matchesSearch && matchesMaterial;
    });
  }, [products, searchQuery, selectedMaterial]);

  return (
    <>
      <ScrollProgress />
      <SiteHeader />

      <main className="flex flex-col pt-16 lg:pt-20">
        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-card/80 via-background to-background py-16 lg:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent opacity-60" />
          <Container size="full" className="relative z-10">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5 opacity-50" />
              <span className="text-foreground font-medium">Products Catalog</span>
            </nav>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                  <Package className="size-3.5" />
                  <span>Verified GCC Inventory • OEM Specifications</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Industrial Products & <span className="text-brand">Technical Brush Catalog</span>
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  Browse our high-performance range of abrasive brushes, deburring tools, industrial strip brushes, and custom-engineered surface finishing solutions.
                </p>
              </motion.div>
            </div>

            {/* Live Search & Filter Bar */}
            <div className="mt-10 grid gap-4 md:grid-cols-12">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products, materials (e.g. Steel, Nylon), or applications (Deburring, Finishing)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card border-border/80 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground shrink-0" />
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="h-12 w-full rounded-md border border-border/80 bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="all">All Materials</option>
                  {allMaterials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Product Grid ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-foreground">
                Showing {filteredProducts.length} Product Categories
              </h2>
              {(searchQuery || selectedMaterial !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMaterial("all");
                  }}
                  className="text-xs text-brand hover:text-brand/80"
                >
                  Reset Filters
                </Button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <Package className="mx-auto size-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-base font-semibold text-foreground">No matching products found</h3>
                <p className="mt-2 text-xs text-muted-foreground">Try clearing your search term or selecting a different material filter.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-accent/30">
                      <Image
                        src={prod.image || "/images/products/abrasive-brushes.png"}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-md">
                          <Icon name={prod.icon as IconName} className="size-4" />
                        </div>
                        <span className="rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-brand backdrop-blur-sm">
                          {prod.subProducts.length} Variants
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                        {prod.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {prod.shortDescription}
                      </p>

                      {/* Sub-products preview */}
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                          Popular Sub-Products
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.subProducts.slice(0, 4).map((sub, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-accent/60 px-2 py-0.5 text-[11px] text-foreground font-medium"
                            >
                              {sub}
                            </span>
                          ))}
                          {prod.subProducts.length > 4 && (
                            <span className="rounded-md bg-accent/30 px-2 py-0.5 text-[11px] text-muted-foreground">
                              +{prod.subProducts.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {prod.materials.slice(0, 3).map((mat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-2 py-0.5 text-[10px] text-muted-foreground"
                            >
                              <Tag className="size-2.5 text-brand" />
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Link Action */}
                      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand group-hover:underline">
                          View Details & Specs
                        </span>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground"
                        >
                          <Link href={`/products/${prod.slug}`}>
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ── Custom Sourcing Banner ── */}
        <section className="py-16 bg-gradient-to-r from-card via-background to-card border-t border-border/40">
          <Container size="full">
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-12 text-center max-w-4xl mx-auto shadow-2xl">
              <Sparkles className="mx-auto size-10 text-brand mb-4" />
              <h2 className="text-2xl font-extrabold sm:text-3xl text-foreground">
                Need a Custom Brush Specification or Bulk Quantity?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                We manufacture and source custom filament densities, core diameters, arbor hole dimensions, and high-temp wire materials tailored to your production machinery.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild variant="brand" size="lg">
                  <Link href="/contact?type=custom_brush">
                    Request Custom Spec Quote
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <MobileCTA />
    </>
  );
}
