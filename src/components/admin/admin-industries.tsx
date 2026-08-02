"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore, newId } from "@/lib/store";
import type { Industry } from "@/lib/content";
import { Icon } from "@/components/icon";
import { AdminModal, AdminField, IconPicker } from "@/components/admin/admin-shared";

const blank = (): Industry => ({
  id: newId("ind"),
  slug: "",
  name: "",
  description: "",
  icon: "factory",
});

export function AdminIndustries() {
  const industries = useContentStore((s) => s.industries);
  const upsert = useContentStore((s) => s.upsertIndustry);
  const remove = useContentStore((s) => s.removeIndustry);

  const [editing, setEditing] = React.useState<Industry | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<Industry | null>(null);

  const startNew = () => { setEditing(blank()); setIsNew(true); };
  const startEdit = (i: Industry) => { setEditing({ ...i }); setIsNew(false); };
  const save = () => {
    if (!editing || !editing.name.trim()) return;
    const slug = editing.slug.trim() || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    upsert({
      ...editing,
      name: editing.name.trim(),
      slug,
      description: editing.description?.trim() || "",
      icon: editing.icon || "factory",
    });
    setEditing(null);
  };
  const update = (patch: Partial<Industry>) => editing && setEditing({ ...editing, ...patch });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="brand" size="sm" onClick={startNew}>
          <Plus className="size-4" />
          Add Industry
        </Button>
      </div>

      {industries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Factory className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No industries yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <motion.div
              key={industry.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                  <Icon name={industry.icon as any} className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-semibold text-foreground">{industry.name}</h3>
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{industry.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(industry)}>
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(industry)}>
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
        title={isNew ? "Add New Industry" : "Edit Industry"}
        onSave={save}
        saveLabel={isNew ? "Create" : "Save Changes"}
      >
        {editing && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Name" required>
                <Input value={editing.name} onChange={(e) => update({ name: e.target.value })} placeholder="Manufacturing" />
              </AdminField>
              <AdminField label="Slug" hint="Auto-generated if blank.">
                <Input value={editing.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="manufacturing" />
              </AdminField>
            </div>
            <AdminField label="Description" required>
              <Textarea value={editing.description} onChange={(e) => update({ description: e.target.value })} rows={4} />
            </AdminField>
            <AdminField label="Icon">
              <IconPicker value={editing.icon} onChange={(icon) => update({ icon })} />
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
              <h3 className="font-display text-lg font-semibold text-foreground">Delete &ldquo;{confirmDelete.name}&rdquo;?</h3>
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
