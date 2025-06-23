import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIStream, StreamingTextResponse } from "ai";
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

⚠️ HEADING ENFORCEMENT: All headings must follow the guide.

You are a professional magazine writer. Write a compelling 1,500-word article about: "${campaignData.name}"

STRUCTURE:
- Engaging opening (250 words)
- 4-5 substantial sections
- Strong conclusion (150 words)

TARGET AUDIENCE: ${campaignData.targetAudience}

Follow EVERY style rule listed at the top.`;
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
  } if (contentTypes.includes("blog-post") || contentTypes.includes("Blog Posts")) {
    prompt = `🚨 MANDATORY STYLE RULES - FOLLOW EXACTLY:
  ${styleInstructions}
  
  ⚠️ HEADING ENFORCEMENT: If the style guide says "upper" then ALL subheads must be COMPLETE UPPERCASE like "INTRODUCTION", not "Introduction".
  
  You are a professional magazine writer. Write a compelling 1,500-word article about: "${campaignData.name}"
  
  STRUCTURE:
  - Engaging opening (250 words)
  - 4–5 substantial sections with clear, descriptive subheadings (200–250 words each)
  - Strong conclusion (150 words)
  
  TARGET AUDIENCE: ${campaignData.targetAudience}
  Avoid cliches, such as "Imagine this"
  
  Do NOT use markdown or HTML. Format using clean, publication-ready plain text. Include paragraph breaks and rich formatting (like a magazine article). Your editor is strict—follow the style guide to the letter.`;
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
    const content: Record<string, any> = {};

    contentTypes.forEach((type: string) => {
      switch (type) {
        case "blog-post":
        case "Blog Posts":
          content[type] = {
            title: "Generated Blog Post",
            content: generatedContent,
            metaDescription: "A compelling blog post for your campaign",
            keywords: campaignData.keyMessages || [],
          };
          break;
        case "Social Posts":
          content[type] = {
            platform: "LinkedIn",
            posts: [
              {
                content: `${generatedContent.substring(0, 200)}...

${(campaignData.keyMessages || []).map((msg: string) => `#${msg.replace(/\s+/g, "")}`).join(" ")}`,
              },
            ],
          };
          break;
        case "Email Campaigns":
          content[type] = {
            subject: campaignData.name,
            preview: generatedContent.substring(0, 100),
            body: generatedContent,
          };
          break;
        default:
          content[type] = {
            title: `Generated ${type}`,
            content: generatedContent,
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
    return res.status(200).json({ content: humanizedContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ error: "Failed to humanize content" });
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
  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }
}
