"use client";

import { useEffect } from "react";

// Dev-only element picker. Imported dynamically so it never lands in the prod
// bundle. Hosted from our own origin, no external CDN needed, CSP stays clean.
export function ReactGrabDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let disposed = false;
    (async () => {
      const mod = await import("react-grab");
      await import("react-grab/styles.css");
      if (disposed) return;
      mod.init();
    })();
    return () => {
      disposed = true;
    };
  }, []);
  return null;
}
