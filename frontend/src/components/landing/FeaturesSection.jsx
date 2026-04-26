"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ScanSearch, Gauge, BarChart3, MessageSquareText, GitCompare,
  Filter, Lightbulb, Webhook, FileText, ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const ICONS = [ScanSearch, Gauge, BarChart3, MessageSquareText, GitCompare, Filter, Lightbulb, Webhook, FileText, ShieldCheck];

function TiltCard({ children, idx }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [10, -10]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-10, 10]), { stiffness: 200, damping: 18 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const reset = () => { x.set(0); y.set(0); };

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
  const { t, dict } = useI18n();
  const items = dict.features.items;

  return (
    <section id="features" className="relative py-28 md:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-5">
            <p className="text-[11px] tracking-[0.3em] uppercase font-mono text-accent-gold mb-4">{t("features.eyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-text-primary">
              {t("features.title1")} <br />
              <span className="italic text-gold-gradient">{t("features.title2")}</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg text-text-secondary leading-relaxed">{t("features.subtitle")}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {items.map((f, i) => {
            const Icon = ICONS[i] || ShieldCheck;
            return (
              <TiltCard key={i} idx={i}>
                <div className="group h-full relative bg-bg-surface/50 border border-border rounded-2xl p-6 backdrop-blur-md overflow-hidden hover:border-accent-gold/50 transition-colors">
                  <span className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent-gold/10 via-transparent to-transparent transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center mb-5">
                      <Icon size={20} className="text-accent-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-text-primary mb-2 leading-tight">{f.title}</h3>
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
