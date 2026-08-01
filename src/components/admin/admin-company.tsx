"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Save, Check, Building2, Share2, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContentStore } from "@/lib/store";
import type { CompanyInfo } from "@/lib/content";
import { AdminField } from "@/components/admin/admin-shared";

export function AdminCompanySettings() {
  const company = useContentStore((s) => s.company);
  const updateCompany = useContentStore((s) => s.updateCompany);
  const changePassword = useContentStore((s) => s.changePassword);
  const partnerBrands = useContentStore((s) => s.partnerBrands);
  const setPartnerBrands = useContentStore((s) => s.setPartnerBrands);

  const [draft, setDraft] = React.useState<CompanyInfo>(company);
  const [brandsText, setBrandsText] = React.useState(partnerBrands.join("\n"));
  const [newPwd, setNewPwd] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [pwdSaved, setPwdSaved] = React.useState(false);

  // Re-sync when store changes externally
  React.useEffect(() => { setDraft(company); }, [company]);
  React.useEffect(() => { setBrandsText(partnerBrands.join("\n")); }, [partnerBrands]);

  const update = (patch: Partial<CompanyInfo>) => setDraft((d) => ({ ...d, ...patch }));
  const updateSocial = (patch: Partial<CompanyInfo["social"]>) =>
    setDraft((d) => ({ ...d, social: { ...d.social, ...patch } }));

  const saveAll = () => {
    updateCompany(draft);
    const brands = brandsText.split("\n").map((b) => b.trim()).filter(Boolean);
    setPartnerBrands(brands);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const savePassword = () => {
    if (newPwd.trim().length < 6) return;
    changePassword(newPwd);
    setNewPwd("");
    setPwdSaved(true);
    setTimeout(() => setPwdSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Company identity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border/60 bg-card p-6"
      >
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-brand" />
          <h3 className="font-display text-base font-semibold text-foreground">Company Identity</h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminField label="Legal Name" required>
            <Input value={draft.name} onChange={(e) => update({ name: e.target.value })} />
          </AdminField>
          <AdminField label="Short Name">
            <Input value={draft.shortName} onChange={(e) => update({ shortName: e.target.value })} />
          </AdminField>
          <AdminField label="Tagline">
            <Input value={draft.tagline} onChange={(e) => update({ tagline: e.target.value })} />
          </AdminField>
          <AdminField label="Founded Year">
            <Input
              type="number"
              value={draft.foundedYear}
              onChange={(e) => update({ foundedYear: parseInt(e.target.value) || draft.foundedYear })}
            />
          </AdminField>
        </div>
        <div className="mt-4">
          <AdminField label="Description">
            <Textarea value={draft.description} onChange={(e) => update({ description: e.target.value })} rows={3} />
          </AdminField>
        </div>
      </motion.div>

      {/* Contact info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl border border-border/60 bg-card p-6"
      >
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-brand" />
          <h3 className="font-display text-base font-semibold text-foreground">Contact Information</h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminField label="Phone (display)">
            <Input value={draft.phone} onChange={(e) => update({ phone: e.target.value })} />
          </AdminField>
          <AdminField label="Phone (tel: link)" hint="Numbers only with country code.">
            <Input value={draft.phoneRaw} onChange={(e) => update({ phoneRaw: e.target.value })} />
          </AdminField>
          <AdminField label="Email">
            <Input type="email" value={draft.email} onChange={(e) => update({ email: e.target.value })} />
          </AdminField>
          <AdminField label="Working Hours">
            <Input value={draft.hours} onChange={(e) => update({ hours: e.target.value })} />
          </AdminField>
          <div className="sm:col-span-2">
            <AdminField label="Headquarters Address">
              <Input value={draft.headquarters} onChange={(e) => update({ headquarters: e.target.value })} />
            </AdminField>
          </div>
        </div>
      </motion.div>

      {/* Social */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border/60 bg-card p-6"
      >
        <div className="flex items-center gap-2">
          <Share2 className="size-5 text-brand" />
          <h3 className="font-display text-base font-semibold text-foreground">Social Links</h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminField label="LinkedIn URL">
            <Input value={draft.social.linkedin} onChange={(e) => updateSocial({ linkedin: e.target.value })} placeholder="https://linkedin.com/…" />
          </AdminField>
          <AdminField label="Instagram URL">
            <Input value={draft.social.instagram} onChange={(e) => updateSocial({ instagram: e.target.value })} placeholder="https://instagram.com/…" />
          </AdminField>
          <AdminField label="Facebook URL">
            <Input value={draft.social.facebook} onChange={(e) => updateSocial({ facebook: e.target.value })} placeholder="https://facebook.com/…" />
          </AdminField>
          <AdminField label="WhatsApp URL" hint="Use https://wa.me/<number> format.">
            <Input value={draft.social.whatsapp} onChange={(e) => updateSocial({ whatsapp: e.target.value })} placeholder="https://wa.me/971…" />
          </AdminField>
        </div>
      </motion.div>

      {/* Partner brands */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-border/60 bg-card p-6"
      >
        <h3 className="font-display text-base font-semibold text-foreground">Partner Brands</h3>
        <p className="mt-1 text-xs text-muted-foreground">One brand per line. Shown in the scrolling marquee on the public site.</p>
        <Textarea
          value={brandsText}
          onChange={(e) => setBrandsText(e.target.value)}
          rows={6}
          className="mt-3 font-mono text-sm"
          placeholder="SKF&#10;NSK&#10;FAG"
        />
      </motion.div>

      {/* Save bar */}
      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border border-border/60 bg-background/95 p-3 shadow-lg backdrop-blur">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-brand">
            <Check className="size-4" />
            Saved
          </span>
        )}
        <Button variant="brand" size="sm" onClick={saveAll}>
          <Save className="size-4" />
          Save All Changes
        </Button>
      </div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-border/60 bg-card p-6"
      >
        <div className="flex items-center gap-2">
          <Lock className="size-5 text-brand" />
          <h3 className="font-display text-base font-semibold text-foreground">Security</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Change the admin password used to access this panel.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              New Password
            </Label>
            <Input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Minimum 6 characters"
              className="h-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={savePassword} disabled={newPwd.trim().length < 6}>
            {pwdSaved ? <Check className="size-4" /> : <Lock className="size-4" />}
            {pwdSaved ? "Updated" : "Update Password"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
