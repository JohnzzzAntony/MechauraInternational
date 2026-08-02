"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Tag,
  X,
  Share2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { MobileCTA } from "@/components/mobile-cta";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useContentStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { seedInsights, type InsightPost } from "@/lib/content";

export default function InsightsPage() {
  const hydrated = useHydrated();
  const storeInsights = useContentStore((s) => s.insights);
  const posts = hydrated ? storeInsights : seedInsights;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [activeArticle, setActiveArticle] = React.useState<InsightPost | null>(null);

  // Extract categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [posts]);

  // Filtered posts
  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [posts, searchQuery, selectedCategory]);

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
              <span className="text-foreground font-medium">Insights & Guides</span>
            </nav>

            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-mono text-brand mb-4">
                  <BookOpen className="size-3.5" />
                  <span>Technical Knowledge Hub</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Industrial Insights & <span className="text-brand">Technical Guides</span>
                </h1>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
                  Expert advice on abrasive filament selection, surface finishing standards, deburring best practices, and industrial supply chain trends in the GCC.
                </p>
              </motion.div>
            </div>

            {/* Search & Filter */}
            <div className="mt-10 grid gap-4 md:grid-cols-12">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card border-border/80 text-foreground"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 w-full rounded-md border border-border/80 bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Articles Grid ── */}
        <section className="py-16 lg:py-24">
          <Container size="full">
            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <BookOpen className="mx-auto size-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-base font-semibold text-foreground">No articles match your criteria</h3>
                <p className="mt-2 text-xs text-muted-foreground">Try clearing your search or selecting a different category.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
                  >
                    <div className="relative aspect-16/9 w-full overflow-hidden bg-accent/40">
                      <Image
                        src={post.image || "/images/products/industrial-brushes.png"}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-brand backdrop-blur-md font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-brand" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-brand" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                        <button
                          onClick={() => setActiveArticle(post)}
                          className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
                        >
                          Read Technical Article
                          <ArrowUpRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ── Article Reader Modal ── */}
        <Dialog open={!!activeArticle} onOpenChange={(open) => !open && setActiveArticle(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
            {activeArticle && (
              <div>
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="rounded-full bg-brand/10 text-brand px-2.5 py-0.5 font-mono text-[10px]">
                      {activeArticle.category}
                    </span>
                    <span>• {activeArticle.date}</span>
                    <span>• {activeArticle.readTime}</span>
                  </div>
                  <DialogTitle className="text-2xl font-bold sm:text-3xl text-foreground">
                    {activeArticle.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-6">
                  <Image
                    src={activeArticle.image || "/images/products/industrial-brushes.png"}
                    alt={activeArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p className="text-base text-foreground font-medium">
                    {activeArticle.excerpt}
                  </p>
                  <p>
                    Industrial finishing and deburring require strict adherence to filament selection, machine RPM limits, and material compatibility. When selecting brushes for stainless steel, non-ferrous alloys, or composite components, choosing between crimped wire, knotted wire, silicon carbide, or aluminum oxide filaments can drastically impact surface finish Ra values and tool life.
                  </p>
                  <h4 className="text-base font-bold text-foreground pt-2">Key Engineering Recommendations:</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
                      <span><strong>Silicon Carbide Filaments:</strong> Ideal for hard metals and precision deburring where fast cutting action with smooth surface finish is required.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
                      <span><strong>Ceramic Abrasive Filaments:</strong> Highest toughness and resistance to filament fracture under heavy pressure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
                      <span><strong>Stainless Steel Wire:</strong> Essential for avoiding cross-contamination on stainless steel weldments and marine structures.</span>
                    </li>
                  </ul>
                  <p>
                    For specific machinery setups or custom arbor dimensions, our technical engineering team at Mechaura International provides direct consultation to optimize brush speed (SFPM) and fill density.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-mono text-muted-foreground">
                    Published by Mechaura Technical Team
                  </span>
                  <Button asChild variant="brand" size="sm">
                    <Link href="/contact?subject=Technical+Article+Inquiry">
                      Discuss This Topic With an Engineer
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Newsletter Subscribe ── */}
        <section className="py-16 bg-gradient-to-r from-card via-background to-card border-t border-border/40">
          <Container size="full">
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-12 text-center max-w-3xl mx-auto shadow-xl">
              <Mail className="mx-auto size-10 text-brand mb-4" />
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Stay Updated with Technical Specs & GCC Trends
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Subscribe to receive our quarterly technical bulletins, new brush catalog releases, and industrial engineering guides directly to your inbox.
              </p>
              <div className="mt-6 flex max-w-md mx-auto gap-2">
                <Input
                  type="email"
                  placeholder="Enter your business email address..."
                  className="bg-background border-border"
                />
                <Button variant="brand" className="shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <MobileCTA />
    </>
  );
}
