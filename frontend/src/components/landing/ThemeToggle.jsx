"use client";

import { useState } from "react";
import { Sun, Moon, Mountain, Trees } from "lucide-react";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";

const THEMES = [
  { id: "dark", name: "Dark", icon: Moon },
  { id: "light", name: "Light", icon: Sun },
  { id: "nordic", name: "Nordic", icon: Mountain },
  { id: "forest", name: "Forest", icon: Trees },
];

export default function ThemeToggle({ size = 36 }) {
  const { theme, setTheme } = useStore();
  const [open, setOpen] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
  const Icon = currentTheme.icon;

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="theme-toggle"
        aria-label="Select theme"
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
          <Icon size={16} strokeWidth={2} />
        </motion.span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 bg-bg-surface border border-border rounded-lg shadow-lg z-50 min-w-[160px] py-1"
          data-testid="theme-dropdown"
        >
          {THEMES.map((t) => {
            const ThemeIcon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  theme === t.id
                    ? "bg-accent-gold/20 text-accent-gold font-semibold"
                    : "text-text-primary hover:bg-bg-secondary"
                }`}
                data-testid={`theme-option-${t.id}`}
              >
                <ThemeIcon size={16} />
                {t.name}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
