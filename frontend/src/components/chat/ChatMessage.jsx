"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  ShieldCheck, User, AlertTriangle, CheckCircle, Info,
  Download, FileText, FileCode, Table as TableIcon, Layers, BarChart2,
} from "lucide-react";
import BiasGauge           from "@/components/chat/BiasGauge";
import FairnessScore3D    from "@/components/analysis/FairnessScore3D";
import BiasExplanationCard from "@/components/analysis/BiasExplanationCard";
import MLAnalysisCard      from "@/components/analysis/MLAnalysisCard";
import { exportToPDF, exportToJSON, exportToCSV } from "@/utils/exportService";

// ── Helpers ───────────────────────────────────────────────────────────────── //
const riskColor = (level) =>
  level === "High"   ? { text: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)"   } :
  level === "Medium" ? { text: "#facc15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)"  } :
                       { text: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)"   };

const confidenceColor = (level) =>
  level === "High"   ? { text: "#2dd4bf", bg: "rgba(45,212,191,0.1)",  border: "rgba(45,212,191,0.3)"  } :
  level === "Low"    ? { text: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" } :
                       { text: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)"  };

const barColor = (bias) =>
  bias <= 30 ? "#22c55e" : bias <= 60 ? "#facc15" : "#ef4444";

// ── Bias Risk Badge ───────────────────────────────────────────────────────── //
const BiasRiskBadge = ({ level = "Low" }) => {
  const c = riskColor(level);
  const icon = level === "Low"
    ? <CheckCircle size={12} />
    : <AlertTriangle size={12} />;
  return (
    <span
      style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase"
    >
      {icon} Bias Risk: {level}
    </span>
  );
};

// ── Confidence Badge ──────────────────────────────────────────────────────── //
const ConfidenceBadge = ({ level = "Medium" }) => {
  const c = confidenceColor(level);
  return (
    <span
      style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase"
    >
      <Info size={12} /> Confidence: {level}
    </span>
  );
};

// ── Bias Progress Bar ─────────────────────────────────────────────────────── //
const BiasBar = ({ value, max = 100, label }) => {
  const pct = Math.min(100, (value / max) * 100);
  const color = barColor(value);
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-[12px] font-semibold shrink-0" style={{ color: "#e2e8f0" }}>{label}</span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ height: "100%", background: color, borderRadius: 99 }}
        />
      </div>
      <span className="text-[12px] font-bold w-5 text-right" style={{ color }}>{value}</span>
    </div>
  );
};

// ── Custom Recharts Tooltip ───────────────────────────────────────────────── //
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#e2e8f0",
    }}>
      <strong>{label}</strong>: <span style={{ color: barColor(val) }}>{val}/100</span>
    </div>
  );
};

// ── Nyaya Structured Card ─────────────────────────────────────────────────── //
const NyayaStructuredCard = ({ structured }) => {
  if (!structured) return null;

  const {
    answer           = "",
    unbiased_answer  = "",
    bias_score       = 0,
    bias_risk        = "Low",
    reason           = "",
    confidence       = "Medium",
    proof_points     = [],
    comparison_table = [],
    comparison       = [],
  } = structured;

  const chartData = comparison.map((c) => ({ name: c.model, bias: c.bias }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 mt-4 rounded-2xl flex flex-col gap-6 border border-white/10 shadow-2xl relative overflow-hidden"
      style={{
        background: "linear-gradient(165deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)",
      }}
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-gold/5 blur-[80px] rounded-full pointer-events-none" />

      {/* ── Header: Summary & Badges ── */}
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="shrink-0">
          <BiasGauge score={bias_score} label="Fairness" size={140} />
        </div>
        
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <BiasRiskBadge level={bias_risk} />
            <ConfidenceBadge level={confidence} />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Bias Audit Report</h3>
          <p className="text-[14px] text-slate-300 leading-relaxed font-medium italic">
            "{reason}"
          </p>
          <p className="text-[13px] text-slate-400 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>

      {/* ── Remediated Answer (centerpiece) ── */}
      {unbiased_answer && (
        <div className="relative z-10 p-5 rounded-xl border border-accent-gold/20 bg-accent-gold/[0.03] overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold" />
          <h4 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            ✨ Remediated Unbiased Answer
          </h4>
          <p className="text-[15px] text-white leading-relaxed font-medium">
            {unbiased_answer}
          </p>
        </div>
      )}

      {/* ── Proof & Evidence Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Proof Points */}
        {proof_points.length > 0 && (
          <div className="bg-white/[0.03] p-5 rounded-xl border border-white/5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <CheckCircle size={14} className="text-accent-gold" /> Critical Proof
            </h4>
            <div className="flex flex-col gap-3">
              {proof_points.map((point, i) => (
                <div key={i} className="flex gap-3 text-[13px] text-slate-300 items-start">
                  <div className="w-5 h-5 rounded-md bg-accent-gold/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-accent-gold border border-accent-gold/20">
                    {i + 1}
                  </div>
                  <span className="leading-tight">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benchmarking (Visual) */}
        {chartData.length > 0 && (
          <div className="bg-white/[0.03] p-5 rounded-xl border border-white/5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart2 size={14} className="text-blue-400" /> Benchmarking
            </h4>
            <div className="flex flex-col gap-4">
              {chartData.map((item) => (
                <BiasBar key={item.name} label={item.name} value={item.bias} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Detailed Comparison Table ── */}
      {comparison_table.length > 0 && (
        <div className="mt-2 relative z-10">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <TableIcon size={14} className="text-purple-400" /> Cross-Model Differential
          </h4>
          <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-white/[0.05] text-slate-400 border-b border-white/5">
                  <th className="px-4 py-3 font-bold uppercase tracking-tight">Feature Analyzed</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-tight">Original Text</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-tight text-accent-gold">Nyaya Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparison_table.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3 font-medium text-slate-300 group-hover:text-white">{row.feature}</td>
                    <td className="px-4 py-3 text-slate-400">{row.external_model}</td>
                    <td className="px-4 py-3 text-white font-semibold">{row.nyaya_ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ── Main ChatMessage ──────────────────────────────────────────────────────── //
const ChatMessage = ({ message }) => {
  if (!message) return null;

  const isAI = message.role === "assistant" || message.role === "system";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex w-full mb-6 ${!isAI ? "justify-end" : "justify-start"}`}
    >
      {isAI ? (
        /* ── AI message: avatar + text left-aligned ── */
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-7 h-7 rounded-full bg-accent-gold/10 flex items-center justify-center shrink-0 mt-0.5">
            <img src="/assets/logo-mark.png" alt="" className="h-4 w-4 object-contain opacity-80" />
          </div>
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            {message.content && (
              <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-wrap">
                {message.content}
              </p>
            )}

            {/* Structured card */}
            {message.structured && (
              <NyayaStructuredCard structured={message.structured} />
            )}

            {/* Analysis results */}
            {message.analysis && (
              <div className="flex flex-col gap-3 w-full mt-1">
                {message.analysis.type === "ml" ? (
                  <MLAnalysisCard analysis={message.analysis} />
                ) : (
                  <>
                    {message.analysis.sensitiveAttrs && (
                      <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-bg-secondary/50 rounded-full border border-border/50">
                        <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1.5 mr-2">
                          <Layers size={12} /> Analyzed:
                        </span>
                        {message.analysis.sensitiveAttrs.map((attr) => (
                          <span key={attr} className="text-[11px] px-2.5 py-1 rounded-full bg-bg-surface text-text-secondary border border-border/50">
                            {attr}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-center bg-bg-surface p-6 rounded-xl border border-border shadow-soft">
                      <FairnessScore3D score={message.analysis.score ?? message.analysis.fairness?.score ?? 0} />
                    </div>
                    <div className="flex flex-col gap-2">
                      {message.analysis.findings?.map((finding, index) => (
                        <BiasExplanationCard key={index} title={finding.title} description={finding.description} severity={finding.severity} detail={finding.detail} />
                      ))}
                    </div>
                  </>
                )}
                {/* Export */}
                <div className="flex items-center gap-3 mt-1 p-3 bg-bg-secondary/30 rounded-lg border border-dashed border-border/50">
                  <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mr-auto flex items-center gap-1.5">
                    <Download size={12} /> Export
                  </span>
                  <button onClick={() => exportToPDF(message.analysis)} className="text-[11px] font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 px-2 py-1 rounded transition-fast"><FileText size={13} /> PDF</button>
                  <button onClick={() => exportToCSV(message.analysis.findings || message.analysis)} className="text-[11px] font-bold text-text-secondary hover:text-text-primary flex items-center gap-1 px-2 py-1 rounded transition-fast"><TableIcon size={13} /> CSV</button>
                  <button onClick={() => exportToJSON(message.analysis)} className="text-[11px] font-bold text-text-secondary hover:text-text-primary flex items-center gap-1 px-2 py-1 rounded transition-fast"><FileCode size={13} /> JSON</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── User message: pill bubble right-aligned ── */
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-bg-surface border border-border text-[15px] leading-relaxed text-text-primary">
          {message.content}
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
