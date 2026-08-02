"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore, newId } from "@/lib/store";
import type { ServiceItem } from "@/lib/content";
import { Icon } from "@/components/icon";
import { AdminModal, AdminField, IconPicker, StringListEditor } from "@/components/admin/admin-shared";

const blankService = (): ServiceItem => ({
  id: newId("svc"),
  number: "01",
  title: "",
  summary: "",
  description: "",
  features: [],
  icon: "wrench",
  image: "/images/services/industrial-tools.png",
});

const SERVICE_IMAGE_OPTIONS = [
  { label: "Industrial Tools", value: "/images/services/industrial-tools.png" },
  { label: "Specialized Brushes", value: "/images/services/specialized-brushes.png" },
  { label: "Industrial Equipment", value: "/images/services/industrial-equipment.png" },
];

export function AdminServices() {
  const services = useContentStore((s) => s.services);
  const upsertService = useContentStore((s) => s.upsertService);
  const removeService = useContentStore((s) => s.removeService);

  const [editing, setEditing] = React.useState<ServiceItem | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState<ServiceItem | null>(null);

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  const startNew = () => {
    const next = blankService();
    next.number = String(services.length + 1).padStart(2, "0");
    setEditing(next);
    setIsNew(true);
  };
  const startEdit = (s: ServiceItem) => {
    setEditing({ ...s });
    setIsNew(false);
  };
  const save = () => {
    if (!editing || !editing.title.trim()) return;
    upsertService({
      ...editing,
      title: editing.title.trim(),
      number: editing.number?.trim() || "01",
      summary: editing.summary?.trim() || "",
      description: editing.description?.trim() || "",
      features: Array.isArray(editing.features) ? editing.features.filter(Boolean) : [],
      icon: editing.icon || "wrench",
      image: editing.image?.trim() || "/images/services/industrial-tools.png",
    });
    setEditing(null);
  };
  const update = (patch: Partial<ServiceItem>) =>
    editing && setEditing({ ...editing, ...patch });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services…" className="pl-9" />
        </div>
        <Button variant="brand" size="sm" onClick={startNew}>
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Wrench className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No services yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <div className="flex">
                <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-gradient-to-br from-brand/10 via-card to-background">
                  <Image src={service.image || "/images/services/industrial-tools.png"} alt={service.title} fill sizes="128px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <span className="absolute left-2 top-2 font-display text-2xl font-bold text-foreground/30">{service.number}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-md bg-brand/10 text-brand">
                        <Icon name={service.icon as any} className="size-4" />
                      </div>
                      <h3 className="font-display text-sm font-semibold text-foreground">{service.title}</h3>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{service.summary}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(service)}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(service)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={isNew ? "Add New Service" : "Edit Service"}
        onSave={save}
        saveLabel={isNew ? "Create Service" : "Save Changes"}
        size="xl"
      >
        {editing && (
          <div className="space-y-5">
            <div className="relative aspect-[16/6] overflow-hidden rounded-xl border border-border/60">
              <Image src={editing.image || "/images/services/industrial-tools.png"} alt="Preview" fill sizes="768px" className="object-cover" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <AdminField label="Number">
                <Input value={editing.number} onChange={(e) => update({ number: e.target.value })} placeholder="01" />
              </AdminField>
              <AdminField label="Title" required>
                <Input value={editing.title} onChange={(e) => update({ title: e.target.value })} placeholder="Industrial Tools" />
              </AdminField>
              <AdminField label="Icon">
                <IconPicker value={editing.icon} onChange={(icon) => update({ icon })} />
              </AdminField>
            </div>

            <AdminField label="Summary" required hint="Short text shown on the service card.">
              <Textarea value={editing.summary} onChange={(e) => update({ summary: e.target.value })} rows={2} />
            </AdminField>

            <AdminField label="Full Description" required hint="Shown when users read more.">
              <Textarea value={editing.description} onChange={(e) => update({ description: e.target.value })} rows={4} />
            </AdminField>

            <AdminField label="Service Image">
              <Input value={editing.image} onChange={(e) => update({ image: e.target.value })} />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SERVICE_IMAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ image: opt.value })}
                    className={`rounded-md border px-2 py-1 text-[10px] transition-colors ${
                      editing.image === opt.value
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </AdminField>

            <StringListEditor
              label="Features"
              items={editing.features}
              onChange={(features) => update({ features })}
              placeholder="Add a feature…"
            />
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
              <h3 className="font-display text-lg font-semibold text-foreground">Delete &ldquo;{confirmDelete.title}&rdquo;?</h3>
              <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => { removeService(confirmDelete.id); setConfirmDelete(null); }}>
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
