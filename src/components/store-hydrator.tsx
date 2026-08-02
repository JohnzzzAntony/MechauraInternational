"use client";

/**
 * StoreHydrator
 * Mounts once in the root layout to hydrate the Zustand store from the DB.
 * Renders nothing — purely a side-effect component.
 */
import { useEffect } from "react";
import { useContentStore } from "@/lib/store";

export function StoreHydrator() {
  const hydrate = useContentStore((s) => s.hydrate);
  const hydrated = useContentStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrate, hydrated]);

  return null;
}
