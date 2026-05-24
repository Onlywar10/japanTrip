"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { T, type Lang, type LocaleText } from "@/lib/itinerary";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (v: LocaleText | undefined) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "kyushu-itinerary-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "zh") setLangState(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: (v) => T(v, lang) }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
