// api/chat.js
export default async function handler(req, res) {
  try {
    // ✅ req.body is already parsed by Vercel
    const userPrompt = req.body?.prompt;
    if (!userPrompt) return res.status(400).json({ error: "Missing prompt" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content:
              "You are an expressive AR assistant appearing as a glowing orb. Speak briefly and emotionally.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    // ✅ Check if choices exist
    if (!data?.choices?.length) {
      return res.status(500).json({ error: "No response from OpenAI API" });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
