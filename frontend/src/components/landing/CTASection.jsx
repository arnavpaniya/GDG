"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[36px] overflow-hidden border border-accent-gold/30 bg-bg-surface/70 backdrop-blur-2xl shadow-glow-gold p-10 md:p-20 text-center grain"
          data-testid="cta-card"
        >
          {/* Decorative logo mark */}
          <motion.img
            src="/assets/logo-mark.png"
            alt=""
            aria-hidden="true"
            className="absolute -top-16 -right-16 w-72 h-72 opacity-[0.06] animate-spin-slow"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.img
            src="/assets/logo-mark.png"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-20 -left-20 w-80 h-80 opacity-[0.05]"
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative">
            <p className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-6">
              / start building fair AI
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary mb-6">
              Ship the model. <br />
              <span className="italic text-gold-gradient">Prove it&rsquo;s fair.</span>
            </h2>
            <p className="max-w-xl mx-auto text-text-secondary text-lg leading-relaxed mb-10">
              Free to start. No credit card. Run your first fairness audit in under two minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app"
                data-testid="cta-launch-app"
                className="group inline-flex items-center gap-2 bg-accent-gold text-[#0a0a08] hover:brightness-110 active:scale-[0.98] px-8 py-4 rounded-pill text-[15px] font-bold transition-all shadow-glow-gold"
              >
                Launch Nyaya AI
                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-border bg-bg-surface/50 hover:border-accent-gold/60 px-8 py-4 rounded-pill text-[15px] font-semibold text-text-primary transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
