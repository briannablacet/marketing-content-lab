// src/pages/api/api_endpoints.ts - Updated with A/B Testing support

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

interface ContentRepurposerRequest extends BaseRequest {
  data: {
    content: string;
    sourceFormat: string;
    targetFormat: string;
    styleGuide?: Record<string, any>;
    tone?: string;
  };
}

interface CompetitorAnalysisRequest extends BaseRequest {
  data: {
    competitors: Array<{ 
      name: string;
      description?: string;
      knownMessages?: string[];
      strengths?: string[];
      weaknesses?: string[];
    }>;
    industry: string;
    userMessages: string[];
  };
}

interface ValuePropositionRequest extends BaseRequest {
  data: {
    productInfo: {
      name: string;
      description: string;
      benefits: string[];
      targetAudience: string[];
    };
    competitors?: string[];
    industry: string;
  };
}

// New interface for A/B testing request
interface ABTestingRequest extends BaseRequest {
  data: {
    contentType: string;
    contentContext: string;
    targetAudience?: string;
    numVariations: number;
  };
}

// Validation functions
const validateContentRepurposerRequest = (data: any): boolean => {
  return !!(data.content && data.sourceFormat && data.targetFormat);
};

const validateCompetitorAnalysisRequest = (data: any): boolean => {
  return !!(data.competitors?.length && data.industry && data.userMessages?.length);
};

const validateValuePropositionRequest = (data: any): boolean => {
  return !!(
    data.productInfo?.name &&
    data.productInfo?.description &&
    data.productInfo?.benefits?.length &&
    data.industry
  );
};

// New validation function for A/B testing
const validateABTestingRequest = (data: any): boolean => {
  return !!(data.contentType && data.contentContext && data.numVariations);
};

// Enhanced prompt generators
const generateContentRepurposerPrompt = (data: ContentRepurposerRequest['data']): string => {
  return `You are an expert content strategist skilled at repurposing content while maintaining brand voice and effectiveness.

Task: Transform the following content from ${data.sourceFormat} to ${data.targetFormat}.

Original Content:
${data.content}

Style Guidelines:
${JSON.stringify(data.styleGuide || {}, null, 2)}

Tone: ${data.tone || 'professional'}

Requirements:
1. Maintain the core message and key points
2. Adapt to ${data.targetFormat} best practices
3. Keep the brand voice consistent
4. Optimize for the new format while preserving intent

Please provide the response in this JSON format:
{
  "repurposedContent": "the transformed content",
  "formatSpecificMetadata": {
    "wordCount": number,
    "readingTime": number,
    "keyPoints": ["main points covered"],
    "seoScore": number
  },
  "contentStats": {
    "originalLength": number,
    "newLength": number,
    "readabilityScore": number
  }
}`;
};

const generateCompetitorAnalysisPrompt = (data: CompetitorAnalysisRequest['data']): string => {
  return `You are an expert competitive analyst specializing in market positioning and messaging strategy.

Task: Based on the provided competitor names and information, provide strategic insights and analysis.

Industry: ${data.industry}

Competitor Information:
${data.competitors.map(comp => `
Company: ${comp.name}
${comp.description ? `Description: ${comp.description}` : ''}
${comp.knownMessages?.length ? `Known Messages: ${comp.knownMessages.join(', ')}` : ''}
${comp.strengths?.length ? `Strengths: ${comp.strengths.join(', ')}` : ''}
${comp.weaknesses?.length ? `Weaknesses: ${comp.weaknesses.join(', ')}` : ''}
`).join('\n')}

User's Key Messages:
${JSON.stringify(data.userMessages, null, 2)}

Provide a detailed analysis in this JSON format:
{
  "competitorInsights": [
    {
      "name": "competitor name",
      "keyThemes": ["identified themes"],
      "uniquePositioning": ["unique aspects"],
      "gaps": ["identified gaps"]
    }
  ],
  "opportunities": ["strategic opportunities"],
  "recommendedMessages": ["message recommendations"]
}`;
};

const generateValuePropositionPrompt = (data: ValuePropositionRequest['data']): string => {
  return `You are an expert in crafting compelling value propositions that resonate with target audiences.

Task: Create a powerful value proposition based on the following information.

Product Information:
${JSON.stringify(data.productInfo, null, 2)}

Industry: ${data.industry}
${data.competitors ? `Competitors: ${JSON.stringify(data.competitors, null, 2)}` : ''}

Create a response in this JSON format:
{
  "valueProposition": "main value proposition",
  "alternativeVersions": ["alternative versions"],
  "keyDifferentiators": ["key differentiating factors"],
  "targetedMessages": {
    "audience1": ["targeted messages"],
    "audience2": ["targeted messages"]
  }
}`;
};

// New prompt generator for A/B testing
const generateABTestingPrompt = (data: ABTestingRequest['data']): string => {
  // Get the appropriate prompt prefix based on content type
  let promptPrefix = "";
  switch (data.contentType) {
    case 'email_subject':
      promptPrefix = "Create email subject line variations that will improve open rates.";
      break;
    case 'cta':
      promptPrefix = "Create call-to-action button text variations that will improve click-through rates.";
      break;
    case 'headline':
      promptPrefix = "Create headline variations for content that will improve engagement.";
      break;
    case 'value_prop':
      promptPrefix = "Create value proposition variations that clearly communicate the unique value.";
      break;
    case 'ad_copy':
      promptPrefix = "Create ad copy variations that will drive conversions.";
      break;
    default:
      promptPrefix = "Create variations of the following content:";
  }

  const audienceContext = data.targetAudience ? `for ${data.targetAudience}` : "for a general audience";
  
  return `${promptPrefix}

Content to communicate: "${data.contentContext}"
Target audience: ${audienceContext}

Generate ${data.numVariations} different high-quality variations that would be effective for A/B testing. 
Make each variation distinct and optimized for the specific content type.

Return the variations in this JSON format:
{
  "variations": [
    "first variation text",
    "second variation text",
    etc.
  ]
}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, data } = req.body;

    // Input validation
    let isValid = false;
    let prompt = '';
    let responseFormat = {};

    switch (endpoint) {
      case 'content-repurposer':
        isValid = validateContentRepurposerRequest(data);
        prompt = generateContentRepurposerPrompt(data);
        responseFormat = {
          repurposedContent: '',
          formatSpecificMetadata: {},
          contentStats: {
            originalLength: data.content?.length || 0,
            newLength: 0,
            readabilityScore: 0,
          },
        };
        break;

      case 'analyze-competitors':
        isValid = validateCompetitorAnalysisRequest(data);
        prompt = generateCompetitorAnalysisPrompt(data);
        responseFormat = {
          competitorInsights: [],
          opportunities: [],
          recommendedMessages: [],
        };
        break;

      case 'value-proposition-generator':
        isValid = validateValuePropositionRequest(data);
        prompt = generateValuePropositionPrompt(data);
        responseFormat = {
          valueProposition: '',
          alternativeVersions: [],
          keyDifferentiators: [],
          targetedMessages: {},
        };
        break;

      // New case for A/B testing
      case 'generate-variations':
        isValid = validateABTestingRequest(data);
        prompt = generateABTestingPrompt(data);
        responseFormat = {
          variations: [],
        };
        break;

      default:
        return res.status(400).json({ 
          error: 'Invalid endpoint',
          message: `Endpoint '${endpoint}' not found`
        });
    }

    if (!isValid) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Missing required fields or invalid data format'
      });
    }

    // Call OpenAI with enhanced error handling
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI expert in content strategy and marketing. Provide responses in valid JSON format only.'
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('OpenAI returned an empty response');
      }

      const responseText = completion.choices[0].message?.content || '';
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse OpenAI response:', responseText);
        throw new Error('Failed to parse AI response as JSON');
      }

      // Merge with response format to ensure all expected fields exist
      const finalResponse = { ...responseFormat, ...parsedResponse };

      return res.status(200).json(finalResponse);

    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      
      // Check for specific OpenAI error types
      if (error.response?.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Please try again later'
        });
      }

      if (error.response?.status === 401) {
        return res.status(401).json({
          error: 'Authentication error',
          message: 'API key validation failed'
        });
      }

      throw error; // Re-throw for general error handling
    }

  } catch (error: any) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred'
    });
  }
}