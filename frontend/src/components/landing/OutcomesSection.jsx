"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Briefcase, HeartPulse, Scale, GraduationCap, Building2, Banknote } from "lucide-react";

const STATS = [
  { value: 80, suffix: "%", label: "of bias detected before deployment" },
  { value: 10, suffix: "x", label: "faster fairness audits" },
  { value: 100, suffix: "+", label: "attributes auto-analysed" },
  { value: 0, suffix: "", label: "PhD required to read the report" },
];

const USE_CASES = [
  { icon: Briefcase, title: "Hiring & HR", body: "Catch gender or age bias in resume screeners before a single applicant is rejected." },
  { icon: Banknote, title: "Lending & Credit", body: "Verify your scoring model treats applicants fairly across regions and demographics." },
  { icon: HeartPulse, title: "Healthcare AI", body: "Audit triage and diagnostic models so care isn't allocated unequally." },
  { icon: Scale, title: "Public-sector Decisions", body: "Bring transparency to AI-assisted policy and benefit allocation." },
  { icon: GraduationCap, title: "EdTech & Admissions", body: "Make sure recommendation and admission models open doors instead of closing them." },
  { icon: Building2, title: "LLM Deployments", body: "Compare GPT, Gemini and Claude responses for harmful or biased patterns at scale." },
];

function Counter({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to, mv]);

  return (
    <span ref={ref} className="font-serif text-5xl md:text-7xl text-gold-gradient glow-text leading-none">
      {display}
      <span className="text-3xl md:text-5xl">{suffix}</span>
    </span>
  );
}

export default function OutcomesSection() {
  return (
    <section id="outcomes" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-25 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
        {/* Heading */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-4">
              / what you can achieve
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary">
              Outcomes that <span className="italic text-gold-gradient">stand up</span>
              <br />
              to scrutiny.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-5 md:col-start-8 flex items-end"
          >
            <p className="text-text-secondary leading-relaxed text-lg">
              From a single dataset upload to a board-ready audit, Nyaya AI shortens the
              path between &ldquo;we should check this&rdquo; and &ldquo;we proved it&rsquo;s fair.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-border mb-24">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-bg-surface/60 backdrop-blur-md p-8 md:p-10 flex flex-col gap-3"
              data-testid={`outcome-stat-${i}`}
            >
              <Counter to={s.value} suffix={s.suffix} />
              <span className="text-sm text-text-secondary leading-snug">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Use case cards */}
        <div className="mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-2xl md:text-3xl text-text-primary mb-2"
          >
            Built for every team that ships decisions.
          </motion.h3>
          <p className="text-text-tertiary text-sm uppercase tracking-[0.2em] font-mono">
            / use cases
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USE_CASES.map((u, i) => {
            const Icon = u.icon;
            return (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
                whileHover={{ y: -4 }}
                className="relative p-7 rounded-2xl border border-border bg-bg-surface/50 backdrop-blur-md hover:border-accent-gold/50 transition-colors group overflow-hidden"
                data-testid={`use-case-${i}`}
              >
                <span className="absolute -top-12 -right-12 w-40 h-40 bg-accent-gold/0 group-hover:bg-accent-gold/15 blur-3xl rounded-full transition-colors" />
                <div className="relative">
                  <Icon size={26} strokeWidth={1.5} className="text-accent-gold mb-5" />
                  <h4 className="font-serif text-xl text-text-primary mb-2">{u.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{u.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
