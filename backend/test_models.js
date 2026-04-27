require("dotenv").config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Key:", GEMINI_API_KEY.substring(0, 12) + "...");

async function tryModel(modelName) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: "Say: hello" }] }],
    generationConfig: { maxOutputTokens: 10 },
  };
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.log(`❌ ${modelName}: ${resp.status} - ${data?.error?.message?.substring(0,100)}`);
    } else {
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`✅ ${modelName}: "${text}"`);
    }
  } catch(e) {
    console.log(`❌ ${modelName}: ${e.message}`);
  }
}

async function main() {
  // Try all models that were listed as available
  await tryModel("gemini-2.5-flash");
  await tryModel("gemini-2.5-flash-lite");
  await tryModel("gemini-2.0-flash-lite");
  await tryModel("gemini-2.0-flash-lite-001");
  await tryModel("gemini-2.0-flash-001");
  await tryModel("gemini-2.0-flash");
  await tryModel("gemini-2.5-pro");
}

main();
