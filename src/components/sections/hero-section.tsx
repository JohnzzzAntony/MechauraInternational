"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Counter } from "@/components/ui/counter";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { heroImages, seedStats } from "@/lib/content";

export function HeroSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const hydrated = useHydrated();
  const storeStats = useContentStore((s) => s.heroStats);
  const stats = hydrated && storeStats.length ? storeStats : seedStats;

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden bg-background pt-28 lg:pt-36"
      aria-label="Hero"
    >
      {/* Background image with parallax + overlays */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <Image
          src={heroImages.background}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        {/* Radial brand glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-brand/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-brand/10 blur-[100px]" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      <Container size="full" className="relative">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-muted-foreground">
              UAE-Based Industrial Supplier · Est. 2019
            </span>
            <Sparkles className="size-3.5 text-brand" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display max-w-5xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
          >
            Your Industrial Partner for{" "}
            <span className="relative inline-block">
              <span className="text-gradient-brand">Quality, Speed</span>
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-1 left-0 w-full text-brand"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 8 Q 75 2, 150 6 T 298 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </span>{" "}
            and Support.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
          >
            Distributing high-quality industrial equipment, precision tools, and
            specialized brushes across the UAE and wider GCC — engineered for
            reliability, priced for competitiveness, delivered on schedule.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild variant="brand" size="xl" className="w-full sm:w-auto">
              <Link href="/contact">
                Request a Quote
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
              <Link href="/products">
                Explore Products
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-background/80 backdrop-blur-sm px-4 py-6 text-center sm:px-6"
              >
                <div className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="pointer-events-none mt-20 flex justify-center pb-8"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </span>
          <span className="relative flex h-10 w-6 justify-center rounded-full border border-border">
            <motion.span
              className="mt-1.5 h-2 w-1 rounded-full bg-brand"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
