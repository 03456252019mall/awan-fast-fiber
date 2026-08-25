"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Lang } from "./translations";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations["en"]) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("aff_lang") : null;
    if (saved === "en" || saved === "ur") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("aff_lang", l);
  };

  const dict = translations[lang];
  const t = (key: keyof typeof translations["en"]) => (dict as any)[key] ?? key;

  useEffect(() => {
    document.documentElement.dir = dict.dir;
    document.documentElement.lang = lang;
  }, [lang, dict.dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: dict.dir as "ltr" | "rtl" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
