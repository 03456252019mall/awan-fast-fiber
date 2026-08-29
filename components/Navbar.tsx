"use client";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";

const LINKS = [
  { href: "/", key: "nav_home" },
  { href: "/packages", key: "nav_packages" },
  { href: "/coverage", key: "nav_coverage" },
  { href: "/about", key: "nav_about" },
  { href: "/faq", key: "nav_faq" },
  { href: "/contact", key: "nav_contact" }
] as const;

export default function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/">
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-white/75 transition hover:text-white">
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white">
            {t("nav_login")}
          </Link>
          <Link
            href="/new-connection"
            className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-navy transition hover:brightness-110"
          >
            {t("nav_new_connection")}
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            {open ? <path d="M6 6l12 12M18 6 6 18" stroke="white" strokeWidth="2" /> : <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-white/80">
                {t(l.key)}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-white/80">
              {t("nav_login")}
            </Link>
            <Link
              href="/new-connection"
              onClick={() => setOpen(false)}
              className="rounded-full bg-amber px-4 py-2 text-center text-sm font-semibold text-navy"
            >
              {t("nav_new_connection")}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
