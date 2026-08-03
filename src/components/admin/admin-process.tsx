"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminField } from "@/components/admin/admin-shared";
import { toast } from "@/hooks/use-toast";

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  order: number;
}

export function AdminProcess() {
  const [steps, setSteps] = React.useState<ProcessStep[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/content/process-steps")
      .then((r) => r.json())
      .then((data) => {
        setSteps(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = (id: string, patch: Partial<ProcessStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const step of steps) {
        await fetch("/api/content/process-steps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(step),
        });
      }
      toast({ title: "Process steps saved", description: `${steps.length} steps updated.` });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addNew = () => {
    const num = steps.length + 1;
    const newStep: ProcessStep = {
      id: `step_${Date.now().toString(36)}`,
      number: String(num).padStart(2, "0"),
      title: `Step ${num}`,
      description: "Description of this process step.",
      order: steps.length,
    };
    setSteps((prev) => [...prev, newStep]);
    setExpanded(newStep.id);
  };

  const remove = async (id: string) => {
    try {
      await fetch("/api/content/process-steps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSteps((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Step deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <RefreshCw className="size-5 animate-spin mr-2" />
        Loading process steps...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Process Steps
          </h2>
          <p className="text-xs text-muted-foreground">
            The numbered steps shown in the "How It Works" / Process section.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addNew} variant="outline" size="sm" className="gap-2">
            <Plus className="size-4" /> Add Step
          </Button>
          <Button onClick={saveAll} disabled={saving} variant="brand" size="sm" className="gap-2">
            {saving ? <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="size-3.5" />}
            {saving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === step.id ? null : step.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="font-display text-2xl font-bold text-brand/30 tabular-nums w-8">
                  {step.number}
                </span>
                <span className="flex-1 font-medium text-sm text-foreground">{step.title}</span>
                {expanded === step.id ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expanded === step.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/40 px-4 pb-4 pt-4 space-y-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-4">
                      <AdminField label="Step Number">
                        <Input
                          value={step.number}
                          onChange={(e) => update(step.id, { number: e.target.value })}
                          className="font-mono"
                        />
                      </AdminField>
                      <div className="sm:col-span-3">
                        <AdminField label="Title">
                          <Input value={step.title} onChange={(e) => update(step.id, { title: e.target.value })} />
                        </AdminField>
                      </div>
                    </div>
                    <AdminField label="Description">
                      <Textarea
                        value={step.description}
                        onChange={(e) => update(step.id, { description: e.target.value })}
                        rows={3}
                      />
                    </AdminField>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive gap-2"
                        onClick={() => remove(step.id)}
                      >
                        <Trash2 className="size-4" /> Delete Step
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
