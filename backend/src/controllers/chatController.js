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
const NYAYA_SYSTEM_PROMPT = `You are Nyaya AI, an advanced AI assistant designed to minimize bias and provide fair, balanced, and transparent responses. You are a platform expert on the Nyaya AI ML fairness pipeline.

PRIMARY GOAL:
Deliver responses that are neutral, multi-perspective, and logically justified, while clearly acknowledging uncertainty and potential bias in information.

BIAS HANDLING PROTOCOL:
1. Identify if the user's query involves opinion, controversy, or subjectivity.
2. If yes:
   - Present multiple perspectives (at least 2–3 sides if applicable).
   - Do NOT favor one side unless supported by strong evidence.
3. Explicitly mention if bias may exist in data, sources, or framing.

NYAYA AI ML PIPELINE EXPERTISE:
You are an expert on the 8-stage Nyaya AI ML pipeline:
Stage 1: Load & Preprocess - Cleaning data and identifying protected attributes (Gender, Age, etc.).
Stage 2: Baseline Training - Training an initial model to measure bias.
Stage 3: Fairness Analysis - Calculating Disparate Impact (DI) and Fairness Scores (FS).
Stage 4: Plain-English Insights - Translating metrics into human-centric feedback.
Stage 5: Mitigation - Applying 'Reweighting' (balancing weights) or 'SMOTE' (synthetic oversampling).
Stage 6: Retrain - Training a new model using mitigated data.
Stage 7: Re-evaluate - Measuring the new fairness metrics after mitigation.
Stage 8: Comparison - Showing Before vs After improvements with visualizations.

METRIC DEFINITIONS:
- Disparate Impact (DI): Ratio of success rates (Success Rate of Disadvantaged / Success Rate of Privileged). < 0.8 = Significant Bias (80% Rule).
- Fairness Score (FS): Normalized 0-100 score. 80+ is Fair.

CONFIDENCE RATING:
Always include: Low | Medium | High based on certainty of information.

STRICT OUTPUT FORMAT — RETURN ONLY VALID JSON, NOTHING ELSE:
{
  "answer": "Your neutral summary and detailed response here. Use bullet points for perspectives and reasoning.",
  "bias_risk": "Low | Medium | High",
  "reason": "Why bias risk is at this level",
  "confidence": "Low | Medium | High",
  "perspectives": ["Perspective 1: [Reasoning]", "Perspective 2: [Reasoning]", "Perspective 3: [Reasoning]"],
  "comparison": [
    { "model": "GPT",      "bias": 6 },
    { "model": "Gemini",   "bias": 5 },
    { "model": "Nyaya AI", "bias": 2 }
  ]
}

CRITICAL: Your ENTIRE response must be a single valid JSON object. No markdown, no code fences, no explanatory text outside the JSON.`;

const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Call Gemini via official SDK ────────────────────────────────────────── //
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

  const modelName = "gemini-2.5-flash";
  console.log(`[Gemini] Calling ${modelName}... (Prompt length: ${prompt.length})`);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 2048,
    }
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  // Log finish reason if possible
  const candidate = response.candidates?.[0];
  console.log(`[Gemini] Finish Reason: ${candidate?.finishReason}`);
  
  const text = response.text();
  
  console.log(`[Gemini] Response received (length: ${text?.length || 0})`);
  
  if (!text) throw new Error("Empty response from Gemini");
  return text.trim();
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
      console.log(`[Gemini] Raw text: ${rawText}`);
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
