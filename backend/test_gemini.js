
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./backend/.env" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini(modelName) {
  console.log(`Testing model: ${modelName}`);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log(`Success with ${modelName}:`, response.text());
  } catch (err) {
    console.error(`Error with ${modelName}:`, err.message);
  }
}

async function run() {
  await testGemini("gemini-2.5-flash");
  await testGemini("gemini-1.5-flash");
  await testGemini("gemini-2.0-flash-exp");
  await testGemini("gemini-2.0-flash");
}

run();
