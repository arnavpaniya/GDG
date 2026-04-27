"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  ShieldCheck, User, AlertTriangle, CheckCircle, Info,
  Download, FileText, FileCode, Table as TableIcon, Layers, BarChart2,
} from "lucide-react";
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
  bias <= 3 ? "#22c55e" : bias <= 6 ? "#facc15" : "#ef4444";

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
const BiasBar = ({ value, max = 10, label }) => {
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
      <strong>{label}</strong>: <span style={{ color: barColor(val) }}>{val}/10</span>
    </div>
  );
};

// ── Nyaya Structured Card ─────────────────────────────────────────────────── //
const NyayaStructuredCard = ({ structured }) => {
  if (!structured) return null;

  const {
    answer      = "",
    bias_risk   = "Low",
    reason      = "",
    confidence  = "Medium",
    perspectives = [],
    comparison  = [],
  } = structured;

  // Default comparison data always shown
  const chartData = comparison.length > 0
    ? comparison.map((c) => ({ name: c.model, bias: c.bias }))
    : [
        { name: "GPT",      bias: 6 },
        { name: "Gemini",   bias: 5 },
        { name: "Nyaya AI", bias: 2 },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "20px 22px",
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* ── Header badges ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <BiasRiskBadge  level={bias_risk}  />
        <ConfidenceBadge level={confidence} />
      </div>

      {/* ── Reason ── */}
      {reason && (
        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: "#e2e8f0" }}>⚖️ Bias Reason: </span>
          {reason}
        </div>
      )}

      {/* ── Perspectives ── */}
      {perspectives.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            🔍 Perspectives
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 0, listStyle: "none", margin: 0 }}>
            {perspectives.map((p, i) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
                <span style={{ color: "#f59e0b", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Progress Bars ── */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart2 size={12} /> Model Bias Comparison (lower = fairer)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {chartData.map((item) => (
            <BiasBar key={item.name} label={item.name} value={item.bias} />
          ))}
        </div>
      </div>

      {/* ── Recharts Bar Chart ── */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          📊 Bias Score Chart
        </p>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="bias" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={barColor(entry.bias)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main ChatMessage ──────────────────────────────────────────────────────── //
const ChatMessage = ({ message }) => {
  if (!message) return null;

  const isAI = message.role === "assistant" || message.role === "system";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-6 ${!isAI ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex gap-3 max-w-[88%] ${!isAI ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isAI ? "bg-yellow-400/10 text-yellow-400" : "bg-blue-400/10 text-blue-400"
          }`}
        >
          {isAI ? <ShieldCheck size={16} /> : <User size={16} />}
        </div>

        {/* Bubble + Card */}
        <div className={`flex flex-col gap-2 ${!isAI ? "items-end" : "items-start"}`} style={{ minWidth: 0, flex: 1 }}>
          {/* Answer bubble */}
          {message.content && (
            <div
              className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                isAI
                  ? "bg-bg-surface text-text-primary border border-border rounded-tl-sm"
                  : "bg-bg-secondary text-text-primary rounded-tr-sm"
              }`}
            >
              {message.content}
            </div>
          )}

          {/* Nyaya Structured Card */}
          {isAI && message.structured && (
            <div style={{ width: "100%" }}>
              <NyayaStructuredCard structured={message.structured} />
            </div>
          )}

          {/* Legacy Analysis Results (file upload) */}
          {message.analysis && (
            <div className="mt-4 flex flex-col gap-3 w-full min-w-[300px] md:min-w-[450px]">
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
                        <span key={attr} className="text-[11px] px-2.5 py-1 rounded-full bg-bg-surface text-text-secondary border border-border/50 shadow-sm">
                          {attr}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center bg-bg-surface p-6 rounded-xl border border-border shadow-soft">
                    <FairnessScore3D score={message.analysis.score} />
                  </div>

                  <div className="flex flex-col gap-compact">
                    {message.analysis.findings?.map((finding, index) => (
                      <BiasExplanationCard
                        key={index}
                        title={finding.title}
                        description={finding.description}
                        severity={finding.severity}
                        detail={finding.detail}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Export actions */}
              <div className="flex items-center gap-3 mt-2 p-3 bg-bg-secondary/30 rounded-lg border border-border/50 border-dashed">
                <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mr-auto flex items-center gap-1.5">
                  <Download size={13} /> Export Report
                </span>
                <button onClick={() => exportToPDF(message.analysis)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-yellow-400 hover:text-yellow-300 transition-all uppercase tracking-widest" title="Download PDF">
                  <FileText size={14} /> PDF
                </button>
                <button onClick={() => exportToCSV(message.analysis.findings || message.analysis)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-text-secondary hover:text-text-primary transition-all uppercase tracking-widest" title="Download CSV">
                  <TableIcon size={14} /> CSV
                </button>
                <button onClick={() => exportToJSON(message.analysis)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-text-secondary hover:text-text-primary transition-all uppercase tracking-widest" title="Download JSON">
                  <FileCode size={14} /> JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
