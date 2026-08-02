"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Newspaper, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore, newId } from "@/lib/store";
import type { InsightPost } from "@/lib/content";
import { AdminModal, AdminField } from "@/components/admin/admin-shared";

const blank = (): InsightPost => ({
  id: newId("i"),
  title: "",
  excerpt: "",
  category: "",
  readTime: "8 min read",
  date: new Date().toISOString().slice(0, 10),
  image: "/images/insights/article-1.png",
});

const IMAGE_OPTIONS = [
  { label: "Article 1", value: "/images/insights/article-1.png" },
  { label: "Article 2", value: "/images/insights/article-2.png" },
  { label: "Article 3", value: "/images/insights/article-3.png" },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export function AdminInsights() {
  const insights = useContentStore((s) => s.insights);
  const upsert = useContentStore((s) => s.upsertInsight);
  const remove = useContentStore((s) => s.removeInsight);

  const [editing, setEditing] = React.useState<InsightPost | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<InsightPost | null>(null);

  const startNew = () => { setEditing(blank()); setIsNew(true); };
  const startEdit = (i: InsightPost) => { setEditing({ ...i }); setIsNew(false); };
  const save = () => {
    if (!editing || !editing.title.trim()) return;
    upsert({
      ...editing,
      title: editing.title.trim(),
      excerpt: editing.excerpt?.trim() || "",
      category: editing.category?.trim() || "General",
      readTime: editing.readTime?.trim() || "5 min read",
      date: editing.date || new Date().toISOString().slice(0, 10),
      image: editing.image?.trim() || "/images/insights/article-1.png",
    });
    setEditing(null);
  };
  const update = (patch: Partial<InsightPost>) => editing && setEditing({ ...editing, ...patch });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="brand" size="sm" onClick={startNew}>
          <Plus className="size-4" />
          Add Article
        </Button>
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Newspaper className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No articles yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {insights.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-gradient-to-br from-brand/10 via-card to-background">
                <Image src={post.image || "/images/insights/article-1.png"} alt={post.title} fill sizes="112px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium uppercase tracking-wide text-brand">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-foreground line-clamp-2">{post.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <span className="text-[10px] text-muted-foreground">{formatDate(post.date)}</span>
                  <div className="ml-auto flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => startEdit(post)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setConfirmDelete(post)}>
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
        title={isNew ? "Add Article" : "Edit Article"}
        onSave={save}
        saveLabel={isNew ? "Create" : "Save Changes"}
        size="xl"
      >
        {editing && (
          <div className="space-y-5">
            <div className="relative aspect-[16/7] overflow-hidden rounded-xl border border-border/60">
              <Image src={editing.image} alt="Preview" fill sizes="768px" className="object-cover" />
            </div>

            <AdminField label="Title" required>
              <Input value={editing.title} onChange={(e) => update({ title: e.target.value })} placeholder="How to select the right…" />
            </AdminField>

            <AdminField label="Excerpt" required>
              <Textarea value={editing.excerpt} onChange={(e) => update({ excerpt: e.target.value })} rows={3} />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-3">
              <AdminField label="Category" required>
                <Input value={editing.category} onChange={(e) => update({ category: e.target.value })} placeholder="Maintenance" />
              </AdminField>
              <AdminField label="Read Time">
                <Input value={editing.readTime} onChange={(e) => update({ readTime: e.target.value })} placeholder="8 min read" />
              </AdminField>
              <AdminField label="Date">
                <Input type="date" value={editing.date} onChange={(e) => update({ date: e.target.value })} />
              </AdminField>
            </div>

            <AdminField label="Cover Image">
              <Input value={editing.image} onChange={(e) => update({ image: e.target.value })} />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {IMAGE_OPTIONS.map((opt) => (
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
                <Button variant="destructive" size="sm" onClick={() => { remove(confirmDelete.id); setConfirmDelete(null); }}>Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
