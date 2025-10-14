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


