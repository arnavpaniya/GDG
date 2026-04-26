"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Upload, Search, BarChart3, Wrench } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const ICONS = [Upload, Search, BarChart3, Wrench];

export default function HowItWorksSection() {
  const { t, dict } = useI18n();
  const items = dict.how.items;

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "100%"]);

  return (
    <section id="how" ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-4"
          >
            {t("how.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary"
          >
            {t("how.title1")}{" "}
            <span className="italic text-gold-gradient">{t("how.title1highlight")}</span>
            <br />
            {t("how.title2")}
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Static rail */}
          <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-border" />
          {/* Animated rail */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-0 w-px bg-gradient-to-b from-accent-gold via-accent-gold to-transparent shadow-[0_0_12px_var(--color-accent-gold)]"
          />

          <div className="space-y-16 md:space-y-24">
            {items.map((s, i) => {
              const Icon = ICONS[i] || Upload;
              const num = String(i + 1).padStart(2, "0");
              // Even (i=0,2): text on LEFT (text-right), visual on RIGHT
              // Odd  (i=1,3): visual on LEFT, text on RIGHT (text-left)
              const isOdd = i % 2 === 1;

              const TextBlock = (
                <div className={`${isOdd ? "md:text-left" : "md:text-right"}`}>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-accent-gold tracking-[0.2em]">
                      {t("how.stepLabel")} {num}
                    </span>
                    <span className="h-px w-10 bg-accent-gold/40" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-4xl text-text-primary mb-3 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed max-w-md md:inline-block">
                    {s.body}
                  </p>
                </div>
              );

              const VisualBlock = (
                <div className="hidden md:block">
                  <div className={`relative ${isOdd ? "" : "md:ml-auto"}`}>
                    <div className="w-full max-w-sm aspect-[4/3] rounded-2xl border border-border bg-bg-surface/40 backdrop-blur-md p-8 flex items-center justify-center overflow-hidden relative group">
                      <span className="absolute -top-16 -right-16 w-48 h-48 bg-accent-gold/10 blur-3xl rounded-full" />
                      <Icon size={88} strokeWidth={1.2} className="text-accent-gold relative z-10 group-hover:scale-110 transition-transform duration-700" />
                      <span className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                        {num} / 04
                      </span>
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative grid grid-cols-1 md:grid-cols-2 md:gap-12 items-center"
                  data-testid={`how-step-${i}`}
                >
                  {/* Center node dot — absolutely positioned, doesn't take grid cells */}
                  <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-2 z-10">
                    <span className="block w-4 h-4 rounded-full bg-accent-gold shadow-[0_0_24px_var(--color-accent-gold)] animate-pulse-ring" />
                  </div>

                  {!isOdd ? (
                    <>
                      <div className="pl-12 md:pl-0 md:pr-12">{TextBlock}</div>
                      <div className="md:pl-12">{VisualBlock}</div>
                    </>
                  ) : (
                    <>
                      <div className="md:pr-12">{VisualBlock}</div>
                      <div className="pl-12 md:pl-12 md:pr-0">{TextBlock}</div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
