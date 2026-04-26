"use client";

import { motion } from "framer-motion";

/**
 * Route-level loading UI for Next.js App Router.
 * Shown automatically while a route segment is suspending.
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-bg-primary"
      data-testid="route-loading"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-accent-gold-soft) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-accent-gold/20"
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 8px var(--color-accent-gold-soft))" }}
          />
          <motion.span
            className="absolute inset-3 rounded-full bg-accent-gold/15"
            animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <img
            src="/assets/logo-mark.png"
            alt=""
            className="absolute inset-4 w-12 h-12 object-contain opacity-95"
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text-tertiary">
          Loading
        </span>
      </div>
    </div>
  );
}
