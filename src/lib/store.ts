"use client";

/**
 * Mechaura Content Store — Database-backed
 *
 * All mutations now proxy through the server API so data is permanently stored
 * in Neon PostgreSQL. On first mount the store hydrates from the API (not from
 * localStorage). Auth state (isAdmin, adminPassword) is still stored in
 * localStorage since it is UI-only and not sensitive content.
 */

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

async function api<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${method} ${url} failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// State shape
// ─────────────────────────────────────────────────────────────────────────────

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

  // Hydration flag
  hydrated: boolean;

  // Auth (persisted locally — not sensitive content)
  isAdmin: boolean;
  adminPassword: string;

  // ── Hydration ────────────────────────────────────────────────────────────
  hydrate: () => Promise<void>;

  // ── Auth actions ────────────────────────────────────────────────────────
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (next: string) => void;

  // ── Company actions ─────────────────────────────────────────────────────
  updateCompany: (patch: Partial<CompanyInfo>) => Promise<void>;
  setPartnerBrands: (next: string[]) => Promise<void>;

  // ── Stats actions ────────────────────────────────────────────────────────
  updateStat: (id: string, patch: Partial<StatItem>) => Promise<void>;

  // ── Values ───────────────────────────────────────────────────────────────
  upsertValue: (item: ValueItem) => Promise<void>;
  removeValue: (id: string) => Promise<void>;

  // ── Services ─────────────────────────────────────────────────────────────
  upsertService: (item: ServiceItem) => Promise<void>;
  removeService: (id: string) => Promise<void>;

  // ── Products ─────────────────────────────────────────────────────────────
  upsertProduct: (item: ProductCategory) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;

  // ── Industries ───────────────────────────────────────────────────────────
  upsertIndustry: (item: Industry) => Promise<void>;
  removeIndustry: (id: string) => Promise<void>;

  // ── Why Choose Us ─────────────────────────────────────────────────────────
  upsertWhyChooseUs: (item: WhyChooseUsItem) => Promise<void>;
  removeWhyChooseUs: (id: string) => Promise<void>;

  // ── Process ───────────────────────────────────────────────────────────────
  upsertProcessStep: (item: ProcessStep) => Promise<void>;
  removeProcessStep: (id: string) => Promise<void>;

  // ── Testimonials ──────────────────────────────────────────────────────────
  upsertTestimonial: (item: Testimonial) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;

  // ── Insights ──────────────────────────────────────────────────────────────
  upsertInsight: (item: InsightPost) => Promise<void>;
  removeInsight: (id: string) => Promise<void>;

  // ── Inquiries ─────────────────────────────────────────────────────────────
  addInquiry: (inq: Omit<Inquiry, "id" | "receivedAt" | "status" | "reference">) => Inquiry;
  loadInquiries: () => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => Promise<void>;
  removeInquiry: (id: string) => Promise<void>;

  // ── Maintenance ───────────────────────────────────────────────────────────
  resetToSeed: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback seed state (shown before DB hydration)
// ─────────────────────────────────────────────────────────────────────────────

const seedState = {
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
  hydrated: false,
  isAdmin: false,
  adminPassword: "Mechaura123",
};

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      ...seedState,

      // ── Hydrate from DB (called once on mount) ──────────────────────────
      hydrate: async () => {
        if (get().hydrated) return;
        try {
          const results = await Promise.allSettled([
            api<any>("/api/content/company", "GET"),
            api<StatItem[]>("/api/content/hero-stats", "GET"),
            api<ValueItem[]>("/api/content/values", "GET"),
            api<ServiceItem[]>("/api/content/services", "GET"),
            api<ProductCategory[]>("/api/content/products", "GET"),
            api<Industry[]>("/api/content/industries", "GET"),
            api<WhyChooseUsItem[]>("/api/content/why-choose-us", "GET"),
            api<ProcessStep[]>("/api/content/process-steps", "GET"),
            api<Testimonial[]>("/api/content/testimonials", "GET"),
            api<InsightPost[]>("/api/content/insights", "GET"),
            api<{ inquiries: Inquiry[] }>("/api/inquiries", "GET"),
          ]);

          const getValue = <T>(index: number, fallback: any): T => {
            const res = results[index];
            if (res.status === "fulfilled" && res.value) return res.value as T;
            console.error(`[store] Hydration endpoint ${index} failed:`, res.status === "rejected" ? res.reason : "Empty result");
            return fallback;
          };

          const company = getValue<any>(0, {});
          const heroStats = getValue<StatItem[]>(1, seedStats);
          const values = getValue<ValueItem[]>(2, seedValues);
          const services = getValue<ServiceItem[]>(3, seedServices);
          const products = getValue<ProductCategory[]>(4, seedProducts);
          const industries = getValue<Industry[]>(5, seedIndustries);
          const whyChooseUs = getValue<WhyChooseUsItem[]>(6, seedWhyChooseUs);
          const processSteps = getValue<ProcessStep[]>(7, seedProcessSteps);
          const testimonials = getValue<Testimonial[]>(8, seedTestimonials);
          const insights = getValue<InsightPost[]>(9, seedInsights);
          const inquiryRes = getValue<{ inquiries: Inquiry[] }>(10, { inquiries: [] });

          set({
            company: {
              ...seedCompany,
              ...company,
              // Ensure nested social object is correct shape
              social: company.social ?? seedCompany.social,
            },
            partnerBrands: company.partnerBrands ?? seedPartnerBrands,
            heroStats,
            values,
            services,
            products,
            industries,
            whyChooseUs,
            processSteps,
            testimonials,
            insights,
            inquiries: inquiryRes.inquiries ?? [],
            hydrated: true,
          });
        } catch (err) {
          console.error("[store] Hydration failed entirely:", err);
          set({ hydrated: true });
        }
      },

      // ── Auth ─────────────────────────────────────────────────────────────
      login: (password) => {
        const ok = password === get().adminPassword;
        if (ok) set({ isAdmin: true });
        return ok;
      },
      logout: () => set({ isAdmin: false }),
      changePassword: (next) => set({ adminPassword: next }),

      // ── Company ───────────────────────────────────────────────────────────
      updateCompany: async (patch) => {
        const merged = { ...get().company, ...patch };
        set({ company: merged });
        await api("/api/content/company", "PUT", merged);
      },
      setPartnerBrands: async (next) => {
        set({ partnerBrands: next });
        await api("/api/content/company", "PUT", { partnerBrands: next });
      },

      // ── Stats ─────────────────────────────────────────────────────────────
      updateStat: async (id, patch) => {
        set((s) => ({
          heroStats: s.heroStats.map((st) => (st.id === id ? { ...st, ...patch } : st)),
        }));
        const updated = get().heroStats.find((s) => s.id === id)!;
        await api("/api/content/hero-stats", "PUT", updated);
      },

      // ── Values ─────────────────────────────────────────────────────────────
      upsertValue: async (item) => {
        if (!item.id) item.id = uid("val");
        set((s) => {
          const exists = s.values.some((v) => v.id === item.id);
          return {
            values: exists
              ? s.values.map((v) => (v.id === item.id ? item : v))
              : [...s.values, item],
          };
        });
        await api("/api/content/values", "POST", item);
      },
      removeValue: async (id) => {
        set((s) => ({ values: s.values.filter((v) => v.id !== id) }));
        await api("/api/content/values", "DELETE", { id });
      },

      // ── Services ───────────────────────────────────────────────────────────
      upsertService: async (item) => {
        if (!item.id) item.id = uid("srv");
        set((s) => {
          const exists = s.services.some((v) => v.id === item.id);
          return {
            services: exists
              ? s.services.map((v) => (v.id === item.id ? item : v))
              : [...s.services, item],
          };
        });
        await api("/api/content/services", "POST", item);
      },
      removeService: async (id) => {
        set((s) => ({ services: s.services.filter((v) => v.id !== id) }));
        await api("/api/content/services", "DELETE", { id });
      },

      // ── Products ───────────────────────────────────────────────────────────
      upsertProduct: async (item) => {
        if (!item.id) item.id = uid("prd");
        set((s) => {
          const exists = s.products.some((v) => v.id === item.id);
          return {
            products: exists
              ? s.products.map((v) => (v.id === item.id ? item : v))
              : [...s.products, item],
          };
        });
        await api("/api/content/products", "POST", item);
      },
      removeProduct: async (id) => {
        set((s) => ({ products: s.products.filter((v) => v.id !== id) }));
        await api("/api/content/products", "DELETE", { id });
      },

      // ── Industries ─────────────────────────────────────────────────────────
      upsertIndustry: async (item) => {
        if (!item.id) item.id = uid("ind");
        set((s) => {
          const exists = s.industries.some((v) => v.id === item.id);
          return {
            industries: exists
              ? s.industries.map((v) => (v.id === item.id ? item : v))
              : [...s.industries, item],
          };
        });
        await api("/api/content/industries", "POST", item);
      },
      removeIndustry: async (id) => {
        set((s) => ({ industries: s.industries.filter((v) => v.id !== id) }));
        await api("/api/content/industries", "DELETE", { id });
      },

      // ── Why Choose Us ──────────────────────────────────────────────────────
      upsertWhyChooseUs: async (item) => {
        if (!item.id) item.id = uid("wcu");
        set((s) => {
          const exists = s.whyChooseUs.some((v) => v.id === item.id);
          return {
            whyChooseUs: exists
              ? s.whyChooseUs.map((v) => (v.id === item.id ? item : v))
              : [...s.whyChooseUs, item],
          };
        });
        await api("/api/content/why-choose-us", "POST", item);
      },
      removeWhyChooseUs: async (id) => {
        set((s) => ({ whyChooseUs: s.whyChooseUs.filter((v) => v.id !== id) }));
        await api("/api/content/why-choose-us", "DELETE", { id });
      },

      // ── Process Steps ──────────────────────────────────────────────────────
      upsertProcessStep: async (item) => {
        if (!item.id) item.id = uid("stp");
        set((s) => {
          const exists = s.processSteps.some((v) => v.id === item.id);
          return {
            processSteps: exists
              ? s.processSteps.map((v) => (v.id === item.id ? item : v))
              : [...s.processSteps, item],
          };
        });
        await api("/api/content/process-steps", "POST", item);
      },
      removeProcessStep: async (id) => {
        set((s) => ({ processSteps: s.processSteps.filter((v) => v.id !== id) }));
        await api("/api/content/process-steps", "DELETE", { id });
      },

      // ── Testimonials ───────────────────────────────────────────────────────
      upsertTestimonial: async (item) => {
        if (!item.id) item.id = uid("tst");
        set((s) => {
          const exists = s.testimonials.some((v) => v.id === item.id);
          return {
            testimonials: exists
              ? s.testimonials.map((v) => (v.id === item.id ? item : v))
              : [...s.testimonials, item],
          };
        });
        await api("/api/content/testimonials", "POST", item);
      },
      removeTestimonial: async (id) => {
        set((s) => ({ testimonials: s.testimonials.filter((v) => v.id !== id) }));
        await api("/api/content/testimonials", "DELETE", { id });
      },

      // ── Insights ───────────────────────────────────────────────────────────
      upsertInsight: async (item) => {
        if (!item.id) item.id = uid("ins");
        set((s) => {
          const exists = s.insights.some((v) => v.id === item.id);
          return {
            insights: exists
              ? s.insights.map((v) => (v.id === item.id ? item : v))
              : [...s.insights, item],
          };
        });
        await api("/api/content/insights", "POST", item);
      },
      removeInsight: async (id) => {
        set((s) => ({ insights: s.insights.filter((v) => v.id !== id) }));
        await api("/api/content/insights", "DELETE", { id });
      },

      // ── Inquiries ──────────────────────────────────────────────────────────
      // Note: addInquiry is kept sync (contact form uses /api/contact directly)
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
      loadInquiries: async () => {
        const res = await api<{ inquiries: Inquiry[] }>("/api/inquiries", "GET");
        set({ inquiries: res.inquiries ?? [] });
      },
      updateInquiryStatus: async (id, status) => {
        set((s) => ({
          inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
        }));
        await api("/api/inquiries", "PUT", { id, status });
      },
      removeInquiry: async (id) => {
        set((s) => ({ inquiries: s.inquiries.filter((i) => i.id !== id) }));
        await api("/api/inquiries", "DELETE", { id });
      },

      // ── Maintenance ────────────────────────────────────────────────────────
      resetToSeed: () =>
        set({
          ...seedState,
          isAdmin: get().isAdmin,
          adminPassword: get().adminPassword,
        }),
    }),
    {
      // Only persist auth state — content now lives in the DB
      name: "mechaura-auth-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAdmin: state.isAdmin,
        adminPassword: state.adminPassword,
      }),
    },
  ),
);

// ─────────────────────────────────────────────────────────────────────────────
// Helper hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useContent<T>(selector: (s: ContentState) => T): T {
  return useContentStore(selector);
}

// ID generator for admin forms
export { uid as newId };
