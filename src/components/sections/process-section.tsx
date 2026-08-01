"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/lib/site-data";

export function ProcessSection() {
  return (
    <section
      id="process"
      className="relative scroll-mt-20 border-t border-border/40 bg-card/20 py-24 sm:py-32"
      aria-labelledby="process-heading"
    >
      <Container size="full">
        <SectionHeading
          eyebrow="How We Work"
          align="center"
          className="mx-auto mb-16 max-w-3xl"
          title={
            <>
              A structured process{" "}
              <span className="text-gradient-brand">from inquiry to after-sales</span>.
            </>
          }
          description="Every engagement follows a disciplined four-step process designed to eliminate ambiguity, accelerate sourcing, and ensure the right product reaches your team on schedule."
        />

        <div className="relative grid gap-6 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[5.5rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
            aria-hidden="true"
          />

          {processSteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col"
            >
              <div className="relative z-10 mx-auto flex size-20 items-center justify-center rounded-full border-2 border-border bg-background transition-all duration-500 group-hover:border-brand group-hover:shadow-[0_0_40px_-8px_var(--brand)]">
                <span className="font-display text-2xl font-bold text-foreground transition-colors group-hover:text-brand">
                  {step.number}
                </span>
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full border border-brand/0 transition-all duration-500 group-hover:scale-125 group-hover:border-brand/30" />
              </div>

              <div className="mt-6 text-center">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
