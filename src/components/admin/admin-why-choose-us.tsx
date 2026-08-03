"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminField } from "@/components/admin/admin-shared";
import { toast } from "@/hooks/use-toast";

interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

const ICON_OPTIONS = [
  "Shield", "Award", "Zap", "CheckCircle", "TrendingUp", "Handshake",
  "Globe", "Package", "Truck", "Clock", "Star", "Users", "BarChart",
  "Lock", "Cog", "Target", "Layers", "Lightbulb",
];

export function AdminWhyChooseUs() {
  const [items, setItems] = React.useState<WhyChooseUsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/content/why-choose-us")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = (id: string, patch: Partial<WhyChooseUsItem>) => {
    setItems((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const item of items) {
        await fetch("/api/content/why-choose-us", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      toast({ title: "Why Choose Us saved", description: `${items.length} items updated.` });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addNew = () => {
    const newItem: WhyChooseUsItem = {
      id: `wcu_${Date.now().toString(36)}`,
      title: "New Differentiator",
      description: "Why clients choose Mechaura International.",
      icon: "Shield",
      order: items.length,
    };
    setItems((prev) => [...prev, newItem]);
    setExpanded(newItem.id);
  };

  const remove = async (id: string) => {
    try {
      await fetch("/api/content/why-choose-us", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems((prev) => prev.filter((v) => v.id !== id));
      toast({ title: "Item deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <RefreshCw className="size-5 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Why Choose Us
          </h2>
          <p className="text-xs text-muted-foreground">
            The differentiator cards shown in the "Why Choose Us" section.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addNew} variant="outline" size="sm" className="gap-2">
            <Plus className="size-4" /> Add Item
          </Button>
          <Button onClick={saveAll} disabled={saving} variant="brand" size="sm" className="gap-2">
            {saving ? <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="size-3.5" />}
            {saving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="font-mono text-xs text-brand">{String(idx + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-medium text-sm text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground font-mono">{item.icon}</span>
                {expanded === item.id ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expanded === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/40 px-4 pb-4 pt-4 space-y-4"
                  >
                    <AdminField label="Title">
                      <Input value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} />
                    </AdminField>
                    <AdminField label="Description">
                      <Textarea
                        value={item.description}
                        onChange={(e) => update(item.id, { description: e.target.value })}
                        rows={3}
                      />
                    </AdminField>
                    <AdminField label="Icon Name" hint="Lucide icon name">
                      <div className="space-y-2">
                        <Input
                          value={item.icon}
                          onChange={(e) => update(item.id, { icon: e.target.value })}
                          className="font-mono"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {ICON_OPTIONS.map((ico) => (
                            <button
                              key={ico}
                              type="button"
                              onClick={() => update(item.id, { icon: ico })}
                              className={`rounded px-2 py-1 text-[10px] font-mono transition-colors ${
                                item.icon === ico
                                  ? "bg-brand text-brand-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {ico}
                            </button>
                          ))}
                        </div>
                      </div>
                    </AdminField>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive gap-2"
                        onClick={() => remove(item.id)}
                      >
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
