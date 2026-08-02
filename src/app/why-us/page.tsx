"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Award,
  Zap,
  Star,
  Quote,
  Building2,
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
import {
  seedWhyChooseUs,
  seedTestimonials,
  seedPartnerBrands,
} from "@/lib/content";

export default function WhyUsPage() {
  const hydrated = useHydrated();
  const storeWhy = useContentStore((s) => s.whyChooseUs);
  const storeTestimonials = useContentStore((s) => s.testimonials);
  const storeBrands = useContentStore((s) => s.partnerBrands);

  const whyChooseUs = hydrated ? storeWhy : seedWhyChooseUs;
  const testimonials = hydrated ? storeTestimonials : seedTestimonials;
  const brands = hydrated ? storeBrands : seedPartnerBrands;

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
              <span className="text-foreground font-medium">Why Us</span>
            </nav>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                  <ShieldCheck className="size-3.5" />
                  <span>The Mechaura Advantage</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Why Leading GCC Enterprises <span className="text-brand">Trust Mechaura</span>
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  We bridge the gap between global industrial manufacturing precision and local GCC logistics agility, delivering unmatched quality, speed, and engineering support.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ── Value Pillars ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                    <Icon name={item.icon as IconName} className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Comparison Table Matrix ── */}
        <section className="py-16 lg:py-24 bg-card/30 border-y border-border/40">
          <Container size="full">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Performance Benchmark
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Mechaura vs. Traditional Distributors
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                See how our direct manufacturer access and GCC stock hub outperform traditional supply channels.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-lg">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-accent/40 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4 sm:p-6">Feature / Capability</th>
                    <th className="p-4 sm:p-6 text-brand font-bold bg-brand/10">Mechaura International</th>
                    <th className="p-4 sm:p-6">Traditional Local Traders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-foreground">GCC Dispatch Speed</td>
                    <td className="p-4 sm:p-6 font-medium text-brand bg-brand/5 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0" />
                      <span>Same-day UAE / 24-48h GCC</span>
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="size-4 text-muted-foreground shrink-0 opacity-50" />
                      <span>2–4 weeks indent import</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-foreground">Custom Technical Brushes</td>
                    <td className="p-4 sm:p-6 font-medium text-brand bg-brand/5 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0" />
                      <span>Engineered to machine drawings</span>
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="size-4 text-muted-foreground shrink-0 opacity-50" />
                      <span>Standard off-the-shelf catalog only</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-foreground">Technical Consultation</td>
                    <td className="p-4 sm:p-6 font-medium text-brand bg-brand/5 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0" />
                      <span>Dedicated technical engineer</span>
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="size-4 text-muted-foreground shrink-0 opacity-50" />
                      <span>Sales order takers only</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-foreground">Quality Inspection & MTC</td>
                    <td className="p-4 sm:p-6 font-medium text-brand bg-brand/5 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0" />
                      <span>100% pre-dispatch check & mill certs</span>
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="size-4 text-muted-foreground shrink-0 opacity-50" />
                      <span>Random or no quality check</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 font-semibold text-foreground">Bulk B2B Pricing</td>
                    <td className="p-4 sm:p-6 font-medium text-brand bg-brand/5 flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0" />
                      <span>Direct OEM factory pricing</span>
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="size-4 text-muted-foreground shrink-0 opacity-50" />
                      <span>Multi-middleman markups</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Client Feedback
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                What Industry Leaders Say
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
                >
                  <div>
                    <Quote className="size-8 text-brand/30 mb-4" />
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      &quot;{t.quote}&quot;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-brand font-bold text-brand-foreground text-xs">
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Partner Brands ── */}
        <section className="py-12 bg-card/40 border-t border-border/40">
          <Container size="full">
            <div className="text-center mb-8">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Trusted Brands & Manufacturing Partners
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-75">
              {brands.map((b, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-border/60 bg-background px-4 py-2 text-xs font-mono text-foreground font-semibold"
                >
                  {b}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-16 bg-brand text-brand-foreground">
          <Container size="full" className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Experience the Mechaura Advantage Today
            </h2>
            <p className="mt-4 text-base opacity-90 max-w-xl mx-auto">
              Partner with a reliable industrial supplier dedicated to your operational success.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Start Your RFQ
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
