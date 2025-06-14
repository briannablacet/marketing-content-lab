// src/pages/api/api_endpoints.ts
// Merged version: GitHub base + local improvements

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define all handler functions FIRST

// Handler for content humanizer endpoint
async function handleContentHumanizer(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (!data.content || typeof data.content !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Please provide content to humanize",
      });
    }

    // Validate content length
    if (data.content.length > 10000) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Content length exceeds maximum limit of 10,000 characters",
      });
    }

    // Validate parameters
    const validTones = [
      "professional",
      "casual",
      "friendly",
      "formal",
      "conversational",
    ];
    const validFormality = ["formal", "neutral", "casual"];
    const validCreativity = ["low", "medium", "high"];

    const parameters = data.parameters || {
      clicheRemoval: true,
      formality: "neutral",
      styleGuide: "Chicago Manual of Style",
    };

    // Validate tone
    if (parameters.tone && !validTones.includes(parameters.tone)) {
      return res.status(400).json({
        error: "Invalid request",
        message: `Invalid tone. Must be one of: ${validTones.join(", ")}`,
      });
    }

    // Validate formality
    if (
      parameters.formality &&
      !validFormality.includes(parameters.formality)
    ) {
      return res.status(400).json({
        error: "Invalid request",
        message: `Invalid formality. Must be one of: ${validFormality.join(
          ", "
        )}`,
      });
    }

    // Validate creativity
    if (
      parameters.creativity &&
      !validCreativity.includes(parameters.creativity)
    ) {
      return res.status(400).json({
        error: "Invalid request",
        message: `Invalid creativity level. Must be one of: ${validCreativity.join(
          ", "
        )}`,
      });
    }

    // Use strategic data if available (without changing the expected structure)
    const strategicData = data.strategicData || {};

    try {
      let prompt = `As an expert editor specializing in humanizing AI-generated or overly formal content, enhance the following text to sound more naturally human.

Text: ${data.content}

Apply these humanization techniques:
${parameters.clicheRemoval ? "- Remove AI clichés and robotic phrasing\n" : ""}
${parameters.addContractions
          ? "- Add natural contractions where appropriate\n"
          : ""
        }
${parameters.addPersonality
          ? "- Incorporate a warmer, more personable tone\n"
          : ""
        }
${parameters.formality
          ? `- Adjust formality level to be ${parameters.formality}\n`
          : ""
        }
${parameters.creativity
          ? `- Apply ${parameters.creativity} level of creative variation\n`
          : ""
        }

Additional humanization principles:
- Replace robotic transitions ("it is important to note," "as mentioned earlier")
- Vary sentence structure to create a more natural rhythm
- Use more conversational connectors ("so," "actually," "though," etc. where appropriate)
- Add natural discourse markers humans use when speaking or writing
- Incorporate tasteful idioms and colloquialisms where appropriate
- Replace generic words with more specific, vivid alternatives
- Follow ${parameters.styleGuide || "Chicago Manual of Style"
        } for punctuation and formatting
- Ensure the content sounds like it was written by a thoughtful human expert
- Maintain the original meaning and expertise level while making it sound more natural`;

      // Add strategic data if available
      if (
        strategicData.product ||
        strategicData.brandVoice ||
        strategicData.writingStyle
      ) {
        prompt += `\n\nAdditional brand context (incorporate where appropriate):`;

        if (strategicData.product?.valueProposition) {
          prompt += `\n- Brand value proposition: "${strategicData.product.valueProposition}"`;
        }

        if (strategicData.brandVoice?.brandVoice?.tone) {
          prompt += `\n- Brand voice tone: ${strategicData.brandVoice.brandVoice.tone}`;
        }

        if (strategicData.writingStyle?.styleGuide?.primary) {
          prompt += `\n- Style guide: ${strategicData.writingStyle.styleGuide.primary}`;
        }
      }

      prompt += `\n\nReturn your response as a JSON string with these fields:
{
  "content": "the humanized text",
  "changes": [
    {
      "original": "original text segment",
      "modified": "modified text segment",
      "reason": "reason for change"
    }
  ],
  "humanityScore": 85,
  "readabilityScore": 90
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert editor who specializes in making AI-generated content sound like it was written by a thoughtful human being.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message?.content || "";

      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(responseText);

        // Create a stable response structure
        const formattedResponse = {
          content: parsedResponse.content || "",
          changes: parsedResponse.changes || [],
          humanityScore: parsedResponse.humanityScore || 85,
          readabilityScore: parsedResponse.readabilityScore || 85,
        };

        return res.status(200).json(formattedResponse);
      } catch (error) {
        console.error("Failed to parse OpenAI response:", responseText);

        // Return a fallback response
        return res.status(200).json({
          content: data.content,
          changes: [],
          humanityScore: 85,
          readabilityScore: 85,
        });
      }
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return res.status(500).json({
        error: "Service temporarily unavailable",
        message: "Whoops! There's a problem. Please try again a little later.",
      });
    }
  } catch (error) {
    console.error("Error in content humanizer:", error);
    return res.status(500).json({
      error: "Service temporarily unavailable",
      message: "Whoops! There's a problem. Please try again a little later.",
    });
  }
}

// Handler for style checking endpoint
async function handleStyleChecker(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (!data.content || typeof data.content !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing or invalid content field",
      });
    }

    // Get the style guide parameters
    const styleGuide = data.styleGuide || {
      guide: "Chicago Manual of Style",
      formatting: {},
      punctuation: {},
      prohibited: [],
      required: [],
    };

    try {
      const prompt = `As an expert editor specializing in style guide compliance, analyze the following text for adherence to style guidelines:

Text to analyze:
${data.content}

Style Guide: ${styleGuide.guide || "Chicago Manual of Style"}

Formatting Guidelines:
${JSON.stringify(styleGuide.formatting || {}, null, 2)}

Punctuation Rules:
${JSON.stringify(styleGuide.punctuation || {}, null, 2)}

Prohibited Terms/Phrases:
${JSON.stringify(styleGuide.prohibited || [], null, 2)}

Required Conventions:
${JSON.stringify(styleGuide.required || [], null, 2)}

Please analyze the text and provide a detailed compliance report. Focus exclusively on identifying violations of the style guide and formatting issues.

Look for these common style guide violations:
1. Capitalization inconsistencies (especially in headings and titles)
2. Punctuation errors (comma usage, quotation marks, apostrophes)
3. Number formatting issues (when to spell out vs. use numerals)
4. Heading and subheading formatting inconsistencies
5. Bulleted or numbered list formatting issues
6. Oxford comma usage or omission (depending on style guide)
7. Acronym usage without proper definition
8. Prohibited terminology or phrasing
9. Spacing issues (single vs. double spaces)
10. Date and time formatting inconsistencies

Return the analysis as a JSON object with these fields:
{
  "compliance": 75,
  "issues": [
    {
      "type": "CAPITALIZATION",
      "text": "the exact text with the issue",
      "suggestion": "specific correction that would fix the issue",
      "severity": "high"
    }
  ],
  "strengths": [
    "Areas where the text adheres well to the style guide"
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert editor with decades of experience in enforcing style guide compliance.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more precise identification of issues
      });

      const responseText = completion.choices[0].message?.content || "";

      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(responseText);

        // Validate the response structure
        if (
          !parsedResponse.compliance ||
          !Array.isArray(parsedResponse.issues) ||
          !Array.isArray(parsedResponse.strengths)
        ) {
          throw new Error("Invalid response structure from OpenAI");
        }

        return res.status(200).json(parsedResponse);
      } catch (error) {
        console.error("Failed to parse OpenAI response:", responseText);
        return res.status(500).json({
          error: { message: "Failed to parse style analysis response" },
        });
      }
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return res.status(500).json({
        error: { message: "Failed to analyze content with OpenAI" },
      });
    }
  } catch (error) {
    console.error("Error in style checker:", error);
    return res.status(500).json({
      error: { message: "Failed to check style compliance" },
    });
  }
}

// Handler for style fixing endpoint
async function handleStyleFixer(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (!data.content || typeof data.content !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing or invalid content field",
      });
    }

    // Get the style guide parameters
    const styleGuide = data.styleGuide || {
      guide: "Chicago Manual of Style",
      formatting: {},
      punctuation: {},
      prohibited: [],
      required: [],
    };

    try {
      const prompt = `As an expert editor, fix the following text to comply with style guidelines and address the identified issues:

Text to fix:
${data.content}

Style Guide: ${styleGuide.guide || "Chicago Manual of Style"}

Identified Issues:
${JSON.stringify(data.issues || [], null, 2)}

Formatting Guidelines:
${JSON.stringify(styleGuide.formatting || {}, null, 2)}

Punctuation Rules:
${JSON.stringify(styleGuide.punctuation || {}, null, 2)}

Prohibited Terms/Phrases:
${JSON.stringify(styleGuide.prohibited || [], null, 2)}

Required Conventions:
${JSON.stringify(styleGuide.required || [], null, 2)}

Please fix all identified issues while maintaining the original meaning and intent of the text. Make the text fully compliant with the style guide.

Return your response as a JSON string with these fields:
{
  "fixedContent": "the corrected text",
  "changes": [
    {
      "original": "original text segment",
      "fixed": "corrected text segment",
      "reason": "explanation of the fix"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert editor who specializes in style guide compliance and fixing writing issues.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const responseText = completion.choices[0].message?.content || "";

      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(responseText);

        // Create a stable response structure
        const formattedResponse = {
          fixedContent: parsedResponse.fixedContent || "",
          changes: parsedResponse.changes || [],
        };

        return res.status(200).json(formattedResponse);
      } catch (error) {
        console.error("Failed to parse OpenAI response:", responseText);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in style fixer:", error);
    return res.status(500).json({
      error: { message: "Failed to fix style issues" },
    });
  }
}

// Handler for mission and vision generation
async function handleMissionVision(data: any, res: NextApiResponse) {
  try {
    console.log("Mission Vision generator received data:", data);

    // Validate input - we need at least some information
    if (
      !data.companyName &&
      !data.audience &&
      !data.differentiator &&
      !data.additionalContext
    ) {
      return res.status(400).json({
        error: "Invalid request",
        message:
          "Please provide at least some company information to generate mission and vision",
      });
    }

    // Extract data with defaults
    const {
      companyName = "",
      audience = "",
      differentiator = "",
      valueProp = "",
      tagline = "",
      boilerplate = "",
      additionalContext = "",
    } = data;

    console.log(`Generating mission and vision for: ${companyName}`);

    // Create a comprehensive prompt for mission and vision generation
    const prompt = `You are a senior brand strategist with a sharp sense of voice and emotional intelligence. You don't write for brochures—you write for real humans. Your mission and vision statements are never generic. They're specific, bold, and just a little unexpected.

Your goal is to help brands sound alive. Avoid filler phrases like "we strive" or "innovative solutions." Instead, write like you've been up all night building the thing yourself. Use vivid verbs, plain speech, and emotional clarity. Let it feel like someone with a spine and a sense of humor wrote it.

Please create a mission statement and vision statement for a company with the following details:

Company Name: ${companyName || "This company"}
What they offer: ${valueProp || "a product or service"}
Who they serve: ${audience || "a target audience"}
Core Beliefs: ${boilerplate || "N/A"}
Tone: ${valueProp ? "authentic and confident" : "professional"}

Mission Statement Guidelines:
- Describe what the company does TODAY
- Explain WHY the company exists
- Use clear, emotionally resonant language—not filler
- Keep it under 50 words

Vision Statement Guidelines:
- Describe the better future the company wants to help create
- Be inspiring, but grounded
- Avoid clichés like "make the world a better place"

Format your response as a JSON object with these exact fields:
{
  "mission": "The mission statement here",
  "vision": "The vision statement here"
}`;

    console.log("Sending prompt to OpenAI for mission and vision");

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert brand strategist who specializes in creating powerful mission and vision statements that capture a company's essence and inspire action.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message?.content || "";
      console.log("Got OpenAI response for mission and vision");

      try {
        // Parse the JSON response
        console.log("Parsing AI response for mission and vision");
        const parsedResponse = JSON.parse(responseText);

        // Validate response format
        if (!parsedResponse.mission && !parsedResponse.vision) {
          console.log("No mission or vision in response");
          return res.status(500).json({
            error: "Invalid AI response",
            message: "AI did not generate mission or vision statements",
          });
        }

        console.log("Successfully generated mission and vision");

        return res.status(200).json({
          mission: parsedResponse.mission || "",
          vision: parsedResponse.vision || "",
        });
      } catch (parseError) {
        console.error("Failed to parse mission/vision response:", parseError);
        console.log("Response text sample:", responseText.substring(0, 200));

        return res.status(500).json({
          error: "Parse error",
          message: "Failed to parse AI response for mission and vision",
        });
      }
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      return res.status(500).json({
        error: "API error",
        message:
          "Failed to connect to AI service for mission and vision generation",
      });
    }
  } catch (error) {
    console.error("Error generating mission and vision:", error);
    return res.status(500).json({
      error: "Server error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate mission and vision",
    });
  }
}

// Handler for prose perfector endpoint
async function handleProsePerfector(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (!data.text || typeof data.text !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing or invalid text field",
      });
    }

    // Get the enhancement options
    const options = data.options || {
      improveClarity: true,
      enhanceEngagement: true,
      adjustFormality: false,
      formalityLevel: "neutral",
      styleGuide: "Chicago Manual of Style",
    };

    try {
      const prompt = `As a professional editor with expertise matching ${options.styleGuide || "Chicago Manual of Style"
        } guidelines, enhance the following text:

Text: ${data.text}

Apply these professional editing standards:
${options.improveClarity ? "- Improve clarity and readability\n" : ""}
${options.enhanceEngagement ? "- Enhance engagement\n" : ""}
${options.adjustFormality
          ? `- Adjust formality level to be ${options.formalityLevel}\n`
          : ""
        }

Additional editing principles:
- Remove all unnecessary words and redundancies
- Convert passive constructions to active voice
- Use shorter, more declarative sentences where appropriate
- Vary sentence structure for better rhythm and flow
- Follow ${options.styleGuide || "Chicago Manual of Style"} guidelines
- Ensure proper parallel structure in lists and series
- Replace vague terms with specific, concrete language

Return response as JSON with these fields:
{
  "enhancedText": "the professionally edited version",
  "suggestions": [
    {
      "original": "string",
      "suggestion": "string",
      "reason": "string",
      "type": "string"
    }
  ],
  "stats": {
    "readabilityScore": 85,
    "passiveVoiceCount": 0,
    "averageSentenceLength": 20
  }
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert editor with decades of experience in professional editing.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message?.content || "";

      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(responseText);
        return res.status(200).json(parsedResponse);
      } catch (error) {
        console.error("Failed to parse OpenAI response:", responseText);

        // Return a fallback response
        return res.status(200).json({
          enhancedText: data.text,
          suggestions: [],
          stats: {
            readabilityScore: 75,
            clarityImprovements: 0,
            concisionImprovements: 0,
            engagementImprovements: 0,
            passiveVoiceCount: 0,
            averageSentenceLength: 20,
          },
        });
      }
    } catch (error) {
      console.error("OpenAI API Error:", error);

      // Return a fallback response
      return res.status(200).json({
        enhancedText: data.text,
        suggestions: [],
        stats: {
          readabilityScore: 75,
          clarityImprovements: 0,
          concisionImprovements: 0,
          engagementImprovements: 0,
          passiveVoiceCount: 0,
          averageSentenceLength: 20,
        },
      });
    }
  } catch (error) {
    console.error("Error in prose perfector:", error);
    return res.status(500).json({
      error: "Server error",
      message: "Failed to enhance text",
    });
  }
}

// Implement generate keywords handler
async function handleGenerateKeywords(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (!data.context) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Please provide context for keyword generation",
      });
    }

    // Extract context data
    const { messages, personas, productInfo, topic, contentType } =
      data.context;

    // Build topic text from available data
    const topicText =
      topic ||
      (Array.isArray(messages) ? messages.join(". ") : messages) ||
      productInfo?.valueProposition ||
      "content marketing";

    console.log("Generating keywords for topic:", topicText);

    // Generate a prompt for keyword generation
    const prompt = `Generate SEO keywords for: ${topicText}
    Target audience: ${Array.isArray(personas)
        ? personas.join(", ")
        : personas || "marketing professionals"
      }
    Content type: ${contentType || "blog post"}
    
    Please provide the following in your response:
    1. Primary Keywords (5-7 most important keywords directly related to the topic)
    2. Secondary Keywords (8-10 supporting keywords, related terms, and long-tail variations)
    3. Keyword Groups (3-4 thematic groups of related keywords)
    
    Format your response as a JSON object with these exact fields:
    {
      "primaryKeywords": ["keyword1", "keyword2", ...],
      "secondaryKeywords": ["keyword1", "keyword2", ...],
      "keywordGroups": [
        {
          "category": "Group Name",
          "keywords": ["keyword1", "keyword2", ...]
        }
      ]
    }
    
    Ensure your response is valid JSON that can be parsed.`;

    try {
      // Call OpenAI to generate keywords
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert specialized in keyword research.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      });

      // Get response text
      const responseText = completion.choices[0].message?.content || "";
      console.log(
        "Got keyword response:",
        responseText.substring(0, 100) + "..."
      );

      try {
        // Try to parse the JSON response
        const parsedResponse = JSON.parse(responseText);
        return res.status(200).json(parsedResponse);
      } catch (parseError) {
        console.error("Failed to parse keyword response:", parseError);

        // If we can't parse the response, return the fallback
        const fallbackResponse = {
          primaryKeywords: [
            "content marketing",
            "blog post",
            "marketing strategy",
            "content creation",
            "digital marketing",
          ],
          secondaryKeywords: [
            "content strategy",
            "content planning",
            "content calendar",
            "content optimization",
            "content distribution",
            "content analytics",
            "content ROI",
            "content performance",
          ],
          keywordGroups: [
            {
              category: "Content Strategy",
              keywords: [
                "content strategy",
                "content planning",
                "content calendar",
              ],
            },
            {
              category: "Content Optimization",
              keywords: [
                "content optimization",
                "content analytics",
                "content performance",
              ],
            },
            {
              category: "Content Distribution",
              keywords: [
                "content distribution",
                "content ROI",
                "content marketing",
              ],
            },
          ],
        };
        return res.status(200).json(fallbackResponse);
      }
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      return res.status(500).json({
        error: "Service temporarily unavailable",
        message: "Whoops! There's a problem. Please try again a little later.",
      });
    }
  } catch (error) {
    console.error("Error generating keywords:", error);
    return res.status(500).json({
      error: "Service temporarily unavailable",
      message: "Whoops! There's a problem. Please try again a little later.",
    });
  }
}

// Handler for analyzing competitors
async function handleAnalyzeCompetitors(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (
      !data.competitors ||
      !Array.isArray(data.competitors) ||
      data.competitors.length === 0
    ) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Please provide at least one competitor to analyze",
      });
    }

    const competitors = data.competitors;
    const industry = data.industry || ""; // Remove default industry

    console.log(
      `Analyzing ${competitors.length} competitors in the ${industry} industry`
    );

    // Process each competitor
    const processedCompetitors = [];

    for (const competitor of competitors) {
      try {
        // Skip empty competitors
        if (!competitor.name.trim()) continue;

        console.log(`Analyzing competitor: ${competitor.name}`);

        // Check if OpenAI API key exists
        if (!process.env.OPENAI_API_KEY) {
          console.error("OPENAI_API_KEY is missing");
          processedCompetitors.push({
            name: competitor.name,
            uniquePositioning: [
              "API key configuration error. Please check your server setup.",
            ],
            keyThemes: [],
            gaps: [],
          });
          continue; // Skip to next competitor without throwing error
        }

        // Create a prompt for analyzing this competitor
        const prompt = `Analyze the following competitor in the ${industry} industry:

Company: ${competitor.name}

Context: We are analyzing competitors for a food company, so please focus on food industry companies, particularly those related to food production, restaurants, food retail, or food service.

Please provide a comprehensive analysis of this competitor, including:

1. Their unique positioning and differentiation in the market
2. Key messaging themes and marketing focus
3. Apparent strengths based on their public presence
4. Potential gaps or weaknesses in their positioning

Format your response as a JSON object with these fields:
{
  "uniquePositioning": ["point 1", "point 2", "point 3"],
  "keyThemes": ["theme 1", "theme 2", "theme 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"]
}

Only include information that would be publicly available or reasonably inferred from their market presence.`;

        // Call OpenAI API with retry logic
        let completion;
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
          try {
            completion = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert competitive analyst with deep knowledge of market positioning and messaging strategies.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.7,
            });
            break; // Exit loop if successful
          } catch (apiError: unknown) {
            console.error(
              `API attempt ${retryCount + 1} failed:`,
              apiError instanceof Error ? apiError.message : "Unknown error"
            );
            retryCount++;

            if (retryCount > maxRetries) {
              // Don't throw, just note the error and continue with fallback
              console.error("Max retries reached, using fallback data");
              processedCompetitors.push({
                name: competitor.name,
                uniquePositioning: [
                  "Unable to reach AI service. Please try again later.",
                ],
                keyThemes: [],
                gaps: [],
              });
              continue;
            }

            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }

        // If we had API errors and exhausted retries, skip to next competitor
        if (!completion) continue;

        const responseText = completion.choices[0].message?.content || "";
        console.log(`Got response for ${competitor.name}, parsing JSON`);

        try {
          // Parse the JSON response
          const parsedResponse = JSON.parse(responseText);

          // Add to processed competitors
          processedCompetitors.push({
            name: competitor.name,
            uniquePositioning: parsedResponse.uniquePositioning || [],
            keyThemes: parsedResponse.keyThemes || [],
            gaps: parsedResponse.gaps || [],
          });
        } catch (parseError) {
          console.error("Failed to parse OpenAI response:", parseError);
          console.log("Response text sample:", responseText.substring(0, 200));

          // Add fallback data for this competitor
          processedCompetitors.push({
            name: competitor.name,
            uniquePositioning: [
              "Could not analyze this competitor. Please try again with a different name.",
            ],
            keyThemes: [],
            gaps: [],
          });
        }
      } catch (competitorError) {
        console.error(
          `Error processing competitor ${competitor.name}:`,
          competitorError
        );
        return res.status(500).json({
          error: "Service temporarily unavailable",
          message:
            "Whoops! There's a problem. Please try again a little later.",
        });
      }
    }

    // Return the processed data - even if empty or with errors
    return res.status(200).json({
      competitorInsights:
        processedCompetitors.length > 0
          ? processedCompetitors
          : [
            {
              name: "Analysis failed",
              uniquePositioning: [
                "Failed to analyze competitors. Please try again.",
              ],
              keyThemes: [],
              gaps: [],
            },
          ],
    });
  } catch (error) {
    console.error("Error in competitor analysis:", error);
    // Always return a 200 status with usable data
    return res.status(200).json({
      competitorInsights: [
        {
          name: "Analysis failed",
          uniquePositioning: [
            "Failed to analyze competitors due to a server error. Please try again.",
          ],
          keyThemes: [],
          gaps: [],
        },
      ],
    });
  }
}

// src/pages/api/api_endpoints.ts - Replace your existing handleGenerateContent function with this

export async function handleGenerateContent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // FIXED: Extract data from either req.body.data or req.body (handle both formats)
    const requestData = req.body.data || req.body;
    const { campaignData, contentTypes, writingStyle } = requestData;

    if (!campaignData || !contentTypes) {
      console.error("Missing required data:", { campaignData, contentTypes });
      return res.status(400).json({ error: "Missing required data" });
    }

    console.log("Generating content for campaign:", campaignData.name);
    console.log("Content types:", contentTypes);

    // YOUR HIGH-QUALITY BLOG PROMPT
    let prompt = "";
    if (contentTypes.includes("blog-post") || contentTypes.includes("Blog Posts")) {
      prompt = `You are a feature writer for a smart lifestyle magazine like Real Simple or Bon Appétit. You write engaging, accessible pieces that feel like chatting with a knowledgeable friend.

ASSIGNMENT: Write a feature article of EXACTLY 1,500 words (minimum 1,400, maximum 1,600) about: "${campaignData.name}"

🚨 WORD COUNT ENFORCEMENT: You are being paid per word. Your editor demands EXACTLY 1,500 words. Too short = fired. Count every single word.

STRUCTURE GUIDELINES (adapt to your topic):
- COMPELLING OPENING (220-250 words): Start with vivid, engaging scene-setting
- DEVELOP YOUR STORY (1,000-1,200 words): Create 4-6 substantial sections that naturally flow from your topic. Use descriptive, topic-specific subheadings (NOT generic ones like "Benefits" or "Analysis")
- MEMORABLE ENDING (150-200 words): Powerful close that resonates - avoid calling it "Conclusion"

Each major section should be 200-250 words minimum. Develop your ideas thoroughly with rich detail, examples, and insights.

EDITORIAL STANDARDS (follow these precisely):
• LEAD: Open with something relatable—a personal moment, surprising discovery, or "you know that feeling when..." 
- STRUCTURE: After your lead, smoothly guide readers through what's coming—but never use phrases like "we'll explore," "let's dive into," "sit back and discover," or "embark on this journey"
• VOICE: Smart but approachable. Think conversations with your most interesting friend—informed but never preachy
• DETAILS: Use specific, concrete examples people can picture. Include real stories and relatable moments
• TONE: Curious and engaging. You're exploring this topic WITH the reader, not lecturing them about it
• PARAGRAPHS: Mix it up—some short and punchy, others that develop an idea fully
• ACCESSIBILITY: Write for smart people who don't need to be impressed by big words
• WORD COUNT: This is critical—deliver 1,200-1,500 words. Magazine pieces require substantial length for proper development
• ENDING: Close with resonance—a callback to your opening, a forward-looking thought, or an unexpected insight

TARGET AUDIENCE: ${campaignData.targetAudience}
TONE: ${campaignData.tone || writingStyle?.styleGuide?.primary || "Sophisticated, engaging, authoritative"}

Writing Guidelines:
${writingStyle ? `
- Follow ${writingStyle.styleGuide.primary} standards
- Additional rules: ${writingStyle.styleGuide.customRules?.join(", ") || "None"}
` : "Use magazine-quality prose with sophisticated vocabulary and varied sentence structure."}

Do not stop writing until you have reached AT LEAST 1,500 words. This is a magazine feature, not a blog post. Develop each section thoroughly with rich detail, examples, and analysis.

FORMATTING: Do NOT use markdown syntax. Write in plain text with clear section breaks. Use simple headings without ## symbols or ** formatting.`;
    } else {
      // fallback to generic prompt for other content types
      prompt = `Generate content for a ${campaignData.type} campaign with the following details:
      Campaign Name: ${campaignData.name}
      Goal: ${campaignData.goal}
      Target Audience: ${campaignData.targetAudience}
      Key Messages: ${campaignData.keyMessages?.join(", ") || ""}
      
      Writing Style Guidelines:
      ${writingStyle ? `
      - Primary Style: ${writingStyle.styleGuide.primary}
      - Custom Rules: ${writingStyle.styleGuide.customRules?.join(", ") || "None"}
      - Formatting: ${Object.entries(writingStyle.formatting || {}).map(([k, v]) => `${k}: ${v}`).join(", ")}
      - Punctuation: ${Object.entries(writingStyle.punctuation || {}).map(([k, v]) => `${k}: ${v}`).join(", ")}
      ` : "Use a professional and engaging tone."
        }
      
      Generate the following content types: ${contentTypes.join(", ")} `;
    }

    console.log("Sending improved prompt to OpenAI");

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional content creator specializing in high-quality editorial content. Generate engaging, well-structured content that follows the provided guidelines precisely.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    console.log("Received response from OpenAI");

    // Process the response
    const generatedContent = response.choices[0].message.content || "";

    // Parse and structure the content for each type
    const content: Record<string, any> = {};

    contentTypes.forEach((type: string) => {
      switch (type) {
        case "blog-post":
        case "Blog Posts":
          content[type] = {
            title: "Generated Blog Post",
            content: generatedContent, // Use the full editorial blog content
            metaDescription: "A compelling blog post for your campaign",
            keywords: campaignData.keyMessages || [],
          };
          break;
        case "Social Posts":
          content[type] = {
            platform: "LinkedIn",
            posts: [
              {
                content: `${generatedContent} \n\n${(campaignData.keyMessages || [])
                  .map((msg: string) => `#${msg.replace(/\s+/g, "")}`)
                  .join(" ")
                  } `,
                hashtags: (campaignData.keyMessages || []).map(
                  (msg: string) => `#${msg.replace(/\s+/g, "")} `
                ),
              },
            ],
          };
          break;
        case "Email Campaigns":
          content[type] = {
            subject: campaignData.name,
            preview: generatedContent.substring(0, 100),
            body: `Dear ${campaignData.targetAudience}, \n\n${generatedContent} \n\nBest regards, \nYour Team`,
            cta: "Learn More",
          };
          break;
        case "Landing Pages":
          content[type] = {
            headline: campaignData.name,
            subheadline: (campaignData.keyMessages || [])[0],
            content: `# ${campaignData.name} \n\n${generatedContent} \n\n## Key Benefits\n${(campaignData.keyMessages || [])
              .map((msg: string) => `- ${msg}`)
              .join("\n")
              } `,
            cta: "Get Started",
          };
          break;
        default:
          content[type] = `# ${campaignData.name} \n\n${generatedContent} `;
      }
    });

    console.log("Returning generated content");
    return res.status(200).json(content);
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
}


// Handler for value proposition generator endpoint
async function handleValuePropositionGenerator(
  data: any,
  res: NextApiResponse
) {
  try {
    console.log("Value proposition generator received data:", data);

    // Validate input
    if (!data.productInfo) {
      console.log("Missing product information");
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing product information",
      });
    }

    const {
      productInfo,
      competitors = [],
      industry = "technology",
      focusAreas = [],
      tone = "professional",
    } = data;
    console.log(
      `Generating value proposition for: ${productInfo.name || "Marketing Platform"} `
    );

    // Build a prompt for the AI
    const prompt = `You are a sharp, human - centered brand strategist.Write a 50 - word boilerplate paragraph that captures the essence of a company in a way that's both professional and deeply human.

Your task is to craft a paragraph that:
      - Opens with a strong, clear statement of what the company does
        - Highlights the unique value or approach that sets them apart
          - Speaks directly to their ideal audience
            - Closes with a forward - looking statement about their impact or vision
              - Uses active voice and concrete details
                - Avoids corporate jargon, buzzwords, or empty superlatives

The tone should embody the selected brand archetype: ${tone || "Professional"}. If it's the Sage, use language that conveys wisdom and insight. If it's the Creator, emphasize innovation and imagination.If it's the Caregiver, focus on nurturing and support. Match the archetype's emotional truth, not just its surface style.

        Here's what we know:
          - Product Name: ${productInfo.name || "The Company"}
      - Description: ${productInfo.description || "No description provided."}
      - Target Audience: ${Array.isArray(productInfo.targetAudience) ? productInfo.targetAudience.join(", ") : productInfo.targetAudience || "General audience"}

Write a paragraph that feels like it was crafted by someone who truly understands this company's purpose and potential. Make every word count.`;

    try {
      console.log("Sending prompt to OpenAI");
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert marketing strategist who specializes in creating clear, compelling messaging frameworks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message?.content || "";
      console.log("Received response from OpenAI");

      // Return the response in the format expected by the frontend
      return res.status(200).json({
        valueProposition: responseText,
        keyDifferentiators: [],
        targetedMessages: []
      });
    } catch (apiError: unknown) {
      console.error("OpenAI API error:", apiError);
      return res.status(500).json({
        error: "API error",
        message:
          apiError instanceof Error
            ? apiError.message
            : "Failed to generate value proposition",
      });
    }
  } catch (error: unknown) {
    console.error("Error in value proposition generator:", error);
    return res.status(500).json({
      error: "Server error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate value proposition",
    });
  }
}

// Handler for persona generator endpoint
async function handlePersonaGenerator(data: any, res: NextApiResponse) {
  try {
    console.log("Persona generator received data:", data);

    // Validate input
    if (!data.productName || !data.productType) {
      console.log("Missing required fields");
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing product name or type",
      });
    }

    const { productName, productType, currentPersona } = data;
    console.log(`Generating personas for: ${productName} (${productType})`);

    // Create a prompt for persona generation
    const prompt = `Generate target audience personas for the following product:

Product: ${productName}
Product Type: ${productType}
${currentPersona?.role ? `Current Target Role: ${currentPersona.role}` : ""}
${currentPersona?.industry
        ? `Current Industry Focus: ${currentPersona.industry}`
        : ""
      }

Please provide 2 detailed target audience personas that would be ideal customers for this product.
Each persona should include:
1. A specific job role/title
2. Their industry
3. 3-5 specific business challenges they face that the product could solve

Format your response as a valid JSON array with this structure:
[
  {
    "role": "Job Title/Role",
    "industry": "Industry",
    "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
  }
]

Make the personas realistic, specific and detail-oriented.`;

    console.log("Sending prompt to OpenAI");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert marketing strategist who specializes in identifying target audiences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    if (completion.choices.length === 0) {
      console.log("No choices returned from OpenAI");
      return res.status(500).json({
        error: "No response from AI",
        message: "Failed to generate personas",
      });
    }

    const responseText = completion.choices[0].message?.content || "";
    console.log("Received response from OpenAI for personas");

    try {
      // Parse the JSON response
      console.log("Parsing AI response for personas");
      const parsedResponse = JSON.parse(responseText);

      // Validate response format
      if (!Array.isArray(parsedResponse)) {
        console.log("Response is not an array:", typeof parsedResponse);
        return res.status(500).json({
          error: "Invalid AI response",
          message: "AI did not return array of personas",
        });
      }

      console.log(
        "Sending personas back to client:",
        parsedResponse.length,
        "personas"
      );

      return res.status(200).json({
        personas: parsedResponse,
      });
    } catch (parseError) {
      console.error("Failed to parse personas response:", parseError);
      console.log("Response text sample:", responseText.substring(0, 200));

      // No fallback data - just return an error
      return res.status(500).json({
        error: "Parse error",
        message: "Failed to parse AI response for personas",
      });
    }
  } catch (error) {
    console.error("Error generating personas:", error);
    return res.status(500).json({
      error: "Server error",
      message:
        error instanceof Error ? error.message : "Failed to generate personas",
    });
  }
}

// Handler for content modification through chat
async function handleModifyContent(data: any, res: NextApiResponse) {
  try {
    console.log(
      "Handling modify-content request with data:",
      JSON.stringify(data).substring(0, 200) + "..."
    );

    // Validate input
    if (!data.originalContent || !data.userRequest) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing required fields: originalContent or userRequest",
      });
    }

    // Extract data
    const {
      contentType,
      originalContent,
      originalTitle,
      userRequest,
      previousMessages,
    } = data;

    // Create a prompt for the AI
    const prompt = `You are an AI content editor specializing in editing and improving ${contentType || "content"
      }.
    
Current content title: ${originalTitle || "Untitled content"}

Current content:
${originalContent}

User request:
${userRequest}

Previous conversation for context:
${previousMessages
        ? previousMessages
          .map(
            (msg: { role: string; content: string }) =>
              `${msg.role}: ${msg.content}`
          )
          .join("\n")
        : "None"
      }

Please edit the content according to the user's request. Provide the following:
1. A brief message explaining what changes you've made
2. The updated content in full with all changes applied

Format your response as JSON with these exact keys:
{
  "message": "Brief explanation of changes made",
  "updatedContent": "Full updated content with all changes applied",
  "updatedTitle": "Updated title if applicable, otherwise keep original"
}

IMPORTANT: Make sure your response is valid JSON that can be parsed. Don't include any explanation text outside the JSON object.`;

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert content editor that helps improve content based on user requests. Always respond with valid, parseable JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message?.content || "";
      console.log("OpenAI response received for modify-content");

      try {
        // Parse the JSON response
        let parsedResponse;

        // Try to extract JSON if it's wrapped in markdown code blocks
        if (responseText.includes("```json")) {
          const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            parsedResponse = JSON.parse(jsonMatch[1]);
          } else {
            parsedResponse = JSON.parse(responseText);
          }
        } else {
          parsedResponse = JSON.parse(responseText);
        }

        console.log("Successfully parsed response JSON");

        return res.status(200).json({
          message: parsedResponse.message || "Content updated successfully",
          updatedContent: parsedResponse.updatedContent || originalContent,
          updatedTitle: parsedResponse.updatedTitle || originalTitle,
        });
      } catch (error) {
        console.error("Failed to parse OpenAI response:", error);
        console.error("Response text:", responseText.substring(0, 200));

        // Return a fallback response
        return res.status(200).json({
          message:
            "I processed your request, but had trouble formatting the response. The content may not be fully updated.",
          updatedContent: originalContent,
          updatedTitle: originalTitle,
        });
      }
    } catch (error) {
      console.error("OpenAI API error:", error);

      // Return a fallback response
      return res.status(200).json({
        message:
          "I processed your request but encountered an API error. Please try again with a different request.",
        updatedContent: originalContent,
        updatedTitle: originalTitle,
      });
    }
  } catch (error) {
    console.error("Error modifying content:", error);
    return res.status(500).json({
      error: "Server error",
      message: "Failed to modify content",
    });
  }
}

// Handler for product-info endpoint
async function handleProductInfo(data: any, res: NextApiResponse) {
  try {
    console.log("Product info handler received data:", data);

    // Validate input
    if (!data || !data.userId) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Please provide a user ID",
      });
    }

    const userId = data.userId;

    // If we're saving data
    if (data.name !== undefined || data.type !== undefined) {
      return res.status(200).json({
        success: true,
        data: data,
      });
    }

    // If we're retrieving data
    return res.status(404).json({
      error: "Not found",
      message: "No product information found. Please add your product details.",
    });
  } catch (error) {
    console.error("Error in product info handler:", error);
    return res.status(500).json({
      error: "Service temporarily unavailable",
      message: "Whoops! There's a problem. Please try again a little later.",
    });
  }
}

// Handler for content repurposer endpoint
async function handleContentRepurposer(data: any, res: NextApiResponse) {
  try {
    // Validate input
    if (!data.content || typeof data.content !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing or invalid content field",
      });
    }

    // Extract data
    const { content, sourceFormat, targetFormat, styleGuide, messaging } = data;

    // Create prompt for the AI
    const prompt = `Repurpose the following content from ${sourceFormat} format to ${targetFormat} format:
    
Content to repurpose:
${content}

${styleGuide ? `Style Guide: ${JSON.stringify(styleGuide)}` : ""}
${messaging ? `Messaging Framework: ${JSON.stringify(messaging)}` : ""}

Please transform this content completely to match the new format while maintaining the core message.
Return your response as JSON with the following structure:
{
  "repurposedContent": "The transformed content in the new format",
  "contentStats": {
    "originalLength": 1500,
    "newLength": 500,
    "readabilityScore": 85
  }
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert content strategist who specializes in repurposing content across different formats.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || "";

    let parsedResponse;

    try {
      // Try parsing once
      const cleanJson = responseText.replace(/[\u0000-\u001F]+/g, " ");
      parsedResponse = JSON.parse(cleanJson);

      // If it's still a string that looks like JSON, parse again
      if (typeof parsedResponse === "string") {
        parsedResponse = JSON.parse(parsedResponse);
      }

      return res.status(200).json(parsedResponse);
    } catch (error) {
      console.error(
        "Failed to parse OpenAI response for content repurposer:",
        error
      );
      return res.status(500).json({
        error: "Parse error",
        message: "Failed to parse the AI response",
      });
    }
  } catch (error) {
    console.error("Error in content repurposer:", error);
    return res.status(500).json({
      error: "Server error",
      message: "Failed to repurpose content",
    });
  }
}

// Handler for messaging framework generator endpoint
async function handleMessagingFramework(data: any, res: NextApiResponse) {
  try {
    console.log("Messaging framework generator received data:", data);

    // Validate input
    if (!data.productInfo) {
      console.log("Missing product information");
      return res.status(400).json({
        error: "Invalid request",
        message: "Missing product information",
      });
    }

    const { productInfo, tone = "professional", competitors = [], valueProp } = data;

    // Build the prompt
    const prompt = `You are a senior brand strategist. Based on the following product details, generate:

1. A refined Value Proposition (unless one is already provided)
2. Three Messaging Pillars – each a full, emotionally compelling statement combining a short headline with supporting detail (in one string)
3. Three Key Benefits – short, specific advantages for the customer

Use vivid, unexpected language. Avoid clichés. Reflect the tone or archetype: ${tone || "Professional"}.

Inputs:
- Brand Name: ${productInfo.name}
- Description: ${productInfo.description}
- Target Audience: ${productInfo.targetAudience}
- Competitors: ${competitors.join(", ") || "None"}
- Existing Value Proposition: ${valueProp || "None provided"}

Format your response as a valid JSON object with this structure:
{
  "valueProp": "Your value proposition here",
  "pillars": ["Pillar 1 with supporting detail", "Pillar 2 with supporting detail", "Pillar 3 with supporting detail"],
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
}`;

    console.log("Sending prompt to OpenAI");
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing strategist who specializes in creating clear, compelling messaging frameworks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || "";
    console.log("Received response from OpenAI");

    try {
      const parsedResponse = JSON.parse(responseText);

      // Map the response to match the frontend's expected format
      const mappedResponse = {
        valueProposition: parsedResponse.valueProp || '',
        keyDifferentiators: parsedResponse.pillars || [],
        targetedMessages: parsedResponse.benefits || []
      };

      return res.status(200).json(mappedResponse);
    } catch (parseError) {
      console.error("Failed to parse messaging framework response:", parseError);
      return res.status(500).json({
        error: "Failed to parse API response",
        message: "The AI returned an invalid response format. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in messaging framework generator:", error);
    return res.status(500).json({
      error: "Server error",
      message: error instanceof Error ? error.message : "Failed to generate messaging framework",
    });
  }
}

// boilerplate generator
export async function generateBoilerplates({
  businessName,
  description,
  product,
  audience,
  promise,
  tone,
  style,
  differentiator,
  positioning,
  archetype,
  personality,
  numOptions = 3,
}: {
  businessName: string;
  description: string;
  product: string;
  audience: string;
  promise: string;
  tone: string;
  style: string;
  differentiator: string;
  positioning: string;
  archetype: string;
  personality: string[];
  numOptions?: number;
}) {
  const prompt = `You are a sharp, human-centered brand strategist. Write ${numOptions} different 20-word boilerplate options for a company based on the following inputs.

Use clear, specific language that avoids jargon or filler. Every word should earn its place.

The tone should reflect the selected brand archetype: ${archetype || "Professional"}. If the brand is bold and innovative, reflect that. If it's nurturing or high-end, adapt accordingly. If it's mystical or transformative, make it feel like a vision.

Here's what we know:
- Product Name: ${businessName || "The Company"}
- Description: ${description || "No description provided."}
- Target Audience: ${Array.isArray(audience) ? audience.join(", ") : audience || "General audience"}

Focus on what the company does, who it serves, and what makes it different. Avoid clichés. Make it feel alive.

Format your response as a JSON array of strings, each exactly 20 words.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert brand strategist who specializes in creating compelling, human-centered boilerplates.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || "";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating boilerplate options:", error);
    throw new Error("Failed to generate boilerplate options");
  }
}

export async function expandBoilerplate({
  boilerplate,
  wordCount = "50",
}: {
  boilerplate: string;
  wordCount?: string;
}) {
  const prompt = `Expand the following 20-word boilerplate to ${wordCount} words. Maintain the same tone and voice. Add detail, depth, and emotional richness while keeping the core message intact.

Boilerplate:
${boilerplate}

Format your response as a JSON object with these fields:
{
  "boilerplate": "the expanded boilerplate text",
  "wordCount": ${wordCount}
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert writer who specializes in expanding content while maintaining its core message and emotional impact.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || "";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error expanding boilerplate:", error);
    throw new Error("Failed to expand boilerplate");
  }
}

export async function generateTaglines({
  businessName,
  description,
  product,
  audience,
  promise,
  tone,
  style,
  archetype,
  personality,
}: {
  businessName: string;
  description: string;
  product: string;
  audience: string;
  promise: string;
  tone: string;
  style: string;
  archetype: string;
  personality: string[];
}) {
  try {
    const prompt = `You are a creative director who crafts punchy, memorable taglines that make people stop, smile, or lean in. Your taglines are never generic—they're sharp, emotionally intelligent, and slightly unexpected.

Your job is to write taglines that:
- Are short (under 10 words)
- Capture the product's promise or experience
- Feel like they belong on a billboard—or a T-shirt
- Match the product's tone: from luxury and poetic to playful or bold
- Clever but never cutesy—no puns, no dad jokes. Think sharp, evocative, and emotionally intelligent. Avoid puns or filler phrases. Write like you're naming something unforgettable—a line people quote, print, or tattoo. Clarity + spark over cleverness alone.

Write in the tone of the selected archetype. If the archetype is the Lover, prioritize language that is romantic, emotionally rich, and evocative—no puns, no snark, no jokes. The goal is to stir the heart, not get a laugh. If the archetype is the Jester, aim for cleverness and charm without being cringey or cartoonish. Match the archetype's emotional truth, not just its surface style.

Here's what you're working with:
Brand Name: ${businessName || "Brand"}
Product/Service: ${description || "A product or service"}
Audience: ${audience || "its audience"}
Tone: ${tone || "smart and confident"}
Archetype: ${archetype || "Not specified"}

Write 3 tagline options that reflect the product's unique energy. Make them distinct, evocative, and hard to ignore.

Respond with:
{
  "taglines": [
    "First option here.",
    "Second option here.",
    "Third option here."
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert copywriter specializing in creating memorable, impactful taglines that capture brand essence.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || "";
    const parsedResponse = JSON.parse(responseText);

    // Extract just the taglines from the response
    return parsedResponse.taglines;
  } catch (error) {
    console.error("Error generating taglines:", error);
    throw error;
  }
}

// Adapt boilerplate to different length
export async function adaptBoilerplate({
  businessName,
  description,
  product,
  audience,
  promise,
  tone,
  style,
  differentiator,
  positioning,
  archetype,
  personality,
  wordCount,
  baseBoilerplate,
}: {
  businessName: string;
  description: string;
  product: string;
  audience: string;
  promise: string;
  tone: string;
  style: string;
  differentiator: string;
  positioning: string;
  archetype: string;
  personality: string[];
  wordCount: string;
  baseBoilerplate: string;
}) {
  const prompt = `
You're an expert brand copywriter. Adapt the following boilerplate to be exactly ${wordCount} words while maintaining the same message, tone, and style:

Original Boilerplate: ${baseBoilerplate}

Business name: ${businessName}
Description: ${description}
Product or solution: ${product}
Ideal customer or audience: ${audience}
Value proposition: ${promise}
Differentiator: ${differentiator}
Positioning: ${positioning}
Tone: ${tone}
Style: ${style}
Brand archetype: ${archetype}
Brand personality traits: ${personality.join(", ")}

Format your response as a JSON array with a single string. The string should be exactly ${wordCount} words.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert brand copywriter who specializes in adapting marketing boilerplates to different lengths while maintaining the core message and brand voice.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content || "";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error adapting boilerplate:", error);
    throw new Error("Failed to adapt boilerplate");
  }
}

// MAIN HANDLER FUNCTION
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Support both 'endpoint' and 'type' for backward compatibility
    const endpoint = req.body.endpoint || req.body.type;
    const data = req.body.data;

    // Check if we have the required parameters
    if (!endpoint) {
      return res.status(400).json({
        error: "Missing endpoint parameter",
        message: "Request must include an endpoint or type parameter",
      });
    }

    // Defensive check for missing or invalid data
    if (typeof data !== "object" || data === null) {
      return res.status(400).json({
        error: "Missing data parameter",
        message: "Request must include a data object",
      });
    }

    console.log(`Processing API request for endpoint: ${endpoint}`);

    // Handle different endpoints using 'endpoint' consistently
    switch (endpoint) {
      case "content-humanizer":
      case "contentHumanizer":
        return await handleContentHumanizer(data, res);
      case "style-checker":
      case "styleChecker":
        return await handleStyleChecker(data, res);
      case "style-fixer":
      case "styleFixer":
        return await handleStyleFixer(data, res);
      case "prose-perfector":
      case "prosePerfector":
        return await handleProsePerfector(data, res);
      case "generate-content":
      case "generateContent":
        return await handleGenerateContent(req, res);
      case "analyze-competitors":
      case "analyzeCompetitors":
        return await handleAnalyzeCompetitors(data, res);
      case "value-proposition":
      case "valueProposition":
        return handleMessagingFramework(data, res);
      case "generateMessagingFramework":
        return handleMessagingFramework(data, res);
      case "persona-generator":
      case "personaGenerator":
        return await handlePersonaGenerator(data, res);
      case "generate-keywords":
      case "generateKeywords":
        return await handleGenerateKeywords(data, res);
      case "modify-content":
      case "modifyContent":
        return await handleModifyContent(data, res);
      case "productInfo":
        return await handleProductInfo(data, res);
      case "contentRepurposer":
        return await handleContentRepurposer(data, res);
      case "generateBoilerplates":
        const boilerplates = await generateBoilerplates(data);
        return res.status(200).json(boilerplates);
      case "generateTaglines":
        const taglines = await generateTaglines(data);
        return res.status(200).json(taglines);
      case "adaptBoilerplate":
        const adaptedBoilerplate = await adaptBoilerplate(data);
        return res.status(200).json(adaptedBoilerplate);
      case "missionVision":
        return await handleMissionVision(data, res);
      default:
        return res.status(400).json({
          error: "Invalid endpoint",
          message: `Endpoint '${endpoint}' not found`,
        });
    }
  } catch (error: unknown) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "Server error",
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
