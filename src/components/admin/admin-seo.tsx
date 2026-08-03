"use client";

import * as React from "react";
import { Search, Globe, Save, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MediaUpload } from "@/components/admin/media-upload";
import { AdminField, AdminTextInput } from "@/components/admin/admin-shared";
import { toast } from "@/hooks/use-toast";

interface PageSeoData {
  id: string;
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
  structuredData: string;
}

const PAGES = [
  { id: "home", label: "Homepage (/)" },
  { id: "about", label: "About Us (/about)" },
  { id: "products", label: "Products Catalog (/products)" },
  { id: "services", label: "Services (/services)" },
  { id: "industries", label: "Industries (/industries)" },
  { id: "insights", label: "Insights / Articles (/insights)" },
  { id: "contact", label: "Contact Us (/contact)" },
];

export function AdminSeo() {
  const [selectedPage, setSelectedPage] = React.useState("home");
  const [data, setData] = React.useState<PageSeoData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const loadPageSeo = React.useCallback(async (page: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/page-seo/${page}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error("Failed to load page SEO:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPageSeo(selectedPage);
  }, [selectedPage, loadPageSeo]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/content/page-seo/${selectedPage}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save SEO metadata");

      toast({ title: "SEO Saved", description: `SEO metadata updated for ${selectedPage}.` });
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err?.message || "Could not save SEO metadata.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            SEO & Social Metadata Manager
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure titles, meta descriptions, OpenGraph share images, and structured data per page.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading} variant="brand" className="gap-2">
          {saving ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="size-4" />
          )}
          Save SEO Settings
        </Button>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-border/60 pb-2 scrollbar-none">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPage(p.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              selectedPage === p.id
                ? "bg-brand text-brand-foreground shadow-sm"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <RefreshCw className="size-5 animate-spin mr-2" />
          Loading SEO configuration...
        </div>
      ) : !data ? (
        <div className="p-8 text-center text-destructive">Failed to load SEO configuration.</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Form */}
          <div className="space-y-6 lg:col-span-7">
            <AdminField
              label={`Page Title (${data.title.length}/60 chars)`}
              hint="Ideal length: 50–60 characters. Appears in search engine result tabs."
            >
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Title..."
                className={data.title.length > 60 ? "border-amber-500" : ""}
              />
            </AdminField>

            <AdminField
              label={`Meta Description (${data.description.length}/160 chars)`}
              hint="Ideal length: 120–158 characters. Appears as the snippet on Google."
            >
              <Textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={3}
                placeholder="Description..."
                className={data.description.length > 160 ? "border-amber-500" : ""}
              />
            </AdminField>

            <MediaUpload
              label="OpenGraph Share Image (Social Preview)"
              value={data.ogImage}
              onChange={(url) => setData({ ...data, ogImage: url })}
              hint="Recommended aspect ratio: 1200 × 630 px."
            />

            <AdminField label="Canonical URL (Optional override)">
              <AdminTextInput
                value={data.canonicalUrl}
                onChange={(v) => setData({ ...data, canonicalUrl: v })}
                placeholder="https://mechaurainternational.com/..."
              />
            </AdminField>

            <div className="flex items-center space-x-2 rounded-xl border border-border/60 bg-muted/20 p-3">
              <Checkbox
                id="noindex"
                checked={data.noIndex}
                onCheckedChange={(c) => setData({ ...data, noIndex: Boolean(c) })}
              />
              <Label htmlFor="noindex" className="text-xs font-medium cursor-pointer">
                Discourage search engines from indexing this page (noindex)
              </Label>
            </div>

            <AdminField
              label="Custom JSON-LD Structured Data"
              hint="Paste valid schema.org JSON-LD blob. Overrides default generated schema."
            >
              <Textarea
                value={data.structuredData}
                onChange={(e) => setData({ ...data, structuredData: e.target.value })}
                rows={4}
                placeholder='{ "@context": "https://schema.org", ... }'
                className="font-mono text-xs"
              />
            </AdminField>
          </div>

          {/* SERP & Social Preview Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Google SERP Preview */}
            <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Search className="size-3.5" />
                <span>Google Search Result Preview</span>
              </div>
              <div className="rounded-xl border border-border/40 bg-background p-4 space-y-1">
                <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                  <span>https://mechaurainternational.com</span>
                  {selectedPage !== "home" && <span>› {selectedPage}</span>}
                </div>
                <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline line-clamp-1 cursor-pointer">
                  {data.title || "Page Title Preview"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">
                  {data.description || "Meta description preview text will appear here..."}
                </p>
              </div>
            </div>

            {/* OpenGraph Social Card Preview */}
            <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Globe className="size-3.5" />
                <span>Social Share Card Preview</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-inner">
                <div
                  className="aspect-[1200/630] w-full bg-cover bg-center bg-muted"
                  style={{ backgroundImage: `url(${data.ogImage || "/images/og/og-image.png"})` }}
                />
                <div className="p-3 bg-card space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    mechaurainternational.com
                  </div>
                  <div className="text-xs font-semibold line-clamp-1">
                    {data.title || "Share Card Title"}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2">
                    {data.description || "Share card description..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
