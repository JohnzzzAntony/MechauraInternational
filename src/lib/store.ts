"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CompanyInfo,
  ValueItem,
  ServiceItem,
  ProductCategory,
  Industry,
  WhyChooseUsItem,
  ProcessStep,
  Testimonial,
  InsightPost,
  StatItem,
  Inquiry,
} from "@/lib/content";
import {
  seedCompany,
  seedStats,
  seedValues,
  seedServices,
  seedProducts,
  seedIndustries,
  seedWhyChooseUs,
  seedProcessSteps,
  seedTestimonials,
  seedInsights,
  seedPartnerBrands,
} from "@/lib/content";

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

interface ContentState {
  // Settings
  company: CompanyInfo;
  partnerBrands: string[];
  heroStats: StatItem[];

  // Content collections
  values: ValueItem[];
  services: ServiceItem[];
  products: ProductCategory[];
  industries: Industry[];
  whyChooseUs: WhyChooseUsItem[];
  processSteps: ProcessStep[];
  testimonials: Testimonial[];
  insights: InsightPost[];

  // Inquiries from contact form
  inquiries: Inquiry[];

  // Auth
  isAdmin: boolean;
  adminPassword: string;

  // ---- Auth actions ----
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (next: string) => void;

  // ---- Company actions ----
  updateCompany: (patch: Partial<CompanyInfo>) => void;
  setPartnerBrands: (next: string[]) => void;

  // ---- Stats actions ----
  updateStat: (id: string, patch: Partial<StatItem>) => void;

  // ---- Values ----
  upsertValue: (item: ValueItem) => void;
  removeValue: (id: string) => void;

  // ---- Services ----
  upsertService: (item: ServiceItem) => void;
  removeService: (id: string) => void;

  // ---- Products ----
  upsertProduct: (item: ProductCategory) => void;
  removeProduct: (id: string) => void;

  // ---- Industries ----
  upsertIndustry: (item: Industry) => void;
  removeIndustry: (id: string) => void;

  // ---- Why Choose Us ----
  upsertWhyChooseUs: (item: WhyChooseUsItem) => void;
  removeWhyChooseUs: (id: string) => void;

  // ---- Process ----
  upsertProcessStep: (item: ProcessStep) => void;
  removeProcessStep: (id: string) => void;

  // ---- Testimonials ----
  upsertTestimonial: (item: Testimonial) => void;
  removeTestimonial: (id: string) => void;

  // ---- Insights ----
  upsertInsight: (item: InsightPost) => void;
  removeInsight: (id: string) => void;

  // ---- Inquiries ----
  addInquiry: (inq: Omit<Inquiry, "id" | "receivedAt" | "status" | "reference">) => Inquiry;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => void;
  removeInquiry: (id: string) => void;

  // ---- Maintenance ----
  resetToSeed: () => void;
}

const initialState = {
  company: seedCompany,
  partnerBrands: seedPartnerBrands,
  heroStats: seedStats,
  values: seedValues,
  services: seedServices,
  products: seedProducts,
  industries: seedIndustries,
  whyChooseUs: seedWhyChooseUs,
  processSteps: seedProcessSteps,
  testimonials: seedTestimonials,
  insights: seedInsights,
  inquiries: [] as Inquiry[],
  isAdmin: false,
  adminPassword: "admin123",
};

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ---------- Auth ----------
      login: (password) => {
        const ok = password === get().adminPassword;
        if (ok) set({ isAdmin: true });
        return ok;
      },
      logout: () => set({ isAdmin: false }),
      changePassword: (next) => set({ adminPassword: next }),

      // ---------- Company ----------
      updateCompany: (patch) =>
        set((s) => ({ company: { ...s.company, ...patch } })),
      setPartnerBrands: (next) => set({ partnerBrands: next }),

      // ---------- Stats ----------
      updateStat: (id, patch) =>
        set((s) => ({
          heroStats: s.heroStats.map((st) => (st.id === id ? { ...st, ...patch } : st)),
        })),

      // ---------- Values ----------
      upsertValue: (item) =>
        set((s) => {
          const exists = s.values.some((v) => v.id === item.id);
          return {
            values: exists
              ? s.values.map((v) => (v.id === item.id ? item : v))
              : [...s.values, item],
          };
        }),
      removeValue: (id) =>
        set((s) => ({ values: s.values.filter((v) => v.id !== id) })),

      // ---------- Services ----------
      upsertService: (item) =>
        set((s) => {
          const exists = s.services.some((v) => v.id === item.id);
          return {
            services: exists
              ? s.services.map((v) => (v.id === item.id ? item : v))
              : [...s.services, item],
          };
        }),
      removeService: (id) =>
        set((s) => ({ services: s.services.filter((v) => v.id !== id) })),

      // ---------- Products ----------
      upsertProduct: (item) =>
        set((s) => {
          const exists = s.products.some((v) => v.id === item.id);
          return {
            products: exists
              ? s.products.map((v) => (v.id === item.id ? item : v))
              : [...s.products, item],
          };
        }),
      removeProduct: (id) =>
        set((s) => ({ products: s.products.filter((v) => v.id !== id) })),

      // ---------- Industries ----------
      upsertIndustry: (item) =>
        set((s) => {
          const exists = s.industries.some((v) => v.id === item.id);
          return {
            industries: exists
              ? s.industries.map((v) => (v.id === item.id ? item : v))
              : [...s.industries, item],
          };
        }),
      removeIndustry: (id) =>
        set((s) => ({ industries: s.industries.filter((v) => v.id !== id) })),

      // ---------- Why Choose Us ----------
      upsertWhyChooseUs: (item) =>
        set((s) => {
          const exists = s.whyChooseUs.some((v) => v.id === item.id);
          return {
            whyChooseUs: exists
              ? s.whyChooseUs.map((v) => (v.id === item.id ? item : v))
              : [...s.whyChooseUs, item],
          };
        }),
      removeWhyChooseUs: (id) =>
        set((s) => ({ whyChooseUs: s.whyChooseUs.filter((v) => v.id !== id) })),

      // ---------- Process ----------
      upsertProcessStep: (item) =>
        set((s) => {
          const exists = s.processSteps.some((v) => v.id === item.id);
          return {
            processSteps: exists
              ? s.processSteps.map((v) => (v.id === item.id ? item : v))
              : [...s.processSteps, item],
          };
        }),
      removeProcessStep: (id) =>
        set((s) => ({ processSteps: s.processSteps.filter((v) => v.id !== id) })),

      // ---------- Testimonials ----------
      upsertTestimonial: (item) =>
        set((s) => {
          const exists = s.testimonials.some((v) => v.id === item.id);
          return {
            testimonials: exists
              ? s.testimonials.map((v) => (v.id === item.id ? item : v))
              : [...s.testimonials, item],
          };
        }),
      removeTestimonial: (id) =>
        set((s) => ({ testimonials: s.testimonials.filter((v) => v.id !== id) })),

      // ---------- Insights ----------
      upsertInsight: (item) =>
        set((s) => {
          const exists = s.insights.some((v) => v.id === item.id);
          return {
            insights: exists
              ? s.insights.map((v) => (v.id === item.id ? item : v))
              : [...s.insights, item],
          };
        }),
      removeInsight: (id) =>
        set((s) => ({ insights: s.insights.filter((v) => v.id !== id) })),

      // ---------- Inquiries ----------
      addInquiry: (inq) => {
        const record: Inquiry = {
          ...inq,
          id: uid("inq"),
          receivedAt: new Date().toISOString(),
          status: "new",
          reference: `MCH-${Date.now().toString(36).toUpperCase()}`,
        };
        set((s) => ({ inquiries: [record, ...s.inquiries] }));
        return record;
      },
      updateInquiryStatus: (id, status) =>
        set((s) => ({
          inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
        })),
      removeInquiry: (id) =>
        set((s) => ({ inquiries: s.inquiries.filter((i) => i.id !== id) })),

      // ---------- Maintenance ----------
      resetToSeed: () => set({ ...initialState, isAdmin: get().isAdmin, adminPassword: get().adminPassword }),
    }),
    {
      name: "mechaura-content-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

// Helper hook for components that only need a slice of state
export function useContent<T>(selector: (s: ContentState) => T): T {
  return useContentStore(selector);
}

// ID generator for admin forms
export { uid as newId };
