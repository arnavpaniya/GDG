/**
 * src/controllers/chatController.js
 * ───────────────────────────────────────
 * Nyaya AI — Fairness-aware chatbot.
 * Uses Gemini 1.5 Flash via direct SDK.
 * Integrates with a local Python ML service for factual fairness metrics.
 * Implements anti-hallucination via strict grounding in ML-service context.
 * Falls back gracefully to a structured JSON response on any error.
 */

const { GEMINI_API_KEY, PYTHON_SERVICE_URL } = require("../config/env");
const axios = require("axios");

// ── Response helper ───────────────────────────────────────────────────────── //
function ok(res, data) {
  return res.status(200).json({ success: true, data });
}

// ── Always-safe fallback ──────────────────────────────────────────────────── //
const FALLBACK_RESPONSE = {
  answer:      "I am not fully certain due to a temporary issue. Please try again.",
  bias_risk:   "Low",
  reason:      "System fallback triggered — AI response could not be parsed.",
  confidence:  "Low",
  proof_points: ["Check network connectivity.", "Verify API keys."],
  perspectives: [],
  comparison: [
    { model: "GPT",      bias: 60 },
    { model: "Gemini",   bias: 50 },
    { model: "Nyaya AI", bias: 20 },
  ],
};

// ── Nyaya AI System Prompt ────────────────────────────────────────────────── //
const NYAYA_SYSTEM_PROMPT = `You are Nyaya AI, a high-fidelity Bias Audit & Remediation Engine. Your intelligence is a hybrid of a Large Language Model (Gemini) and a factual grounding engine (Local Trained ML Service).

CORE MISSION:
When a user provides a Question + an Answer from another model (like GPT or Claude), your job is to:
1. AUDIT: Scan the provided text for linguistic, cognitive, gender, racial, or statistical bias.
2. BENCHMARK: Compare the provided answer's fairness against Nyaya's grounded statistics.
3. REMEDIATE: Provide a 100% unbiased, neutral, and fact-based alternative answer.

STRICT OPERATING RULES:
- GROUNDING: If "ML_SERVICE_CONTEXT" is provided, you MUST use its statistical metrics (Fairness Score, Disparate Impact) as the baseline for your "Nyaya AI" claims.
- ANTI-HALLUCINATION: Do not invent numbers or facts. If data is missing, state the analysis is based on linguistic heuristics.
- REMEDIATION: The "unbiased_answer" must be a full, high-quality replacement for the original answer, stripped of all subjective skew.
- SCALE: Use a 0-100 Fairness Scale. (90+ = Excellent, 75-89 = Fair, <75 = Biased).

STRICT OUTPUT FORMAT — RETURN ONLY VALID JSON:
{
  "answer": "A concise executive summary of the BIAS AUDIT performed on the external text.",
  "unbiased_answer": "The COMPLETE, 100% neutral, fact-grounded remediation of the original query.",
  "bias_score": 85, 
  "bias_risk": "Low | Medium | High",
  "reason": "One-sentence breakdown of the primary bias detected (or lack thereof).",
  "confidence": "Low | Medium | High",
  "proof_points": [
    "Ground Truth: [Reference ML Context if available]",
    "Linguistic Scan: [Describe skew detected]",
    "Remediation Logic: [Why the new version is fairer]"
  ],
  "comparison_table": [
    { "feature": "Metric/Tone", "external_model": "Original Value", "nyaya_ai": "Remediated Value" }
  ],
  "comparison": [
    { "model": "External Model", "bias": 65 },
    { "model": "Nyaya AI (Trained)", "bias": 98 }
  ]
}

CRITICAL: Return ONLY JSON. No other text. Use professional, plain English.`;

const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Call Local ML Service ──────────────────────────────────────────────── //
async function fetchMLMetrics(context) {
  try {
    console.log(`[ML Service] Fetching metrics from ${PYTHON_SERVICE_URL}/analyze...`);
    // Default to biased dataset if none specified in context
    const dataset = context?.dataset || "biased";
    const response = await axios.post(`${PYTHON_SERVICE_URL}/analyze`, { dataset }, { timeout: 5000 });
    
    // Normalize keys for frontend MLAnalysisCard
    const data = response.data;
    const normalize = (metrics) => ({
      ...metrics,
      score:           metrics.fairness_score,
      disparateImpact: metrics.disparate_impact,
      biasExists:      metrics.bias_exists,
      selectionRates:  metrics.selection_rates
    });

    return {
      ...data,
      before: data.before ? normalize(data.before) : null,
      after:  data.after  ? normalize(data.after)  : null
    };
  } catch (err) {
    console.warn(`[ML Service] Service unavailable or failed: ${err.message}`);
    return null;
  }
}

// ── Call Gemini via official SDK ────────────────────────────────────────── //
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

  const modelName = "gemini-1.5-flash";
  console.log(`[Gemini] Calling ${modelName}... (Prompt length: ${prompt.length})`);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.1, // Lower temperature for anti-hallucination
      topP: 0.8,
      maxOutputTokens: 2048,
    }
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`[Gemini] Response received (length: ${text?.length || 0})`);
    
    if (!text) throw new Error("Empty response from Gemini");
    return text.trim();
  } catch (err) {
    console.error(`[Gemini] API Error: ${err.message}`);
    throw err;
  }
}

// ── Parse and sanitize the AI response ───────────────────────────────────── //
function parseStructured(rawText) {
  // Strip markdown fences
  let cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {}

  // Try extracting first JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  return null;
}

// ── Main Chat Handler ─────────────────────────────────────────────────────── //
async function handleChat(req, res) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (!GEMINI_API_KEY) {
      return ok(res, { text: FALLBACK_RESPONSE.answer, structured: { ...FALLBACK_RESPONSE, reason: "API key not configured" } });
    }

    // Build prompt with Hybrid Context
    let mlContext = null;
    // Always trigger ML context if it's a bias-related query or first message
    if (context || message.toLowerCase().includes("bias") || message.toLowerCase().includes("fair") || message.toLowerCase().includes("scan")) {
      mlContext = await fetchMLMetrics(context);
    }

    let fullPrompt = `${NYAYA_SYSTEM_PROMPT}\n\n`;
    
    if (mlContext) {
      fullPrompt += `[ML_SERVICE_CONTEXT - TRAINED MODEL GROUND TRUTH]\n${JSON.stringify(mlContext, null, 2)}\n\n`;
    }

    if (context) {
      fullPrompt += `[USER_PROVIDED_CONTEXT]\n${JSON.stringify(context, null, 2)}\n\n`;
    }
    
    fullPrompt += `[USER QUERY (QUESTION + EXTERNAL OUTPUT TO AUDIT)]\n${message}\n\n[REMINDER: Respond with ONLY a valid JSON object. Use the ML_SERVICE_CONTEXT statistics for the 'Nyaya AI' fields in your response.]`;

    // Call Gemini
    let structured = null;
    try {
      const rawText = await callGemini(fullPrompt);
      structured = parseStructured(rawText);
    } catch (apiErr) {
      console.error("Gemini call failed:", apiErr.message);
      return ok(res, { text: FALLBACK_RESPONSE.answer, structured: { ...FALLBACK_RESPONSE } });
    }

    // Normalize — fill in any missing fields
    if (!structured) {
      structured = { ...FALLBACK_RESPONSE };
    } else {
      structured.answer           = structured.answer      || FALLBACK_RESPONSE.answer;
      structured.bias_score       = structured.bias_score  || 0;
      structured.bias_risk        = structured.bias_risk   || "High";
      structured.reason           = structured.reason      || "Analysis complete.";
      structured.confidence       = structured.confidence  || "Medium";
      structured.proof_points     = Array.isArray(structured.proof_points) ? structured.proof_points : [];
      structured.comparison_table = Array.isArray(structured.comparison_table) ? structured.comparison_table : [];
      
      // Always ensure comparison data is present
      structured.comparison   = (Array.isArray(structured.comparison) && structured.comparison.length > 0)
        ? structured.comparison
        : FALLBACK_RESPONSE.comparison;
    }

    return ok(res, { 
      text: structured.answer, 
      structured,
      analysis: mlContext ? { type: "ml", ...mlContext } : null
    });

  } catch (err) {
    // Ultimate safety net
    console.error("Unhandled chat error:", err.message);
    return ok(res, { text: FALLBACK_RESPONSE.answer, structured: { ...FALLBACK_RESPONSE } });
  }
}

module.exports = { handleChat };
