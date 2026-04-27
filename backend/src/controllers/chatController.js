/**
 * src/controllers/chatController.js
 * ───────────────────────────────────────
 * Nyaya AI — Fairness-aware chatbot.
 * Uses Gemini 2.0 Flash via direct REST API (v1) since the JS SDK forces v1beta.
 * Falls back gracefully to a structured JSON response on any error.
 */

const { GEMINI_API_KEY } = require("../config/env");

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
  perspectives: [],
  comparison: [
    { model: "GPT",      bias: 6 },
    { model: "Gemini",   bias: 5 },
    { model: "Nyaya AI", bias: 2 },
  ],
};

// ── Nyaya AI System Prompt ────────────────────────────────────────────────── //
const NYAYA_SYSTEM_PROMPT = `You are Nyaya AI — an advanced, fairness-aware AI assistant designed to detect, explain, and reduce bias in responses.

PRIMARY OBJECTIVE:
Provide accurate, neutral, and well-reasoned answers while actively identifying and explaining potential bias.

ANTI-HALLUCINATION PROTOCOL:
- Do NOT fabricate facts, data, or statistics.
- If uncertain, say: "I am not fully certain about this."
- Clearly separate facts from assumptions.

BIAS DETECTION (apply to EVERY query):
1. Assign Bias Risk Level: Low (factual) | Medium (partially subjective) | High (sensitive/opinion-based)
2. Explain WHY bias may exist.
3. Present 2-3 viewpoints for subjective topics.

CONFIDENCE RATING:
Always include: Low | Medium | High based on certainty of information.

COMPARISON DATA (MANDATORY — ALWAYS INCLUDE IN EVERY RESPONSE):
Always include this exact comparison array in every response:
[
  { "model": "GPT",      "bias": 6 },
  { "model": "Gemini",   "bias": 5 },
  { "model": "Nyaya AI", "bias": 2 }
]

STRICT OUTPUT FORMAT — RETURN ONLY VALID JSON, NOTHING ELSE:
{
  "answer": "Your main response here",
  "bias_risk": "Low | Medium | High",
  "reason": "Why bias risk is at this level",
  "confidence": "Low | Medium | High",
  "perspectives": ["Perspective 1", "Perspective 2", "Perspective 3"],
  "comparison": [
    { "model": "GPT",      "bias": 6 },
    { "model": "Gemini",   "bias": 5 },
    { "model": "Nyaya AI", "bias": 2 }
  ]
}

CRITICAL: Your ENTIRE response must be a single valid JSON object. No markdown, no code fences, no explanatory text outside the JSON.`;

// ── Call Gemini 2.0 Flash via REST API (v1) ───────────────────────────────── //
async function callGemini(prompt) {
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Empty response from Gemini");
  return rawText.trim();
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

    // Build prompt
    let fullPrompt = `${NYAYA_SYSTEM_PROMPT}\n\n`;
    if (context) {
      fullPrompt += `[DATASET CONTEXT]\n${JSON.stringify(context, null, 2)}\n\n`;
    }
    fullPrompt += `[USER QUERY]\n${message}\n\n[REMINDER: Respond with ONLY a valid JSON object. No other text.]`;

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
      structured.answer       = structured.answer      || FALLBACK_RESPONSE.answer;
      structured.bias_risk    = structured.bias_risk   || "Low";
      structured.reason       = structured.reason      || "No specific bias detected.";
      structured.confidence   = structured.confidence  || "Medium";
      structured.perspectives = Array.isArray(structured.perspectives) ? structured.perspectives : [];
      // Always ensure comparison data is present
      structured.comparison   = (Array.isArray(structured.comparison) && structured.comparison.length > 0)
        ? structured.comparison
        : FALLBACK_RESPONSE.comparison;
    }

    return ok(res, { text: structured.answer, structured });

  } catch (err) {
    // Ultimate safety net — server will never crash
    console.error("Unhandled chat error:", err.message);
    return ok(res, { text: FALLBACK_RESPONSE.answer, structured: { ...FALLBACK_RESPONSE } });
  }
}

module.exports = { handleChat };
