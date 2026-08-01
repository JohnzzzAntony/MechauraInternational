"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { industries } from "@/lib/site-data";

export function IndustriesSection() {
  return (
    <section
      id="industries"
      className="relative scroll-mt-20 border-t border-border/40 bg-card/20 py-24 sm:py-32"
      aria-labelledby="industries-heading"
    >
      <Container size="full">
        <SectionHeading
          eyebrow="Our Expertise"
          align="center"
          className="mx-auto mb-16 max-w-3xl"
          title={
            <>
              Tailored solutions for{" "}
              <span className="text-gradient-brand">every industry</span> we serve.
            </>
          }
          description="Mechaura International supports a wide range of industries with dependable industrial products. Our team brings application-specific knowledge to every account, ensuring the right specification for the right operating environment."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, idx) => (
            <motion.div
              key={industry.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="group relative bg-background p-8 transition-colors hover:bg-card/60"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-all duration-500 group-hover:bg-brand group-hover:text-brand-foreground group-hover:rotate-6">
                  <Icon name={industry.icon as IconName} className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {industry.description}
                  </p>
                </div>
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
