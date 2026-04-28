
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./backend/.env" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log(`Listing models...`);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // There is no direct listModels in the JS SDK usually, it's a separate client usually or via fetch
    // But we can try to find the right name by guessing
    console.log("Current API Key:", GEMINI_API_KEY);
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

listModels();
