"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedProducts } from "@/lib/content";

export function ProductsSection() {
  const hydrated = useHydrated();
  const products = useContentStore((s) => s.products);
  const list = hydrated ? products : seedProducts;

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
          {list.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left transition-all duration-500 hover:border-brand/40 hover:shadow-[0_24px_60px_-24px_var(--brand)] focus-visible:border-brand/60"
                aria-label={`View details for ${product.name}`}
              >
                {/* Product image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand/10 via-card to-background">
                  <Image
                    src={product.image || "/images/products/abrasive-brushes.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl bg-background/80 text-brand backdrop-blur ring-1 ring-brand/30 transition-all duration-500 group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon name={product.icon as IconName} className="size-5" />
                  </div>
                  <span className="absolute right-4 top-4 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                    {String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {product.shortDescription}
                  </p>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      View details
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-brand-foreground">
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                {/* Hover gradient line */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand via-brand to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
