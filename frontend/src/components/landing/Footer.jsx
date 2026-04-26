"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Footer() {
  const { t, dict } = useI18n();
  const productLinks = [
    { href: "#features", label: dict.footer.productLinks.features },
    { href: "#why", label: dict.footer.productLinks.why },
    { href: "#how", label: dict.footer.productLinks.how },
    { href: "#outcomes", label: dict.footer.productLinks.outcomes },
  ];
  const getStartedLinks = [
    { href: "/app", label: dict.footer.getStartedLinks.app },
    { href: "/login", label: dict.footer.getStartedLinks.login },
  ];
  const legalLinks = [
    { href: "/privacy", label: dict.footer.legalLinks.privacy },
    { href: "/terms", label: dict.footer.legalLinks.terms },
  ];

  return (
    <footer className="relative border-t border-border py-14 md:py-20" data-testid="landing-footer">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-5">
            <img src="/assets/logo-mark.png" alt="" className="w-9 h-9" />
            <span className="font-serif text-xl text-text-primary">
              Nyaya<span className="text-accent-gold"> AI</span>
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            {t("footer.brandTagline")}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-text-tertiary mb-4">
            {t("footer.productLabel")}
          </p>
          <ul className="space-y-2 text-sm">
            {productLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-text-secondary hover:text-accent-gold transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-text-tertiary mb-4">
            {t("footer.getStartedLabel")}
          </p>
          <ul className="space-y-2 text-sm">
            {getStartedLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-text-secondary hover:text-accent-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-text-tertiary mb-4">
            {t("footer.legalLabel")}
          </p>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-text-secondary hover:text-accent-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-text-tertiary text-xs">
        <span>© {new Date().getFullYear()} Nyaya AI. {t("footer.copyrightSuffix")}</span>
        <span className="font-mono tracking-[0.2em] uppercase">{t("footer.sloganMono")}</span>
      </div>
    </footer>
  );
}
