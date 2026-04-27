/**
 * src/controllers/chatController.js
 * ───────────────────────────────────────
 * Handles chat interactions using Gemini API
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config/env");

function ok(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

async function handleChat(req, res, next) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "Gemini API key is not configured" });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Construct a prompt that includes the context if available
    let prompt = "You are an AI fairness and bias mitigation assistant named Nyaya AI.
";
    prompt += "Answer the user's questions about AI fairness, ML bias, or their uploaded dataset.

";

    if (context) {
      prompt += `Context about current dataset/analysis:
${JSON.stringify(context, null, 2)}

`;
    }

    prompt += `User: ${message}
Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return ok(res, { text });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleChat,
};
