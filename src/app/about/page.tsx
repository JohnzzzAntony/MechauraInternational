"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Award,
  Users,
  Building2,
  Clock,
  ArrowUpRight,
  Globe,
  CheckCircle2,
  Target,
  Compass,
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
import { seedCompany, seedValues, seedStats } from "@/lib/content";

export default function AboutPage() {
  const hydrated = useHydrated();
  const company = useContentStore((s) => s.company);
  const storeValues = useContentStore((s) => s.values);
  const storeStats = useContentStore((s) => s.heroStats);

  const c = hydrated ? company : seedCompany;
  const values = hydrated ? storeValues : seedValues;
  const stats = hydrated ? storeStats : seedStats;

  return (
    <>
      <ScrollProgress />
      <SiteHeader />

      <main className="flex flex-col pt-16 lg:pt-20">
        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-card/80 via-background to-background py-16 lg:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent opacity-60" />
          <Container size="full" className="relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5 opacity-50" />
              <span className="text-foreground font-medium">About Us</span>
            </nav>

            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                    <Building2 className="size-3.5" />
                    <span>Established {c.foundedYear} • Headquarters: {c.headquarters}</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    Engineering Excellence & <span className="text-brand">GCC Industrial Supply</span>
                  </h1>
                  <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
                    {c.description} Driven by precision, speed, and dependable B2B service across the United Arab Emirates and the wider GCC region.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button asChild variant="brand" size="lg">
                      <Link href="/contact">
                        Work With Us
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/products">Explore Products</Link>
                    </Button>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative aspect-video lg:aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                >
                  <Image
                    src="/images/products/industrial-brushes.png"
                    alt="Mechaura Industrial Operations"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-border/80 bg-background/80 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-brand/20 text-brand">
                        <Globe className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-muted-foreground uppercase">Regional Presence</p>
                        <p className="text-sm font-semibold text-foreground">UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Key Metrics ── */}
        <section className="py-12 bg-card/40 border-b border-border/40">
          <Container size="full">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-6 text-center shadow-sm"
                >
                  <span className="font-mono text-3xl font-extrabold text-brand sm:text-4xl">
                    {s.value}
                    {s.suffix}
                  </span>
                  <span className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Mission & Vision ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-brand/40 hover:shadow-lg">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-6">
                  <Target className="size-6" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  To provide industrial enterprises across the Middle East with uncompromising equipment quality, rapid procurement execution, and specialized technical tools that minimize operational downtime and optimize production efficiency.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand shrink-0" />
                    <span>Direct OEM sourcing for verified technical compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand shrink-0" />
                    <span>Rapid GCC dispatch with real-time tracking</span>
                  </li>
                </ul>
              </div>

              <div className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-brand/40 hover:shadow-lg">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-6">
                  <Compass className="size-6" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  To be recognized as the premier industrial supply partner in the GCC, known for technical consultation integrity, high-performance specialized brushes, and unmatched customer satisfaction in energy, manufacturing, and heavy industry.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand shrink-0" />
                    <span>Continuous inventory expansion for specialized tooling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand shrink-0" />
                    <span>Dedicated technical account managers for every B2B client</span>
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Core Values ── */}
        <section className="py-16 lg:py-24 bg-card/30 border-y border-border/40">
          <Container size="full">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Guiding Principles
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Our Core Values
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                The foundational pillars driving every product we stock, every quote we generate, and every partnership we build.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div
                  key={v.id}
                  className="group relative rounded-2xl border border-border/70 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon name={v.icon as IconName} className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Infrastructure & GCC Operations ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-background p-8 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                    Regional Infrastructure
                  </span>
                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
                    Strategically Located in Ajman Free Zone, UAE
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Our central distribution hub in Ajman Free Zone provides seamless access to major sea ports, international airports, and highway networks across the UAE and GCC. This enables rapid dispatch, bulk customs clearance, and reduced lead times for critical industrial components.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4">
                      <Truck className="size-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold">Express Logistics</h4>
                        <p className="mt-1 text-xs text-muted-foreground">Same-day UAE dispatch & priority GCC freight.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4">
                      <ShieldCheck className="size-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold">Quality Inspection</h4>
                        <p className="mt-1 text-xs text-muted-foreground">Strict multi-point quality check on every shipment.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full rounded-2xl border border-border bg-background/80 p-6 space-y-4">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Building2 className="size-4 text-brand" />
                      Company Details
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">Legal Entity</span>
                        <span className="font-medium text-foreground">{c.legalEntity}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">Headquarters</span>
                        <span className="font-medium text-foreground">{c.headquarters}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">Operating Hours</span>
                        <span className="font-medium text-foreground">{c.hours}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-muted-foreground">Direct Support</span>
                        <span className="font-medium text-brand">{c.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-16 bg-brand text-brand-foreground">
          <Container size="full" className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to Upgrade Your Industrial Supply Chain?
            </h2>
            <p className="mt-4 text-base opacity-90 max-w-xl mx-auto">
              Get in touch with our engineering support team for specialized brush quotes, bulk tooling rates, or custom manufacturing options.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Request a Quote Now
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <MobileCTA />
    </>
  );
}
