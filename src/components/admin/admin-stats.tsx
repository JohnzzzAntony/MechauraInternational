"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, Plus, Trash2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminField } from "@/components/admin/admin-shared";
import { toast } from "@/hooks/use-toast";

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  order: number;
}

export function AdminStats() {
  const [stats, setStats] = React.useState<StatItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/content/hero-stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = (id: string, patch: Partial<StatItem>) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const save = async (stat: StatItem) => {
    setSaving(stat.id);
    try {
      const res = await fetch("/api/content/hero-stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Stat updated", description: `"${stat.label}" saved.` });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <RefreshCw className="size-5 animate-spin mr-2" />
        Loading stats...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Hero Counter Stats
        </h2>
        <p className="text-xs text-muted-foreground">
          The 4 animated counters shown below the hero CTA buttons (e.g. "6+ Years", "500+ Clients").
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-brand" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Stat {idx + 1}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AdminField label="Numeric Value">
                <Input
                  type="number"
                  value={stat.value}
                  onChange={(e) => update(stat.id, { value: parseInt(e.target.value) || 0 })}
                  className="font-mono"
                />
              </AdminField>
              <AdminField label="Suffix (e.g. +, %)">
                <Input
                  value={stat.suffix}
                  onChange={(e) => update(stat.id, { suffix: e.target.value })}
                  placeholder="+"
                  className="font-mono"
                />
              </AdminField>
            </div>

            <AdminField label="Label (shown below number)">
              <Input
                value={stat.label}
                onChange={(e) => update(stat.id, { label: e.target.value })}
                placeholder="Years Experience"
              />
            </AdminField>

            {/* Preview */}
            <div className="rounded-lg bg-background/60 border border-border/40 p-4 text-center">
              <div className="font-display text-3xl font-bold text-foreground">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>

            <Button
              onClick={() => save(stat)}
              disabled={saving === stat.id}
              variant="brand"
              size="sm"
              className="w-full gap-2"
            >
              {saving === stat.id ? (
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="size-3.5" />
              )}
              {saving === stat.id ? "Saving…" : "Save Stat"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
