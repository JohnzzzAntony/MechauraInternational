"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedInsights } from "@/lib/content";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InsightsSection() {
  const hydrated = useHydrated();
  const items = useContentStore((s) => s.insights);
  const list = hydrated ? items : seedInsights;

  return (
    <section
      id="insights"
      className="relative scroll-mt-20 border-t border-border/40 bg-card/20 py-24 sm:py-32"
      aria-labelledby="insights-heading"
    >
      <Container size="full">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Knowledge Center"
            title={
              <>
                Insights from our{" "}
                <span className="text-gradient-brand">engineering desk</span>.
              </>
            }
            description="Practical guidance on product selection, maintenance, and operational best practice — distilled from years of hands-on industrial supply experience."
            className="max-w-3xl"
          />
          <Button asChild variant="brand-outline" size="lg" className="shrink-0 self-start lg:self-end">
            <Link href="#contact">
              Browse All Articles
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {list.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_var(--brand)]"
            >
              {/* Visual with real image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand/15 via-card to-background">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-brand backdrop-blur">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                  {post.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                <Link
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand/80"
                >
                  Read article
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
