"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Cloud, HardDrive, Film, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
  accept?: string;
  defaultStorage?: "auto" | "cloudinary" | "local";
  className?: string;
}

export function MediaUpload({
  value,
  onChange,
  label = "Media Asset (Image or Video)",
  hint = "Upload from your local computer, send to Cloudinary, or paste a URL.",
  placeholder = "/images/products/sample.png or https://res.cloudinary.com/...",
  accept = "image/*,video/*",
  defaultStorage = "auto",
  className = "",
}: MediaUploadProps) {
  const [storage, setStorage] = React.useState<"auto" | "cloudinary" | "local">(defaultStorage);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVideo = React.useMemo(() => {
    if (!value) return false;
    return (
      value.endsWith(".mp4") ||
      value.endsWith(".webm") ||
      value.endsWith(".mov") ||
      value.includes("/video/upload/") ||
      value.startsWith("data:video/")
    );
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("storage", storage);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      setSuccess(
        data.provider === "cloudinary"
          ? "Uploaded successfully to Cloudinary!"
          : "Saved to local system storage!"
      );

      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      console.error("[MediaUpload] upload error:", err);
      setError(err?.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </Label>
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setStorage("auto")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                storage === "auto"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Auto-select based on Cloudinary environment variables"
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setStorage("cloudinary")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                storage === "cloudinary"
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Upload directly to Cloudinary CDN"
            >
              <Cloud className="size-3" />
              Cloudinary
            </button>
            <button
              type="button"
              onClick={() => setStorage("local")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                storage === "local"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Upload to Local System directory"
            >
              <HardDrive className="size-3" />
              Local System
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview box */}
      {value ? (
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-border/70 bg-black/40 shadow-inner">
          {isVideo ? (
            <video
              src={value}
              controls
              className="h-full w-full object-cover"
              poster=""
            />
          ) : (
            <Image
              src={value}
              alt="Media Preview"
              fill
              sizes="768px"
              className="object-cover"
            />
          )}
          <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-mono text-white backdrop-blur">
            {isVideo ? "VIDEO" : "IMAGE"}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[16/6] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 text-center transition-colors hover:border-brand/50 hover:bg-muted/40"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Upload className="size-5" />
          </div>
          <p className="mt-2 text-xs font-medium text-foreground">
            Click to upload Image or Video
          </p>
          <p className="text-[11px] text-muted-foreground">
            Supports Cloudinary & Local System storage
          </p>
        </div>
      )}

      {/* URL input + Upload button row */}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 font-mono text-xs"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 gap-1.5"
        >
          {uploading ? (
            <>
              <span className="size-3.5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="size-3.5" />
              <span>Upload File</span>
            </>
          )}
        </Button>
      </div>

      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}

      {/* Success/Error Alerts */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
