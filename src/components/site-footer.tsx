"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/logo";
import { company, navigation, products } from "@/lib/site-data";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="relative mt-auto border-t border-border/60 bg-background"
    >
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <Container size="full" className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {company.name} supplies high-quality industrial equipment, tools,
              and specialized brushes across the UAE — offering reliable
              availability, competitive pricing, and excellent service to keep
              businesses running efficiently with minimal downtime.
            </p>

            <div className="mt-6 flex gap-2">
              {[
                { icon: Linkedin, href: company.social.linkedin, label: "LinkedIn" },
                { icon: Instagram, href: company.social.instagram, label: "Instagram" },
                { icon: Facebook, href: company.social.facebook, label: "Facebook" },
                { icon: MessageCircle, href: company.social.whatsapp, label: "WhatsApp" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition-all hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Products
            </h3>
            <ul className="mt-5 space-y-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href="#products"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Get in Touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="text-muted-foreground">{company.headquarters}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                <a
                  href={`tel:${company.phoneRaw}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {company.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-border/60 bg-card/40 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Working Hours
              </div>
              <div className="mt-1.5 text-sm text-foreground">{company.hours}</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {year} {company.legalEntity}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              UAE · Est. {company.foundedYear}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
