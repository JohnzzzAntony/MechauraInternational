"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Mail,
  Phone,
  Building2,
  Package,
  Trash2,
  RefreshCw,
  Mailbox,
  Archive,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AdminInquiries() {
  const inquiries = useContentStore((s) => s.inquiries);
  const loadInquiries = useContentStore((s) => s.loadInquiries);
  const updateInquiryStatus = useContentStore((s) => s.updateInquiryStatus);
  const removeInquiry = useContentStore((s) => s.removeInquiry);

  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "new" | "read" | "archived">("all");

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      await loadInquiries();
    } finally {
      setLoading(false);
    }
  }, [loadInquiries]);

  // Refresh from DB on mount
  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    read: inquiries.filter((i) => i.status === "read").length,
    archived: inquiries.filter((i) => i.status === "archived").length,
  };

  const selectedInquiry = inquiries.find((i) => i.id === selected);

  const markRead = async (id: string) => {
    await updateInquiryStatus(id, "read");
  };

  const archive = async (id: string) => {
    await updateInquiryStatus(id, "archived");
  };

  const remove = async (id: string) => {
    await removeInquiry(id);
    if (selected === id) setSelected(null);
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "new", "read", "archived"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === f
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Mailbox className="size-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {filter === "all"
              ? "No inquiries yet. Submissions from the contact form will appear here."
              : `No ${filter} inquiries.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((inq) => (
            <motion.div
              key={inq.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border bg-card p-4 transition-colors",
                inq.status === "new" ? "border-brand/40" : "border-border/60",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/20">
                  <span className="font-display text-xs font-bold">
                    {inq.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{inq.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{inq.reference}</span>
                    {inq.status === "new" && (
                      <Badge className="bg-brand/15 text-brand" variant="secondary">
                        New
                      </Badge>
                    )}
                    {inq.status === "archived" && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Archived
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" />
                      {inq.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" />
                      {inq.phone}
                    </span>
                    {inq.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="size-3" />
                        {inq.company}
                      </span>
                    )}
                    {inq.productCategory && (
                      <span className="flex items-center gap-1">
                        <Package className="size-3" />
                        {inq.productCategory}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{inq.message}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(inq.id);
                        if (inq.status === "new") markRead(inq.id);
                      }}
                    >
                      View Details
                    </Button>
                    <a href={`mailto:${inq.email}?subject=Re: Your inquiry ${inq.reference}`}>
                      <Button variant="ghost" size="sm" className="text-brand">
                        <Mail className="size-3.5" />
                        Reply
                      </Button>
                    </a>
                    {inq.status !== "archived" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => archive(inq.id)}
                      >
                        <Archive className="size-3.5" />
                        Archive
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => remove(inq.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {new Date(inq.receivedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <AnimatePresence>
        {selectedInquiry && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {selectedInquiry.name}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {selectedInquiry.reference}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Received{" "}
                    {new Date(selectedInquiry.receivedAt).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={Mail}
                  label="Email"
                  value={selectedInquiry.email}
                  href={`mailto:${selectedInquiry.email}`}
                />
                <DetailRow
                  icon={Phone}
                  label="Phone"
                  value={selectedInquiry.phone}
                  href={`tel:${selectedInquiry.phone}`}
                />
                <DetailRow
                  icon={Building2}
                  label="Company"
                  value={selectedInquiry.company || "—"}
                />
                <DetailRow
                  icon={Package}
                  label="Product"
                  value={selectedInquiry.productCategory || "General inquiry"}
                />
              </div>

              <div className="mt-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </div>
                <div className="mt-2 rounded-lg border border-border/60 bg-card/40 p-4 text-sm leading-relaxed text-foreground/80">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => archive(selectedInquiry.id)}
                >
                  <Archive className="size-4" />
                  Archive
                </Button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry ${selectedInquiry.reference}`}
                >
                  <Button variant="brand" size="sm">
                    <ExternalLink className="size-4" />
                    Reply via Email
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-card/40 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand" />
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
