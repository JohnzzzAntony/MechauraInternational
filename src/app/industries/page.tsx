"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  Building,
  Factory,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Ship,
  Plane,
  Car,
  HardHat,
  Cpu,
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
import { seedIndustries } from "@/lib/content";

export default function IndustriesPage() {
  const hydrated = useHydrated();
  const storeIndustries = useContentStore((s) => s.industries);
  const industries = hydrated ? storeIndustries : seedIndustries;

  const [selectedSlug, setSelectedSlug] = React.useState<string>(industries[0]?.slug || "oil-gas");

  const selectedIndustry = industries.find((i) => i.slug === selectedSlug) || industries[0];

  return (
    <>
      <ScrollProgress />
      <SiteHeader />

      <main className="flex flex-col pt-16 lg:pt-20">
        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-card/80 via-background to-background py-16 lg:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent opacity-60" />
          <Container size="full" className="relative z-10">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5 opacity-50" />
              <span className="text-foreground font-medium">Industries</span>
            </nav>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                  <Factory className="size-3.5" />
                  <span>Sector Expertise Across GCC</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Targeted Solutions for <span className="text-brand">GCC Heavy Industries</span>
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  Mechaura supplies high-specification tooling, non-sparking brushes, and industrial equipment tailored to the unique regulatory, material, and operational demands of the Middle East&apos;s key sectors.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ── Industry Grid Showcase ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              {industries.map((ind) => (
                <div
                  key={ind.id}
                  onClick={() => setSelectedSlug(ind.slug)}
                  className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                    selectedSlug === ind.slug
                      ? "border-brand bg-brand/5 shadow-lg shadow-brand/10 ring-1 ring-brand"
                      : "border-border/80 bg-card hover:border-brand/40 hover:bg-card/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                      <Icon name={ind.icon as IconName} className="size-6" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-brand">
                      Sector Solution
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground">{ind.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {ind.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-1 text-xs font-semibold text-brand">
                    <span>View Technical Specs</span>
                    <ChevronRight className="size-3.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Industry Technical Breakdown */}
            {selectedIndustry && (
              <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-background p-8 lg:p-12 shadow-xl">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-mono text-brand mb-3">
                      <Icon name={selectedIndustry.icon as IconName} className="size-3.5" />
                      <span>{selectedIndustry.name} Industry Profile</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground">{selectedIndustry.name}</h2>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {selectedIndustry.description}
                    </p>

                    <div className="mt-8 space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                        Industry Applications & Solved Challenges
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-border/60 bg-background p-3.5">
                          <h4 className="text-xs font-bold text-brand">Surface Prep & Deburring</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">Precision burr removal on CNC machined components, turbine blades, and flange faces.</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background p-3.5">
                          <h4 className="text-xs font-bold text-brand">Corrosion & Scale Removal</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">Heavy-duty wire knot brushes for weld cleaning, rust stripping, and pipeline maintenance.</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background p-3.5">
                          <h4 className="text-xs font-bold text-brand">Safety Compliance</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">Non-sparking brass and bronze wire brushes for ATEX / Zone 1 hazardous environments.</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background p-3.5">
                          <h4 className="text-xs font-bold text-brand">OEM Custom Sourcing</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">Tailored strip brush seals and internal pipe cleaning brushes manufactured to order.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Button asChild variant="brand" size="lg">
                        <Link href={`/contact?industry=${encodeURIComponent(selectedIndustry.name)}`}>
                          Request Industry Spec Quote
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/products">Browse Recommended Brushes</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-border/80 bg-background p-6 space-y-4 shadow-md">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <ShieldCheck className="size-4 text-brand" />
                        Compliance & Standards
                      </h3>
                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-brand shrink-0" />
                          <span>ISO 9001:2015 Quality Management Standards</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-brand shrink-0" />
                          <span>GCC Industrial Safety & Non-Sparking Specs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-brand shrink-0" />
                          <span>Full Manufacturer Test Certification (MTC)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-brand shrink-0" />
                          <span>ATEX Zone 1 & 2 Explosion Safety Options</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-16 bg-brand text-brand-foreground">
          <Container size="full" className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Need Industry-Specific Technical Recommendations?
            </h2>
            <p className="mt-4 text-base opacity-90 max-w-xl mx-auto">
              Our engineering specialists are ready to analyze your material specs, burr types, and machine operating parameters.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Consult an Engineer
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
