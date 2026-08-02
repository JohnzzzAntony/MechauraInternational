"use client";

import * as React from "react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { ReactNode } from "react";

function AdminPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <span className="text-sm font-medium">Loading Admin Panel...</span>
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <React.Suspense fallback={<AdminPageLoading />}>
      <AdminPanel />
    </React.Suspense>
  );
}

export default AdminPage;