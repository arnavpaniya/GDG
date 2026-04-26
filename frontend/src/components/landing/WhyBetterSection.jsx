"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkle } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function WhyBetterSection() {
  const { t, dict } = useI18n();
  const rows = dict.why.rows;
  const quote = t("why.quote");
  const w1 = t("why.quoteWord1");
  const w2 = t("why.quoteWord2");

  // Highlight quote keywords in gold
  const highlightInQuote = (text) => {
    const parts = text.split(new RegExp(`(${w1}|${w2})`, "g"));
    return parts.map((p, i) => {
      if (p === w1 || p === w2) return <span key={i} className="text-gold-gradient">{p}</span>;
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <section id="why" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-9">
            <p className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-4">{t("why.eyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary">
              {t("why.title1a")} <span className="italic text-text-tertiary">{t("why.title1b")}</span>
              <br />
              {t("why.title2")}{" "}
              <span className="italic text-gold-gradient">{t("why.word_explain")}</span>,{" "}
              <span className="italic text-gold-gradient">{t("why.word_compare")}</span>,{" "}
              {t("why.word_act") && <>{"&  "}</>}
              <span className="italic text-gold-gradient">{t("why.word_act")}</span>.
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-px rounded-3xl overflow-hidden border border-border bg-border">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-bg-surface/40 backdrop-blur-md p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-center justify-center">
                <X size={18} className="text-accent-red" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary font-mono">{t("why.oldLabel")}</p>
                <h3 className="font-serif text-xl text-text-primary">{t("why.oldTitle")}</h3>
              </div>
            </div>
            <ul className="space-y-5">
              {rows.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 text-text-tertiary">—</span>
                  <span className="text-text-secondary leading-relaxed line-through decoration-text-tertiary/40 decoration-1">
                    {c.theirs}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative bg-bg-surface/80 backdrop-blur-md p-8 md:p-12 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-gold/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative flex items-center gap-3 mb-8 pb-6 border-b border-accent-gold/20">
              <div className="w-9 h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/40 flex items-center justify-center">
                <Sparkle size={16} className="text-accent-gold" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent-gold font-mono">{t("why.newLabel")}</p>
                <h3 className="font-serif text-xl text-text-primary">{t("why.newTitle")}</h3>
              </div>
            </div>
            <ul className="relative space-y-5">
              {rows.map((c, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.05 * i }}
                  className="flex items-start gap-3"
                  data-testid={`why-row-${i}`}
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-accent-gold/15 border border-accent-gold/40 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-accent-gold" strokeWidth={3} />
                  </span>
                  <span className="text-text-primary leading-relaxed">{c.ours}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-20 max-w-3xl mx-auto text-center">
          <p className="font-serif italic text-2xl md:text-4xl text-text-primary leading-snug">
            {highlightInQuote(quote)}
          </p>
          <p className="mt-6 text-[11px] tracking-[0.3em] uppercase font-mono text-text-tertiary">
            {t("why.attribution")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
