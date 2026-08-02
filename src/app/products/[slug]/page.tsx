"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Mail,
  Phone,
  Package,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { MobileCTA } from "@/components/mobile-cta";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedProducts } from "@/lib/content";

function ProductPageContent({ slug }: { slug: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const storeProducts = useContentStore((s) => s.products);
  const allProducts = hydrated ? storeProducts : seedProducts;

  const product = allProducts.find((p) => p.slug === slug);

  React.useEffect(() => {
    if (hydrated && !product) {
      router.replace("/#products");
    }
  }, [hydrated, product, router]);

  if (!product) {
    // Show nothing while waiting for hydration / redirect
    return null;
  }

  // Other products for the sidebar
  const otherProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <>
      <ScrollProgress />
      <SiteHeader />

      <main className="flex flex-col pt-16 lg:pt-20">
        {/* ── Hero ── */}
        <div className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full overflow-hidden">
          <Image
            src={product.image || "/images/products/abrasive-brushes.png"}
            alt={product.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
          {/* Breadcrumb */}
          <div className="absolute inset-x-0 top-6 z-10">
            <Container size="full">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-white/70"
              >
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3 opacity-50" />
                <Link href="/#products" className="hover:text-white transition-colors">
                  Products
                </Link>
                <ChevronRight className="size-3 opacity-50" />
                <span className="text-white font-medium">{product.name}</span>
              </nav>
            </Container>
          </div>
          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0">
            <Container size="full" className="pb-8 pt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-lg shadow-brand/30">
                    <Icon name={product.icon as IconName} className="size-6" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                    Product Details
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>
              </motion.div>
            </Container>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="border-t border-border/40 py-12 lg:py-16">
          <Container size="full">
            <div className="grid gap-10 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">

              {/* ── Left: Main Content ── */}
              <div className="space-y-10 min-w-0">

                {/* Back link */}
                <Link
                  href="/#products"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  Back to Products
                </Link>

                {/* Description */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-base leading-relaxed text-foreground/80">
                    {product.description}
                  </p>
                  <Link
                    href="#contact-cta"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:underline underline-offset-4"
                  >
                    Contact us
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </motion.section>

                {/* Typical Applications */}
                {product.typicalApplications && product.typicalApplications.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <h2 className="font-display text-xl font-semibold tracking-tight text-foreground mb-6">
                      Typical Applications for {product.name.split(" ")[0]} include:
                    </h2>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {product.typicalApplications.map((app) => (
                        <div
                          key={app}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span className="text-foreground/80">{app}</span>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Large image */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 via-card to-background"
                >
                  <Image
                    src={product.image || "/images/products/abrasive-brushes.png"}
                    alt={`${product.name} - industrial view`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className="object-cover"
                  />
                </motion.div>

                {/* Materials & Brands row */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="grid gap-8 sm:grid-cols-2"
                >
                  {/* Materials */}
                  {product.materials && product.materials.length > 0 && (
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand mb-4">
                        Materials &amp; Standards
                      </h3>
                      <ul className="space-y-2">
                        {product.materials.map((mat) => (
                          <li key={mat} className="flex items-start gap-2.5 text-sm">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                            <span className="text-foreground/80">{mat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Applications */}
                  {product.applications && product.applications.length > 0 && (
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand mb-4">
                        Key Applications
                      </h3>
                      <ul className="space-y-2">
                        {product.applications.map((app) => (
                          <li key={app} className="flex items-start gap-2.5 text-sm">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                            <span className="text-foreground/80">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Compatible Brands */}
                {product.brands && product.brands.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand mb-4">
                      Compatible Brands We Supply
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.brands.map((brand) => (
                        <span
                          key={brand}
                          className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTA */}
                <motion.div
                  id="contact-cta"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Ready to order or need a quote?
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Our team responds within one business day.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Button asChild variant="brand" size="lg">
                      <Link href="/#contact">
                        Request a Quote
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href={`mailto:info@mechaurainternational.com?subject=Inquiry: ${product.name}`}>
                        <Mail className="size-4" />
                        Email Our Team
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* ── Right: Sidebar ── */}
              <aside className="space-y-6">
                {/* Sub-products box */}
                {product.subProducts && product.subProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="overflow-hidden rounded-2xl border border-border/60 bg-card"
                  >
                    <div className="bg-brand px-5 py-3.5">
                      <h3 className="font-display text-sm font-semibold text-brand-foreground">
                        Product Variants
                      </h3>
                    </div>
                    <ul className="divide-y divide-border/60">
                      {product.subProducts.map((sub) => (
                        <li key={sub}>
                          <div className="flex items-center gap-3 px-5 py-3 text-sm text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
                            <ChevronRight className="size-3.5 shrink-0 text-brand" />
                            <span>{sub}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Other Products */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-card"
                >
                  <div className="bg-muted/50 border-b border-border/60 px-5 py-3.5">
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Other Products
                    </h3>
                  </div>
                  <ul className="divide-y divide-border/60">
                    {otherProducts.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-foreground/80 hover:bg-accent hover:text-foreground transition-colors group"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                            <Icon name={p.icon as IconName} className="size-3.5" />
                          </span>
                          <span>{p.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick contact card */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-2xl border border-border/60 bg-card p-5 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-brand" />
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Quick Contact
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Need specifications or want to discuss a custom requirement?
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`tel:+971566202517`}
                      className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-brand transition-colors"
                    >
                      <Phone className="size-4 shrink-0 text-brand" />
                      +971 56 620 2517
                    </a>
                    <a
                      href="mailto:info@mechaurainternational.com"
                      className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-brand transition-colors"
                    >
                      <Mail className="size-4 shrink-0 text-brand" />
                      info@mechaurainternational.com
                    </a>
                  </div>
                </motion.div>
              </aside>
            </div>
          </Container>
        </div>
      </main>

      <SiteFooter />
      <MobileCTA />
    </>
  );
}

function ProductPageLoading() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col pt-24 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-sm font-medium">Loading product details...</span>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  return (
    <React.Suspense fallback={<ProductPageLoading />}>
      <ProductPageContent slug={slug} />
    </React.Suspense>
  );
}
