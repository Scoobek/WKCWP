"use client";

import { useSyncExternalStore } from "react";

export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false
  );
}
