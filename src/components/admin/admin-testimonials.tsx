"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore, newId } from "@/lib/store";
import type { Testimonial } from "@/lib/content";
import { AdminModal, AdminField } from "@/components/admin/admin-shared";

const blank = (): Testimonial => ({
  id: newId("t"),
  quote: "",
  name: "",
  company: "",
  initials: "",
});

export function AdminTestimonials() {
  const testimonials = useContentStore((s) => s.testimonials);
  const upsert = useContentStore((s) => s.upsertTestimonial);
  const remove = useContentStore((s) => s.removeTestimonial);

  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<Testimonial | null>(null);

  const startNew = () => { setEditing(blank()); setIsNew(true); };
  const startEdit = (t: Testimonial) => { setEditing({ ...t }); setIsNew(false); };
  const save = () => {
    if (!editing || !editing.quote.trim() || !editing.name.trim()) return;
    const initials = editing.initials.trim() || editing.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    upsert({ ...editing, initials });
    setEditing(null);
  };
  const update = (patch: Partial<Testimonial>) => editing && setEditing({ ...editing, ...patch });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="brand" size="sm" onClick={startNew}>
          <Plus className="size-4" />
          Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Quote className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <Quote className="size-6 text-brand/40" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/80 line-clamp-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                  <span className="font-display text-[10px] font-bold">{t.initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.company}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEdit(t)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(t)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={isNew ? "Add Testimonial" : "Edit Testimonial"}
        onSave={save}
        saveLabel={isNew ? "Create" : "Save Changes"}
      >
        {editing && (
          <div className="space-y-5">
            <AdminField label="Quote" required>
              <Textarea value={editing.quote} onChange={(e) => update({ quote: e.target.value })} rows={4} placeholder="What did the client say?" />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Name" required>
                <Input value={editing.name} onChange={(e) => update({ name: e.target.value })} placeholder="Operations Manager" />
              </AdminField>
              <AdminField label="Company" required>
                <Input value={editing.company} onChange={(e) => update({ company: e.target.value })} placeholder="Steel Plant, Sharjah" />
              </AdminField>
            </div>
            <AdminField label="Initials" hint="Auto-generated from name if blank.">
              <Input value={editing.initials} onChange={(e) => update({ initials: e.target.value })} placeholder="OM" maxLength={2} />
            </AdminField>
          </div>
        )}
      </AdminModal>

      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirmDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-semibold text-foreground">Delete this testimonial?</h3>
              <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => { remove(confirmDelete.id); setConfirmDelete(null); }}>Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
