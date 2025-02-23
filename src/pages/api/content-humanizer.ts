//src/pages/api/content-humanizer.ts
console.log("🔍 Loaded API Key:", process.env.OPENAI_API_KEY);

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
console.log("✅ API Route Loaded: /api/content-humanizer");
console.log("Loaded API Key:", process.env.OPENAI_API_KEY ? "✅ Exists" : "❌ Missing");


// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware for authentication
function authenticate(req: NextApiRequest, res: NextApiResponse): boolean {
    const authHeader = req.headers.authorization;
    const storedKey = process.env.OPENAI_API_KEY?.trim(); // Ensure no extra spaces
  
    console.log("🔍 Expected API Key (from .env.local):", `"${storedKey}"`);
    console.log("🔍 Received API Key (from request):", `"${authHeader}"`);
  
    if (!storedKey) {
      console.error("❌ ERROR: OPENAI_API_KEY is missing from environment variables.");
      res.status(500).json({
        success: false,
        error: { code: "SERVER_ERROR", message: "Missing API key in server configuration." }
      });
      return false;
    }
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Missing API key in request" }
      });
      return false;
    }
  
    // ✅ Correctly extract only the API key
    const token = authHeader.replace("Bearer ", "").trim();
  
    console.log("🔍 Extracted Token:", `"${token}"`);
  
    if (token !== storedKey) {
      console.error("❌ ERROR: API Key does not match!");
      res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Invalid API key" }
      });
      return false;
    }
  
    return true;
  }
  
// Humanization presets
const humanizationOptions = {
  tones: ["Conversational", "Professional", "Casual", "Authoritative", "Friendly"],
  formalityLevels: ["Formal", "Neutral", "Casual"],
  features: ["Simplify language", "Add storytelling", "Make it engaging"],
  industryContexts: ["Technology", "Healthcare", "Finance", "Education", "E-commerce"]
};

// API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!authenticate(req, res)) return;

  if (req.method === 'GET') {
    return res.status(200).json(humanizationOptions);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use GET or POST' } });
  }

  try {
    const { content, parameters } = req.body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Content is required' } });
    }

    const prompt = `
      You are a professional content editor specializing in humanizing AI-generated text.
      Your goal is to refine the following content while preserving key messages, making it sound natural and engaging.

      Tone: ${parameters?.tone || 'Conversational'}
      Formality: ${parameters?.formality || 'Neutral'}
      Industry Context: ${parameters?.industryContext || 'General'}
      Prohibited Words: ${parameters?.styleGuideParameters?.prohibited?.join(', ') || 'None'}
      Required Terminology: ${parameters?.styleGuideParameters?.required?.join(', ') || 'None'}
      Preserve Keywords: ${parameters?.preserveKeywords?.join(', ') || 'None'}

      Original Content:
      ${content}

      Rewrite this text according to the given parameters while making it sound more human-like.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-0613',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 500,
    });

    const aiMessage = aiResponse.choices[0]?.message?.content || '';
    console.log('AI Response:', aiMessage);

    return res.status(200).json({
      success: true,
      content: aiMessage,
      changes: [
        { original: content, modified: aiMessage, reason: "Humanized based on user preferences" }
      ]
    });
  } catch (error) {
    console.error('Error in content-humanizer:', error);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal Server Error' } });
  }
}
