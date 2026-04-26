"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ScanSearch,
  Gauge,
  BarChart3,
  MessageSquareText,
  GitCompare,
  Filter,
  Lightbulb,
  Webhook,
  FileText,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Bias Detection",
    body: "Scan datasets and model outputs for hidden patterns of unfairness across protected attributes.",
  },
  {
    icon: Gauge,
    title: "Fairness Score",
    body: "A clear 0–100 metric so anyone — engineer, PM, regulator — knows where you stand.",
  },
  {
    icon: BarChart3,
    title: "Interactive Visuals",
    body: "Dashboards and charts that make disparate impact, parity gaps and group rates obvious.",
  },
  {
    icon: MessageSquareText,
    title: "Plain-English Reasons",
    body: "We explain why bias appears, in human language — no statistics PhD required.",
  },
  {
    icon: GitCompare,
    title: "Model Comparison",
    body: "Pit GPT, Gemini, Claude and your own models side-by-side to see who is fairest.",
  },
  {
    icon: Filter,
    title: "Sensitive Attribute Detection",
    body: "Auto-identify gender, age, region, caste and other features driving the gap.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Suggestions",
    body: "Concrete next steps — reweighting, sampling, prompt fixes — to reduce bias measurably.",
  },
  {
    icon: Webhook,
    title: "Real-time API",
    body: "Drop a single endpoint into your stack to bias-check every prediction at request time.",
  },
  {
    icon: FileText,
    title: "PDF Reports",
    body: "Generate audit-ready reports for compliance, leadership and external partners.",
  },
  {
    icon: ShieldCheck,
    title: "Ethical by Design",
    body: "Built around transparency and accountability — the foundation of trustworthy AI.",
  },
];

function TiltCard({ children, idx }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-50, 50], [10, -10]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-10, 10]), {
    stiffness: 200,
    damping: 18,
  });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (idx % 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full"
      data-testid={`feature-card-${idx}`}
    >
      {children}
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 md:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-4">
              / what nyaya ai provides
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary">
              Ten capabilities. <br />
              <span className="italic text-gold-gradient">One mission.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-6 md:col-start-7 flex items-end"
          >
            <p className="text-lg text-text-secondary leading-relaxed">
              Every model you ship is a decision about who gets a yes and who gets a no.
              Nyaya AI gives you the toolkit to see those decisions clearly — and to make
              them fairer before they reach a human being.
            </p>
          </motion.div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            // Make the first 5 span 1 col, last 5 span 1 col → 5x2 grid on xl
            return (
              <TiltCard key={f.title} idx={i}>
                <div className="group h-full relative bg-bg-surface/50 border border-border rounded-2xl p-6 backdrop-blur-md overflow-hidden hover:border-accent-gold/50 transition-colors">
                  <span className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent-gold/10 via-transparent to-transparent transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center mb-5">
                      <Icon size={20} className="text-accent-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-text-primary mb-2 leading-tight">
                      {f.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
                    <span className="absolute -bottom-2 -right-2 font-mono text-[10px] text-text-tertiary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
