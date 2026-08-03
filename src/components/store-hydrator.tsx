"use client";

/**
 * StoreHydrator
 * Mounts once in the root layout to hydrate the Zustand store from the DB.
 * Resets hydrated=false on every mount so the store always fetches fresh
 * data from the API instead of serving stale localStorage cache.
 * Renders nothing — purely a side-effect component.
 */
import { useEffect } from "react";
import { useContentStore } from "@/lib/store";

export function StoreHydrator() {
  const hydrate = useContentStore((s) => s.hydrate);
  const setHydrated = useContentStore((s) => s.setHydrated);

  useEffect(() => {
    // Always re-fetch on mount — clears stale localStorage cache
    setHydrated(false);
    hydrate();
  }, []); // mount-once intentional

  return null;
}
