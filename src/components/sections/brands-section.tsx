"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { partnerBrands } from "@/lib/site-data";

export function BrandsSection() {
  // Duplicate for seamless marquee
  const marqueeItems = [...partnerBrands, ...partnerBrands];

  return (
    <section
      id="brands"
      className="relative scroll-mt-20 border-t border-border/40 py-20 sm:py-24"
      aria-labelledby="brands-heading"
    >
      <Container size="full">
        <SectionHeading
          eyebrow="Brands & Partners"
          align="center"
          className="mx-auto mb-12 max-w-3xl"
          title={
            <>
              Sourcing from the{" "}
              <span className="text-gradient-brand">brands engineers trust</span>.
            </>
          }
          description="We maintain sourcing relationships with leading global manufacturers — supplying both original and compatible alternatives, each backed by full technical documentation and traceability."
        />
      </Container>

      {/* Marquee */}
      <div
        className="relative flex overflow-hidden border-y border-border/60 bg-card/20 py-8"
        aria-label="Partner brands"
        role="list"
      >
        {/* Fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"
          aria-hidden="true"
        />

        <motion.div
          className="flex shrink-0 items-center gap-12 pr-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {marqueeItems.map((brand, idx) => (
            <span
              key={`${brand}-${idx}`}
              role="listitem"
              className="font-display select-none whitespace-nowrap text-xl font-semibold uppercase tracking-wider text-muted-foreground/60 transition-colors hover:text-brand sm:text-2xl"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
