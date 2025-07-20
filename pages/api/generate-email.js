// pages/api/generate-email.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, title, skills, pitch, tone } = req.body;
  if (!name || !title || !skills || !pitch || !tone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Initialize OpenAI client
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  // Build the prompt
  const userPrompt = `
You're a recruiter writing a cold email to a candidate.

Candidate Name: ${name}
Job Title: ${title}
Background/Skills: ${skills}
Your Pitch: ${pitch}
Tone: ${tone}

Write a 3-sentence subject line and a 5-7 sentence cold email that is concise, relevant, and human. Avoid clichés and sound natural. End with a clear call to action.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes recruitment cold emails.' },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const email = completion.data.choices[0].message.content.trim();
    return res.status(200).json({ email });
  } catch (err) {
    console.error('OpenAI API error:', err);
    return res.status(500).json({ error: 'Failed to generate email' });
  }
}
