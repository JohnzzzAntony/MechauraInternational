"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/site-data";

export function CTASection() {
  return (
    <section className="relative scroll-mt-20 border-t border-border/40 py-24 sm:py-32">
      <Container size="full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative isolate overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/10 via-card to-background p-8 sm:p-12 lg:p-16"
        >
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40"
            aria-hidden="true"
          />
          {/* Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[400px] w-[400px] rounded-full bg-brand/20 blur-[100px]"
            aria-hidden="true"
          />

          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="section-tag">Get in touch</span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Let&rsquo;s discuss your{" "}
                <span className="text-gradient-brand">industrial supply needs</span>.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Contact us today to discuss your industrial equipment and tool
                requirements. Our team is here to provide expert guidance,
                competitive pricing, and reliable solutions tailored to your
                business.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:shrink-0">
              <Button asChild variant="brand" size="xl">
                <Link href="#contact">
                  Request a Quote
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href={`tel:${company.phoneRaw}`}>
                  <Phone className="size-4" />
                  {company.phone}
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
