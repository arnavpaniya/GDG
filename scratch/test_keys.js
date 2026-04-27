const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey(key, label) {
  console.log(`Testing ${label}: ${key ? `${key.substring(0, 10)}...` : "MISSING"}`);
  if (!key) return;

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log(`${label} SUCCESS:`, result.response.text());
    return true;
  } catch (error) {
    console.error(`${label} FAILURE:`, error.message);
    return false;
  }
}

async function run() {
  const key1 = "AIzaSyDRzHBSx0VAs5kKnE7bpHFlMet37hDNXbo"; // Current backend key
  const key2 = "AIzaSyDigwC7TKpRALnKgEuSdMB51Yy81nR8xhk"; // Current frontend firebase key
  
  await testKey(key1, "Backend Key");
  await testKey(key2, "Frontend Key");
}

run();
