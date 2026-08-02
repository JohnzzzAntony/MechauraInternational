"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Package, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore, newId } from "@/lib/store";
import type { ProductCategory } from "@/lib/content";
import { Icon } from "@/components/icon";
import { AdminModal, AdminField, AdminTextInput, IconPicker, StringListEditor } from "@/components/admin/admin-shared";

const blankProduct = (): ProductCategory => ({
  id: newId("p"),
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  applications: [],
  materials: [],
  brands: [],
  typicalApplications: [],
  subProducts: [],
  icon: "package",
  image: "/images/products/abrasive-brushes.png",
});

const DEFAULT_IMAGE_OPTIONS = [
  { label: "Abrasive Brushes", value: "/images/products/abrasive-brushes.png" },
  { label: "Bearings", value: "/images/products/bearings.png" },
  { label: "Hydraulic Hose", value: "/images/products/hydraulic-hose.png" },
  { label: "Cutting Tools", value: "/images/products/cutting-tools.png" },
  { label: "Elevator Accessories", value: "/images/products/elevator-accessories.png" },
  { label: "Bandsaw Blades", value: "/images/products/bandsaw-blades.png" },
];

export function AdminProducts() {
  const products = useContentStore((s) => s.products);
  const upsertProduct = useContentStore((s) => s.upsertProduct);
  const removeProduct = useContentStore((s) => s.removeProduct);

  const [editing, setEditing] = React.useState<ProductCategory | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState<ProductCategory | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        update({ image: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()),
  );

  const startNew = () => {
    setEditing(blankProduct());
    setIsNew(true);
  };
  const startEdit = (p: ProductCategory) => {
    setEditing({ ...p });
    setIsNew(false);
  };
  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) return;
    // Auto-generate slug if empty
    const slug = editing.slug.trim() || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    upsertProduct({
      ...editing,
      name: editing.name.trim(),
      slug,
      shortDescription: editing.shortDescription?.trim() || "",
      description: editing.description?.trim() || "",
      applications: Array.isArray(editing.applications) ? editing.applications.filter(Boolean) : [],
      materials: Array.isArray(editing.materials) ? editing.materials.filter(Boolean) : [],
      brands: Array.isArray(editing.brands) ? editing.brands.filter(Boolean) : [],
      typicalApplications: Array.isArray(editing.typicalApplications) ? editing.typicalApplications.filter(Boolean) : [],
      subProducts: Array.isArray(editing.subProducts) ? editing.subProducts.filter(Boolean) : [],
      icon: editing.icon || "package",
      image: editing.image?.trim() || "/images/products/abrasive-brushes.png",
    });
    setEditing(null);
  };

  const update = (patch: Partial<ProductCategory>) => {
    if (!editing) return;
    setEditing({ ...editing, ...patch });
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
          />
        </div>
        <Button variant="brand" size="sm" onClick={startNew}>
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Package className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {search ? "No products match your search." : "No products yet. Add your first one."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand/10 via-card to-background">
                <Image
                  src={product.image || "/images/products/abrasive-brushes.png"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-lg bg-background/80 text-brand backdrop-blur ring-1 ring-brand/30">
                  <Icon name={product.icon as any} className="size-4" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold text-foreground">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(product)}>
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setConfirmDelete(product)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <AdminModal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={isNew ? "Add New Product" : "Edit Product"}
        subtitle="Changes save instantly to the live site."
        onSave={save}
        saveLabel={isNew ? "Create Product" : "Save Changes"}
        size="xl"
      >
        {editing && (
          <div className="space-y-5">
            {/* Image preview */}
            <div className="relative aspect-[16/8] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-brand/10 via-card to-background">
              <Image
                src={editing.image || "/images/products/abrasive-brushes.png"}
                alt="Preview"
                fill
                sizes="768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Product Name" required>
                <AdminTextInput
                  value={editing.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="e.g. Precision Bearings"
                />
              </AdminField>
              <AdminField label="Slug" hint="URL-friendly identifier. Auto-generated if left blank.">
                <AdminTextInput
                  value={editing.slug}
                  onChange={(e) => update({ slug: e.target.value })}
                  placeholder="precision-bearings"
                />
              </AdminField>
            </div>

            <AdminField label="Short Description" required hint="Shown on the product card.">
              <Input
                value={editing.shortDescription}
                onChange={(e) => update({ shortDescription: e.target.value })}
                placeholder="One-line summary"
              />
            </AdminField>

            <AdminField label="Full Description" required hint="Shown in the detail modal.">
              <Textarea
                value={editing.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={4}
                placeholder="Detailed description of the product…"
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Icon">
                <IconPicker value={editing.icon} onChange={(icon) => update({ icon })} />
              </AdminField>
              <AdminField label="Product Image" hint="Upload from your computer or paste a URL.">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex gap-2">
                  <AdminTextInput
                    value={editing.image}
                    onChange={(e) => update({ image: e.target.value })}
                    placeholder="/images/products/… or upload below"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="size-3.5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                        Uploading…
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Upload className="size-3.5" />
                        Upload
                      </span>
                    )}
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {DEFAULT_IMAGE_OPTIONS.map((opt) => (
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

            <div className="grid gap-4 sm:grid-cols-3">
              <StringListEditor
                label="Applications"
                items={editing.applications}
                onChange={(applications) => update({ applications })}
                placeholder="Add an application…"
              />
              <StringListEditor
                label="Materials"
                items={editing.materials}
                onChange={(materials) => update({ materials })}
                placeholder="Add a material…"
              />
              <StringListEditor
                label="Brands"
                items={editing.brands}
                onChange={(brands) => update({ brands })}
                placeholder="Add a brand…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StringListEditor
                label="Typical Applications (Detail Page)"
                items={editing.typicalApplications ?? []}
                onChange={(typicalApplications) => update({ typicalApplications })}
                placeholder="Add a typical application…"
              />
              <StringListEditor
                label="Product Variants / Sub-Products (Sidebar)"
                items={editing.subProducts ?? []}
                onChange={(subProducts) => update({ subProducts })}
                placeholder="Add a variant or sub-product…"
              />
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-semibold text-foreground">
                Delete &ldquo;{confirmDelete.name}&rdquo;?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This will permanently remove the product from your catalog. This
                action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    removeProduct(confirmDelete.id);
                    setConfirmDelete(null);
                  }}
                >
                  Delete Product
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
