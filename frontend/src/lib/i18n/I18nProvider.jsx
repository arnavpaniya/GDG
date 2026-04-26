"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { TRANSLATIONS, DEFAULT_LANG, LANGUAGES } from "./translations";

const I18nContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (k) => k,
  dict: TRANSLATIONS[DEFAULT_LANG],
  languages: LANGUAGES,
});

/**
 * Resolve a dot-path like "hero.headline_1" against the active dictionary.
 * Returns the resolved value (string | array | object). Falls back to English.
 */
function resolve(dict, path) {
  if (!path) return "";
  const parts = path.split(".");
  let cur = dict;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nyaya.lang");
      if (stored && TRANSLATIONS[stored]) {
        setLangState(stored);
        document.documentElement.setAttribute("lang", stored);
      } else {
        document.documentElement.setAttribute("lang", DEFAULT_LANG);
      }
    } catch {}
  }, []);

  const setLang = useCallback((newLang) => {
    if (!TRANSLATIONS[newLang]) return;
    setLangState(newLang);
    try {
      localStorage.setItem("nyaya.lang", newLang);
      document.documentElement.setAttribute("lang", newLang);
    } catch {}
  }, []);

  const value = useMemo(() => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    const fallback = TRANSLATIONS[DEFAULT_LANG];

    const t = (path, vars) => {
      let val = resolve(dict, path);
      if (val === undefined || val === null) val = resolve(fallback, path);
      if (typeof val === "string" && vars) {
        return Object.keys(vars).reduce(
          (acc, k) => acc.replaceAll(`{${k}}`, vars[k]),
          val
        );
      }
      return val ?? path;
    };

    return { lang, setLang, t, dict, languages: LANGUAGES };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
