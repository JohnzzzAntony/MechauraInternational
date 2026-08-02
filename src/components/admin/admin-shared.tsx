"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
  size?: "md" | "lg" | "xl";
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  onSave,
  saveLabel = "Save",
  size = "lg",
}: AdminModalProps) {
  const sizeClass = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn("max-h-[90vh] overflow-y-auto border-border bg-background p-0", sizeClass)}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div>
            <DialogTitle className="font-display text-lg font-semibold text-foreground">
              {title}
            </DialogTitle>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {onSave && (
          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="brand" size="sm" onClick={onSave}>
              {saveLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Reusable field components ----------

export function AdminField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

export function AdminTextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...props} className="h-10" />;
}

export function AdminTextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <Textarea {...props} />;
}

// String list editor (for features, applications, materials, brands)
export function StringListEditor({
  items = [],
  onChange,
  placeholder = "Add item…",
  label,
}: {
  items?: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  label?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const [draft, setDraft] = React.useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...safeItems, v]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="h-9"
        />
        <Button type="button" variant="outline" size="sm" onClick={add} className="shrink-0">
          <Plus className="size-4" />
        </Button>
      </div>
      {safeItems.length > 0 && (
        <ul className="space-y-1">
          {safeItems.map((item, idx) => (
            <li
              key={`${item}-${idx}`}
              className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-sm"
            >
              <span className="text-foreground/80">{item}</span>
              <button
                type="button"
                onClick={() => onChange(safeItems.filter((_, i) => i !== idx))}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remove ${item}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Icon picker dropdown
const ICON_OPTIONS = [
  "shield-check",
  "network",
  "truck",
  "headset",
  "wrench",
  "brush",
  "settings",
  "circle-dot",
  "git-branch",
  "scissors",
  "move-vertical",
  "zap",
  "factory",
  "car",
  "hard-hat",
  "flame",
  "ruler",
  "building-2",
  "trending-down",
  "badge-check",
  "wind",
  "filter",
  "package",
];

export function IconPicker({
  value,
  onChange,
  label = "Icon",
}: {
  value: string;
  onChange: (next: string) => void;
  label?: string;
}) {
  return (
    <AdminField label={label} hint="Choose an icon to represent this item.">
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {ICON_OPTIONS.map((ic) => (
          <button
            key={ic}
            type="button"
            onClick={() => onChange(ic)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md border text-xs transition-all",
              value === ic
                ? "border-brand bg-brand/10 text-brand"
                : "border-border/60 text-muted-foreground hover:border-brand/40 hover:text-foreground",
            )}
            title={ic}
          >
            <IconBadge name={ic} />
          </button>
        ))}
      </div>
    </AdminField>
  );
}

// Lightweight inline icon display using dynamic import
import { Icon } from "@/components/icon";
function IconBadge({ name }: { name: string }) {
  return <Icon name={name as any} className="size-4" />;
}
