"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedServices } from "@/lib/content";

export function ServicesSection() {
  const hydrated = useHydrated();
  const services = useContentStore((s) => s.services);
  const list = hydrated ? services : seedServices;

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
          {list.map((service, idx) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_var(--brand)]"
            >
              {/* Service image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image || "/images/services/industrial-tools.png"}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                {/* Big number watermark */}
                <span
                  className="pointer-events-none absolute right-4 top-3 font-display text-7xl font-bold text-foreground/10 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  {service.number}
                </span>
                <div className="absolute bottom-3 left-4 flex size-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-lg shadow-brand/20 ring-1 ring-brand/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon name={service.icon as IconName} className="size-6" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>

                <ul className="mt-5 space-y-2" aria-label={`${service.title} capabilities`}>
                  {(service.features || []).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Link
                    href="#contact"
                    className="group/link inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand/80"
                  >
                    Discuss your requirements
                    <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Hover gradient line */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand via-brand to-transparent transition-transform duration-500 group-hover:scale-x-100" />
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
