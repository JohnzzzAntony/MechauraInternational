"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Wrench,
  Truck,
  ShieldCheck,
  Headphones,
  Settings,
  Package,
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
import { seedServices, seedProcessSteps } from "@/lib/content";

export default function ServicesPage() {
  const hydrated = useHydrated();
  const storeServices = useContentStore((s) => s.services);
  const storeSteps = useContentStore((s) => s.processSteps);

  const services = hydrated ? storeServices : seedServices;
  const steps = hydrated ? storeSteps : seedProcessSteps;

  const [activeTab, setActiveTab] = React.useState<string>(services[0]?.id || "srv_1");

  const selectedService = services.find((s) => s.id === activeTab) || services[0];

  return (
    <>
      <ScrollProgress />
      <SiteHeader />

      <main className="flex flex-col pt-16 lg:pt-20">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-card/80 via-background to-background py-16 lg:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent opacity-60" />
          <Container size="full" className="relative z-10">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5 opacity-50" />
              <span className="text-foreground font-medium">Services</span>
            </nav>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                  <Wrench className="size-3.5" />
                  <span>Technical & Sourcing Capabilities</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Industrial Services & <span className="text-brand">Technical Solutions</span>
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  From specialized brush selection to global B2B equipment sourcing and custom technical engineering support — Mechaura provides comprehensive industrial service across the GCC.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ── Services Showcase ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            {/* Service Navigation Tabs */}
            <div className="flex flex-wrap gap-2 pb-8 border-b border-border/60 mb-12">
              {services.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setActiveTab(srv.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                    activeTab === srv.id
                      ? "bg-brand text-brand-foreground shadow-lg shadow-brand/20"
                      : "border border-border/60 bg-card/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs opacity-75">{srv.number}</span>
                  <span>{srv.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Service Detailed View */}
            {selectedService && (
              <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-sm font-bold text-brand">{selectedService.number}</span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon name={selectedService.icon as IconName} className="size-5" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold sm:text-4xl text-foreground">{selectedService.title}</h2>
                  <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                    {selectedService.description}
                  </p>

                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                      Key Capabilities & Deliverables
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedService.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5"
                        >
                          <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
                          <span className="text-xs font-medium text-foreground">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button asChild variant="brand" size="lg">
                      <Link href={`/contact?service=${encodeURIComponent(selectedService.title)}`}>
                        Inquire About This Service
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                    <Image
                      src={selectedService.image || "/images/products/industrial-brushes.png"}
                      alt={selectedService.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/80 bg-background/90 p-4 backdrop-blur-md">
                      <p className="text-xs font-mono text-brand">Service SLA Summary</p>
                      <p className="mt-1 text-xs text-muted-foreground">{selectedService.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* ── Process / SLA Workflow ── */}
        <section className="py-16 lg:py-24 bg-card/30 border-y border-border/40">
          <Container size="full">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Service Execution
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Our 4-Step Procurement & Service SLA
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                A streamlined, transparent workflow ensuring rapid turnarounds and zero friction from quote to delivery.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((st, i) => (
                <div
                  key={st.id}
                  className="relative rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
                >
                  <span className="font-mono text-2xl font-extrabold text-brand">{st.number}</span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{st.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{st.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="size-6 text-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-16 bg-gradient-to-r from-card via-background to-card border-t border-border/40">
          <Container size="full" className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Require Custom Technical Sourcing?
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
              Our engineering team assists with specialized specifications, OEM replacements, and customized brush dimensions.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild variant="brand" size="lg">
                <Link href="/contact">
                  Submit Technical Inquiry
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
