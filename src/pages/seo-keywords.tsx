// src/pages/api/api_endpoints.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type definitions for better type safety
interface BaseRequest {
  endpoint: string;
  data: any;
}

// Handler for keyword generation
async function handleKeywordGeneration(data: any) {
  if (!data.context || !Array.isArray(data.context.messages)) {
    throw new Error('Invalid request data for keyword generation');
  }

  const prompt = `You are an expert SEO strategist specializing in keyword research and content optimization.

Task: Based on the provided information, generate strategic SEO keywords that will help this content rank well and reach the right audience.

Messages/Value Propositions:
${JSON.stringify(data.context.messages, null, 2)}

Target Personas:
${JSON.stringify(data.context.personas || [], null, 2)}

Competitors:
${JSON.stringify(data.context.competitors || [], null, 2)}

${data.context.productInfo ? `Product Information:
${JSON.stringify(data.context.productInfo, null, 2)}` : ''}

Generate SEO keywords and group them based on the following categories.

Format your response as a JSON object with these exact properties:
- primaryKeywords: Array of 3-5 most important target keywords (STRINGS ONLY)
- secondaryKeywords: Array of 5-10 supporting keywords that capture related search intent (STRINGS ONLY)
- keywordGroups: Array of objects with { category: string, keywords: string[] }
- metrics: Object with estimated search volume, competition level, and recommended content types

IMPORTANT: All keywords MUST be simple strings, not objects. Do not return objects with 'keyword' properties or any nested objects.

Example of CORRECT format:
{
  "primaryKeywords": ["marketing automation", "content strategy", "SEO tools"],
  "secondaryKeywords": ["marketing software", "content creation tools"],
  "keywordGroups": [
    {
      "category": "Features",
      "keywords": ["automation tools", "content scheduling"]
    }
  ],
  "metrics": {
    "estimatedSearchVolume": "medium",
    "competitionLevel": "high",
    "recommendedContent": ["Blog Posts", "Case Studies"]
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in keyword research. Respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedContent = JSON.parse(content);
    
    // Ensure all keyword arrays contain only strings
    const ensureStringArray = (arr: any[]): string[] => {
      if (!arr || !Array.isArray(arr)) return [];
      
      return arr.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // If it's an object, convert to string representation
          if (item.keyword) return String(item.keyword);
          if (item.name) return String(item.name);
          return JSON.stringify(item);
        }
        return String(item);
      }).filter(Boolean);
    };
    
    // Process each keyword array to ensure they contain only strings
    const result = {
      primaryKeywords: ensureStringArray(parsedContent.primaryKeywords || []),
      secondaryKeywords: ensureStringArray(parsedContent.secondaryKeywords || []),
      keywordGroups: Array.isArray(parsedContent.keywordGroups) 
        ? parsedContent.keywordGroups.map((group: any) => ({
            category: typeof group.category === 'string' ? group.category : String(group.category || 'Group'),
            keywords: ensureStringArray(group.keywords || [])
          }))
        : [],
      metrics: parsedContent.metrics || {
        estimatedSearchVolume: "medium",
        competitionLevel: "medium",
        recommendedContent: ["Blog Posts", "Case Studies", "White Papers"]
      }
    };
    
    // Verify that we have actual string values
    console.log('Processed keywords:', {
      primarySample: result.primaryKeywords.slice(0, 2),
      secondarySample: result.secondaryKeywords.slice(0, 2),
      groupSample: result.keywordGroups.length > 0 ? result.keywordGroups[0].keywords.slice(0, 2) : []
    });
    
    return result;
  } catch (error) {
    console.error('Error in keyword generation:', error);
    throw error;
  }
}

// Main API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { endpoint, data } = req.body as BaseRequest;

    // Simplified endpoint handling
    switch (endpoint) {
      case 'generate-keywords':
        try {
          const result = await handleKeywordGeneration(data);
          return res.status(200).json(result);
        } catch (error) {
          console.error('Keyword generation error:', error);
          return res.status(500).json({ 
            error: 'Keyword generation failed', 
            details: (error as Error).message 
          });
        }
        
      case 'product-info':
        // Simple demo handler for product info
        return res.status(200).json({
          success: true,
          data: {
            name: "Marketing Content Lab",
            type: "SaaS Platform",
            description: "AI-powered content marketing platform"
          }
        });
        
      // Add handlers for other endpoints here
      case 'content-repurposer':
      case 'analyze-competitors':
      case 'generate-value-prop':
      case 'persona-generator':
        return res.status(501).json({ 
          error: 'Endpoint not implemented in simplified version', 
          endpoint: endpoint
        });
        
      default:
        return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
    }
  } catch (error) {
    console.error('General error in API endpoint:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: (error as Error).message 
    });
  }
}