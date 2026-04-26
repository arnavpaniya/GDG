"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkle } from "lucide-react";

const COMPARISON = [
  { theirs: "Black-box scoring you can't explain", ours: "Plain-English reasons for every flag" },
  { theirs: "Single-model audits", ours: "Compare GPT, Gemini, Claude & your own side-by-side" },
  { theirs: "Static one-time reports", ours: "Real-time API checks on every prediction" },
  { theirs: "Generic 'fairness' labels", ours: "Attribute-level breakdowns (gender, age, region…)" },
  { theirs: "Statistician-only dashboards", ours: "Built for engineers, PMs, and regulators alike" },
  { theirs: "Tells you what is wrong", ours: "Tells you exactly how to fix it" },
];

export default function WhyBetterSection() {
  return (
    <section id="why" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-4">
              / why nyaya ai is different
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary">
              Most fairness tools <span className="italic text-text-tertiary">measure.</span>
              <br />
              We <span className="italic text-gold-gradient">explain</span>, <span className="italic text-gold-gradient">compare</span>, and <span className="italic text-gold-gradient">act</span>.
            </h2>
          </motion.div>
        </div>

        {/* Comparison split */}
        <div className="grid md:grid-cols-2 gap-px rounded-3xl overflow-hidden border border-border bg-border">
          {/* Other tools column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-bg-surface/40 backdrop-blur-md p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-center justify-center">
                <X size={18} className="text-accent-red" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary font-mono">Most fairness tools</p>
                <h3 className="font-serif text-xl text-text-primary">The old way</h3>
              </div>
            </div>
            <ul className="space-y-5">
              {COMPARISON.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 text-text-tertiary">—</span>
                  <span className="text-text-secondary leading-relaxed line-through decoration-text-tertiary/40 decoration-1">
                    {c.theirs}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Nyaya AI column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-bg-surface/80 backdrop-blur-md p-8 md:p-12 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-gold/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative flex items-center gap-3 mb-8 pb-6 border-b border-accent-gold/20">
              <div className="w-9 h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/40 flex items-center justify-center">
                <Sparkle size={16} className="text-accent-gold" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent-gold font-mono">Nyaya AI</p>
                <h3 className="font-serif text-xl text-text-primary">The new way</h3>
              </div>
            </div>
            <ul className="relative space-y-5">
              {COMPARISON.map((c, i) => (
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

        {/* Quote band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <p className="font-serif italic text-2xl md:text-4xl text-text-primary leading-snug">
            “If your AI is making decisions about people,
            <span className="text-gold-gradient"> someone</span> should be checking whether those decisions are <span className="text-gold-gradient">fair</span>.”
          </p>
          <p className="mt-6 text-[11px] tracking-[0.3em] uppercase font-mono text-text-tertiary">
            — the Nyaya principle
          </p>
        </motion.div>
      </div>
    </section>
  );
}
