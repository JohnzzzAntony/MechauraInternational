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
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContentStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminProducts } from "@/components/admin/admin-products";
import { AdminServices } from "@/components/admin/admin-services";
import { AdminIndustries } from "@/components/admin/admin-industries";
import { AdminTestimonials } from "@/components/admin/admin-testimonials";
import { AdminInsights } from "@/components/admin/admin-insights";
import { AdminCompanySettings } from "@/components/admin/admin-company";
import { AdminInquiries } from "@/components/admin/admin-inquiries";

type AdminView =
  | "dashboard"
  | "products"
  | "services"
  | "industries"
  | "testimonials"
  | "insights"
  | "inquiries"
  | "settings";

const navItems: { id: AdminView; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & quick stats" },
  { id: "products", label: "Products", icon: Package, description: "Manage product catalog" },
  { id: "services", label: "Services", icon: Wrench, description: "Edit service offerings" },
  { id: "industries", label: "Industries", icon: Factory, description: "Industries served" },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote, description: "Client voices" },
  { id: "insights", label: "Insights", icon: Newspaper, description: "Knowledge center posts" },
  { id: "inquiries", label: "Inquiries", icon: Inbox, description: "Contact form submissions" },
  { id: "settings", label: "Settings", icon: Settings, description: "Company info & social" },
];

export function AdminPanel() {
  const isAdmin = useContentStore((s) => s.isAdmin);
  const login = useContentStore((s) => s.login);
  const logout = useContentStore((s) => s.logout);
  const inquiries = useContentStore((s) => s.inquiries);
  const [view, setView] = React.useState<AdminView>("dashboard");
  const [pwd, setPwd] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = login(pwd);
    if (!ok) {
      setError("Incorrect password. Default is admin123 — change it after login.");
    } else {
      setPwd("");
    }
  };

  // ---------- Login gate ----------
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Animated background */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-brand/15 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="absolute left-6 top-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />
              Back to site
            </Button>
          </Link>
        </div>

        <div className="flex min-h-screen items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            <div className="glass rounded-3xl border border-border/60 p-8 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/30">
                  <Lock className="size-7" />
                </div>
                <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
                  Admin Access
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to manage Mechaura International&rsquo;s website content.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-pwd" className="text-sm font-medium">
                    Admin Password
                  </Label>
                  <Input
                    id="admin-pwd"
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="Enter password"
                    autoFocus
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive"
                  >
                    {error}
                  </div>
                )}

                <Button type="submit" variant="brand" size="lg" className="w-full">
                  Sign In
                </Button>
              </form>

              <div className="mt-6 flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/5 p-3 text-xs text-muted-foreground">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-brand" />
                <span>
                  Demo password: <code className="font-mono text-brand">admin123</code> — change
                  it from Settings after login.
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Logo />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ---------- Admin dashboard ----------
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle navigation"
          onClick={() => setSidebarOpen((s) => !s)}
        >
          <LayoutDashboard className="size-5" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <Logo />
              <Link href="/" className="hidden lg:block">
                <Button variant="ghost" size="icon" aria-label="Back to site" title="Back to site">
                  <Eye className="size-4" />
                </Button>
              </Link>
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
                            ? "bg-brand/10 text-brand ring-1 ring-brand/30"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
              <Link href="/">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="size-4" />
                  View Public Site
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={() => {
                  logout();
                  setView("dashboard");
                }}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-screen flex-1 lg:ml-72">
          <div className="border-b border-border bg-background/60 px-6 py-5 backdrop-blur-xl lg:px-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-tag">Admin</div>
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
            {view === "products" && <AdminProducts />}
            {view === "services" && <AdminServices />}
            {view === "industries" && <AdminIndustries />}
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
