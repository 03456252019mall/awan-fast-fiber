"use client";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-white/10 bg-navy-deep bg-navy-deep/60">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold text-white">Awan Fast Fiber</p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{t("footer_operates")}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">Quick Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/60">
              <Link href="/packages">{t("nav_packages")}</Link>
              <Link href="/coverage">{t("nav_coverage")}</Link>
              <Link href="/new-connection">{t("nav_new_connection")}</Link>
              <Link href="/faq">{t("nav_faq")}</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">Contact</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/60">
              <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              <p>{BUSINESS.office}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">Follow Us</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/60">
              <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <p>Instagram: @{BUSINESS.instagram}</p>
              <p>TikTok: @{BUSINESS.tiktok}</p>
              <p>YouTube: @{BUSINESS.youtube}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Awan Fast Fiber. {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
}
