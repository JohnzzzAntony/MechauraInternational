"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Globe,
  Building2,
  FileCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { MobileCTA } from "@/components/mobile-cta";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedCompany, type Inquiry } from "@/lib/content";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const company = useContentStore((s) => s.company);
  const addInquiry = useContentStore((s) => s.addInquiry);
  const products = useContentStore((s) => s.products);

  const c = hydrated ? company : seedCompany;

  const prefilledProduct = searchParams?.get("product") || "";
  const prefilledService = searchParams?.get("service") || "";
  const prefilledIndustry = searchParams?.get("industry") || "";

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productCategory: prefilledProduct || prefilledService || prefilledIndustry || "Abrasive Brushes",
    message: "",
  });

  const [submittedInquiry, setSubmittedInquiry] = React.useState<Inquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const result = addInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        productCategory: formData.productCategory,
        message: formData.message,
      });
      setSubmittedInquiry(result);
      setIsSubmitting(false);
    }, 600);
  };

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
              <span className="text-foreground font-medium">Contact Us</span>
            </nav>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                  <Mail className="size-3.5" />
                  <span>RFQ & Engineering Consultation</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Contact Us & <span className="text-brand">Request a Technical Quote</span>
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  Have a technical inquiry, custom brush requirement, or bulk price request? Contact our engineering supply team for rapid assistance across the GCC.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ── Contact Form & Info Section ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Left Column: Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl">
                  {submittedInquiry ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand/20 text-brand mb-6">
                        <CheckCircle2 className="size-10" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Inquiry Received Successfully!</h2>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        Thank you for contacting Mechaura. An engineering specialist will review your request and respond within 24 business hours.
                      </p>

                      <div className="mt-6 rounded-2xl border border-border bg-background p-4 max-w-md mx-auto text-left space-y-2 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reference Code:</span>
                          <span className="font-bold text-brand">{submittedInquiry.reference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="text-foreground">{submittedInquiry.productCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="text-foreground">{new Date(submittedInquiry.receivedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSubmittedInquiry(null);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            company: "",
                            productCategory: "Abrasive Brushes",
                            message: "",
                          });
                        }}
                        variant="outline"
                        className="mt-8"
                      >
                        Submit Another Inquiry
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Send an Inquiry / RFQ</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Fill in your details below and our team will prepare a formal proposal.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-semibold">
                            Full Name <span className="text-brand">*</span>
                          </Label>
                          <Input
                            id="name"
                            required
                            placeholder="e.g. Alexander Vance"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-background border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-semibold">
                            Business Email <span className="text-brand">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="e.g. a.vance@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-background border-border"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs font-semibold">
                            Phone / WhatsApp
                          </Label>
                          <Input
                            id="phone"
                            placeholder="e.g. +971 50 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-background border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-xs font-semibold">
                            Company Name
                          </Label>
                          <Input
                            id="company"
                            placeholder="e.g. Gulf Energy Fabrication"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="bg-background border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productCategory" className="text-xs font-semibold">
                          Product / Service Interest
                        </Label>
                        <select
                          id="productCategory"
                          value={formData.productCategory}
                          onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                        >
                          <option value="Abrasive Brushes">Abrasive Brushes</option>
                          <option value="Industrial Brushes">Industrial Strip & Roller Brushes</option>
                          <option value="Deburring Tools">Deburring Tools & Holders</option>
                          <option value="Technical Brushes">Technical & Tube Brushes</option>
                          <option value="Custom Solutions">Custom Brush Engineering</option>
                          <option value="General Industrial Sourcing">General Industrial Sourcing</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs font-semibold">
                          Message / Specifications <span className="text-brand">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          required
                          rows={4}
                          placeholder="Include quantity requirements, dimensions, filament type, or machine specs..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-background border-border"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="brand"
                        size="lg"
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <span>Processing Inquiry...</span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Submit Quote Request
                            <Send className="size-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: Direct Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                {/* Contact Card */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md space-y-6">
                  <h3 className="text-xl font-bold text-foreground">Direct Contact Info</h3>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Headquarters</h4>
                        <p className="text-muted-foreground mt-0.5">{c.headquarters}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0">
                        <Phone className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Phone & WhatsApp</h4>
                        <a href={`tel:${c.phoneRaw}`} className="text-brand font-medium hover:underline block mt-0.5">
                          {c.phone}
                        </a>
                        <a
                          href={c.social.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-brand transition-colors block mt-0.5"
                        >
                          Chat directly on WhatsApp →
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0">
                        <Mail className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Email Address</h4>
                        <a href={`mailto:${c.email}`} className="text-brand font-medium hover:underline block mt-0.5">
                          {c.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0">
                        <Clock className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Working Hours</h4>
                        <p className="text-muted-foreground mt-0.5">{c.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional Logistics Card */}
                <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card to-background p-6 sm:p-8 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="size-5 text-brand" />
                    <h3 className="text-lg font-bold text-foreground">GCC Regional Supply Hub</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We process customs clearance and priority logistics across all GCC territories:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain"].map((country) => (
                      <span
                        key={country}
                        className="rounded-lg border border-border/60 bg-background px-3 py-1 text-[11px] font-medium text-foreground"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-16 lg:py-24 bg-card/30 border-t border-border/40">
          <Container size="full">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Frequently Asked Questions
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                B2B Procurement & Sourcing FAQs
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="rounded-2xl border border-border bg-card px-6 py-2">
                  <AccordionTrigger className="text-left font-bold text-sm text-foreground hover:no-underline">
                    What is the typical turnaround time for quotation requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Standard catalog items receive formal price proposals within 2–4 business hours. Custom-engineered brush requests requiring drawing analysis receive quotes within 24 hours.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="rounded-2xl border border-border bg-card px-6 py-2">
                  <AccordionTrigger className="text-left font-bold text-sm text-foreground hover:no-underline">
                    Can Mechaura manufacture custom brushes according to machine drawings?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Yes. We specialize in custom brush manufacturing. Send us your CAD drawings or physical sample specifications, and we will engineer custom arbor dimensions, filament densities, and core materials.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="rounded-2xl border border-border bg-card px-6 py-2">
                  <AccordionTrigger className="text-left font-bold text-sm text-foreground hover:no-underline">
                    What are your Minimum Order Quantities (MOQs)?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    We maintain flexible MOQs. For stocked standard abrasive brushes, single-unit or small pack orders are supported. For custom-manufactured strip or roller brushes, reasonable batch MOQs apply.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="rounded-2xl border border-border bg-card px-6 py-2">
                  <AccordionTrigger className="text-left font-bold text-sm text-foreground hover:no-underline">
                    Do you provide Manufacturer Test Certificates (MTC)?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Yes. All shipments can be accompanied by Material Test Certificates (MTC) and Certificate of Origin (COO) for full compliance auditing in oil & gas or defense contracts.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="rounded-2xl border border-border bg-card px-6 py-2">
                  <AccordionTrigger className="text-left font-bold text-sm text-foreground hover:no-underline">
                    How are international shipments handled across GCC countries?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    We handle door-to-door road freight, air courier, and sea cargo across UAE, KSA, Oman, Qatar, Kuwait, and Bahrain with pre-cleared GCC customs documentation.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <MobileCTA />
    </>
  );
}

export default function ContactPage() {
  return (
    <React.Suspense fallback={null}>
      <ContactPageContent />
    </React.Suspense>
  );
}
