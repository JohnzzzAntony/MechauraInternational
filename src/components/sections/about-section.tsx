"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { aboutImages, seedCompany, seedValues } from "@/lib/content";

export function AboutSection() {
  const hydrated = useHydrated();
  const company = useContentStore((s) => s.company);
  const values = useContentStore((s) => s.values);
  const c = hydrated ? company : seedCompany;
  const v = hydrated ? values : seedValues;

  return (
    <section
      id="about"
      className="relative scroll-mt-20 border-t border-border/40 py-24 sm:py-32"
      aria-labelledby="about-heading"
    >
      <Container size="full">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — narrative */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Who We Are"
              title={
                <>
                  A UAE-based industrial supplier
                  <br className="hidden lg:block" /> built on{" "}
                  <span className="text-gradient-brand">reliability</span> and{" "}
                  <span className="text-gradient-brand">trust</span>.
                </>
              }
              description={
                <>
                  {c.name} is a UAE-based industrial supplier committed to
                  delivering reliable products, competitive pricing, and timely
                  service. We support a wide spectrum of industries — from
                  manufacturing and construction to oil &amp; gas and facility
                  management — with quality-tested industrial equipment and
                  customized solutions engineered for the realities of
                  continuous-duty operation.
                </>
              }
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {[
                { label: "Headquarters", value: c.headquarters },
                { label: "Legal Entity", value: `FZE LLC · Est. ${c.foundedYear}` },
                { label: "Service Region", value: "UAE & GCC" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-brand/40"
                >
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-1.5 text-sm font-medium text-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button asChild variant="brand-outline" size="lg">
                <Link href="#contact">
                  Talk to Our Team
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-brand" />
                {c.headquarters}
              </div>
            </motion.div>
          </div>

          {/* Right — image + value cards */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-border/60"
            >
              <Image
                src={aboutImages.warehouse}
                alt="Mechaura International warehouse with organized industrial inventory"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur">
                Ajman Free Zone Facility
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-3"
            >
              {v.map((value, idx) => (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-brand/40 hover:bg-card/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20 transition-transform group-hover:scale-105">
                      <Icon name={value.icon as IconName} className="size-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-sm font-semibold text-foreground">
                        {value.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                  {/* Hover accent line */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
