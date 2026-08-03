"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Factory,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Inbox,
  LogOut,
  Eye,
  Lock,
  ArrowLeft,
  Sparkles,
  SlidersHorizontal,
  Search as SearchIcon,
  Hash,
  Heart,
  GitBranch,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContentStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminProducts } from "@/components/admin/admin-products";
import { AdminServices } from "@/components/admin/admin-services";
import { AdminIndustries } from "@/components/admin/admin-industries";
import { AdminTestimonials } from "@/components/admin/admin-testimonials";
import { AdminHero } from "@/components/admin/admin-hero";
import { AdminSeo } from "@/components/admin/admin-seo";
import { AdminSections } from "@/components/admin/admin-sections";
import { AdminInsights } from "@/components/admin/admin-insights";
import { AdminCompanySettings } from "@/components/admin/admin-company";
import { AdminInquiries } from "@/components/admin/admin-inquiries";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminValues } from "@/components/admin/admin-values";
import { AdminWhyChooseUs } from "@/components/admin/admin-why-choose-us";
import { AdminProcess } from "@/components/admin/admin-process";

type AdminView =
  | "dashboard"
  | "hero"
  | "stats"
  | "sections"
  | "seo"
  | "products"
  | "services"
  | "industries"
  | "values"
  | "why-choose-us"
  | "process"
  | "testimonials"
  | "insights"
  | "inquiries"
  | "settings";

const navItems: { id: AdminView; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & quick stats" },
  { id: "hero", label: "Hero Banner", icon: Sparkles, description: "Homepage main banner content & imagery" },
  { id: "stats", label: "Counter Stats", icon: Hash, description: "Animated hero stats (6+ Years, 500+ Clients…)" },
  { id: "sections", label: "Layout & Order", icon: SlidersHorizontal, description: "Reorder or hide homepage sections" },
  { id: "seo", label: "SEO & Social", icon: SearchIcon, description: "Meta titles, descriptions, and share cards" },
  { id: "products", label: "Products", icon: Package, description: "Manage product catalog" },
  { id: "services", label: "Services", icon: Wrench, description: "Edit service offerings" },
  { id: "industries", label: "Industries", icon: Factory, description: "Industries served" },
  { id: "values", label: "Core Values", icon: Heart, description: "About section value cards" },
  { id: "why-choose-us", label: "Why Choose Us", icon: CheckSquare, description: "Differentiator cards" },
  { id: "process", label: "Process Steps", icon: GitBranch, description: "How It Works numbered steps" },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote, description: "Client voices" },
  { id: "insights", label: "Insights", icon: Newspaper, description: "Knowledge center posts" },
  { id: "inquiries", label: "Inquiries", icon: Inbox, description: "Contact form submissions" },
  { id: "settings", label: "Settings", icon: Settings, description: "Company info & social" },
];


export function AdminPanel() {
  const storeIsAdmin = useContentStore((s) => s.isAdmin);
  const storeLogin = useContentStore((s) => s.login);
  const storeLogout = useContentStore((s) => s.logout);
  const inquiries = useContentStore((s) => s.inquiries);
  const [view, setView] = React.useState<AdminView>("dashboard");
  const [pwd, setPwd] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState<boolean | null>(null);

  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  React.useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.isLoggedIn || storeIsAdmin))
      .catch(() => setAuthenticated(storeIsAdmin));
  }, [storeIsAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        setAuthenticated(true);
        storeLogin(pwd);
        setPwd("");
      } else {
        const okLocal = storeLogin(pwd);
        if (okLocal) {
          setAuthenticated(true);
          setPwd("");
        } else {
          setError("Incorrect password. Default is Mechaura123");
        }
      }
    } catch {
      const okLocal = storeLogin(pwd);
      if (okLocal) {
        setAuthenticated(true);
        setPwd("");
      } else {
        setError("Incorrect password.");
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    storeLogout();
    setAuthenticated(false);
    setView("dashboard");
  };

  // ---------- Login gate ----------
  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-sm font-medium">Checking Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-brand/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col items-center text-center">
            <Logo size="lg" />
            <h1 className="mt-4 font-display text-xl font-semibold tracking-tight">Admin Authentication</h1>
            <p className="mt-1 text-xs text-muted-foreground">Enter password to access CMS Control Panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Admin Password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="font-mono"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" variant="brand" className="w-full">
              Unlock Panel
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg lg:hidden">
          <Logo size="sm" />
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <LayoutDashboard className="size-5" />
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card/80 backdrop-blur-2xl transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-6">
              <Logo size="md" />
              <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                CMS Control Workspace
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4" aria-label="Admin">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = view === item.id;
                  const badge = item.id === "inquiries" && newInquiriesCount > 0 ? newInquiriesCount : null;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setView(item.id);
                          setSidebarOpen(false);
                        }}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                          isActive
                            ? "bg-brand/10 text-brand ring-1 ring-brand/30 font-semibold"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="flex-1 font-medium">{item.label}</span>
                        {badge !== null && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
                            {badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-border p-4 space-y-2">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="size-4" />
                  View Public Site
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-screen flex-1 lg:ml-72">
          <div className="border-b border-border bg-background/60 px-6 py-5 backdrop-blur-xl lg:px-10 mt-14 lg:mt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-tag">Admin CMS</div>
                <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {navItems.find((n) => n.id === view)?.label}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {navItems.find((n) => n.id === view)?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-10">
            {view === "dashboard" && <AdminDashboard onNavigate={setView} />}
            {view === "hero" && <AdminHero />}
            {view === "stats" && <AdminStats />}
            {view === "sections" && <AdminSections />}
            {view === "seo" && <AdminSeo />}
            {view === "products" && <AdminProducts />}
            {view === "services" && <AdminServices />}
            {view === "industries" && <AdminIndustries />}
            {view === "values" && <AdminValues />}
            {view === "why-choose-us" && <AdminWhyChooseUs />}
            {view === "process" && <AdminProcess />}
            {view === "testimonials" && <AdminTestimonials />}
            {view === "insights" && <AdminInsights />}
            {view === "inquiries" && <AdminInquiries />}
            {view === "settings" && <AdminCompanySettings />}
          </div>
        </main>
      </div>
    </div>
  );
}
