"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Wrench,
  Factory,
  Newspaper,
  Inbox,
  MessageSquareQuote,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/store";

type View = "dashboard" | "products" | "services" | "industries" | "testimonials" | "insights" | "inquiries" | "settings";

export function AdminDashboard({ onNavigate }: { onNavigate: (v: View) => void }) {
  const products = useContentStore((s) => s.products);
  const services = useContentStore((s) => s.services);
  const industries = useContentStore((s) => s.industries);
  const insights = useContentStore((s) => s.insights);
  const testimonials = useContentStore((s) => s.testimonials);
  const inquiries = useContentStore((s) => s.inquiries);
  const resetToSeed = useContentStore((s) => s.resetToSeed);
  const [confirmReset, setConfirmReset] = React.useState(false);

  const cards = [
    { label: "Products", count: products.length, icon: Package, view: "products" as View, color: "text-brand" },
    { label: "Services", count: services.length, icon: Wrench, view: "services" as View, color: "text-brand" },
    { label: "Industries", count: industries.length, icon: Factory, view: "industries" as View, color: "text-brand" },
    { label: "Insights", count: insights.length, icon: Newspaper, view: "insights" as View, color: "text-brand" },
    { label: "Testimonials", count: testimonials.length, icon: MessageSquareQuote, view: "testimonials" as View, color: "text-brand" },
    { label: "Inquiries", count: inquiries.length, icon: Inbox, view: "inquiries" as View, color: "text-brand" },
  ];

  const newInquiries = inquiries.filter((i) => i.status === "new");

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 via-card to-background p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Welcome back to your content workspace.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage every piece of content on the Mechaura International website from
            this panel. Changes you make here are saved instantly and reflected on
            the public site in real time.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="sm">
              <Link href="/" target="_blank">
                <ArrowUpRight className="size-4" />
                View Live Site
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmReset(true)}
            >
              <RefreshCw className="size-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <motion.button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.view)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-6 text-left transition-all hover:border-brand/40 hover:shadow-[0_12px_40px_-12px_var(--brand)]"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {card.label}
              </div>
              <div className="mt-2 font-display text-4xl font-bold text-foreground">
                {card.count}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {card.count === 1 ? "entry" : "entries"} total
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-transform group-hover:scale-110">
              <card.icon className="size-6" />
            </div>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand to-transparent transition-transform duration-500 group-hover:scale-x-100" />
          </motion.button>
        ))}
      </div>

      {/* Recent inquiries preview */}
      {newInquiries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-border/60 bg-card p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-brand" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                New Inquiries
              </h3>
              <span className="flex size-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
                {newInquiries.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("inquiries")}>
              View all
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <ul className="mt-4 space-y-2">
            {newInquiries.slice(0, 5).map((inq) => (
              <li
                key={inq.id}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{inq.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{inq.reference}</span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {inq.productCategory || "General inquiry"} · {inq.email}
                  </div>
                </div>
                <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                  {new Date(inq.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Reset confirmation */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-semibold text-foreground">
              Reset all content to defaults?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will restore the original seed data for products, services,
              industries, testimonials, and insights. Inquiries will be cleared.
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  resetToSeed();
                  setConfirmReset(false);
                }}
              >
                Reset Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
