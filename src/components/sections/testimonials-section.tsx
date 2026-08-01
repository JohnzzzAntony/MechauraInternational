"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/lib/site-data";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-20 border-t border-border/40 py-24 sm:py-32"
      aria-labelledby="testimonials-heading"
    >
      <Container size="full">
        <SectionHeading
          eyebrow="Client Voices"
          align="center"
          className="mx-auto mb-16 max-w-3xl"
          title={
            <>
              Partnerships built on{" "}
              <span className="text-gradient-brand">measurable outcomes</span>.
            </>
          }
          description="We measure our success by the operational outcomes our clients achieve. Here&rsquo;s what teams across the UAE say about working with Mechaura International."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-all hover:border-brand/40 hover:bg-card/60 sm:p-8"
            >
              <Quote
                className="size-8 text-brand/40 transition-colors group-hover:text-brand/70"
                aria-hidden="true"
              />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                  <span className="font-display text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.company}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
