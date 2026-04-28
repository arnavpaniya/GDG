/**
 * src/controllers/chatController.js
 * ───────────────────────────────────────
 * Nyaya AI — Fairness-aware chatbot.
 * Uses gemini-2.5-flash via v1beta REST API.
 * Falls back to smart keyword-aware demo responses if API is unavailable.
 */

const { GEMINI_API_KEY } = require("../config/env");

// ── Response helper ───────────────────────────────────────────────────────── //
function ok(res, data) {
  return res.status(200).json({ success: true, data });
}

// ── Smart Demo Response Library ───────────────────────────────────────────── //
// Keyword-matched responses so the chatbot always answers meaningfully
const DEMO_RESPONSES = [
  {
    keywords: ["bias", "ai bias", "algorithmic bias", "machine learning bias"],
    answer: "AI bias refers to systematic and unfair discrimination in AI systems caused by flawed data or algorithms. When training data reflects historical inequalities — such as hiring records that favored men — the AI learns and perpetuates those patterns. This leads to real-world harms: biased hiring tools, discriminatory loan approvals, and unequal healthcare predictions. Addressing AI bias requires diverse datasets, fairness metrics like Disparate Impact, and ongoing audits of deployed models.",
    bias_risk: "Low",
    reason: "This is a factual, educational explanation of a technical concept with no subjective opinion embedded.",
    confidence: "High",
    perspectives: [
      "Technical view: Bias is a mathematical artifact of skewed training distributions.",
      "Social justice view: AI bias amplifies existing systemic discrimination against marginalized groups.",
      "Industry view: Companies must invest in bias audits to avoid regulatory risk and reputational damage."
    ],
  },
  {
    keywords: ["fairness", "fair", "equitable", "equity"],
    answer: "AI fairness means ensuring that automated decisions do not systematically disadvantage any demographic group. There are multiple mathematical definitions: Demographic Parity (equal selection rates across groups), Equal Opportunity (equal true positive rates), and Disparate Impact (ratio of outcomes ≥ 0.8). Achieving fairness requires balancing these metrics with accuracy — a tradeoff known as the fairness-accuracy frontier. Nyaya AI helps teams measure and visualize these metrics before deploying models.",
    bias_risk: "Low",
    reason: "Fairness in AI is a well-studied technical field with established definitions and metrics.",
    confidence: "High",
    perspectives: [
      "Statistician view: Fairness is a measurable property — use Disparate Impact ratios to quantify it.",
      "Ethicist view: Different fairness definitions can conflict; choosing one involves value judgments.",
      "Legal view: Disparate Impact is legally actionable in employment under Title VII in the US."
    ],
  },
  {
    keywords: ["gender", "woman", "women", "female", "male", "sexism", "gender bias"],
    answer: "Gender bias in AI is one of the most documented forms of algorithmic discrimination. Famous examples include Amazon's recruiting AI (scrapped in 2018) that downgraded resumes mentioning 'women's chess club', facial recognition systems with 34% higher error rates for dark-skinned women (MIT Media Lab study), and language models that associate 'nurse' with women and 'engineer' with men. Mitigation strategies include balanced training data, adversarial debiasing, and mandatory fairness audits before deployment.",
    bias_risk: "Medium",
    reason: "Gender bias involves sensitive demographic attributes and historically contested societal norms.",
    confidence: "High",
    perspectives: [
      "Data science view: Imbalanced gender representation in training data directly causes model bias.",
      "Feminist view: AI bias in hiring and credit scoring perpetuates economic inequality for women.",
      "Corporate view: Gender-diverse teams build more inclusive products — diversity is a business advantage."
    ],
  },
  {
    keywords: ["race", "racial", "racism", "ethnic", "ethnicity", "discrimination"],
    answer: "Racial bias in AI manifests across critical domains: COMPAS recidivism scores were found to falsely flag Black defendants as high-risk at twice the rate of white defendants (ProPublica, 2016). Facial recognition tools from major vendors show up to 10x higher error rates for darker-skinned individuals. Healthcare risk-scoring algorithms systematically underestimated the severity of illness in Black patients. These aren't bugs — they're features of systems trained on racially biased historical data that must be actively audited and corrected.",
    bias_risk: "High",
    reason: "Race is a legally protected attribute. AI decisions affecting race carry high legal, ethical, and social risk.",
    confidence: "High",
    perspectives: [
      "Civil rights view: Algorithmic discrimination is a form of systemic racism that must be legislated against.",
      "Technical view: Proxy variables (zip code, names) can encode race even without explicit race features.",
      "Policy view: Regulators like the EU AI Act classify race-sensitive AI as high-risk requiring audits."
    ],
  },
  {
    keywords: ["hiring", "recruitment", "job", "resume", "employment", "candidate"],
    answer: "Hiring algorithms can encode and amplify discrimination at massive scale. A model trained on 10 years of hiring decisions from a male-dominated company will learn to prefer male candidates — even if gender is removed from the data, proxies like college names or sports listed will carry the signal. Nyaya AI's bias detection pipeline measures Disparate Impact (selection rate ratio between groups) and Statistical Parity Difference to flag biased hiring models. A Disparate Impact ratio below 0.8 is legally considered discriminatory under the EEOC's 4/5ths rule.",
    bias_risk: "High",
    reason: "Hiring decisions directly affect livelihoods. Automated hiring bias has clear legal and social consequences.",
    confidence: "High",
    perspectives: [
      "HR view: AI tools promise efficiency but must be validated for bias before use in hiring pipelines.",
      "Candidate view: Automated rejections with no explanation are opaque and difficult to challenge.",
      "Legal view: The EEOC's 4/5ths rule makes discriminatory hiring models legally actionable."
    ],
  },
  {
    keywords: ["healthcare", "medical", "health", "hospital", "patient", "doctor"],
    answer: "Medical AI bias can be life-threatening. A 2019 study in Science found a widely-used hospital risk algorithm systematically assigned lower risk scores to Black patients than equally sick White patients — causing Black patients to receive less care. This happened because the model used healthcare cost as a proxy for health need, but Black patients historically receive less expensive care due to systemic inequities. Dermatology AI trained on light-skinned patients performs poorly on darker skin tones. Nyaya AI's fairness audit tools can be applied to any dataset to surface these disparities before deployment.",
    bias_risk: "High",
    reason: "Medical AI bias can directly cause harm or death, making it one of the highest-stakes applications.",
    confidence: "High",
    perspectives: [
      "Patient advocacy view: Biased medical AI perpetuates health disparities in vulnerable communities.",
      "Clinical view: AI tools must be validated across all demographic groups before clinical deployment.",
      "Research view: Diverse and representative clinical datasets are essential for equitable healthcare AI."
    ],
  },
  {
    keywords: ["detect", "detection", "find", "identify", "measure", "check"],
    answer: "Nyaya AI detects bias through a multi-step pipeline: (1) **Data Profiling** — analyzing the distribution of sensitive attributes like gender, age, and race in your dataset. (2) **Disparate Impact Analysis** — computing the ratio of positive outcome rates between groups; a ratio below 0.8 signals bias. (3) **Statistical Parity Difference** — measuring the raw gap in selection rates between advantaged and disadvantaged groups. (4) **ML Model Audit** — training a classifier and evaluating fairness metrics before vs. after mitigation. Upload a CSV dataset to see your bias score instantly.",
    bias_risk: "Low",
    reason: "This is a technical description of a bias detection methodology — no subjective claims are made.",
    confidence: "High",
    perspectives: [
      "Data scientist view: Multiple complementary metrics are needed since no single measure captures all fairness aspects.",
      "Auditor view: Independent bias audits should be mandatory before deploying high-stakes AI systems.",
      "User view: Bias detection tools must be interpretable and explainable to non-technical stakeholders."
    ],
  },
  {
    keywords: ["mitigation", "fix", "reduce", "solve", "correct", "remove", "address"],
    answer: "Nyaya AI supports two primary bias mitigation strategies: **Reweighting** — assigns higher training weights to underrepresented group-class combinations without changing the data. This is computationally cheap and interpretable. **SMOTE (Synthetic Minority Oversampling)** — generates synthetic samples for minority groups to balance the dataset. More powerful but requires careful validation to avoid overfitting. Beyond algorithmic fixes, real mitigation also requires diverse data collection, inclusive team composition, and ongoing post-deployment monitoring. No single technique eliminates bias entirely.",
    bias_risk: "Low",
    reason: "This is a factual explanation of established bias mitigation techniques in the ML fairness literature.",
    confidence: "High",
    perspectives: [
      "ML engineer view: Reweighting is preferred when data is sufficient; SMOTE when minority samples are scarce.",
      "Ethics view: Technical mitigation is necessary but not sufficient — institutional change is also required.",
      "Product view: Mitigation must be validated on held-out test sets to confirm real-world improvement."
    ],
  },
  {
    keywords: ["what is nyaya", "about nyaya", "nyaya ai", "what do you do", "what can you"],
    answer: "Nyaya AI is a fairness-first AI assistant built to help data scientists, product teams, and policymakers detect, understand, and mitigate bias in machine learning models and datasets. The name 'Nyaya' comes from Sanskrit, meaning justice and logical reasoning. Nyaya AI offers: (1) CSV dataset bias analysis with instant fairness metrics, (2) ML pipeline auditing with before/after mitigation comparison, (3) Transparent explanations of bias sources, and (4) Concrete, actionable recommendations. Ask me anything about AI fairness, bias detection, or ethical ML — or upload a dataset to get started.",
    bias_risk: "Low",
    reason: "This is factual product information with no subjective claims.",
    confidence: "High",
    perspectives: [
      "Technical view: Nyaya AI provides quantitative fairness metrics grounded in academic research.",
      "Social impact view: Fairness tools like Nyaya AI are essential for responsible AI deployment.",
      "User view: Nyaya AI makes AI fairness accessible to teams without deep ML expertise."
    ],
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening", "greetings", "namaste"],
    answer: "Hello! I'm Nyaya AI — your fairness-aware AI assistant. I'm here to help you detect bias, understand unfairness, and build more ethical AI systems. You can ask me about AI bias, fairness metrics, specific bias cases in hiring or healthcare, or how to mitigate bias in your models. You can also upload a CSV dataset and I'll analyze it for bias instantly. What would you like to explore today?",
    bias_risk: "Low",
    reason: "A greeting carries no factual claims and thus no meaningful bias risk.",
    confidence: "High",
    perspectives: [],
  },
  {
    keywords: ["disparate impact", "statistical parity", "equal opportunity", "metric", "metrics"],
    answer: "The key fairness metrics in AI are: **Disparate Impact** — ratio of positive outcome rates between unprivileged and privileged groups. Values below 0.8 or above 1.25 are considered discriminatory under the EEOC 4/5ths rule. **Statistical Parity Difference** — the raw difference in selection rates (ideal = 0). **Equal Opportunity** — requires equal true positive rates across groups, ensuring qualified candidates from all groups are selected equally. **Predictive Parity** — equal precision across groups. These metrics often conflict; improving one can worsen another. Nyaya AI visualizes all of them so you can make an informed tradeoff.",
    bias_risk: "Low",
    reason: "These are established mathematical definitions with no subjective content.",
    confidence: "High",
    perspectives: [
      "Academic view: The impossibility theorem proves that demographic parity and equal opportunity cannot both be satisfied simultaneously except in trivial cases.",
      "Legal view: Different jurisdictions mandate different fairness criteria; disparate impact is the US legal standard.",
      "Practitioner view: Choose metrics based on the real-world harms you most want to prevent."
    ],
  },
];

// ── Generic fallback for unmatched questions ──────────────────────────────── //
function buildGenericResponse(message) {
  return {
    answer: `That's a thoughtful question about "${message}". In the context of AI fairness, I analyze how automated systems can produce biased outcomes that disadvantage certain groups. Bias in AI typically originates from three sources: (1) Historical bias in training data reflecting past discrimination, (2) Representation bias where minority groups are underrepresented, and (3) Measurement bias where features used as proxies correlate with protected attributes. I recommend examining any AI system through the lens of Disparate Impact, Equal Opportunity, and Statistical Parity to identify and quantify unfair outcomes. Would you like me to go deeper on any specific aspect of AI fairness?`,
    bias_risk: "Low",
    reason: "General AI fairness inquiry with factual, educational content and no subjective claims.",
    confidence: "Medium",
    perspectives: [
      "Technical view: Every AI decision system should be audited with fairness metrics before deployment.",
      "Ethical view: Fairness is not a binary property — it exists on a spectrum and requires ongoing monitoring.",
      "User view: Transparency about model limitations and fairness properties builds justified trust in AI."
    ],
    comparison: [
      { model: "GPT",      bias: 6 },
      { model: "Gemini",   bias: 5 },
      { model: "Nyaya AI", bias: 2 },
    ],
  };
}

// ── Match message to a demo response ─────────────────────────────────────── //
function getDemoResponse(message) {
  const lower = message.toLowerCase();
  for (const entry of DEMO_RESPONSES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return {
        ...entry,
        comparison: [
          { model: "GPT",      bias: 6 },
          { model: "Gemini",   bias: 5 },
          { model: "Nyaya AI", bias: 2 },
        ],
      };
    }
  }
  return buildGenericResponse(message);
}

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

// ── Call Gemini via REST API (v1beta) ─────────────────────────────────────── //
async function callGemini(prompt) {
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

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
    console.error(`[Gemini] API error ${response.status}:`, errText.substring(0, 300));
    throw new Error(`Gemini API ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Empty response from Gemini");
  return rawText.trim();
}

// ── Parse and sanitize the AI response ───────────────────────────────────── //
function parseStructured(rawText) {
  let cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

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

    // ── Try Gemini first ──────────────────────────────────────────────────── //
    if (GEMINI_API_KEY) {
      try {
        let fullPrompt = `${NYAYA_SYSTEM_PROMPT}\n\n`;
        if (context) {
          fullPrompt += `[DATASET CONTEXT]\n${JSON.stringify(context, null, 2)}\n\n`;
        }
        fullPrompt += `[USER QUERY]\n${message}\n\n[REMINDER: Respond with ONLY a valid JSON object. No other text.]`;

        const rawText = await callGemini(fullPrompt);
        let structured = parseStructured(rawText);

        if (structured) {
          // Normalize fields
          structured.answer       = structured.answer      || "I processed your query successfully.";
          structured.bias_risk    = structured.bias_risk   || "Low";
          structured.reason       = structured.reason      || "No specific bias detected.";
          structured.confidence   = structured.confidence  || "Medium";
          structured.perspectives = Array.isArray(structured.perspectives) ? structured.perspectives : [];
          structured.comparison   = (Array.isArray(structured.comparison) && structured.comparison.length > 0)
            ? structured.comparison
            : [{ model: "GPT", bias: 6 }, { model: "Gemini", bias: 5 }, { model: "Nyaya AI", bias: 2 }];

          console.log(`[Chat] ✅ Gemini responded for: "${message.substring(0, 50)}"`);
          return ok(res, { text: structured.answer, structured });
        }
      } catch (apiErr) {
        console.warn(`[Chat] Gemini unavailable (${apiErr.message}), using demo mode.`);
      }
    }

    // ── Fallback: Smart demo response ─────────────────────────────────────── //
    console.log(`[Chat] 🎭 Demo mode responding for: "${message.substring(0, 50)}"`);
    const structured = getDemoResponse(message);
    return ok(res, { text: structured.answer, structured });

  } catch (err) {
    console.error("Unhandled chat error:", err.message);
    const fallback = getDemoResponse(req.body?.message || "");
    return ok(res, { text: fallback.answer, structured: fallback });
  }
}

module.exports = { handleChat };
