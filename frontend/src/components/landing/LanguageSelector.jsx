"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import useStore from "@/store/useStore";
import { getSupportedLanguages, isLanguageSupported } from "@/utils/i18n";

export default function LanguageSelector({ showLabel = true }) {
  const { language, setLanguage } = useStore();
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const langs = getSupportedLanguages();
    setLanguages(langs);
  }, []);

  const currentLanguage = languages.find((l) => l.code === language);

  const handleLanguageChange = (languageCode) => {
    if (isLanguageSupported(languageCode)) {
      setLanguage(languageCode);
      setOpen(false);
      // Trigger page refresh or update to apply language changes
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-bg-surface/60 backdrop-blur-md hover:border-accent-gold/60 transition-colors text-text-primary text-sm"
        data-testid="language-selector-btn"
        aria-label="Select language"
      >
        <Globe size={16} strokeWidth={2} className="text-accent-gold" />
        {showLabel && <span>{currentLanguage?.name || "English"}</span>}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 bg-bg-surface border border-border rounded-lg shadow-lg z-50 min-w-[200px] py-1"
          data-testid="language-dropdown"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                language === lang.code
                  ? "bg-accent-gold/20 text-accent-gold font-semibold"
                  : "text-text-primary hover:bg-bg-secondary"
              }`}
              data-testid={`language-option-${lang.code}`}
            >
              {lang.name}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
