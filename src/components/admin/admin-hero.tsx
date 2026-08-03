"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Layout, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MediaUpload } from "@/components/admin/media-upload";
import { AdminField, AdminTextInput } from "@/components/admin/admin-shared";
import { toast } from "@/hooks/use-toast";

interface HeroData {
  id: string;
  badgeText: string;
  showBadge: boolean;
  headline: string;
  subheadline: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
  backgroundImage: string;
  overlayOpacity: number;
  showStats: boolean;
}

export function AdminHero() {
  const [data, setData] = React.useState<HeroData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/content/hero")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hero:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update hero section");

      const updated = await res.json();
      setData(updated);
      setSuccess(true);
      toast({ title: "Hero updated", description: "Changes published to live site." });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err?.message || "Could not save hero section.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <RefreshCw className="size-5 animate-spin mr-2" />
        Loading Hero settings...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load Hero settings. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Hero Section Editor
          </h2>
          <p className="text-xs text-muted-foreground">
            Customize the main banner badge, headline, subheadline, CTA buttons, background image, overlay, and stats bar.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="brand" className="gap-2">
          {saving ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="size-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form Fields */}
        <div className="space-y-6 lg:col-span-7">
          {/* Eyebrow Badge Settings */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground">Hero Eyebrow Badge</Label>
                <p className="text-xs text-muted-foreground">Pill badge shown above the main title.</p>
              </div>
              <Switch
                checked={data.showBadge}
                onCheckedChange={(checked) => setData({ ...data, showBadge: checked })}
              />
            </div>
            {data.showBadge && (
              <AdminField label="Badge Text">
                <Input
                  value={data.badgeText ?? "UAE-Based Industrial Supplier · Est. 2019"}
                  onChange={(e) => setData({ ...data, badgeText: e.target.value })}
                  placeholder="UAE-Based Industrial Supplier · Est. 2019"
                  className="font-medium"
                />
              </AdminField>
            )}
          </div>
          <AdminField label="Headline" hint="Main title shown on homepage hero banner.">
            <Input
              value={data.headline}
              onChange={(e) => setData({ ...data, headline: e.target.value })}
              placeholder="Your Industrial Partner for Quality..."
              className="font-medium"
            />
          </AdminField>

          <AdminField label="Subheadline / Short Description">
            <Textarea
              value={data.subheadline}
              onChange={(e) => setData({ ...data, subheadline: e.target.value })}
              rows={3}
              placeholder="UAE-based industrial supplier..."
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Primary Button Text">
              <AdminTextInput
                value={data.ctaPrimaryText}
                onChange={(v) => setData({ ...data, ctaPrimaryText: v })}
                placeholder="Request a Quote"
              />
            </AdminField>
            <AdminField label="Primary Button URL">
              <AdminTextInput
                value={data.ctaPrimaryHref}
                onChange={(v) => setData({ ...data, ctaPrimaryHref: v })}
                placeholder="/contact"
              />
            </AdminField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Secondary Button Text">
              <AdminTextInput
                value={data.ctaSecondaryText}
                onChange={(v) => setData({ ...data, ctaSecondaryText: v })}
                placeholder="Browse Products"
              />
            </AdminField>
            <AdminField label="Secondary Button URL">
              <AdminTextInput
                value={data.ctaSecondaryHref}
                onChange={(v) => setData({ ...data, ctaSecondaryHref: v })}
                placeholder="/products"
              />
            </AdminField>
          </div>

          <MediaUpload
            label="Background Image / Video"
            value={data.backgroundImage}
            onChange={(url) => setData({ ...data, backgroundImage: url })}
            hint="High-resolution hero background image or looping video URL."
          />

          <AdminField label={`Dark Overlay Opacity (${Math.round(data.overlayOpacity * 100)}%)`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={data.overlayOpacity}
              onChange={(e) => setData({ ...data, overlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-brand cursor-pointer"
            />
          </AdminField>

          {/* Stats Bar Toggle */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold text-foreground">Hero Counter Stats Bar</Label>
              <p className="text-xs text-muted-foreground">Show counter stats bar below the hero CTAs (6+ Years, 500+ Clients, etc.)</p>
            </div>
            <Switch
              checked={data.showStats ?? true}
              onCheckedChange={(checked) => setData({ ...data, showStats: checked })}
            />
          </div>
        </div>

        {/* Live Scaled Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 rounded-2xl border border-border/70 bg-card p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Live Scaled Preview</span>
              <span className="rounded bg-brand/10 text-brand px-2 py-0.5 text-[10px]">Desktop</span>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 p-6 flex flex-col justify-center text-white shadow-inner">
              {/* Background image preview */}
              {data.backgroundImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{ backgroundImage: `url(${data.backgroundImage})` }}
                />
              )}
              {/* Dark overlay */}
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: data.overlayOpacity }}
              />

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <h3 className="font-display text-lg font-bold leading-tight line-clamp-2">
                  {data.headline || "Headline Preview"}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {data.subheadline || "Subheadline text preview..."}
                </p>
                <div className="pt-2 flex gap-2">
                  <div className="rounded-md bg-brand px-3 py-1 text-[10px] font-semibold text-brand-foreground shadow">
                    {data.ctaPrimaryText || "Button 1"}
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/10 px-3 py-1 text-[10px] font-medium backdrop-blur">
                    {data.ctaSecondaryText || "Button 2"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
