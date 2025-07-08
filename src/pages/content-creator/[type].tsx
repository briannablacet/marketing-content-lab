// src/pages/content-creator/[type].tsx


import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useNotification } from "../../context/NotificationContext";
import { useWritingStyle } from "../../context/WritingStyleContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FileHandler from "@/components/shared/FileHandler";
import KeywordSuggestions from "../../components/shared/KeywordSuggestions";
import ContentEditChat from "../../components/features/ContentEditChat";
import StrategicDataService from "../../services/StrategicDataService";
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../utils/exportUtils';

import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Download,
  MessageSquare,
  FileCheck,
  CheckCircle,
  Copy,
  Loader2,
  Share2,
} from "lucide-react";

// Content types definition
const CONTENT_TYPES = [
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog content to establish your expertise and attract organic traffic.'
  },
  {
    id: 'social-posts',
    title: 'Social Media Posts',
    description: 'Create engaging social media content that drives engagement and builds your audience.'
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Create individual email content that drives opens, clicks, and conversions for your business.'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create high-converting landing pages that turn visitors into leads and customers.'
  },
  {
    id: 'case-study',
    title: 'Case Study',
    description: 'Create compelling case studies that showcase your success stories and build credibility.'
  }
];

// Social media platforms
const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦', color: 'bg-black' },
  { value: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-blue-700' },
  { value: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-pink-600' }
];

// Clean content function for blog posts
function cleanGeneratedContent(content: string): string {
  if (!content) return content;

  let cleaned = content;
  cleaned = cleaned.replace(/^H1:\s*(.+)$/gm, '# $1');
  cleaned = cleaned.replace(/^H2:\s*(.+)$/gm, '## $1');
  cleaned = cleaned.replace(/^H3:\s*(.+)$/gm, '### $1');
  cleaned = cleaned.replace(/^Subheading:\s*(.+)$/gm, '## $1'); // ADD THIS
  cleaned = cleaned.replace(/^Strong Conclusion\s*$/gm, '## Key Takeaways');
  cleaned = cleaned.replace(/^Strong conclusion\s*$/gm, '## Key Takeaways'); // ADD THIS (lowercase)
  cleaned = cleaned.replace(/^Engaging Opening\s*$/gm, '## Introduction');
  cleaned = cleaned.replace(/^Engaging opening\s*$/gm, '## Introduction'); // ADD THIS (lowercase)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // Add this line AFTER all your existing replace statements, before the return:
  cleaned = cleaned.replace(/^([A-Z][A-Za-z\s]{15,60})$/gm, '## $1');
  return cleaned.trim();
}

// Apply heading case
function applyHeadingCase(text: string, headingCase: string): string {
  if (!headingCase) return text;

  switch (headingCase) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    default:
      return text;
  }
}

// Render formatted content
function renderFormattedContent(content: string, writingStyle: any) {
  if (!content) return null;

  const cleanedContent = cleanGeneratedContent(content);
  const lines = cleanedContent.split('\n');
  console.log("📝 First few lines on Vercel:", lines.slice(0, 5));
  const elements = [];
  let currentParagraph = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
      continue;
    }

    // Continue with the rest of your function...

    if (line.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const headingText = line.substring(2).trim();
      elements.push(
        <h1
          key={elements.length}
          className="text-3xl font-bold mb-6 mt-8 text-gray-900 leading-tight"
        >
          {applyHeadingCase(headingText, writingStyle?.formatting?.headingCase)}
        </h1>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const headingText = line.substring(3).trim();
      elements.push(
        <h2
          key={elements.length}
          className="text-2xl font-bold mb-4 mt-8 text-gray-900 leading-tight"
        >
          {applyHeadingCase(headingText, writingStyle?.formatting?.headingCase)}
        </h2>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const headingText = line.substring(4).trim();
      elements.push(
        <h3
          key={elements.length}
          className="text-lg font-semibold mb-3 mt-6 text-gray-900 leading-tight"
        >
          {applyHeadingCase(headingText, writingStyle?.formatting?.headingCase)}
        </h3>
      );
      continue;
    }

    currentParagraph.push(line);
  }

  if (currentParagraph.length > 0) {
    elements.push(
      <p key={elements.length} className="mb-4 leading-relaxed">
        {currentParagraph.join(' ')}
      </p>
    );
  }

  return <div>{elements}</div>;
}

const ContentCreatorPage = () => {
  const router = useRouter();
  const { type } = router.query;
  const { showNotification } = useNotification();
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // Main state
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState(null);
  const [promptText, setPromptText] = useState("");
  const [uploadedContent, setUploadedContent] = useState("");

  // Advanced options state
  const [advancedOptions, setAdvancedOptions] = useState({
    audience: "",
    tone: "professional",
    keywords: "",
    additionalNotes: "",
  });

  // Generated content state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");

  // Social media state
  const [socialPlatforms, setSocialPlatforms] = useState(['linkedin']);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);
  const [numSocialVariations, setNumSocialVariations] = useState(3);
  const [selectedSocialVariations, setSelectedSocialVariations] = useState({});

  // Strategic data state
  const [strategicData, setStrategicData] = useState(null);
  const [isLoadingStrategicData, setIsLoadingStrategicData] = useState(true);
  const [hasStrategicData, setHasStrategicData] = useState(false);

  // Export state
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Load content type from URL
  useEffect(() => {
    if (type && router.isReady) {
      const typeFromUrl = Array.isArray(type) ? type[0] : type;
      const foundType = CONTENT_TYPES.find((t) => t.id === typeFromUrl);

      if (foundType) {
        setContentType(foundType);
      } else {
        router.push("/content-creator");
      }
    }
  }, [type, router]);

  // Load strategic data
  useEffect(() => {
    const loadStrategicData = async () => {
      setIsLoadingStrategicData(true);
      try {
        const data = await StrategicDataService.getAllStrategicData();
        setStrategicData(data);

        const hasData = Boolean(
          data &&
          (data.isComplete ||
            (data.product?.name) ||
            (data.audiences && data.audiences.length > 0) ||
            (data.messaging?.valueProposition) ||
            (data.writingStyle?.styleGuide?.primary))
        );
        setHasStrategicData(hasData);

        if (data) {
          if (data.audiences && data.audiences.length > 0) {
            setAdvancedOptions(prev => ({
              ...prev,
              audience: data.audiences[0].name || data.audiences[0].role
            }));
          }
          if (data.brandVoice?.brandVoice?.tone) {
            setAdvancedOptions(prev => ({
              ...prev,
              tone: data.brandVoice.brandVoice.tone
            }));
          }
        }
      } catch (error) {
        console.error("Error loading strategic data:", error);
      } finally {
        setIsLoadingStrategicData(false);
      }
    };

    loadStrategicData();
  }, []);

  const handleFileContent = (content) => {
    if (typeof content === "string") {
      setUploadedContent(content);
      showNotification("File content loaded successfully", "success");
    } else {
      setUploadedContent(JSON.stringify(content, null, 2));
      showNotification("Structured content loaded successfully", "success");
    }
  };

  const handleAdvancedOptionChange = (option, value) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handlePlatformToggle = (platform) => {
    setSocialPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSocialVariationSelect = (platform, variationId) => {
    setSelectedSocialVariations(prev => ({
      ...prev,
      [platform]: variationId
    }));
  };

  const handleGenerateContent = async () => {
    if (!promptText && !uploadedContent) {
      showNotification("Please enter a prompt or upload content", "error");
      return;
    }

    setIsGenerating(true);

    try {
      const strategicDataForAPI = await StrategicDataService.getAllStrategicData();

      if (contentType?.id === 'social-posts' && socialPlatforms.length > 0) {
        // Social media generation
        const socialData = {
          content: `Topic: ${promptText || 'your topic'}\nAudience: ${advancedOptions.audience || 'general audience'}\nKeywords: ${advancedOptions.keywords || ''}`,
          platforms: socialPlatforms,
          tone: advancedOptions.tone || 'professional',
          includeHashtags: includeHashtags,
          includeEmojis: includeEmojis,
          callToAction: includeCallToAction,
          strategicData: strategicDataForAPI,
          writingStyle: writingStyle || null,
          numVariations: numSocialVariations
        };

        const response = await fetch('/api/api_endpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode: 'social-media',
            data: socialData
          }),
        });

        if (response.ok) {
          const data = await response.json();

          setGeneratedContent({
            content: "Social posts generated successfully",
            socialPosts: data.socialPosts,
            type: 'social-media'
          });
          setStep(4);
          showNotification("✨ Social posts generated successfully!", "success");
        } else {
          throw new Error('Failed to generate social media posts');
        }
      } else {
        // Regular content generation
        const payload = {
          campaignData: {
            name: promptText || "Generated Content",
            type: contentType?.id || "blog-post",
            goal: "Create engaging content. Do not use the words 'Introduction' or 'Conclusion' as headings in blog posts. Use descriptive, engaging headings instead.",
            targetAudience: advancedOptions.audience || "general audience",
            keyMessages: advancedOptions.keywords
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k),
          },
          contentTypes: [contentType?.id || "blog-post"],
          writingStyle: {
            styleGuide: {
              primary: writingStyle?.styleGuide?.primary,
              customRules: writingStyle?.styleGuide?.customRules || [],
              completed: true
            },
            formatting: {
              headingCase: writingStyle?.formatting?.headingCase,
              numberFormat: writingStyle?.formatting?.numberFormat,
              dateFormat: writingStyle?.formatting?.dateFormat,
              listStyle: writingStyle?.formatting?.listStyle
            },
            punctuation: {
              oxfordComma: writingStyle?.punctuation?.oxfordComma,
              hyphenation: writingStyle?.punctuation?.hyphenation
            },
            completed: true
          },
          strategicData: strategicDataForAPI
        };

        const response = await fetch('/api/api_endpoints', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            mode: 'enhance',
            data: payload
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate ${contentType?.title}: ${response.status}`);
        }

        const data = await response.json();
        const contentKey = contentType?.id || "blog-post";
        const content = data[contentKey];

        if (content) {
          const contentText = content.content || content;
          const cleanedContent = cleanGeneratedContent(contentText);

          setGeneratedContent(cleanedContent);
          setGeneratedTitle(content.title || "Generated Content");
          setStep(4);

          showNotification("✨ Content generated successfully!", "success");
        } else {
          throw new Error("Invalid response format from API");
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      showNotification(`Failed to generate content: ${error.message}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentUpdate = (newContent, newTitle) => {
    const cleanedContent = cleanGeneratedContent(newContent);
    // Also remove markdown asterisks from ContentEditChat results
    const finalContent = cleanedContent.replace(/\*\*(.*?)\*\*/g, '$1');
    setGeneratedContent(finalContent);
    if (newTitle && newTitle !== generatedTitle) {
      setGeneratedTitle(newTitle);
    }
    showNotification("✨ Content updated successfully!", "success");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification("Content copied to clipboard", "success");
  };

  const copySocialPost = (platform, content) => {
    navigator.clipboard.writeText(content);
    showNotification(`${platform} post copied to clipboard!`, "success");
  };

  const handleExport = (format) => {
    if (!generatedContent) {
      showNotification("No content to export", "error");
      return;
    }

    const fileName = `content-${new Date().toISOString().slice(0, 10)}`;

    try {
      const cleanContentForExport = typeof generatedContent === 'string'
        ? generatedContent.replace(/^#+\s*/gm, '')
        : generatedContent;

      switch (format) {
        case 'txt':
          exportToText(cleanContentForExport, `${fileName}.txt`);
          break;
        case 'markdown':
          exportToMarkdown(cleanContentForExport, `${fileName}.md`);
          break;
        case 'html':
          exportToHTML(cleanContentForExport, `${fileName}.html`);
          break;
        case 'pdf':
          exportToPDF(cleanContentForExport, `${fileName}.pdf`);
          break;
        case 'docx':
          exportToDocx(cleanContentForExport, `${fileName}.docx`);
          break;
        default:
          exportToText(cleanContentForExport, `${fileName}.txt`);
      }

      showNotification(`Content exported as ${format.toUpperCase()}`, "success");
      setShowExportDropdown(false);
    } catch (error) {
      console.error('Export error:', error);
      showNotification("Export failed. Please try again.", "error");
    }
  };

  // Step 1: Content Details
  const renderContentDetails = () => (
    <div className="space-y-6">
      {isStyleConfigured && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50 pb-6">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span>Using Your Style Guide Selections</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-sm text-green-700">
              Style Guide: {writingStyle?.styleGuide?.primary} •
              Headings: {writingStyle?.formatting?.headingCase === 'upper' ? 'ALL CAPS' :
                writingStyle?.formatting?.headingCase === 'lower' ? 'lowercase' :
                  writingStyle?.formatting?.headingCase === 'sentence' ? 'Sentence case' : 'Title Case'}
              {writingStyle?.punctuation?.oxfordComma !== undefined &&
                ` • Oxford Comma: ${writingStyle.punctuation.oxfordComma ? 'Used' : 'Omitted'}`}
            </div>
          </CardContent>
        </Card>
      )}

      {hasStrategicData && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50 pb-6">
            <CardTitle className="flex items-center">
              <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
              <span>Using Your Marketing Program</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-sm text-blue-700">
              {strategicData?.product?.name && `Product: ${strategicData.product.name} • `}
              {strategicData?.audiences?.[0]?.role && `Audience: ${strategicData.audiences[0].role} • `}
              {strategicData?.brandVoice?.brandVoice?.tone && `Tone: ${strategicData.brandVoice.brandVoice.tone}`}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tell me what you'd like to create</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Content Topic/Description</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-3 border rounded-lg h-32"
              placeholder={`Write a ${contentType?.title?.toLowerCase() || "content piece"} about...`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <input
              type="text"
              value={advancedOptions.audience}
              onChange={(e) => handleAdvancedOptionChange("audience", e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Who is this content for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <select
              value={advancedOptions.tone}
              onChange={(e) => handleAdvancedOptionChange("tone", e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual & Friendly</option>
              <option value="engaging">Highly Engaging</option>
              <option value="authoritative">Authoritative</option>
              <option value="conversational">Conversational</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="border-t pt-6">
            <FileHandler onContentLoaded={handleFileContent} content="" />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!promptText.trim() && !uploadedContent}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              Continue to Keywords <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 2: Keywords
  const renderKeywordsStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keywords & SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <KeywordSuggestions
            contentTopic={promptText}
            contentType={contentType?.id || "blog-post"}
            initialKeywords={advancedOptions.keywords}
            onKeywordsChange={(keywordsString) =>
              handleAdvancedOptionChange("keywords", keywordsString)
            }
            showSelectionInstructions={true}
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Continue to Options <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 3: Advanced Options
  const renderOptionsStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Instructions (optional)
            </label>
            <textarea
              value={advancedOptions.additionalNotes}
              onChange={(e) => handleAdvancedOptionChange("additionalNotes", e.target.value)}
              className="w-full p-3 border rounded-lg h-32"
              placeholder="Any specific requirements for your content? (e.g., Include statistics, focus on specific aspects, etc.)"
            />
          </div>

          {/* Enhanced Social Media Options for Social Posts */}
          {contentType?.id === 'social-posts' && (
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Share2 className="w-5 h-5 text-purple-600 mr-2" />
                  Social Media Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Select Platforms</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <button
                        key={platform.value}
                        onClick={() => handlePlatformToggle(platform.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${socialPlatforms.includes(platform.value)
                          ? 'border-purple-500 bg-purple-100 text-purple-800'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-lg mb-1">{platform.icon}</div>
                          <div>{platform.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Posts per Platform</label>
                    <select
                      value={numSocialVariations}
                      onChange={(e) => setNumSocialVariations(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={1}>1 post per platform</option>
                      <option value={2}>2 posts per platform</option>
                      <option value={3}>3 posts per platform</option>
                      <option value={4}>4 posts per platform</option>
                      <option value={5}>5 posts per platform</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Content Options</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeHashtags}
                          onChange={(e) => setIncludeHashtags(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Include hashtags</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeEmojis}
                          onChange={(e) => setIncludeEmojis(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Include emojis</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeCallToAction}
                          onChange={(e) => setIncludeCallToAction(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Include call-to-action</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Content Summary:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Topic:</strong> {promptText}</li>
              <li><strong>Audience:</strong> {advancedOptions.audience || 'General audience'}</li>
              <li><strong>Tone:</strong> {advancedOptions.tone}</li>
              {advancedOptions.keywords && (
                <li><strong>Keywords:</strong> {advancedOptions.keywords}</li>
              )}
            </ul>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Keywords
            </button>
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating || (contentType?.id === 'social-posts' && socialPlatforms.length === 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 4: Generated Content with ContentEditChat
  const renderGeneratedContent = () => (
    <div className="space-y-8">
      {/* Content Display */}
      <Card className="border-2 border-green-300">
        <CardHeader className="bg-green-50 pb-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <span>✨ Content Generated Successfully</span>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                    <button
                      onClick={() => handleExport('txt')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Plain Text (.txt)
                    </button>
                    <button
                      onClick={() => handleExport('markdown')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Markdown (.md)
                    </button>
                    <button
                      onClick={() => handleExport('html')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      HTML (.html)
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      PDF (.pdf)
                    </button>
                    <button
                      onClick={() => handleExport('docx')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Word (.docx)
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => copyToClipboard(typeof generatedContent === 'string' ? generatedContent : 'Social posts generated')}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Enhanced display for social media posts with multiple variations */}
          {generatedContent.type === 'social-media' && generatedContent.socialPosts ? (
            <div className="space-y-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-800">
                  Generated {Object.keys(generatedContent.socialPosts).length} platform{Object.keys(generatedContent.socialPosts).length > 1 ? 's' : ''} with {' '}
                  {Object.values(generatedContent.socialPosts).reduce((total, platform) => total + platform.variations.length, 0)} total variations
                </div>
              </div>

              {Object.entries(generatedContent.socialPosts).map(([platform, platformData]) => {
                const platformInfo = SOCIAL_PLATFORMS.find(p => p.value === platform) || { icon: '📱', label: platform };
                const selectedVariationId = selectedSocialVariations[platform] || 1;

                return (
                  <div key={platform} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{platformInfo.icon}</span>
                        <span className="font-medium">{platformInfo.label}</span>
                        <span className="ml-2 text-sm text-gray-600">
                          ({platformData.variations.length} variations)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const selectedVariation = platformData.variations.find(v => v.id === selectedVariationId);
                          copySocialPost(platform, selectedVariation?.content || '');
                        }}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Selected
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {platformData.variations.map((variation) => (
                        <button
                          key={variation.id}
                          onClick={() => handleSocialVariationSelect(platform, variation.id)}
                          className={`px-3 py-1 text-xs rounded-md transition-all ${selectedVariationId === variation.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-purple-100 border'
                            }`}
                        >
                          {variation.approach} ({variation.characterCount} chars)
                        </button>
                      ))}
                    </div>

                    {(() => {
                      const selectedVariation = platformData.variations.find(v => v.id === selectedVariationId);
                      return selectedVariation ? (
                        <div className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
                          {selectedVariation.content}
                        </div>
                      ) : null;
                    })()}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Regular content display */
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm" style={{
              fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              lineHeight: '1.6',
              fontSize: '11pt',
              color: '#333'
            }}>
              {renderFormattedContent(generatedContent, writingStyle)}

              <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <span>Word count: {typeof generatedContent === 'string' ? generatedContent.split(/\s+/).length : 0}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ContentEditChat Integration - only for non-social content */}
      {generatedContent.type !== 'social-media' && (
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50 pb-6">
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 text-gray-600 mr-2" />
              <span>Ask for Improvements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ContentEditChat
              originalContent={generatedContent}
              originalTitle={generatedTitle}
              contentType={contentType?.id || "content"}
              onContentUpdate={handleContentUpdate}
              strategicContext={
                hasStrategicData
                  ? {
                    productName: strategicData?.product?.name,
                    audience: strategicData?.audiences?.[0]?.role,
                    tone: strategicData?.brandVoice?.brandVoice?.tone || advancedOptions.tone,
                  }
                  : null
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Writing Style Applied Notice */}
      {isStyleConfigured && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            <span>
              Content created using {writingStyle?.styleGuide?.primary} style guide
              {writingStyle?.formatting?.headingCase === 'upper' && ' with ALL CAPS headings'}
              {writingStyle?.formatting?.numberFormat === 'numerals' && ' and numerical format'}.
            </span>
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            setGeneratedContent("");
            setStep(1);
          }}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Over
        </button>
        <button
          onClick={handleGenerateContent}
          disabled={isGenerating}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderContentDetails();
      case 2:
        return renderKeywordsStep();
      case 3:
        return renderOptionsStep();
      case 4:
        return renderGeneratedContent();
      default:
        return renderContentDetails();
    }
  };

  if (!contentType && router.isReady && type) {
    return <div className="p-8 text-center">Loading content type...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/content-creator">
          <button className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Content Types
          </button>
        </Link>
        <h1 className="text-3xl font-bold">
          {contentType?.title || "Content Creator"}
        </h1>
        <p className="text-gray-600 mt-2">{contentType?.description}</p>
      </div>

      {/* Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNum
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
                  }`}
              >
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-12 h-0.5 ${step > stepNum ? "bg-blue-600" : "bg-gray-300"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Details</span>
          <span>Keywords</span>
          <span>Options</span>
          <span>Generate</span>
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  );
};

export default ContentCreatorPage;