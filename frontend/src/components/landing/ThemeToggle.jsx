"use client";

import { Sun, Moon } from "lucide-react";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";

export default function ThemeToggle({ size = 36 }) {
  const { theme, setTheme } = useStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-testid="theme-toggle"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative flex items-center justify-center rounded-full border border-border bg-bg-surface/60 backdrop-blur-md hover:border-accent-gold/60 transition-colors"
      style={{ width: size, height: size }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-accent-gold"
      >
        {isDark ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
      </motion.span>
    </button>
  );
}
