// src/pages/api/generate-content.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ success: false, message: "Invalid prompt input" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4-turbo"
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });
  
    // ✅ Make sure we're correctly extracting the AI-generated response
    const generatedContent = completion.choices?.[0]?.message?.content || "⚠️ No content generated.";
  
    res.status(200).json({ 
      success: true, 
      content: generatedContent // 🔥 This ensures the response includes generated text
    });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate content", error });
  }
  
}
