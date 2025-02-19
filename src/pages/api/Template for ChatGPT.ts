Template for ChatGPT:

// Template for creating Market Multiplier API endpoints

/*
Instructions for ChatGPT:
1. Follow this exact structure
2. Use TypeScript
3. Include proper error handling
4. Follow the response format pattern
5. Include comments as shown
6. Use the OpenAI configuration as shown
7. Include console.error for error logging
*/

// src/pages/api/[endpoint-name].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

// Define response types
interface YourResponseType {
  // Define the shape of your response data
}

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Get data from request body
    const { yourData } = req.body;

    // 2. Construct the prompt
    const prompt = `Your prompt here`;

    // 3. Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "System message defining AI's role"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // 4. Parse the response
    const responseText = completion.data.choices[0].message?.content || '';
    const parsedResponse: YourResponseType = JSON.parse(responseText);

    // 5. Return the response
    return res.status(200).json(parsedResponse);

  } catch (error: any) {
    // Log the error
    console.error('Your error label:', error);
    
    // Return error response
    return res.status(500).json({ 
      error: 'Error message for user',
      details: error.message 
    });
  }
}

//end template
