"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Preloader — first-paint loading screen.
 * Theme-aware (uses CSS vars) + multilingual via i18n.
 */
export default function Preloader() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined" && document.readyState === "complete") {
      const tm = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(tm);
    }
    const onLoad = () => setTimeout(() => setDone(true), 900);
    window.addEventListener("load", onLoad);
    const fallback = setTimeout(() => setDone(true), 3500);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-bg-primary"
          data-testid="preloader"
          aria-hidden="true"
        >
          {/* radial accent glow — uses theme accent */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--color-accent-gold-soft) 0%, transparent 60%)",
            }}
          />
          {/* faint grid in accent */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--color-accent-gold) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-accent-gold) 8%, transparent) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div className="relative flex flex-col items-center">
            <div className="relative w-[140px] h-[140px]">
              {/* outer rotating ring (drawn with accent color via CSS var) */}
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <motion.circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="var(--color-accent-gold)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="540"
                  initial={{ strokeDashoffset: 540 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ filter: "drop-shadow(0 0 8px var(--color-accent-gold-soft))" }}
                />
              </motion.svg>

              {/* inner cross + nodes */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                <line x1="100" y1="22" x2="100" y2="178" stroke="var(--color-accent-gold)" strokeWidth="8" strokeLinecap="round" />
                <line x1="22" y1="100" x2="178" y2="100" stroke="var(--color-accent-gold)" strokeWidth="8" strokeLinecap="round" />
                <circle cx="100" cy="22" r="11" fill="var(--color-accent-gold)" />
                <circle cx="100" cy="178" r="11" fill="var(--color-accent-gold)" />
                <circle cx="22" cy="100" r="13" fill="var(--color-bg-primary)" stroke="var(--color-accent-gold)" strokeWidth="5" />
                <circle cx="178" cy="100" r="13" fill="var(--color-bg-primary)" stroke="var(--color-accent-gold)" strokeWidth="5" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="16"
                  fill="var(--color-accent-gold)"
                  animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "100px 100px", filter: "drop-shadow(0 0 12px var(--color-accent-gold-soft))" }}
                />
              </svg>

              <motion.span
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: "color-mix(in srgb, var(--color-accent-gold) 40%, transparent)" }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Wordmark — uses theme text */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <span
                className="text-2xl tracking-[0.05em] text-text-primary"
                style={{ fontFamily: "Lora, Georgia, 'Times New Roman', serif" }}
              >
                Nyaya<span className="text-accent-gold"> AI</span>
              </span>
              <span
                className="text-[10px] tracking-[0.4em] uppercase text-text-secondary"
                style={{ fontFamily: "JetBrains Mono, Menlo, monospace" }}
              >
                {t("preloader.tagline")}
              </span>
            </div>

            {/* Loading bar */}
            <div
              className="mt-7 h-px w-44 overflow-hidden rounded-full"
              style={{ background: "color-mix(in srgb, var(--color-text-primary) 12%, transparent)" }}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--color-accent-gold), transparent)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
