import * as React from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { MobileCTA } from "@/components/mobile-cta";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProductsSection } from "@/components/sections/products-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { ProcessSection } from "@/components/sections/process-section";
import { BrandsSection } from "@/components/sections/brands-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { CTASection } from "@/components/sections/cta-section";
import { ContactSection } from "@/components/sections/contact-section";
import { JsonLd } from "@/components/json-ld";
import { getPageSeo, getCompany } from "@/lib/cms-data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home");
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    robots: seo.noIndex ? { index: false } : { index: true, follow: true },
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
  };
}

export default async function Home() {
  const company = await getCompany();

  return (
    <>
      <JsonLd type="organization" data={company} />
      <JsonLd type="website" />
      <ScrollProgress />
      <SiteHeader />
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProductsSection />
        <IndustriesSection />
        <WhyChooseUsSection />
        <ProcessSection />
        <BrandsSection />
        <TestimonialsSection />
        <InsightsSection />
        <CTASection />
        <ContactSection />
      </main>
      <SiteFooter />
      <MobileCTA />
    </>
  );
}
