import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getStrategicDataFromRequest(requestData: any) {
  return {
    writingStyle: requestData.writingStyle || null,
    brandVoice: requestData.brandVoice || null,
    messaging: requestData.messaging || null,
    product: requestData.product || null,
    audiences: requestData.audiences || null
  };
}
function buildStyleGuideInstructions(writingStyle: any, brandVoice: any, messaging: any): string {
  let instructions = "";

  if (writingStyle?.styleGuide?.primary) {
    instructions += `\nFOLLOW ${writingStyle.styleGuide.primary} as the base style guide.`;
  }

  // Handle formatting rules
  if (writingStyle?.formatting) {
    // Heading style
    if (writingStyle.formatting.headingCase) {
      if (writingStyle.formatting.headingCase === 'upper' || writingStyle.formatting.headings === 'All caps for main headings') {
        instructions += `\n- ALL MAIN HEADINGS MUST BE IN ALL CAPS.`;
      } else if (writingStyle.formatting.headingCase === 'lower') {
        instructions += `\n- All headings must be in lowercase.`;
      } else if (writingStyle.formatting.headingCase === 'sentence' || writingStyle.formatting.headings === 'Sentence case') {
        instructions += `\n- Use sentence case for all headings (capitalize only the first word).`;
      } else if (writingStyle.formatting.headingCase === 'title' || writingStyle.formatting.headings === 'Title Case') {
        instructions += `\n- Use title case for all headings (capitalize major words).`;
      } else if (writingStyle.formatting.headingCase === 'custom' && writingStyle.formatting.headingCustom) {
        instructions += `\n- Headings: ${writingStyle.formatting.headingCustom}`;
      }
    }
    // List style
    if (writingStyle.formatting.listStyle) {
      if (writingStyle.formatting.listStyle === 'bullets') {
        instructions += `\n- Use bullet points for all lists.`;
      } else if (writingStyle.formatting.listStyle === 'numbers') {
        instructions += `\n- Use numbered lists for all lists.`;
      } else if (typeof writingStyle.formatting.listStyle === 'string') {
        instructions += `\n- List style: ${writingStyle.formatting.listStyle}`;
      }
    }
    // Numbers
    if (writingStyle.formatting.numberFormat) {
      if (writingStyle.formatting.numberFormat === 'numerals') {
        instructions += `\n- NUMBERS: Use numerals for ALL numbers (1, 2, 3, 10, 100, etc.).`;
      } else if (writingStyle.formatting.numberFormat === 'words') {
        instructions += `\n- NUMBERS: Spell out all numbers as words (one, two, three, ten, etc.).`;
      } else if (typeof writingStyle.formatting.numberFormat === 'string') {
        instructions += `\n- Number format: ${writingStyle.formatting.numberFormat}`;
      }
    }
    // Date format
    if (writingStyle.formatting.dateFormat) {
      instructions += `\n- DATE FORMAT: Use ${writingStyle.formatting.dateFormat} for all dates.`;
    }
    // Paragraph spacing/indentation (if present)
    if (writingStyle.formatting.paragraphSpacing) {
      instructions += `\n- Add ${writingStyle.formatting.paragraphSpacing} between paragraphs.`;
    }
    if (writingStyle.formatting.paragraphIndent) {
      instructions += `\n- Indent each paragraph by ${writingStyle.formatting.paragraphIndent}.`;
    }
    // Section order/layout (if present)
    if (writingStyle.formatting.sectionOrder && Array.isArray(writingStyle.formatting.sectionOrder)) {
      instructions += `\n- SECTION ORDER: The content must follow this exact section order: ${writingStyle.formatting.sectionOrder.join(' > ')}.`;
    }
  }

  // Handle punctuation rules
  if (writingStyle?.punctuation) {
    if (writingStyle.punctuation.oxfordComma !== undefined) {
      instructions += `\n- Oxford comma: ${writingStyle.punctuation.oxfordComma ? 'ALWAYS use' : 'NEVER use'}`;
    }
    if (writingStyle.punctuation.quotationMarks) {
      instructions += `\n- Use ${writingStyle.punctuation.quotationMarks === 'double' ? 'double' : 'single'} quotation marks for all quotes.`;
    }
    if (writingStyle.punctuation.bulletPoints) {
      instructions += `\n- Bullet points: ${writingStyle.punctuation.bulletPoints}`;
    }
    if (writingStyle.punctuation.hyphenation) {
      instructions += `\n- Hyphenation: ${writingStyle.punctuation.hyphenation}`;
    }
  }

  // Internal conventions / custom rules
  if (writingStyle?.styleGuide?.customRules && Array.isArray(writingStyle.styleGuide.customRules)) {
    writingStyle.styleGuide.customRules.forEach((rule: string) => {
      instructions += `\n- ${rule}`;
    });
  }

  // Add brand voice and messaging
  if (brandVoice?.brandVoice?.tone) {
    instructions += `\n- Tone: ${brandVoice.brandVoice.tone}`;
  }
  if (messaging?.valueProposition) {
    instructions += `\n- Value Proposition: ${messaging.valueProposition}`;
  }

  // Strict compliance warning
  instructions += `\n\n🚨 STRICT COMPLIANCE: If you do not follow ALL the above layout, formatting, and style rules EXACTLY, your output will be rejected. Do NOT add, remove, or reorder sections. Do NOT use any formatting not specified above. Do NOT improvise.`;

  return instructions;
}

// Function to clean generated content
function cleanGeneratedContent(content: string): string {
  if (!content) return content;

  // Split into lines and clean each line
  const lines = content.split('\n');
  const cleanedLines = lines.map(line => {
    // Remove semicolon at the beginning of lines (but keep them in the middle)
    let cleaned = line.replace(/^;\s*/, '');
    // Remove other common unwanted characters at line beginnings
    cleaned = cleaned.replace(/^[:\\-\\*]\s*/, '');
    // Remove extra whitespace at the beginning
    cleaned = cleaned.replace(/^\s+/, '');
    return cleaned;
  });

  return cleanedLines.join('\n');
}

// Function to clean taglines by removing unnecessary quotation marks
function cleanTagline(tagline: string): string {
  if (!tagline) return tagline;

  // Remove leading and trailing quotation marks (both single and double)
  let cleaned = tagline.trim();
  cleaned = cleaned.replace(/^["']|["']$/g, '');

  // Remove extra whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

// Handler for enhanced content generation
async function handleEnhancedContent(requestData: any, res: NextApiResponse) {
  const { campaignData, contentTypes, writingStyle, brandVoice, messaging } = requestData;

  if (!campaignData || !contentTypes || !campaignData.name || contentTypes.length === 0) {
    console.error("Missing required data:", { campaignData, contentTypes });
    return res.status(400).json({ error: "Missing required data" });
  }

  console.log("🚀 Generating content for campaign:", campaignData.name);
  console.log("📝 Content types:", contentTypes);
  console.log("🎨 Writing style received:", writingStyle);

  const strategicData = getStrategicDataFromRequest(requestData);
  const styleInstructions = buildStyleGuideInstructions(
    writingStyle || strategicData.writingStyle,
    brandVoice || strategicData.brandVoice,
    messaging || strategicData.messaging
  );

  console.log("📋 Style instructions being sent to AI:", styleInstructions);

  let prompt = "";
  if (contentTypes.includes("blog-post") || contentTypes.includes("Blog Posts")) {
    prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

⚠️ HEADING ENFORCEMENT: All headings and subheadings must use markdown syntax (e.g., # Title, ## Section, ### Subsection).

You are a professional magazine writer. Write a compelling 1,500-word article about: "${campaignData.name}"

STRUCTURE:
- Engaging opening (250 words)
- 4–5 substantial sections with clear, descriptive subheadings (200–250 words each)
- Strong conclusion (150 words)

TARGET AUDIENCE: ${campaignData.targetAudience}
Avoid cliches, such as "Imagine this"

Use markdown formatting for all headings, subheadings, and lists. Do NOT use HTML. Paragraphs should be separated by blank lines. Your editor is strict—follow the style guide to the letter.`;
  } else {
    prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Write a compelling 1,500-word article about: "${campaignData.name}"

STRUCTURE:
- Clear opening
- 4-6 sections
- Conclusion

TARGET AUDIENCE: ${campaignData.targetAudience}

Remember: Adhere to all style rules.`;
  }


  try {
    const model = "gpt-4-turbo";

    const response = await openai.chat.completions.create({
      model: model,
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a seasoned copywriter." },
        { role: "user", content: prompt },
      ],
    });



    const generatedContent = response.choices[0].message.content || "";
    // Clean the generated content to remove unwanted formatting
    const cleanedContent = cleanGeneratedContent(generatedContent);
    const content: Record<string, any> = {};

    contentTypes.forEach((type: string) => {
      switch (type) {
        case "blog-post":
        case "Blog Posts":
          content[type] = {
            title: "Generated Blog Post",
            content: cleanedContent,
            metaDescription: "A compelling blog post for your campaign",
            keywords: campaignData.keyMessages || [],
          };
          break;
        case "Social Posts":
          content[type] = {
            platform: "LinkedIn",
            posts: [
              {
                content: `${cleanedContent.substring(0, 200)}...

${(campaignData.keyMessages || []).map((msg: string) => `#${msg.replace(/\s+/g, "")}`).join(" ")}`,
              },
            ],
          };
          break;
        case "Email Campaigns":
          content[type] = {
            subject: campaignData.name,
            preview: cleanedContent.substring(0, 100),
            body: cleanedContent,
          };
          break;
        default:
          content[type] = {
            title: `Generated ${type}`,
            content: cleanedContent,
          };
      }
    });

    console.log("✅ Returning generated content with enhanced style compliance");
    return res.status(200).json(content);
  } catch (error) {
    console.error("❌ Error generating content:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
}

// Handler for content humanizer
async function handleContentHumanizer(data: any, res: NextApiResponse) {
  try {
    const { content, parameters } = data;
    const { 
      styleGuideParameters,
      strategicData
    } = parameters || {};

    const styleInstructions = buildStyleGuideInstructions(
      styleGuideParameters || strategicData?.writingStyle,
      strategicData?.brandVoice,
      strategicData?.messaging
    );

    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Humanize the following content to make it more engaging and conversational while maintaining its professional tone and key messages.

Content: ${content}

Make the content more human, relatable, and engaging while preserving all key information and maintaining the specified style guidelines.

Return only the humanized content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a content humanization expert." },
        { role: "user", content: prompt },
      ],
    });

    const humanizedContent = response.choices[0].message.content || "";
    // Clean the humanized content to remove unwanted formatting
    const cleanedHumanizedContent = cleanGeneratedContent(humanizedContent);
    return res.status(200).json({ content: cleanedHumanizedContent });
  } catch (error) {
    console.error("Content humanizer error:", error);
    return res.status(500).json({ error: "Failed to humanize content" });
  }
}

// Handler for boilerplate generation
async function handleBoilerplateGeneration(data: any, res: NextApiResponse) {
  try {
    const {
      businessName,
      description,
      product,
      audiences,
      promise,
      tone,
      style,
      differentiator,
      positioning,
      archetype,
      personality,
      wordCount,
      numOptions = 3,
      writingStyle,
      strategicData
    } = data;

    const styleInstructions = buildStyleGuideInstructions(
      writingStyle || strategicData?.writingStyle,
      strategicData?.brandVoice,
      strategicData?.messaging
    );

    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Write a brand boilerplate for the following business.

Business Name: ${businessName}
Description: ${description}
Product: ${product}
Audiences: ${(audiences || []).join(", ")}
Promise: ${promise}
Tone: ${tone}
Style: ${style}
Differentiator: ${differentiator}
Positioning: ${positioning}
Archetype: ${archetype}
Personality: ${(personality || []).join(", ")}
Word Count: ${wordCount}

Return only the boilerplate text. Do not include explanations.`;

    const completions = await Promise.all(
      Array.from({ length: numOptions }).map(() =>
        openai.chat.completions.create({
          model: "gpt-4-turbo",
          temperature: 0.7,
          messages: [
            { role: "system", content: "You are a branding expert." },
            { role: "user", content: prompt },
          ],
        })
      )
    );
    const options = completions.map((c) => c.choices[0].message.content || "");
    return res.status(200).json(options);
  } catch (error) {
    console.error("Boilerplate generation error:", error);
    return res.status(500).json({ error: "Failed to generate boilerplate" });
  }
}

// Handler for adapting boilerplate to a different word count
async function handleAdaptBoilerplate(data: any, res: NextApiResponse) {
  try {
    const {
      baseBoilerplate,
      wordCount,
      businessName,
      description,
      product,
      audiences,
      promise,
      tone,
      style,
      differentiator,
      positioning,
      archetype,
      personality,
      writingStyle,
      strategicData
    } = data;

    const styleInstructions = buildStyleGuideInstructions(
      writingStyle || strategicData?.writingStyle,
      strategicData?.brandVoice,
      strategicData?.messaging
    );

    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Adapt the following brand boilerplate to approximately ${wordCount} words.

Boilerplate: ${baseBoilerplate}

Business Name: ${businessName}
Description: ${description}
Product: ${product}
Audiences: ${(audiences || []).join(", ")}
Promise: ${promise}
Tone: ${tone}
Style: ${style}
Differentiator: ${differentiator}
Positioning: ${positioning}
Archetype: ${archetype}
Personality: ${(personality || []).join(", ")}

Return only the adapted boilerplate text. Do not include explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a branding expert." },
        { role: "user", content: prompt },
      ],
    });
    const adapted = response.choices[0].message.content || "";
    return res.status(200).json([adapted]);
  } catch (error) {
    console.error("Adapt boilerplate error:", error);
    return res.status(500).json({ error: "Failed to adapt boilerplate" });
  }
}

// Handler for tagline generation
async function handleTaglineGeneration(data: any, res: NextApiResponse) {
  try {
    const {
      businessName,
      description,
      audiences,
      promise,
      tone,
      style,
      archetype,
      personality,
      numOptions = 5,
      writingStyle,
      strategicData
    } = data;

    const styleInstructions = buildStyleGuideInstructions(
      writingStyle || strategicData?.writingStyle,
      strategicData?.brandVoice,
      strategicData?.messaging
    );

    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Write a catchy, brand-appropriate tagline for the following business.

Business Name: ${businessName}
Description: ${description}
Audiences: ${(audiences || []).join(", ")}
Promise: ${promise}
Tone: ${tone}
Style: ${style}
Archetype: ${archetype}
Personality: ${(personality || []).join(", ")}

Return only the tagline. Do not include explanations.`;

    const completions = await Promise.all(
      Array.from({ length: numOptions }).map(() =>
        openai.chat.completions.create({
          model: "gpt-4-turbo",
          temperature: 0.8,
          messages: [
            { role: "system", content: "You are a branding expert." },
            { role: "user", content: prompt },
          ],
        })
      )
    );
    const taglines = completions.map((c) => c.choices[0].message.content?.trim() || "");
    const cleanedTaglines = taglines.map(cleanTagline);
    return res.status(200).json(cleanedTaglines);
  } catch (error) {
    console.error("Tagline generation error:", error);
    return res.status(500).json({ error: "Failed to generate taglines" });
  }
}

// Handler for persona generation
async function handlePersonaGenerator(data: any, res: NextApiResponse) {
  try {
    const { productName, productType, currentPersona } = data;
    const prompt = `Generate 3 ideal customer personas for the following product. Return ONLY a valid JSON array with this exact format:

[
  {
    "role": "Job title or role",
    "industry": "Industry they work in",
    "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
  }
]

Product Name: ${productName}
Product Type/Description: ${productType}
Current Persona: ${currentPersona ? JSON.stringify(currentPersona) : 'N/A'}

Important: Return ONLY the JSON array, no explanations or additional text.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a B2B marketing strategist." },
        { role: "user", content: prompt },
      ],
    });
    let personasText = response.choices[0].message.content || "[]";
    let parsed;
    try {
      parsed = JSON.parse(personasText);
    } catch {
      // Try to extract JSON array from the text
      const match = personasText.match(/\[[\s\S]*\]/);
      const match = personasText.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = [{ role: "Sample Role", industry: "Sample Industry", challenges: ["Sample Challenge"] }];
        }
      } else {
        parsed = [{ role: "Sample Role", industry: "Sample Industry", challenges: ["Sample Challenge"] }];
      }
    }
    return res.status(200).json({ personas: parsed });
  } catch (error) {
    console.error("Persona generation error:", error);
    return res.status(500).json({ error: "Failed to generate personas" });
  }
}

// Handler for content repurposer
async function handleContentRepurposer(data: any, res: NextApiResponse) {
  try {
    const { content, sourceFormat, targetFormat, styleGuide, messaging, strategicData } = data;
    
    // FIXED: Build style guide instructions using writing style data
    const styleInstructions = buildStyleGuideInstructions(
      styleGuide || strategicData?.writingStyle,
      strategicData?.brandVoice,
      messaging || strategicData?.messaging
    );

    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Repurpose the following content from ${sourceFormat} to ${targetFormat}.

Content: ${content}

Style Guide: ${JSON.stringify(styleGuide || strategicData?.writingStyle || {})}
Messaging: ${JSON.stringify(messaging || strategicData?.messaging || {})}

Return only the repurposed content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a content strategist." },
        { role: "user", content: prompt },
      ],
    });
    const repurposedContent = response.choices[0].message.content || "";
    return res.status(200).json({ repurposedContent });
  } catch (error) {
    console.error("Content repurposer error:", error);
    return res.status(500).json({ error: "Failed to repurpose content" });
  }
}

// Handler for AB test generator
async function handleABTestGenerator(data: any, res: NextApiResponse) {
  try {
    const { contentType, contentContext, targetAudience, numVariations } = data;
    
    // Get strategic data to access writing style
    const strategicData = getStrategicDataFromRequest({ data });
    
    // Build style guide instructions
    const styleInstructions = buildStyleGuideInstructions(
      strategicData?.writingStyle || null,
      strategicData?.brandVoice || null,
      strategicData?.messaging || null
    );
    
    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Generate ${numVariations} variations for A/B testing.

Type: ${contentType}
Context: ${contentContext}
Target Audience: ${targetAudience}

IMPORTANT: Follow the style guide rules above EXACTLY. If the style guide specifies heading case formatting, apply it to any headings or titles in your response.

Return a JSON array of variations. Each variation should be a string.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a marketing copywriter who strictly follows style guide rules." },
        { role: "user", content: prompt },
      ],
    });
    let variations;
    try {
      variations = JSON.parse(response.choices[0].message.content || "[]");
    } catch {
      variations = ["Variation 1", "Variation 2"];
    }
    return res.status(200).json({ variations });
  } catch (error) {
    console.error("AB Test generator error:", error);
    return res.status(500).json({ error: "Failed to generate variations" });
  }
}

// Handler for prose perfector
async function handleProsePerfector(data: any, res: NextApiResponse) {
  try {
    const { text, options, writingStyle, strategicData } = data;
    
    // FIXED: Build style guide instructions using writing style data
    const styleInstructions = buildStyleGuideInstructions(
      writingStyle || strategicData?.writingStyle,
      strategicData?.brandVoice,
      strategicData?.messaging
    );

    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Improve the following text for clarity, engagement, and style.

Text: ${text}

Options: ${JSON.stringify(options || {})}

Return a JSON object with 'enhancedText' and an array 'suggestions' (each with original, suggestion, reason, type).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a professional editor." },
        { role: "user", content: prompt },
      ],
    });
    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      result = { enhancedText: text, suggestions: [] };
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Prose Perfector error:", error);
    return res.status(500).json({ error: "Failed to enhance prose" });
  }
}

// Handler for key messages/value proposition
async function handleKeyMessages(data: any, res: NextApiResponse) {
  try {
    const { productInfo, competitors, industry, focusAreas, tone, currentFramework } = data;
    
    // Get strategic data to access writing style
    const strategicData = getStrategicDataFromRequest({ data });
    
    // Also check for writing style passed directly in the request
    const requestBody = data.requestBody || {};
    const directWritingStyle = requestBody.writingStyle;
    
    // Build style guide instructions - prioritize direct writing style over strategic data
    const styleInstructions = buildStyleGuideInstructions(
      directWritingStyle || strategicData?.writingStyle || null,
      strategicData?.brandVoice || null,
      strategicData?.messaging || null
    );
    
    const prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

Generate a value proposition, 3 key differentiators, and 5 targeted key messages for the following product.

Product Info: ${JSON.stringify(productInfo)}
Industry: ${industry}
Focus Areas: ${focusAreas}
Tone: ${tone}
Current Framework: ${JSON.stringify(currentFramework)}

IMPORTANT: Follow the style guide rules above EXACTLY. If the style guide specifies heading case formatting, apply it to any headings or titles in your response.

Return ONLY a valid JSON object with valueProposition, keyDifferentiators (array), and targetedMessages (array). Do not include any explanation or formatting.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a B2B messaging strategist who strictly follows style guide rules." },
        { role: "user", content: prompt },
      ],
    });
    let text = response.choices[0].message.content || '{}';
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Try to extract JSON object from the text
      const match = text.match(/{[\s\S]*}/);
      if (match) {
        try {
          result = JSON.parse(match[0]);
        } catch {
          result = { valueProposition: '', keyDifferentiators: [], targetedMessages: [] };
        }
      } else {
        result = { valueProposition: '', keyDifferentiators: [], targetedMessages: [] };
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Key Messages error:", error);
    return res.status(500).json({ error: "Failed to generate key messages" });
  }
}

// Handler for competitor analysis
async function handleCompetitiveAnalysis(data: any, res: NextApiResponse) {
  try {
    const { competitors, industry } = data;
    const prompt = `Analyze the following competitors in the ${industry} industry. For each competitor, provide:

1. Unique positioning (array of strings)
2. Key themes/messages (array of strings)
3. Gaps/opportunities (array of strings)

Competitors: ${JSON.stringify(competitors)}
Industry: ${industry}

Return ONLY a valid JSON array with this exact format:
[
  {
    "name": "Competitor Name",
    "uniquePositioning": ["Positioning 1", "Positioning 2"],
    "keyThemes": ["Theme 1", "Theme 2"],
    "gaps": ["Gap 1", "Gap 2"]
  }
]

Important: Return ONLY the JSON array, no explanations or additional text. Ensure the JSON is valid and properly formatted.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a marketing strategist." },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7
    });
    let text = response.choices[0].message.content.trim();
    console.log("[CompetitiveAnalysis] AI raw response:", text);
    let result: any = [];
    try {
      result = JSON.parse(text);
      console.log("[CompetitiveAnalysis] Parsed JSON:", result);
    } catch (e) {
      // Try to extract JSON array from the response
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          result = JSON.parse(match[0]);
          console.log("[CompetitiveAnalysis] Extracted JSON array:", result);
        } catch (e2) {
          console.error("[CompetitiveAnalysis] Failed to parse extracted JSON array:", e2);
          result = [];
        }
      } else {
        console.error("[CompetitiveAnalysis] No JSON array found in AI response.");
        result = [];
      }
    }
    if (!result || !Array.isArray(result)) {
      // fallback sample
      console.warn("[CompetitiveAnalysis] Falling back to sample data.");
      result = Array.isArray(competitors)
        ? competitors.map((c: any) => ({
          name: c.name || "Unknown Competitor",
          uniquePositioning: ["Sample positioning"],
          keyThemes: ["Sample theme"],
          gaps: ["Sample gap"]
        }))
        : [];
    }
    return res.status(200).json(result);
  } catch (error) {
    const errorMessage = typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error);
    console.error("[CompetitiveAnalysis] Handler error:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
}

// Handler for mission and vision generation
async function handleMissionVision(data: any, res: NextApiResponse) {
  try {
    const { companyName, audience, valueProp, additionalContext } = data;
    const prompt = `Generate a concise mission statement and a vision statement for the following company.\n\nCompany Name: ${companyName}\nTarget Audience: ${audience}\nValue Proposition: ${valueProp}\nAdditional Context: ${additionalContext}\n\nReturn a JSON object with 'mission' and 'vision' fields. Do not include any explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a branding strategist." },
        { role: "user", content: prompt },
      ],
    });
    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      // Fallback: try to extract mission/vision from text
      const text = response.choices[0].message.content || '';
      const missionMatch = text.match(/mission\s*[:\-]?\s*(.+)/i);
      const visionMatch = text.match(/vision\s*[:\-]?\s*(.+)/i);
      result = {
        mission: missionMatch && missionMatch[1] ? missionMatch[1].trim() : '',
        vision: visionMatch && visionMatch[1] ? visionMatch[1].trim() : ''
      };
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Mission/Vision generation error:", error);
    return res.status(500).json({ error: "Failed to generate mission and vision" });
  }
}

// MAIN HANDLER FUNCTION
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { mode, data } = body;

  if (mode === "humanize") {
    return handleContentHumanizer(data, res);
  } else if (mode === "enhance") {
    return handleEnhancedContent(data, res);
  } else if (mode === "boilerplate") {
    return handleBoilerplateGeneration(data, res);
  } else if (mode === "adapt-boilerplate") {
    return handleAdaptBoilerplate(data, res);
  } else if (mode === "taglines") {
    return handleTaglineGeneration(data, res);
  } else if (mode === "personas") {
    return handlePersonaGenerator(data, res);
  } else if (mode === "repurpose") {
    return handleContentRepurposer(data, res);
  } else if (mode === "ab-test") {
    return handleABTestGenerator(data, res);
  } else if (mode === "prose") {
    return handleProsePerfector(data, res);
  } else if (mode === "key-messages") {
    return handleKeyMessages(data, res);
  } else if (mode === "competitors") {
    return handleCompetitiveAnalysis(data, res);
  } else if (mode === "mission-vision") {
    return handleMissionVision(data, res);
  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }
}
