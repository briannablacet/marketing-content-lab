import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Competitor {
  name: string;
  url: string;
}

interface AIAnalysis {
  keyThemes: string[];
  gaps: string[];
  opportunities: string[];
  differentiators: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Incoming Request Method:', req.method); // Debugging

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let { competitors, userMessages } = req.body;

    // Debugging: Log request body
    console.log('Incoming Request Body:', req.body);

    // Validate JSON body structure
    if (
      !Array.isArray(competitors) ||
      !competitors.every((comp: Competitor) => comp.name && comp.url) ||
      !Array.isArray(userMessages) ||
      !userMessages.every((msg: string) => typeof msg === 'string')
    ) {
      console.error('Invalid Request Data:', { competitors, userMessages });
      return res.status(400).json({ error: 'Invalid JSON format or missing required fields' });
    }

    // Construct OpenAI prompt
    const prompt = `
      You are a marketing strategy expert specializing in competitive analysis.

      Analyze the following competitor websites and compare their messaging with the user's key messages.

      Competitors:
      ${competitors.map((comp: Competitor) => `- ${comp.name}: ${comp.url}`).join('\n')}

      User's Key Messages:
      ${userMessages.join('\n')}

      Respond **only** in valid JSON format. Do not include any explanations or introductory text. 

      Example output format:
      {
        "keyThemes": ["Key theme 1", "Key theme 2"],
        "gaps": ["Gap 1", "Gap 2"],
        "opportunities": ["Opportunity 1", "Opportunity 2"],
        "differentiators": ["Differentiator 1", "Differentiator 2"]
      }
    `;

    console.log('Generated OpenAI Prompt:', prompt); // Debugging

    // Call OpenAI API
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-0613', // Ensure you're using the correct model
      messages: [
        { role: 'system', content: "You are an expert marketing analyst. Respond with JSON only." },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    // Debugging: Log raw AI response
    console.log('OpenAI Raw Response:', aiResponse);

    // Extract AI response safely
    const aiMessage = aiResponse.choices[0]?.message?.content || '';
    console.log('Extracted AI Message:', aiMessage); // Debugging

    // Parse AI response into structured format
    const parsedResponse: AIAnalysis = JSON.parse(aiMessage);

    return res.status(200).json(parsedResponse);
  } catch (error) {
    console.error('Error in analyze-competitors:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
