"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Linkedin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedCompany, seedProducts } from "@/lib/content";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  company: z.string().max(100, "Company name is too long").optional().or(z.literal("")),
  productCategory: z.string().optional(),
  message: z
    .string()
    .min(10, "Please provide a few details about your requirement (min 10 characters)")
    .max(2000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const hydrated = useHydrated();
  const company = useContentStore((s) => s.company);
  const products = useContentStore((s) => s.products);
  const c = hydrated ? company : seedCompany;
  const p = hydrated ? products : seedProducts;

  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      productCategory: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Submission failed");
      }
      setSubmitted(true);
      reset();
    } catch (e: any) {
      setSubmitError(e?.message || "Something went wrong. Please try again.");
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: "Address",
      value: c.headquarters,
      href: "https://www.google.com/maps/search/?api=1&query=Ajman+Free+Zone+Ajman+UAE",
    },
    {
      icon: Phone,
      label: "Phone",
      value: c.phone,
      href: `tel:${c.phoneRaw}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: c.email,
      href: `mailto:${c.email}`,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: c.hours,
    },
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 border-t border-border/40 bg-card/20 py-24 sm:py-32"
      aria-labelledby="contact-heading"
    >
      <Container size="full">
        <SectionHeading
          eyebrow="Contact Us"
          align="center"
          className="mx-auto mb-16 max-w-3xl"
          title={
            <>
              Let&rsquo;s build something{" "}
              <span className="text-gradient-brand">reliable</span> together.
            </>
          }
          description="Share your requirement and our team will respond within one business day with technical guidance, lead times, and pricing. No call centers — you&rsquo;ll hear directly from our supply desk."
        />

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left — contact details */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="grid gap-4">
              {contactItems.map((item) => {
                const Inner = (
                  <div className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 transition-all hover:border-brand/40 hover:bg-card/60">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-transform group-hover:scale-110">
                      <item.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">
                        {item.value}
                      </div>
                    </div>
                    {item.href && (
                      <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </div>
                );
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {Inner}
                  </a>
                ) : (
                  <div key={item.label}>{Inner}</div>
                );
              })}
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Follow us
              </span>
              <div className="flex gap-2">
                {[
                  { icon: Linkedin, href: c.social.linkedin, label: "LinkedIn" },
                  { icon: Instagram, href: c.social.instagram, label: "Instagram" },
                  { icon: Facebook, href: c.social.facebook, label: "Facebook" },
                  { icon: MessageCircle, href: c.social.whatsapp, label: "WhatsApp" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-muted-foreground transition-all hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-border/60">
              <iframe
                title="Mechaura International location — Ajman Free Zone"
                src="https://www.google.com/maps?q=Ajman+Free+Zone,+Ajman,+UAE&z=13&output=embed"
                width="100%"
                height="220"
                loading="lazy"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">
                    Inquiry received
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Thank you for reaching out to {c.shortName}. Our supply
                    desk will respond within one business day with technical guidance
                    and pricing.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" error={errors.name?.message} required>
                      <Input
                        {...register("name")}
                        placeholder="Ahmed Al Marri"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                      />
                    </Field>
                    <Field label="Email Address" error={errors.email?.message} required>
                      <Input
                        type="email"
                        {...register("email")}
                        placeholder="ahmed@company.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone Number" error={errors.phone?.message} required>
                      <Input
                        type="tel"
                        {...register("phone")}
                        placeholder="+971 50 123 4567"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                      />
                    </Field>
                    <Field label="Company (Optional)" error={errors.company?.message}>
                      <Input
                        {...register("company")}
                        placeholder="Your organization"
                        autoComplete="organization"
                      />
                    </Field>
                  </div>

                  <Field label="Product Category of Interest" error={errors.productCategory?.message}>
                    <select
                      {...register("productCategory")}
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a category (optional)
                      </option>
                      {p.map((prod) => (
                        <option key={prod.id} value={prod.name}>
                          {prod.name}
                        </option>
                      ))}
                      <option value="Other">Other / Not listed</option>
                    </select>
                  </Field>

                  <Field label="Your Requirement" error={errors.message?.message} required>
                    <Textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Please describe the product, quantity, application, and delivery timeline you need."
                      aria-invalid={!!errors.message}
                    />
                  </Field>

                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to be contacted by {c.shortName}
                      regarding your inquiry.
                    </p>
                    <Button
                      type="submit"
                      variant="brand"
                      size="lg"
                      disabled={isSubmitting}
                      className="sm:shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-brand-foreground/30 border-t-brand-foreground" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
