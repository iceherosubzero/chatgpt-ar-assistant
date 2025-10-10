// api/chat.js

export default async function handler(req, res) {
  try {
    const body = await req.json ? await req.json() : req.body;
    const userPrompt = body.prompt || "";

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
            content: "You are an expressive AR assistant appearing as a glowing orb. Speak briefly and emotionally.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
}
