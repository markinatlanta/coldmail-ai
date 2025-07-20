// pages/api/generate-email.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, title, skills, pitch, tone } = req.body;
  if (!name || !title || !skills || !pitch || !tone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Initialize OpenAI client (v4 SDK)
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Load & fill prompt template
  const template = fs.readFileSync(
    path.resolve(process.cwd(), "prompt.txt"),
    "utf-8"
  );
  const userPrompt = template
    .replace("{{name}}", name)
    .replace("{{title}}", title)
    .replace("{{skills}}", skills)
    .replace("{{pitch}}", pitch)
    .replace("{{tone}}", tone);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that writes recruitment cold emails." },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    // Extract the generated email
    const email = completion.choices[0].message.content.trim();
    return res.status(200).json({ email });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to generate email" });
  }
}
