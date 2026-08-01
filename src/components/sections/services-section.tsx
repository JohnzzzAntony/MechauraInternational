"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site-data";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 border-t border-border/40 bg-card/20 py-24 sm:py-32"
      aria-labelledby="services-heading"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-30"
        aria-hidden="true"
      />

      <Container size="full" className="relative">
        <SectionHeading
          eyebrow="Our Services"
          align="center"
          className="mx-auto mb-16 max-w-3xl"
          title={
            <>
              Industrial solutions &amp; equipment
              <br className="hidden sm:block" /> engineered to{" "}
              <span className="text-gradient-brand">keep you moving</span>.
            </>
          }
          description="Mechaura International supplies high-quality industrial equipment, tools, and specialized brushes across the UAE — ensuring reliable delivery, competitive pricing, and efficient operations for businesses of every scale."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service, idx) => (
            <motion.article
              key={service.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-500 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_var(--brand)] sm:p-8"
            >
              {/* Big number watermark */}
              <span
                className="pointer-events-none absolute -right-2 -top-4 font-display text-8xl font-bold text-foreground/[0.04] transition-colors duration-500 group-hover:text-brand/10"
                aria-hidden="true"
              >
                {service.number}
              </span>

              <div className="relative">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon name={service.icon as IconName} className="size-7" />
                </div>

                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2.5" aria-label={`${service.title} capabilities`}>
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-8 pt-6 border-t border-border/60">
                <Link
                  href="#contact"
                  className="group/link inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand/80"
                >
                  Discuss your requirements
                  <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="#contact">
              Get a tailored service proposal
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
