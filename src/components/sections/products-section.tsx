"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { products, type ProductCategory } from "@/lib/site-data";

export function ProductsSection() {
  const [active, setActive] = React.useState<ProductCategory | null>(null);

  return (
    <section
      id="products"
      className="relative scroll-mt-20 border-t border-border/40 py-24 sm:py-32"
      aria-labelledby="products-heading"
    >
      <Container size="full">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our Products"
            title={
              <>
                Solutions that{" "}
                <span className="text-gradient-brand">power your business</span>.
              </>
            }
            description="A wide range of industrial products built for durability and high performance — delivering trusted solutions that enhance operational efficiency across manufacturing, fabrication, and maintenance operations."
            className="max-w-3xl"
          />
          <Button asChild variant="brand-outline" size="lg" className="shrink-0 self-start lg:self-end">
            <Link href="#contact">
              Request Full Catalog
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Product grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <motion.button
              key={product.slug}
              type="button"
              onClick={() => setActive(product)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 text-left transition-all duration-500 hover:border-brand/40 hover:shadow-[0_24px_60px_-24px_var(--brand)] focus-visible:border-brand/60"
              aria-label={`View details for ${product.name}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon name={product.icon as IconName} className="size-6" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-foreground">
                {product.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  View specs
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-brand-foreground">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>

              {/* Hover gradient line */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand via-brand to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </motion.button>
          ))}
        </div>
      </Container>

      {/* Product detail dialog */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          aria-describedby={undefined}
          className="max-h-[90vh] max-w-3xl overflow-y-auto border-border bg-background p-0"
        >
          {active && (
            <div className="flex flex-col">
              {/* Header */}
              <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand/10 via-card to-background p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Close dialog"
                >
                  <X className="size-4" />
                </button>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-lg shadow-brand/20">
                  <Icon name={active.icon as IconName} className="size-7" />
                </div>
                <DialogTitle className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {active.name}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground">
                  {active.shortDescription}
                </DialogDescription>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                    Overview
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {active.description}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                      Applications
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {active.applications.map((app) => (
                        <li key={app} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span className="text-foreground/80">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                      Materials &amp; Standards
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {active.materials.map((mat) => (
                        <li key={mat} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span className="text-foreground/80">{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                    Compatible Brands We Supply
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {active.brands.map((brand) => (
                      <span
                        key={brand}
                        className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                  <Button asChild variant="brand" size="lg" className="flex-1">
                    <Link href="#contact" onClick={() => setActive(null)}>
                      Request a Quote
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="flex-1">
                    <Link href={`mailto:info@mechaurainternational.com?subject=Inquiry: ${active.name}`}>
                      Email Our Team
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
