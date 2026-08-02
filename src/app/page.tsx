"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
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
import { AdminPanel } from "@/components/admin/admin-panel";

function HomeLayout() {
  return (
    <>
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

function HomeContent() {
  const params = useSearchParams();
  const isAdmin = params?.get("admin") === "1";

  if (isAdmin) {
    return <AdminPanel />;
  }

  return <HomeLayout />;
}

export default function Home() {
  return (
    <React.Suspense fallback={<HomeLayout />}>
      <HomeContent />
    </React.Suspense>
  );
}
