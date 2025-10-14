/*import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `
            You are an AI assistant in an AR car showroom.
            Answer user questions about the car.
            Respond ONLY in JSON format:
            {
              "answer": "<concise answer>",
              "emotion": "<happy, sad, excited, curious, calm, angry>"
            }
            Do not include anything outside JSON.
          `},
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;

    try {
      // Parse JSON safely
      const parsed = JSON.parse(message);
      res.json(parsed);
    } catch (err) {
      res.json({ answer: "Sorry, I couldn’t process that.", emotion: "calm" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
*/



// api/chat.js
export default async function handler(req, res) {
try {
const prompt = req.body?.prompt;
if (!prompt) return res.status(400).json({ error: "Missing prompt" });


const systemPrompt = `
You are an AI assistant in an AR car showroom.
Answer user questions about the car.
Respond ONLY in JSON format:
{
"answer": "<concise answer>",
"emotion": "<happy, sad, excited, curious, calm, angry>"
}
Do not include anything outside JSON.
`;


const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
model: "gpt-5",
messages: [
{ role: "system", content: systemPrompt },
{ role: "user", content: prompt }
],
max_tokens: 250,
temperature: 0.6
}),
});


const data = await response.json();
const raw = data?.choices?.[0]?.message?.content || '{}';


// Try to parse as JSON — fallback to a safe structure
let json;
try {
json = JSON.parse(raw.trim());
} catch (e) {
// If model returned extra text, attempt to extract the first JSON block
const m = raw.match(/\{[\s\S]*\}/);
if (m) {
try { json = JSON.parse(m[0]); }
catch (e2) { json = { answer: raw, emotion: "curious" }; }
} else {
json = { answer: raw, emotion: "curious" };
}
}


// Validate fields
if (typeof json.answer !== 'string') json.answer = String(json.answer || '');
if (!json.emotion) json.emotion = 'curious';


res.status(200).json({ answer: json.answer, emotion: json.emotion });


} catch (err) {
console.error('Error in /api/chat:', err);
res.status(500).json({ answer: 'Internal server error', emotion: 'sad' });
}
}

/*
export default async function handler(req, res) {
  try {
    const prompt = req.body?.prompt;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const context = `
      You are an AI assistant in an AR car showroom.
      Answer user questions about the car.
      Respond ONLY in JSON format:
      {
        "answer": "<concise answer>",
        "emotion": "<happy, sad, excited, curious, calm, angry>"
      }
      Do not include anything outside JSON.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          { role: "system", content: context },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || '{}';

    let json;
    try { json = JSON.parse(content); } 
    catch(e) { json = { answer: content, emotion: "curious" }; }

    res.status(200).json(json);

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Internal server error", emotion: "sad" });
  }
}
*/




