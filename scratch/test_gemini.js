const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./backend/.env" });

async function testKey() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Testing Key:", key ? `${key.substring(0, 5)}...` : "MISSING");
  
  if (!key) return;

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log("SUCCESS:", result.response.text());
  } catch (error) {
    console.error("FAILURE:", error.message);
  }
}

testKey();
