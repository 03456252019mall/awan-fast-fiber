"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1 text-xs font-medium">
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 transition ${lang === "en" ? "bg-cyan text-navy" : "text-white/70"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ur")}
        className={`rounded-full px-3 py-1 transition ${lang === "ur" ? "bg-cyan text-navy" : "text-white/70"}`}
      >
        اردو
      </button>
    </div>
  );
}
