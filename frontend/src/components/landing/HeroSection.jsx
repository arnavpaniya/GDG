"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

const wordVar = {
  hidden: { y: 40, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0, opacity: 1, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const { t } = useI18n();

  const headline = [
    t("hero.headline_1"),
    t("hero.headline_2"),
    t("hero.headline_3"),
    t("hero.headline_4"),
  ];

  const trust = [
    { k: t("hero.trust1k"), v: t("hero.trust1v") },
    { k: t("hero.trust2k"), v: t("hero.trust2v") },
    { k: t("hero.trust3k"), v: t("hero.trust3v") },
  ];

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden grain" data-testid="hero-section">
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 bg-radial-gold opacity-70" aria-hidden="true" />

      <div className="absolute inset-0">
        <Hero3D />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 55%, color-mix(in srgb, var(--color-bg-primary) 55%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg-primary pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 pt-[140px] md:pt-[170px] pb-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-pill mb-8 shadow-glow-gold"
          data-testid="hero-eyebrow"
        >
          <Sparkles size={13} className="text-accent-gold" />
          <span className="text-[11px] font-bold text-accent-gold uppercase tracking-[0.18em]">
            {t("hero.eyebrow")}
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
          className="font-serif text-[44px] sm:text-[62px] md:text-[82px] leading-[1.14] tracking-[-0.015em] text-text-primary max-w-5xl overflow-visible px-2 sm:px-4 flex flex-wrap justify-center gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-2"
        >
          {headline.map((w, i) => (
            <motion.span
              key={i}
              variants={wordVar}
              className={`inline-block align-baseline leading-[1.12] py-[0.06em] px-[0.04em] ${
                w === t("hero.headline_3") ? "italic text-gold-gradient-safe glow-text" : ""
              }`}
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-6 max-w-[680px] text-lg md:text-xl text-text-secondary leading-relaxed"
          data-testid="hero-subtitle"
        >
          {t("hero.subtitle", { brand: "Nyaya AI" }).split("Nyaya AI").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="font-serif italic text-text-primary">Nyaya AI</span>
              )}
            </span>
          ))}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/app"
            data-testid="hero-cta-primary"
            className="group inline-flex items-center gap-2 bg-accent-gold text-[#0a0a08] hover:brightness-110 active:scale-[0.98] px-7 py-3.5 rounded-pill text-[15px] font-bold transition-all shadow-glow-gold"
          >
            {t("hero.ctaPrimary")}
            <ArrowRight size={17} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#how"
            data-testid="hero-cta-secondary"
            className="inline-flex items-center gap-2 border border-border bg-bg-surface/50 backdrop-blur-md hover:border-accent-gold/60 text-text-primary px-7 py-3.5 rounded-pill text-[15px] font-semibold transition-colors"
          >
            <ShieldCheck size={16} className="text-accent-gold" />
            {t("hero.ctaSecondary")}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 grid grid-cols-3 gap-6 md:gap-12 text-left"
        >
          {trust.map((s, i) => (
            <div key={i} className="flex flex-col items-center md:items-start gap-1 px-2 md:px-6 border-l border-border first:border-l-0">
              <span className="font-serif text-2xl md:text-3xl text-accent-gold">{s.k}</span>
              <span className="text-[12px] uppercase tracking-[0.18em] text-text-tertiary font-semibold">
                {s.v}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-text-tertiary font-mono uppercase">{t("hero.scroll")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-px h-8 bg-gradient-to-b from-accent-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
