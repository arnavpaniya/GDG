require("dotenv").config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function test() {
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: "Say: Hello world" }] }],
  };
  
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  const data = await resp.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
