// src/pages/api/generate-keywords.ts


import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

// Configure OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface KeywordResponse {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  keywordGroups: Array<{
    category: string;
    keywords: string[];
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { context } = req.body;
    
    // Construct the prompt
    const prompt = `Based on the following context about a business:
    
Key Messages: ${context.messages.join(', ')}
Target Personas: ${context.personas.join(', ')}
Competitors: ${context.competitors.join(', ')}

Generate SEO keywords in this JSON format:
{
  "primaryKeywords": ["keyword1", "keyword2"],
  "secondaryKeywords": ["keyword1", "keyword2"],
  "keywordGroups": [
    {
      "category": "Category Name",
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}

Focus on terms that will help reach their target audience and differentiate from competitors.`;

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a skilled SEO expert who helps businesses identify strategic keywords."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Parse the response
    const responseText = completion.data.choices[0].message?.content || '';
    const keywords: KeywordResponse = JSON.parse(responseText);

    return res.status(200).json(keywords);
  } catch (error: any) {
    console.error('Keyword generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate keywords',
      details: error.message 
    });
  }
}