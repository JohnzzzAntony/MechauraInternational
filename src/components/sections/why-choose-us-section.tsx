"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon, type IconName } from "@/components/icon";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedWhyChooseUs } from "@/lib/content";

export function WhyChooseUsSection() {
  const hydrated = useHydrated();
  const items = useContentStore((s) => s.whyChooseUs);
  const list = hydrated ? items : seedWhyChooseUs;

  return (
    <section
      id="why-us"
      className="relative scroll-mt-20 border-t border-border/40 py-24 sm:py-32"
      aria-labelledby="why-us-heading"
    >
      <Container size="full">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why Choose Us"
              title={
                <>
                  Trusted industrial supplier{" "}
                  <span className="text-gradient-brand">built on substance</span>, not slogans.
                </>
              }
              description="Our differentiators are operational, not promotional. They show up in every shipment, every conversation, and every after-sales interaction — and they compound over the life of the partnership."
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-6"
            >
              <blockquote className="text-sm italic leading-relaxed text-foreground/80">
                &ldquo;Quality isn&rsquo;t an act — it&rsquo;s a habit we practice across sourcing,
                inspection, documentation, and delivery. That&rsquo;s how we earn long-term
                partnerships.&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                  <span className="font-display text-sm font-bold">M</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Mechaura Team</div>
                  <div className="text-xs text-muted-foreground">Founding Principles</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-all hover:border-brand/40 hover:bg-card/60"
                >
                  <span className="font-mono text-xs text-brand">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-transform group-hover:scale-110">
                    <Icon name={item.icon as IconName} className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
