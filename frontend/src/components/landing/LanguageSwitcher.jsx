"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, languages, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const active = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div ref={ref} className="relative" data-testid="language-switcher">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language.label")}
        data-testid="language-switcher-button"
        className="flex items-center gap-2 rounded-full border border-border bg-bg-surface/60 backdrop-blur-md hover:border-accent-gold/60 transition-colors h-9 pl-3 pr-3"
      >
        <Languages size={14} className="text-accent-gold" />
        <span className="text-xs font-semibold text-text-primary leading-none">
          {compact ? lang.toUpperCase() : active.native}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-bg-surface/95 backdrop-blur-2xl shadow-glow-gold overflow-hidden z-50"
            role="listbox"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary font-mono">
                {t("language.label")}
              </p>
            </div>
            <ul className="max-h-72 overflow-auto py-1">
              {languages.map((l) => {
                const isActive = l.code === lang;
                return (
                  <li key={l.code}>
                    <button
                      onClick={() => {
                        setLang(l.code);
                        setOpen(false);
                      }}
                      data-testid={`lang-option-${l.code}`}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                        isActive
                          ? "bg-accent-gold/10 text-text-primary"
                          : "text-text-secondary hover:bg-bg-secondary/60 hover:text-text-primary"
                      }`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{l.native}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                          {l.name}
                        </span>
                      </span>
                      {isActive && <Check size={14} className="text-accent-gold" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
