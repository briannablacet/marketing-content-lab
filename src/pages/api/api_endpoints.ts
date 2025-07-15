//FIXED CONTENTEDITCHAT

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

  console.log("🔍 FULL STYLE INSTRUCTIONS BEING SENT:", instructions);
  return instructions;
}

// Function to clean generated content
function cleanGeneratedContent(content: string): string {
  if (!content) return content;

  // Remove code blocks
  let cleaned = content.replace(/```[\s\S]*?```/g, '');

  // Remove markdown headings (e.g., # Heading)
  cleaned = cleaned.replace(/^#+\s?/gm, '');

  // Remove bold/italic markdown, but KEEP bold at line start (for headings)
  // Remove bold NOT at line start
  cleaned = cleaned.replace(/(?!^)(\*\*|__)(.*?)\1/g, '$2'); // Remove bold not at line start
  // Remove italic everywhere
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');

  // Remove inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Remove bullet points and numbered lists
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

  // Remove extra whitespace at the beginning of lines
  cleaned = cleaned.replace(/^\s+/gm, '');

  // Remove any remaining asterisks at line start (except for bold)
  cleaned = cleaned.replace(/^(?!\*\*).*\*\s*/gm, '');

  // Remove extra blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

// Function to clean taglines by removing unnecessary quotation marks
function cleanTagline(tagline: string): string {
  if (!tagline) return tagline;

  let cleaned = tagline.trim();
  // Remove multiple layers of quotes
  cleaned = cleaned.replace(/^["']+|["']+$/g, '');
  cleaned = cleaned.replace(/^["']+|["']+$/g, ''); // Run it twice for nested quotes
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
  const styleInstructions = "";
  // writingStyle || strategicData.writingStyle,
  //brandVoice || strategicData.brandVoice,
  //messaging || strategicData.messaging
  //);

  console.log("📋 Style instructions being sent to AI:", styleInstructions);

  let prompt = "";
  if (contentTypes.includes("blog-post") || contentTypes.includes("Blog Posts")) {
    console.log("🔍 FULL PROMPT BEING SENT TO AI:");
    console.log("Prompt exists:", !!prompt);
    console.log("Prompt length:", prompt ? prompt.length : 0);
    console.log("Prompt content:", prompt);

    prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
${styleInstructions}

⚠️ HEADING ENFORCEMENT: Use clear headings and subheadings in plain text format. Include an H1 heading at the top. Do not put colons at the ends of headings and subheadings.

You are a professional magazine writer. Write a compelling 1,500-word article about: "${campaignData.name}"

STRUCTURE:
- Engaging opening (250 words)
- 4–5 substantial sections with clear, descriptive subheadings (200–250 words each)
- Strong conclusion (150 words)

TARGET AUDIENCE: ${campaignData.targetAudience}
Avoid cliches, such as "Imagine this"

Use clear formatting with proper headings, subheadings, and lists. Paragraphs should be separated by blank lines. Your editor is strict—follow the style guide to the letter.`;
  } else {
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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
        { role: "system", content: "You are a professional writer. Write in plain text format without any markdown, asterisks, or special formatting." },
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
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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
// Handler for tagline improvement - keeps it concise and punchy
async function handleTaglineImprovement(data: any, res: NextApiResponse) {
  try {
    if (!data.content || typeof data.content !== "string") {
      return res.status(400).json({ error: "Missing or invalid tagline content" });
    }

    const { content, instructions, strategicContext } = data;

    const prompt = `You are a tagline specialist. Improve this tagline based on the user's request.

Current tagline: "${content}"

User request: ${instructions}

Strategic context:
- Product: ${strategicContext?.productName || 'N/A'}
- Target audience: ${strategicContext?.audience || 'N/A'}
- Brand tone: ${strategicContext?.tone || 'N/A'}
- Brand archetype: ${strategicContext?.archetype || 'N/A'}
- Brand promise: ${strategicContext?.promise || 'N/A'}

REQUIREMENTS:
- Return ONLY the improved tagline
- Keep it under 10 words maximum
- Make it punchy and memorable
- No explanations, quotes, or extra text
- Single line only`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 30, // Very short to force brevity
      messages: [
        {
          role: "system",
          content: "You are a tagline expert. Return only the improved tagline, nothing else. Keep it under 10 words."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    let improvedTagline = response.choices[0].message.content?.trim() || "";

    // Extra cleaning for taglines
    improvedTagline = cleanTagline(improvedTagline);

    return res.status(200).json({ content: improvedTagline });
  } catch (error) {
    console.error("Tagline improvement error:", error);
    return res.status(500).json({ error: "Failed to improve tagline" });
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
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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

// Handler for tagline generation - 80% FOUNDATION FOR HUMAN POLISH
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

    // COMPREHENSIVE FORBIDDEN WORDS LIST
    const forbiddenWords = [
      'revolutionize', 'revolutionizing', 'revolution',
      'empower', 'empowering', 'empowerment',
      'master', 'mastering', 'mastery',
      'unleash', 'unleashing',
      'unchain', 'unchaining',
      'evolve', 'evolving', 'evolution',
      'reinvent', 'reinventing',
      'transform', 'transforming', 'transformation',
      'disrupt', 'disrupting', 'disruption',
      'unlock', 'unlocking',
      'elevate', 'elevating',
      'optimize', 'optimizing',
      'leverage', 'leveraging',
      'synergy', 'synergize',
      'paradigm', 'innovative', 'cutting-edge',
      'next-level', 'game-changing', 'breakthrough',
      'seamless', 'scalable', 'robust',
      'dynamic', 'strategic', 'holistic',
      'comprehensive', 'integrated', 'streamlined',
      'maximize', 'accelerate', 'amplify', 'amplified'
    ];

    // 80% FOUNDATION PROMPT
    const prompt = `Generate 20 tagline foundations for ${businessName} that a human can easily polish into perfect taglines.

Business: ${description}

Focus on FEELINGS and OUTCOMES customers want:
- How do they want to FEEL about their business?
- What RESULT do they want to achieve?
- What WORRY do they want to eliminate?
- What would make them confident/proud/successful?

Use these FEELING/TIME concepts that work:
Life, Future, Tomorrow, Today, Finally, Always, Never, Simple, Smart, Better, Right, Sure, Easy, Fast, Clear

GOOD FOUNDATIONS we created by hand:
"Talent for Life" - life concept + outcome
"Tomorrow's Team, Today" - time concept + feeling prepared  
"Intelligence at Work" - outcome + action
"See Tomorrow's Hire" - action + future concept
"Data Beats Hunches" - comparison + confidence

These work because they:
- Focus on customer outcomes, not product features
- Use emotional or time-based concepts
- Sound conversational and natural
- Are specific enough to mean something
- Give humans a strong foundation to refine

AVOID:
- Generic business motivation: "Make It Happen", "Act Now"
- Corporate jargon and buzzwords
- Explaining what the product does
- Forced creativity or wordplay

FORBIDDEN WORDS (DO NOT USE):
${forbiddenWords.join(', ')}

Requirements:
- 2-4 words maximum
- Focus on FEELINGS and OUTCOMES
- Natural, conversational language
- Strong foundation that humans can polish
- Specific to this business type

Return exactly 20 tagline foundations in this format:
"Foundation One"
"Foundation Two"
etc.`;

    console.log("🔍 GENERATING 20 TAGLINE FOUNDATIONS FOR HUMAN POLISH");

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7, // Balanced for good foundations
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You create tagline foundations that humans can easily refine into great taglines. Focus on emotions, outcomes, and natural language. Avoid corporate buzzwords. Think about how customers want to FEEL, not what the product does. Create solid 80% foundations that humans can polish to 100%.`
        },
        { role: "user", content: prompt }
      ],
    });

    const content = response.choices[0].message.content?.trim() || "";
    console.log("📝 AI Response length:", content.length);

    // Parse and filter the response
    let allTaglines = content.split('\n')
      .map(line => cleanTagline(line.trim()))
      .filter(line => line.length > 0 && line.split(' ').length <= 6);

    console.log(`📊 Generated ${allTaglines.length} initial foundations`);

    // Remove any that contain forbidden words
    const cleanTaglines = allTaglines.filter(tagline => {
      const taglineLower = tagline.toLowerCase();
      const hasForbiddenWord = forbiddenWords.some(word =>
        taglineLower.includes(word.toLowerCase())
      );

      if (hasForbiddenWord) {
        console.log(`❌ Rejected for forbidden words: "${tagline}"`);
        return false;
      }
      return true;
    });

    console.log(`✅ ${cleanTaglines.length} foundations passed forbidden word filter`);

    // Remove exact duplicates and similar phrases
    const uniqueTaglines = [];
    const usedWords = new Set();

    for (const tagline of cleanTaglines) {
      const words = tagline.toLowerCase().split(/\s+/);
      const hasOverlap = words.some(word => usedWords.has(word));

      if (!hasOverlap && uniqueTaglines.length < 15) {
        uniqueTaglines.push(tagline);
        words.forEach(word => usedWords.add(word));
        console.log(`✅ Accepted foundation: "${tagline}"`);
      } else if (hasOverlap) {
        console.log(`🔄 Rejected for word overlap: "${tagline}"`);
      }
    }

    // Take the best 5 for the UI
    const finalTaglines = uniqueTaglines.slice(0, numOptions);

    console.log(`🎯 Returning ${finalTaglines.length} foundations to UI:`);
    finalTaglines.forEach((tagline, i) => console.log(`${i + 1}. "${tagline}"`));

    // If we don't have enough, fill with the remaining clean ones
    while (finalTaglines.length < numOptions && cleanTaglines.length > finalTaglines.length) {
      const remaining = cleanTaglines.find(t => !finalTaglines.includes(t));
      if (remaining) {
        finalTaglines.push(remaining);
      } else {
        break;
      }
    }

    return res.status(200).json(finalTaglines);
  } catch (error) {
    console.error("Tagline generation error:", error);
    return res.status(500).json({ error: "Failed to generate taglines" });
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
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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
// src/pages/api/api_endpoints.ts
// REPLACE your handleSocialMediaGeneration function with this clean version:

async function handleSocialMediaGeneration(data: any, res: NextApiResponse) {
  try {
    console.log("🚀 Social Media Generation Started");
    console.log("📊 Request Data:", data);

    const {
      content,
      platforms = ['linkedin'],
      tone = 'professional',
      includeHashtags = true,
      includeEmojis = true,
      callToAction = true,
      strategicData,
      writingStyle,
      numVariations = 3
    } = data;

    console.log("🎯 Number of variations requested:", numVariations);
    console.log("📱 Platforms:", platforms);

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Missing or invalid content" });
    }

    // Build style guide instructions
    const styleInstructions = buildStyleGuideInstructions(
      writingStyle || strategicData?.writingStyle,
      strategicData?.brandVoice,
      strategicData?.messaging
    );

    const socialPosts: { [key: string]: any } = {};

    for (const platform of platforms) {
      let maxLength = "";
      let platformGuidelines = "";

      switch (platform.toLowerCase()) {
        case 'linkedin':
          maxLength = "1,300 characters (about 200-250 words)";
          platformGuidelines = `
- Professional yet engaging tone
- Use line breaks for readability  
- Include 3-5 relevant hashtags at the end
- Add a clear call-to-action
- Use emojis sparingly but strategically
- Consider starting with a hook or question
- LinkedIn users appreciate insights and professional value`;
          break;

        case 'twitter':
        case 'x':
          maxLength = "280 characters total";
          platformGuidelines = `
- Concise and punchy
- Use 1-2 hashtags maximum (they count toward character limit)
- Include emojis for engagement
- Strong hook in first 8 words
- Consider thread format if content is complex
- Use Twitter-style language (brief, conversational)`;
          break;

        case 'facebook':
          maxLength = "500-800 characters for best engagement";
          platformGuidelines = `
- Conversational and friendly tone
- Use storytelling when possible
- Include 2-3 hashtags
- Ask questions to encourage comments
- Use emojis to break up text
- Facebook users like relatable, human content`;
          break;

        case 'instagram':
          maxLength = "2,200 characters but first 125 characters are crucial";
          platformGuidelines = `
- Visual-first platform (mention this content needs an image)
- Start with an engaging first line
- Use line breaks for readability
- Include 5-10 relevant hashtags (can go up to 30)
- Stories should be engaging and personal
- Use emojis throughout
- Instagram users love authentic, behind-the-scenes content`;
          break;

        default:
          maxLength = "300-500 characters";
          platformGuidelines = "General social media best practices";
      }

      const platformPrompt = `🚨 STYLE GUIDE COMPLIANCE:
${styleInstructions}

Create ${numVariations} different engaging ${platform} posts based on this content. Each should have a unique angle or approach.

ORIGINAL CONTENT:
${content}

PLATFORM: ${platform.toUpperCase()}
MAX LENGTH: ${maxLength}
TONE: ${tone}

PLATFORM GUIDELINES:
${platformGuidelines}

REQUIREMENTS:
- Create ${numVariations} DIFFERENT variations with unique angles
- Each variation should stay within ${maxLength}
- Make each post engaging and scroll-stopping
- ${includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}
- ${includeEmojis ? 'Use emojis strategically' : 'No emojis'}
- ${callToAction ? 'Include a clear call-to-action' : 'No call-to-action needed'}
- Follow the style guide rules exactly
- Remove any markdown formatting

VARIATION APPROACHES (use these for inspiration):
1. Question/Hook approach - Start with an engaging question
2. Statistic/Insight approach - Lead with a compelling stat or insight  
3. Story/Personal approach - Use storytelling or personal angle
4. Tip/Actionable approach - Focus on actionable advice
5. Contrarian/Bold approach - Challenge conventional thinking

Return ONLY a JSON array of ${numVariations} posts like this:
["post 1 text here", "post 2 text here", "post 3 text here"]

No explanations, just the JSON array.`;

      console.log(`🔍 ${platform.toUpperCase()} PROMPT:`, platformPrompt.substring(0, 200) + "...");

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        temperature: 0.8,
        max_tokens: platform.toLowerCase() === 'twitter' ? 200 : 500,
        messages: [
          {
            role: "system",
            content: `You are a social media expert specializing in ${platform}. Create multiple engaging, platform-specific content variations that follow all style guidelines. Return only a JSON array of post variations with no explanations.`
          },
          {
            role: "user",
            content: platformPrompt
          }
        ]
      });

      let postVariations: string[] = [];

      try {
        const rawResponse = response.choices[0].message.content?.trim() || '';
        console.log(`📝 Raw ${platform} response:`, rawResponse.substring(0, 100) + "...");

        // Try to parse as JSON array
        const parsed = JSON.parse(rawResponse);

        // Validate it's an array with the right number of items
        if (!Array.isArray(parsed)) {
          throw new Error(`AI returned non-array response for ${platform}`);
        }

        if (parsed.length === 0) {
          throw new Error(`AI returned empty array for ${platform}`);
        }

        // Clean each variation
        postVariations = parsed.map((post, index) => {
          if (typeof post !== 'string') {
            throw new Error(`AI returned non-string post ${index + 1} for ${platform}`);
          }

          let cleaned = cleanGeneratedContent(post);
          cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove quotes

          if (!cleaned.trim()) {
            throw new Error(`AI returned empty post ${index + 1} for ${platform}`);
          }

          return cleaned;
        });

      } catch (parseError) {
        console.error(`❌ Failed to parse ${platform} variations:`, parseError);

        // STRICT: No fallbacks in beta! Return error instead
        return res.status(500).json({
          error: `Failed to generate ${platform} posts. Please try again.`,
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        });
      }

      // Store the variations with metadata
      socialPosts[platform] = {
        platform: platform,
        maxLength: maxLength,
        guidelines: platformGuidelines.trim(),
        variations: postVariations.slice(0, numVariations).map((content, index) => ({
          id: index + 1,
          content: content,
          characterCount: content.length,
          approach: ['Question/Hook', 'Statistic/Insight', 'Story/Personal', 'Tip/Actionable', 'Contrarian/Bold'][index] || 'Creative'
        }))
      };
    }

    console.log("✅ Generated social post variations for platforms:", Object.keys(socialPosts));
    console.log("📊 Total variations created:",
      Object.values(socialPosts).reduce((total: number, platform: any) => total + platform.variations.length, 0)
    );

    return res.status(200).json({ socialPosts });

  } catch (error) {
    console.error("❌ Social media generation error:", error);
    return res.status(500).json({
      error: "Failed to generate social media content",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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

// Handler for prose perfector - SIMPLE AND DIRECT
async function handleProsePerfector(data: any, res: NextApiResponse) {
  try {
    const { text, options, writingStyle, strategicData } = data;

    // Build user instructions - make them SUPER clear
    let instructions = "Improve this text by:\n";

    if (options.additionalInstructions && options.additionalInstructions.trim()) {
      instructions += `- MOST IMPORTANT: ${options.additionalInstructions.trim()}\n`;
    }

    if (options.improveClarity) instructions += "- Fix unclear sentences\n";
    if (options.enhanceEngagement) instructions += "- Make it more engaging\n";
    if (options.adjustFormality) instructions += `- Make it ${options.formalityLevel}\n`;

    instructions += "- Fix grammar and punctuation errors\n";
    instructions += "- Fix formatting issues (like '5) 5)' should be '5)')\n";

    const prompt = `${instructions}

Text to improve:
${text}

Return your response as JSON with this exact format:
{"enhancedText": "your improved version", "suggestions": [{"original": "what you changed", "suggestion": "what you changed it to", "reason": "why", "type": "improvement"}]}`;
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.1,
      messages: [
        { role: "system", content: "You follow instructions exactly. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
    });

    let result;
    try {
      const content = response.choices[0].message.content || '{}';
      console.log('🔍 AI raw response:', content);

      // Try to parse directly first
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Parse error:', parseError);
      // Fallback
      result = {
        enhancedText: text,
        suggestions: [{
          original: "AI response error",
          suggestion: "Please try again",
          reason: "Could not parse AI response",
          type: "error"
        }]
      };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Prose error:", error);
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
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
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
// Handler for keyword suggestions (for ContentCreator)
async function handleKeywordSuggestions(data: any, res: NextApiResponse) {
  try {
    const { contentTopic, contentType } = data;

    const prompt = `Generate 15-20 relevant SEO keywords for this content topic: "${contentTopic}"
Content Type: ${contentType || 'blog-post'}

Return ONLY a JSON array of keyword strings: ["keyword1", "keyword2", "keyword3"]
No explanations, just the array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are an SEO expert. Return only valid JSON arrays." },
        { role: "user", content: prompt }
      ],
    });

    const keywords = JSON.parse(response.choices[0].message.content?.trim() || '[]');
    return res.status(200).json({ keywords });
  } catch (error) {
    console.error("Keyword suggestions error:", error);
    return res.status(500).json({ error: "Failed to generate keyword suggestions" });
  }
}
// Handler for competitor analysis
// REPLACE ONLY the handleCompetitiveAnalysis function in your existing api_endpoints.ts file
// Find the existing function and replace it with this enhanced version

// Helper functions for URL detection (add these at the top of your file, after your existing helper functions)
function isURL(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch {
    return input.toLowerCase().includes('.com') ||
      input.toLowerCase().includes('.org') ||
      input.toLowerCase().includes('.net') ||
      input.toLowerCase().includes('www.') ||
      input.toLowerCase().includes('http');
  }
}

function extractDomain(input: string): string {
  try {
    if (!input.startsWith('http')) {
      input = 'https://' + input;
    }
    const url = new URL(input);
    return url.hostname.replace('www.', '');
  } catch {
    return input.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

// ENHANCED Handler for competitor analysis - REPLACE your existing handleCompetitiveAnalysis function with this
async function handleCompetitiveAnalysis(data: any, res: NextApiResponse) {
  try {
    const { competitors, industry } = data;

    if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
      return res.status(400).json({
        error: "No competitors provided for analysis"
      });
    }

    console.log("🎯 Starting enhanced competitive analysis for:", competitors.map(c => c.name));

    const analysisResults = [];

    for (const competitor of competitors) {
      if (!competitor.name || competitor.name.trim() === '') {
        continue;
      }

      try {
        console.log(`🔍 Analyzing competitor: ${competitor.name}`);

        // Determine if input is a URL
        const inputIsUrl = isURL(competitor.name);

        // Create enhanced prompt based on input type
        const basePrompt = inputIsUrl
          ? `Analyze the company at this website: ${competitor.name}`
          : `Analyze this competitor company: ${competitor.name}`;

        const prompt = `${basePrompt}

Industry Context: ${industry || 'Technology/SaaS'}

Please provide a detailed competitive analysis with the following structure:

1. UNIQUE POSITIONING (3-5 key points about how they position themselves)
2. KEY THEMES/MESSAGES (4-6 main marketing messages they use)  
3. GAPS/OPPORTUNITIES (3-4 areas where they could be vulnerable or where competitors could differentiate)

${inputIsUrl ? `
Since this is a website URL, focus on:
- Their homepage messaging and value propositions
- About page positioning statements  
- Product/service descriptions
- Any unique angles they take in their marketing
` : `
For this company, research and analyze:
- Their known market positioning
- Common messaging themes in their marketing
- Competitive advantages they claim
- Areas where they might be weak or overextended
`}

Be specific and actionable. Avoid generic business advice.

Return ONLY a JSON object with this exact format:
{
  "name": "${competitor.name}",
  "uniquePositioning": ["positioning point 1", "positioning point 2", ...],
  "keyThemes": ["theme 1", "theme 2", ...],
  "gaps": ["opportunity 1", "opportunity 2", ...]
}`;
        console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
        // Get AI analysis with better parameters
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: "You are a competitive intelligence analyst with deep knowledge of business strategy and marketing. Provide detailed, specific analysis based on real market knowledge. Return only valid JSON with no explanations."
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.3 // Lower temperature for more consistent, factual responses
        });

        const aiResponse = response.choices[0].message.content?.trim() || '';
        console.log(`📊 AI response for ${competitor.name}:`, aiResponse.substring(0, 100) + "...");

        // Parse the response
        let parsedResult;
        try {
          parsedResult = JSON.parse(aiResponse);
        } catch (parseError) {
          console.error(`❌ Failed to parse JSON for ${competitor.name}:`, parseError);

          // Try to extract JSON from the response
          const match = aiResponse.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              parsedResult = JSON.parse(match[0]);
            } catch (secondParseError) {
              console.error(`❌ Second parse attempt failed for ${competitor.name}`);
              throw new Error(`Could not analyze ${competitor.name} - please try again`);
            }
          } else {
            throw new Error(`No valid analysis data found for ${competitor.name}`);
          }
        }

        // Validate the structure
        if (!parsedResult.uniquePositioning || !Array.isArray(parsedResult.uniquePositioning)) {
          throw new Error(`Invalid analysis structure for ${competitor.name}`);
        }

        // Check if we got meaningful content
        const totalInsights = parsedResult.uniquePositioning.length +
          (parsedResult.keyThemes?.length || 0) +
          (parsedResult.gaps?.length || 0);

        if (totalInsights === 0) {
          throw new Error(`No competitive insights found for ${competitor.name}. This may be a very small company or limited public information is available.`);
        }

        // Add metadata about our analysis
        parsedResult.metadata = {
          searchPerformed: true,
          isUrl: inputIsUrl,
          analysisTimestamp: new Date().toISOString(),
          totalInsights: totalInsights
        };

        analysisResults.push(parsedResult);

        console.log(`✅ Successfully analyzed ${competitor.name} with ${totalInsights} insights`);

      } catch (competitorError) {
        console.error(`❌ Error analyzing ${competitor.name}:`, competitorError);

        // Return an error for this specific competitor instead of fallback data
        analysisResults.push({
          name: competitor.name,
          error: `Failed to analyze ${competitor.name}: ${competitorError && typeof competitorError === 'object' && 'message' in competitorError ? (competitorError as any).message : String(competitorError)}`,
          uniquePositioning: [],
          keyThemes: [],
          gaps: []
        });
      }
    }

    // Return results
    if (analysisResults.length === 0) {
      return res.status(400).json({
        error: "Could not analyze any of the provided competitors"
      });
    }

    const successfulAnalyses = analysisResults.filter(result => !result.error);
    console.log(`🎉 Completed analysis: ${successfulAnalyses.length}/${analysisResults.length} successful`);

    return res.status(200).json(analysisResults);

  } catch (error) {
    const errorMessage = typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error);
    console.error("❌ Competitive analysis handler error:", errorMessage);
    res.status(500).json({
      error: `Analysis failed: ${errorMessage}`
    });
  }
}

// Handler for mission and vision generation
async function handleMissionVision(data: any, res: NextApiResponse) {
  try {
    const { companyName, audience, valueProp, additionalContext } = data;
    const prompt = `Generate a concise mission statement and a vision statement for the following company.

Company Name: ${companyName}
Target Audience: ${audience}
Value Proposition: ${valueProp}
Additional Context: ${additionalContext}

Return ONLY a JSON object with 'mission' and 'vision' fields. Do not include any explanations, labels, or extra text.

Example format:
{
  "mission": "Your mission statement here",
  "vision": "Your vision statement here"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a branding strategist. Return only valid JSON with mission and vision fields. No explanations." },
        { role: "user", content: prompt },
      ],
    });

    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      // Better fallback parsing
      const text = response.choices[0].message.content || '';
      const missionMatch = text.match(/mission["\s:]*["']?([^"',\n]+)["']?[,\s]*/i);
      const visionMatch = text.match(/vision["\s:]*["']?([^"',\n]+)["']?[,\s]*/i);
      result = {
        mission: missionMatch && missionMatch[1] ? missionMatch[1].trim().replace(/,$/, '') : '',
        vision: visionMatch && visionMatch[1] ? visionMatch[1].trim().replace(/,$/, '') : ''
      };
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Mission/Vision generation error:", error);
    return res.status(500).json({ error: "Failed to generate mission and vision" });
  }
}

//handler for style checker

async function handleStyleChecker(data: any, res: NextApiResponse) {
  try {
    const { content, styleGuide } = data;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Missing or invalid content" });
    }

    console.log("🎯 Starting style compliance check");

    // Build style guide instructions
    const styleInstructions = buildStyleGuideInstructions(
      { styleGuide, formatting: styleGuide.formatting, punctuation: styleGuide.punctuation },
      null, // brandVoice
      null  // messaging
    );

    const prompt = `You are a professional style guide compliance checker. Analyze the following content for compliance with the specified style guide rules.

STYLE GUIDE RULES:
${styleInstructions}

CONTENT TO ANALYZE:
${content}

IMPORTANT: Only flag ACTUAL violations, not preferences. Do not suggest changes unless there are clear errors or violations.

Look specifically for:
- Grammar errors (spelling, punctuation mistakes)
- Clear style guide violations (if Oxford comma is required but missing)
- Inconsistent formatting within the document
- Obvious errors that need fixing

DO NOT flag:
- Personal writing style choices
- Content that is already well-formatted
- Holiday names or common expressions
- Paragraph text that you think "should" be bullets
- Minor stylistic preferences that don't violate rules

Analyze this content and return ONLY a JSON object with this exact format:
{
  "compliance": 95,
  "issues": [
    {
      "type": "Grammar",
      "text": "actual error found",
      "suggestion": "corrected version",
      "severity": "medium"
    }
  ],
  "strengths": [
    "Consistent formatting",
    "Clear writing style"
  ]
}

Be conservative - if you're not sure it's a real error, don't flag it. Only suggest changes for obvious problems.`;
    console.log("🔍 PROMPT BEING SENT TO AI:", prompt);
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You are a meticulous style guide compliance expert. Return only valid JSON with no explanations."
        },
        { role: "user", content: prompt }
      ],
    });

    const aiResponse = response.choices[0].message.content?.trim() || '';
    console.log("📊 Style check response:", aiResponse.substring(0, 200) + "...");

    // Parse the response
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("❌ Failed to parse style check JSON:", parseError);

      // Try to extract JSON from the response
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          result = JSON.parse(match[0]);
        } catch (secondParseError) {
          throw new Error("Could not parse style compliance analysis");
        }
      } else {
        throw new Error("No valid JSON found in style analysis");
      }
    }

    // Validate the structure
    if (typeof result.compliance !== 'number' ||
      !Array.isArray(result.issues) ||
      !Array.isArray(result.strengths)) {
      throw new Error("Invalid style analysis structure");
    }

    // Ensure compliance is within valid range
    result.compliance = Math.max(0, Math.min(100, result.compliance));

    console.log(`✅ Style compliance check complete: ${result.compliance}% compliant`);
    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ Style compliance check error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      error: `Style compliance check failed: ${errorMessage}`
    });
  }
}

// Handler for fixing style compliance issues
async function handleStyleFixer(data: any, res: NextApiResponse) {
  try {
    const { content, issues, styleGuide } = data;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Missing or invalid content" });
    }

    if (!issues || !Array.isArray(issues)) {
      return res.status(400).json({ error: "Missing or invalid issues array" });
    }

    console.log("🔧 Starting style compliance fix");

    // Build style guide instructions
    const styleInstructions = buildStyleGuideInstructions(
      { styleGuide, formatting: styleGuide.formatting, punctuation: styleGuide.punctuation },
      null, // brandVoice
      null  // messaging
    );

    // Create a detailed list of issues to fix
    const issuesList = issues.map((issue, index) =>
      `${index + 1}. ${issue.type}: "${issue.text}" → ${issue.suggestion}`
    ).join('\n');

    const prompt = `You are a professional editor. Fix the following content to address the specific issues identified.

STYLE GUIDE RULES:
${styleInstructions}

SPECIFIC ISSUES TO FIX:
${issuesList}

ORIGINAL CONTENT:
${content}

INSTRUCTIONS:
- Fix ONLY the specific issues listed above
- Do NOT make other changes to the content
- Maintain the original structure, tone, and style
- Return the corrected content with minimal changes

CRITICAL: Return the COMPLETE corrected content. Do not truncate, summarize, or shorten the text in any way. The output must be the same length as the input with only the specific issues fixed. Include ALL paragraphs, sentences, and content from the original.

Return ONLY the corrected content with no explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are a professional editor who fixes style guide violations. Return only the corrected content with no explanations."
        },
        { role: "user", content: prompt }
      ],
    });

    const fixedContent = response.choices[0].message.content?.trim() || content;

    // Clean the fixed content (remove any unwanted formatting)
    const cleanedContent = cleanGeneratedContent(fixedContent);

    console.log("✅ Style compliance fix complete");
    return res.status(200).json({
      fixedContent: cleanedContent
    });

  } catch (error) {
    console.error("❌ Style compliance fix error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      error: `Style compliance fix failed: ${errorMessage}`
    });
  }
}
// Handler for email generation
async function handleEmailGeneration(data: any, res: NextApiResponse) {
  try {
    const { topic, audience, tone, maxWords = 150 } = data;

    const prompt = `Write a professional email about: ${topic}

Target audience: ${audience || 'general audience'}
Tone: ${tone || 'professional'}
Maximum words: ${maxWords}

Format:
Subject: [compelling subject line - max 50 characters]
Preview: [preview text - max 20 words]  
Headline: [main headline]
Body: [email body - concise and focused]
Call-to-Action: [specific action you want them to take]

Keep it concise, professional, and actionable. Total word count must not exceed ${maxWords} words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are an expert email marketer. Write concise, effective emails." },
        { role: "user", content: prompt }
      ],
    });

    const emailContent = response.choices[0].message.content || "";
    return res.status(200).json({ content: emailContent });
  } catch (error) {
    console.error("Email generation error:", error);
    return res.status(500).json({ error: "Failed to generate email" });
  }
}


// Handler for ContentEditChat targeted improvements
async function handleContentImprove(data: any, res: NextApiResponse) {
  try {
    const { content, instructions, strategicContext } = data;

    const prompt = `You are a professional editor.
ONLY do what the USER INSTRUCTION says.
Do NOT make any other changes, do NOT humanize, do NOT rewrite, do NOT improve anything else.
Preserve ALL formatting, headings, structure, and markdown.
Do not remove or change any headings, subheadings, bullet points, or other formatting elements unless the instruction specifically says to.
If the instruction is to 'add a stat', ONLY add a stat and change nothing else.

USER INSTRUCTION: ${instructions}

CONTENT TO IMPROVE:
${content}

Return only the improved content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a professional editor who follows instructions exactly." },
        { role: "user", content: prompt },
      ],
    });

    const improvedContent = response.choices[0].message.content || "";
    // Clean the improved content to remove unwanted formatting
    const cleanedContent = cleanGeneratedContent(improvedContent);
    return res.status(200).json({ content: cleanedContent });
  } catch (error) {
    console.error("Content improve error:", error);
    return res.status(500).json({ error: "Failed to improve content" });
  }
}

// Handler for email nurture flow generation
async function handleEmailNurtureFlow(data: any, res: NextApiResponse) {
  try {
    const {
      campaignName,
      audience,
      keyMessages,
      campaignType,
      numEmails = 5
    } = data;

    console.log("🔄 Generating email nurture flow:", { campaignName, audience, numEmails });

    // Define email purposes based on campaign type
    const emailPurposes = {
      'awareness': [
        'Welcome and introduce your brand',
        'Share valuable industry insights',
        'Provide educational content',
        'Build trust with social proof',
        'Invite further engagement'
      ],
      'lead_generation': [
        'Welcome and set expectations',
        'Identify pain points and challenges',
        'Present your solution',
        'Share success stories and case studies',
        'Strong call-to-action to convert'
      ],
      'conversion': [
        'Welcome and confirm interest',
        'Address common objections',
        'Demonstrate clear value and ROI',
        'Share testimonials and proof',
        'Create urgency with limited offer'
      ],
      'retention': [
        'Thank them for being a customer',
        'Share advanced tips and best practices',
        'Introduce new features or services',
        'Request feedback and testimonials',
        'Offer exclusive benefits or upgrades'
      ]
    };

    const purposes = emailPurposes[campaignType] || emailPurposes['awareness'];
    const emails = [];

    // Generate each email in the sequence
    for (let i = 0; i < numEmails; i++) {
      const emailNumber = i + 1;
      const purpose = purposes[i] || purposes[purposes.length - 1];

      const prompt = `Create a professional email for an email nurture sequence.

CAMPAIGN: ${campaignName}
EMAIL NUMBER: ${emailNumber} of ${numEmails}
PURPOSE: ${purpose}
AUDIENCE: ${audience}
KEY MESSAGES: ${keyMessages.join(', ')}

Create a 150-word email with this structure:
- Subject line (max 45 characters)
- Preview text (max 20 words)
- Headline
- Body (conversational, professional tone)
- Clear call-to-action

Make this email ${emailNumber === 1 ? 'welcoming and introductory' :
          emailNumber === numEmails ? 'action-oriented with strong CTA' :
            'educational and value-focused'}.

CRITICAL: Use this EXACT format with line breaks:

Subject: [subject line]

Preview: [preview text]

Headline: [headline]

Body: [body content]

CTA: [call to action]

Follow this format exactly with line breaks before each section.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "You are an email marketing expert. Create professional, engaging emails that drive results. Keep to 150 words total."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const emailContent = response.choices[0].message.content || '';

      emails.push({
        emailNumber: emailNumber,
        purpose: purpose,
        content: emailContent,
        sendDelay: emailNumber === 1 ? 'Immediate' : `${(emailNumber - 1) * 3} days after signup`
      });
    }

    // Format the complete nurture flow
    const nurtureFlow = `EMAIL NURTURE FLOW: ${campaignName}
Campaign Type: ${campaignType}
Target Audience: ${audience}
Total Emails: ${numEmails}

${emails.map(email => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMAIL ${email.emailNumber}: ${email.purpose}
Send Timing: ${email.sendDelay}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${email.content}

`).join('')}

IMPLEMENTATION NOTES:
• Set up automated triggers in your email platform
• Track open rates, click rates, and conversions for each email
• A/B test subject lines for optimal performance
• Consider personalizing based on recipient behavior
• Monitor unsubscribe rates and adjust timing if needed`;

    console.log("✅ Email nurture flow generated successfully");

    return res.status(200).json({
      nurtureFlow: nurtureFlow,
      emails: emails,
      campaignName: campaignName,
      totalEmails: numEmails
    });

  } catch (error) {
    console.error("❌ Email nurture flow error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      error: `Email nurture flow generation failed: ${errorMessage}`
    });
  }
}

// MAIN HANDLER FUNCTION
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  if (method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { mode, data } = body;

  console.log("🔍 API called with mode:", mode);
  if (mode === "humanize") {
    return handleContentHumanizer(data, res);
  } else if (mode === "improve") {
    return handleContentImprove(data, res);
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
  } else if (mode === "styleChecker") {
    return handleStyleChecker(data, res);
  } else if (mode === "styleFixer") {
    return handleStyleFixer(data, res);
  } else if (mode === "improve-tagline") {
    return handleTaglineImprovement(data, res);
  } else if (mode === "keywords") {
    return handleKeywordSuggestions(data, res);
  } else if (mode === "email-generation") {
    return handleEmailGeneration(data, res);
  } else if (mode === "social-media") {
    return handleSocialMediaGeneration(data, res);
    console.log("🎯 Using social media handler");
  } else if (mode === "email-nurture-flow") {
    return handleEmailNurtureFlow(data, res);
  } else {
    console.log("❌ Unknown mode:", mode);
    return res.status(400).json({ error: "Invalid mode" });
  }
}
