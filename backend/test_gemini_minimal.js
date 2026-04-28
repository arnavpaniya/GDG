const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  const modelName = "gemini-1.5-flash";
  console.log(`Testing model: ${modelName}`);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say 'API Key is Working'");
    const response = await result.response;
    console.log(`Success:`, response.text());
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

testGemini();
