"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * Preloader — first-paint loading screen.
 * Renders a full-bleed dark stage with a glowing animated rebuild
 * of the Nyaya AI logo mark, then fades out once the window has
 * finished loading (or a max-time fallback elapses).
 */
export default function Preloader() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // If the page is already loaded (cached navigation), fade out fast
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

  // Theme-aware color palette
  const getColors = () => {
    const colors = {
      dark: {
        bg: "#07070a",
        text: "#F5EFDD",
        accent: "#E5B028",
        accentDark: "#9c7115",
        coreBg: "#0a0a08",
        glowRgba: "rgba(229,176,40,0.6)",
        glowRgbaLight: "rgba(229,176,40,0.15)",
        gridRgba: "rgba(229,176,40,0.06)",
        tertiaryText: "#B7AE96",
        coreGlow: "rgba(245,194,56,0.9)",
      },
      light: {
        bg: "#F7F4EC",
        text: "#15110A",
        accent: "#C68A12",
        accentDark: "#8B5E00",
        coreBg: "#F7F4EC",
        glowRgba: "rgba(198,138,18,0.4)",
        glowRgbaLight: "rgba(198,138,18,0.1)",
        gridRgba: "rgba(198,138,18,0.04)",
        tertiaryText: "#8C8576",
        coreGlow: "rgba(198,138,18,0.6)",
      },
      nordic: {
        bg: "#F0F4F8",
        text: "#102A43",
        accent: "#2D6BE4",
        accentDark: "#1f4d99",
        coreBg: "#F0F4F8",
        glowRgba: "rgba(45,107,228,0.4)",
        glowRgbaLight: "rgba(45,107,228,0.1)",
        gridRgba: "rgba(45,107,228,0.04)",
        tertiaryText: "#829AB1",
        coreGlow: "rgba(45,107,228,0.6)",
      },
      forest: {
        bg: "#F1F7F6",
        text: "#0C2927",
        accent: "#1D9E75",
        accentDark: "#146b52",
        coreBg: "#F1F7F6",
        glowRgba: "rgba(29,158,117,0.4)",
        glowRgbaLight: "rgba(29,158,117,0.1)",
        gridRgba: "rgba(29,158,117,0.04)",
        tertiaryText: "#719290",
        coreGlow: "rgba(29,158,117,0.6)",
      },
    };

    return colors[theme] || colors.dark;
  };

  const colors = getColors();

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
          {/* radial gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(229,176,40,0.15) 0%, transparent 60%)",
            }}
          />
          {/* faint grid in accent */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(229,176,40,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,176,40,0.06) 1px, transparent 1px)",
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
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5C238" />
                    <stop offset="50%" stopColor="#E5B028" />
                    <stop offset="100%" stopColor="#9c7115" />
                  </linearGradient>
                </defs>
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
                  style={{ filter: "drop-shadow(0 0 8px rgba(229,176,40,0.6))" }}
                />
              </motion.svg>

              {/* inner cross + nodes (always visible; ring rotates around them) */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
              >
                {/* vertical beam */}
                <line x1="100" y1="22" x2="100" y2="178" stroke="#E5B028" strokeWidth="8" strokeLinecap="round" />
                {/* horizontal beam */}
                <line x1="22" y1="100" x2="178" y2="100" stroke="#E5B028" strokeWidth="8" strokeLinecap="round" />
                {/* nodes */}
                <circle cx="100" cy="22" r="11" fill="#F5C238" />
                <circle cx="100" cy="178" r="11" fill="#F5C238" />
                <circle cx="22" cy="100" r="13" fill="#0a0a08" stroke="#E5B028" strokeWidth="5" />
                <circle cx="178" cy="100" r="13" fill="#0a0a08" stroke="#E5B028" strokeWidth="5" />
                {/* core */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="16"
                  fill="#F5C238"
                  animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "100px 100px", filter: "drop-shadow(0 0 12px rgba(245,194,56,0.9))" }}
                />
              </svg>

              <motion.span
                className="absolute inset-0 rounded-full border border-[#E5B028]/40"
                animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Wordmark — visible immediately */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <span
                className="text-2xl tracking-[0.05em] text-text-primary"
                style={{ fontFamily: "Lora, Georgia, 'Times New Roman', serif" }}
              >
                Nyaya<span className="text-[#E5B028]"> AI</span>
              </span>
              <span
                className="text-[10px] tracking-[0.4em] uppercase text-[#B7AE96]"
                style={{ fontFamily: "JetBrains Mono, Menlo, monospace" }}
              >
                {t("preloader.tagline")}
              </span>
            </div>

            {/* Loading bar — visible immediately */}
            <div className="mt-7 h-px w-44 bg-white/10 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#E5B028] to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
