"use client";

import * as React from "react";
import { useContentStore } from "@/lib/store";

/**
 * Returns true once the persisted Zustand store has hydrated on the client.
 * Sections should defer rendering store-driven dynamic content until hydrated
 * to avoid SSR/CSR markup mismatches.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    // persist hydrates synchronously on first effect run
    setHydrated(true);
  }, []);
  return hydrated;
}

/**
 * Convenience: read the entire content store but only after hydration.
 * Before hydration returns null so callers can render seed fallback.
 */
export function useStoreAfterHydration<T>(selector: (s: ReturnType<typeof useContentStore.getState>) => T): T | null {
  const hydrated = useHydrated();
  const value = useContentStore(selector);
  return hydrated ? value : null;
}
