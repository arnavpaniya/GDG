"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Compass } from "lucide-react";

/**
 * 404 — rendered for any non-existent route.
 * Matches the immersive landing aesthetic: deep stage, gold accents,
 * tilted "404" with the Nyaya logo mark caught between the digits.
 */
export default function NotFound() {
  return (
    <main
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-bg-primary text-text-primary"
      data-testid="not-found-page"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-radial-gold opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 grain pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg-primary pointer-events-none"
      />

      {/* Decorative spinning logo marks */}
      <motion.img
        src="/assets/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="absolute -top-32 -right-24 w-[420px] h-[420px] opacity-[0.05]"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      <motion.img
        src="/assets/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="absolute -bottom-40 -left-32 w-[480px] h-[480px] opacity-[0.04]"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-[920px] w-full px-6 md:px-10 py-24 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-pill mb-8 shadow-glow-gold"
        >
          <Compass size={13} className="text-accent-gold" />
          <span className="text-[11px] font-bold text-accent-gold uppercase tracking-[0.18em]">
            Off the record
          </span>
        </motion.div>

        {/* Big 404 with logo mark in the middle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 md:gap-6 mb-8"
          data-testid="not-found-code"
        >
          <span className="font-serif italic text-[110px] md:text-[200px] leading-none text-gold-gradient glow-text select-none">
            4
          </span>
          <motion.div
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.img
              src="/assets/logo-mark.png"
              alt="Nyaya AI"
              className="w-[100px] md:w-[180px] h-[100px] md:h-[180px] drop-shadow-[0_0_40px_rgba(229,176,40,0.4)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border border-accent-gold/30"
              animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <span className="font-serif italic text-[110px] md:text-[200px] leading-none text-gold-gradient glow-text select-none">
            4
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-4"
        >
          This decision has no <span className="italic text-gold-gradient">precedent.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl text-base md:text-lg text-text-secondary leading-relaxed mb-10"
        >
          The page you're looking for doesn't exist — or it never did.
          Let&apos;s get you back to something fair and known.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/"
            data-testid="not-found-home-btn"
            className="group inline-flex items-center gap-2 bg-accent-gold text-[#0a0a08] hover:brightness-110 active:scale-[0.98] px-7 py-3.5 rounded-pill text-[15px] font-bold transition-all shadow-glow-gold"
          >
            <Home size={16} strokeWidth={2.5} />
            Back to home
          </Link>
          <Link
            href="/app"
            data-testid="not-found-app-btn"
            className="inline-flex items-center gap-2 border border-border bg-bg-surface/50 backdrop-blur-md hover:border-accent-gold/60 text-text-primary px-7 py-3.5 rounded-pill text-[15px] font-semibold transition-colors"
          >
            <ArrowLeft size={16} className="text-accent-gold" />
            Open the app
          </Link>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 font-mono text-[10px] tracking-[0.3em] uppercase text-text-tertiary"
        >
          error · 404 · path not in record
        </motion.p>
      </div>
    </main>
  );
}
