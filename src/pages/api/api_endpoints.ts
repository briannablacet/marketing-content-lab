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
    if (writingStyle.formatting.headingCase) {
      if (writingStyle.formatting.headingCase === 'upper') {
        instructions += `\n- HEADINGS: ALL HEADINGS MUST BE IN COMPLETE UPPERCASE/ALL CAPS.`;
      } else if (writingStyle.formatting.headingCase === 'lower') {
        instructions += `\n- HEADINGS: All headings must be in lowercase.`;
      } else if (writingStyle.formatting.headingCase === 'sentence') {
        instructions += `\n- HEADINGS: Use sentence case (capitalize only first word).`;
      }
    }

    if (writingStyle.formatting.numberFormat) {
      if (writingStyle.formatting.numberFormat === 'numerals') {
        instructions += `\n- NUMBERS: Use numerals for ALL numbers (1, 2, 3, 10, 100, etc.).`;
      } else if (writingStyle.formatting.numberFormat === 'words') {
        instructions += `\n- NUMBERS: Spell out all numbers as words (one, two, three, ten, etc.).`;
      }
    }
  }

  // Handle punctuation rules
  if (writingStyle?.punctuation) {
    if (writingStyle.punctuation.oxfordComma !== undefined) {
      instructions += `\n- Oxford comma: ${writingStyle.punctuation.oxfordComma ? 'ALWAYS use' : 'NEVER use'}`;
    }
  }

  if (brandVoice?.brandVoice?.tone) {
    instructions += `\n- Tone: ${brandVoice.brandVoice.tone}`;
  }

  if (messaging?.valueProposition) {
    instructions += `\n- Value Proposition: ${messaging.valueProposition}`;
  }

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

// Handler for content humanizer endpoint
async function handleContentHumanizer(data: any, res: NextApiResponse) {
  try {
    if (!data.content || typeof data.content !== "string") {
      return res.status(400).json({ error: "Missing or invalid content" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.65,
      messages: [
        {
          role: "system",
          content: "You are a smart, savvy magazine editor. Humanize this copy.",
        },
        {
          role: "user",
          content: `Humanize and improve this content:

${data.content}`,
        },
      ],
    });

    const humanizedContent = response.choices[0].message.content || "";
    // Clean the humanized content to remove unwanted formatting
    const cleanedHumanizedContent = cleanGeneratedContent(humanizedContent);
    return res.status(200).json({ content: cleanedHumanizedContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
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
      numOptions = 3
    } = data;

    const prompt = `Write a brand boilerplate for the following business.\n\nBusiness Name: ${businessName}\nDescription: ${description}\nProduct: ${product}\nAudiences: ${(audiences || []).join(", ")}\nPromise: ${promise}\nTone: ${tone}\nStyle: ${style}\nDifferentiator: ${differentiator}\nPositioning: ${positioning}\nArchetype: ${archetype}\nPersonality: ${(personality || []).join(", ")}\nWord Count: ${wordCount}\n\nReturn only the boilerplate text. Do not include explanations.`;

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
      personality
    } = data;
    const prompt = `Adapt the following brand boilerplate to approximately ${wordCount} words.\n\nBoilerplate: ${baseBoilerplate}\n\nBusiness Name: ${businessName}\nDescription: ${description}\nProduct: ${product}\nAudiences: ${(audiences || []).join(", ")}\nPromise: ${promise}\nTone: ${tone}\nStyle: ${style}\nDifferentiator: ${differentiator}\nPositioning: ${positioning}\nArchetype: ${archetype}\nPersonality: ${(personality || []).join(", ")}\n\nReturn only the adapted boilerplate text. Do not include explanations.`;
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
      numOptions = 5
    } = data;

    const prompt = `Write a catchy, brand-appropriate tagline for the following business.\n\nBusiness Name: ${businessName}\nDescription: ${description}\nAudiences: ${(audiences || []).join(", ")}\nPromise: ${promise}\nTone: ${tone}\nStyle: ${style}\nArchetype: ${archetype}\nPersonality: ${(personality || []).join(", ")}\n\nReturn only the tagline. Do not include explanations.`;

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
<<<<<<< Updated upstream
    const prompt = `Generate an ideal customer persona for the following product.\n\nProduct Name: ${productName}\nProduct Type/Description: ${productType}\nCurrent Persona: ${currentPersona ? JSON.stringify(currentPersona) : 'N/A'}\n\nReturn ONLY a valid JSON array of personas with role, industry, and challenges. Do not include any explanation or formatting.`;
=======
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
>>>>>>> Stashed changes
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
      const match = personasText.match(/\[.*\]/s);
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
    const { content, sourceFormat, targetFormat, styleGuide, messaging } = data;
    const prompt = `Repurpose the following content from ${sourceFormat} to ${targetFormat}.\n\nContent: ${content}\n\nStyle Guide: ${JSON.stringify(styleGuide)}\nMessaging: ${JSON.stringify(messaging)}\n\nReturn only the repurposed content.`;
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
    const prompt = `Generate ${numVariations} variations for A/B testing.\n\nType: ${contentType}\nContext: ${contentContext}\nTarget Audience: ${targetAudience}\n\nReturn a JSON array of variations.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a marketing copywriter." },
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
    const { text, options } = data;
    const prompt = `Improve the following text for clarity, engagement, and style.\n\nText: ${text}\n\nOptions: ${JSON.stringify(options)}\n\nReturn a JSON object with 'enhancedText' and an array 'suggestions' (each with original, suggestion, reason, type).`;
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
    const prompt = `Generate a value proposition, 3 key differentiators, and 5 targeted key messages for the following product.\n\nProduct Info: ${JSON.stringify(productInfo)}\nIndustry: ${industry}\nFocus Areas: ${focusAreas}\nTone: ${tone}\nCurrent Framework: ${JSON.stringify(currentFramework)}\n\nReturn ONLY a valid JSON object with valueProposition, keyDifferentiators (array), and targetedMessages (array). Do not include any explanation or formatting.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a B2B messaging strategist." },
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
<<<<<<< Updated upstream
    const { competitors, productInfo, industry, focusAreas, tone } = data;
    const prompt = `Analyze the following competitors for the given product.\n\nProduct Info: ${JSON.stringify(productInfo)}\nIndustry: ${industry}\nFocus Areas: ${focusAreas}\nTone: ${tone}\nCompetitors: ${JSON.stringify(competitors)}\n\nReturn ONLY a valid JSON array. Each item should have name, uniquePositioning (array, at least 1), keyThemes (array, at least 1), and gaps (array, at least 1). Do not include any explanation or formatting. Never return empty arrays; always provide at least one insight for each field.`;
=======
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

>>>>>>> Stashed changes
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
    let result;
    try {
      result = JSON.parse(text);
      console.log("[CompetitiveAnalysis] Parsed JSON:", result);
    } catch (e) {
      // Try to extract JSON array from the response (ES2018 workaround)
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          result = JSON.parse(match[0]);
          console.log("[CompetitiveAnalysis] Extracted JSON array:", result);
        } catch (e2) {
          console.error("[CompetitiveAnalysis] Failed to parse extracted JSON array:", e2);
          result = null;
        }
      } else {
        console.error("[CompetitiveAnalysis] No JSON array found in AI response.");
        result = null;
      }
    }
    if (!result || !Array.isArray(result)) {
      // fallback sample
      console.warn("[CompetitiveAnalysis] Falling back to sample data.");
      result = Array.isArray(competitors)
        ? competitors.map((c: any) => ({
            name: c.name,
            uniquePositioning: ["Sample positioning"],
            keyThemes: ["Sample theme"],
            gaps: ["Sample gap"]
          }))
        : [];
    }
    res.status(200).json(result);
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
        mission: missionMatch ? missionMatch[1].trim() : '',
        vision: visionMatch ? visionMatch[1].trim() : ''
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  } else if (mode === "adaptBoilerplate") {
    return handleAdaptBoilerplate(data, res);
  } else if (mode === "tagline") {
    return handleTaglineGeneration(data, res);
  } else if (mode === "personaGenerator") {
    return handlePersonaGenerator(data, res);
  } else if (mode === "contentRepurposer") {
    return handleContentRepurposer(data, res);
  } else if (mode === "abTestGenerator") {
    return handleABTestGenerator(data, res);
  } else if (mode === "prosePerfector") {
    return handleProsePerfector(data, res);
  } else if (mode === "keyMessages") {
    return handleKeyMessages(data, res);
  } else if (mode === "analyzeCompetitors") {
    return handleCompetitiveAnalysis(data, res);
  } else if (mode === "missionVision") {
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
    return handleAnalyzeCompetitors(data, res);
  } else if (mode === "mission-vision") {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    return handleMissionVision(data, res);
  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }
}
