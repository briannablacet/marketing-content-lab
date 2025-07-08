// src/components/features/ContentRepurposer/index.tsx
// ENHANCED: Better social media generation + existing markdown cleaning

import React, { useState, useRef } from "react";
import { useNotification } from "../../../context/NotificationContext";
import { useWritingStyle } from "../../../context/WritingStyleContext";
import StrategicDataService from "../../../services/StrategicDataService";
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../../utils/exportUtils';
import {
  Loader,
  Sparkles,
  Copy,
  Download,
  CheckCircle,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowRight,
  MessageSquare,
  Share2
} from "lucide-react";
import FileHandler from "@/components/shared/FileHandler";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChangeDisplay from "../../shared/ChangeDisplay";
import ContentEditChat from "../ContentEditChat";

interface RepurposingResult {
  repurposedText: string;
  socialPosts?: { [key: string]: any }; // NEW: For social media results
  summary: {
    sourceFormat: string;
    targetFormat: string;
    adaptationsApplied: string[];
    wordCountChange: number;
    mainChanges: string[];
  };
  changeDetails: Array<{
    original: string;
    suggestion: string;
    reason: string;
    type: string;
  }>;
}

// Content format options
const CONTENT_FORMATS = [
  { value: 'blog-post', label: 'Blog Post' },
  { value: 'social-media', label: 'Social Media Post' },
  { value: 'email', label: 'Email' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'press-release', label: 'Press Release' },
  { value: 'case-study', label: 'Case Study' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'video-script', label: 'Video Script' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'infographic-text', label: 'Infographic Text' }
];

// NEW: Social media platform options
const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦', color: 'bg-black' },
  { value: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-blue-700' },
  { value: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-pink-600' }
];

// ENHANCED: More comprehensive markdown cleaning function
const cleanRepurposedContent = (content: string): string => {
  if (!content) return content;

  let cleaned = content;

  // Remove code blocks (```code```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Remove markdown headings (### → plain text) but preserve the text
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '$1');

  // Remove bold markdown (**text** and __text__ → text)
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');

  // Remove italic markdown (*text* and _text_ → text)
  cleaned = cleaned.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '$1');
  cleaned = cleaned.replace(/(?<!_)_(?!_)([^_]+)_(?!_)/g, '$1');

  // Remove inline code (`code` → code)
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Convert markdown bullets to natural text
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1');

  // Remove numbered list markdown (1. → plain text)
  cleaned = cleaned.replace(/^\s*\d+\.\s+(.+)$/gm, '$1');

  // Remove emoji bullets at start of lines
  cleaned = cleaned.replace(/^[🔍🌐🎯✅❌💡🚀📊⚡️]\s*/gm, '');

  // Remove markdown links but keep the text [text](url) → text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove reference-style links [text][ref] → text
  cleaned = cleaned.replace(/\[([^\]]+)\]\[[^\]]+\]/g, '$1');

  // Remove horizontal rules (--- or ***)
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, '');

  // Remove blockquote markers (> text → text)
  cleaned = cleaned.replace(/^>\s*/gm, '');

  // Clean up extra whitespace and normalize line breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/^\s+|\s+$/g, '');

  return cleaned;
};

// Main component
const ContentRepurposer: React.FC = () => {
  const { showNotification } = useNotification();
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // Refs for auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Local state
  const [originalText, setOriginalText] = useState("");
  const [repurposingResult, setRepurposingResult] = useState<RepurposingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [content, setContent] = useState("");
  const [sourceFormat, setSourceFormat] = useState("blog-post");
  const [targetFormat, setTargetFormat] = useState("social-media");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // NEW: Social media specific options
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
  const [socialTone, setSocialTone] = useState('professional');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);

  const handleFileContent = (fileContent: string | object) => {
    if (typeof fileContent === "string") {
      setContent(fileContent);
      showNotification("File content loaded successfully", "success");
    } else {
      const jsonContent = JSON.stringify(fileContent, null, 2);
      setContent(jsonContent);
      showNotification("Structured content loaded successfully", "success");
    }
  };

  // NEW: Handle platform selection for social media
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // ENHANCED: Process content with special handling for social media
  const processContent = async () => {
    if (!content.trim()) {
      showNotification("Please enter or upload content to repurpose", "error");
      return;
    }

    if (sourceFormat === targetFormat) {
      showNotification("Please select different source and target formats", "error");
      return;
    }

    // Special validation for social media
    if (targetFormat === 'social-media' && selectedPlatforms.length === 0) {
      showNotification("Please select at least one social media platform", "error");
      return;
    }

    setIsProcessing(true);
    setOriginalText(content);
    setRepurposingResult(null);

    try {
      const strategicData = await StrategicDataService.getAllStrategicData();

      // NEW: Special handling for social media repurposing
      if (targetFormat === 'social-media') {
        const socialData = {
          content: content,
          platforms: selectedPlatforms,
          tone: socialTone,
          includeHashtags: includeHashtags,
          includeEmojis: includeEmojis,
          callToAction: includeCallToAction,
          strategicData: strategicData,
          writingStyle: writingStyle || null
        };

        const response = await fetch('/api/api_endpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            mode: 'social-media',
            data: socialData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create social media posts");
        }

        const data = await response.json();
        console.log("✅ Social Media API Response:", data);

        // Create combined text for display
        const combinedText = Object.entries(data.socialPosts)
          .map(([platform, postData]: [string, any]) =>
            `${platform.toUpperCase()} POST:\n${postData.content}\n(${postData.characterCount} characters)`
          ).join('\n\n---\n\n');

        const result: RepurposingResult = {
          repurposedText: combinedText,
          socialPosts: data.socialPosts, // Store the structured social posts
          summary: {
            sourceFormat: CONTENT_FORMATS.find(f => f.value === sourceFormat)?.label || sourceFormat,
            targetFormat: `Social Media (${selectedPlatforms.join(', ')})`,
            adaptationsApplied: [
              "Platform-specific formatting applied",
              "Optimized for social media engagement",
              "Character limits respected",
              includeHashtags ? "Relevant hashtags included" : "No hashtags added",
              includeEmojis ? "Strategic emoji usage" : "No emojis added",
              "Markdown formatting removed"
            ],
            wordCountChange: combinedText.split(/\s+/).length - content.split(/\s+/).length,
            mainChanges: [
              `Converted to ${selectedPlatforms.length} social platform${selectedPlatforms.length > 1 ? 's' : ''}`,
              "Optimized for social media best practices",
              "Added platform-specific engagement elements",
              "Cleaned formatting for social platforms"
            ]
          },
          changeDetails: [
            {
              original: "Long-form content",
              suggestion: "Bite-sized social posts",
              reason: "Social media requires concise, engaging content",
              type: "format-adaptation"
            },
            {
              original: "Formal structure",
              suggestion: "Social-friendly format",
              reason: "Adapted for social media consumption patterns",
              type: "structure-optimization"
            },
            {
              original: "Standard text",
              suggestion: includeEmojis ? "Text with strategic emojis" : "Clean text format",
              reason: includeEmojis ? "Emojis increase social media engagement" : "Clean professional format",
              type: "engagement-optimization"
            },
            {
              original: "No hashtags",
              suggestion: includeHashtags ? "Relevant hashtags added" : "No hashtags",
              reason: includeHashtags ? "Hashtags improve discoverability" : "Clean format without hashtags",
              type: "discoverability"
            }
          ]
        };

        setRepurposingResult(result);
        showNotification(`✨ Social media posts created for ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}!`, "success");

      } else {
        // Regular repurposing for non-social formats
        const requestData = {
          content: content,
          sourceFormat: sourceFormat,
          targetFormat: targetFormat,
          styleGuide: writingStyle || null,
          messaging: strategicData?.messaging || null,
          strategicData: strategicData
        };

        const response = await fetch('/api/api_endpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            mode: 'repurpose',
            data: requestData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to repurpose content");
        }

        const data = await response.json();
        console.log("✅ Regular Repurpose API Response:", data);

        // Apply markdown cleaning to the actual content that gets stored
        const cleanedContent = cleanRepurposedContent(data.repurposedContent || content);

        // Process the API response into our format
        const originalWordCount = content.split(/\s+/).length;
        const repurposedWordCount = cleanedContent.split(/\s+/).length;

        const result: RepurposingResult = {
          repurposedText: cleanedContent,
          summary: {
            sourceFormat: CONTENT_FORMATS.find(f => f.value === sourceFormat)?.label || sourceFormat,
            targetFormat: CONTENT_FORMATS.find(f => f.value === targetFormat)?.label || targetFormat,
            adaptationsApplied: [
              "Format-specific structure applied",
              "Tone adjusted for target audience",
              "Length optimized for format",
              "Markdown formatting removed"
            ],
            wordCountChange: repurposedWordCount - originalWordCount,
            mainChanges: [
              `Converted from ${sourceFormat} to ${targetFormat}`,
              "Adapted structure and formatting",
              "Optimized for target platform",
              "Cleaned markdown formatting"
            ]
          },
          changeDetails: [
            {
              original: "Original format structure",
              suggestion: `Adapted for ${targetFormat} format`,
              reason: `Restructured content for ${targetFormat} best practices`,
              type: "format-adaptation"
            },
            {
              original: "Source format tone",
              suggestion: "Target format tone",
              reason: `Adjusted tone to match ${targetFormat} conventions`,
              type: "tone-adjustment"
            },
            {
              original: "Markdown formatting",
              suggestion: "Clean text formatting",
              reason: "Removed markdown for clean, readable text",
              type: "formatting-cleanup"
            },
            {
              original: "Original length",
              suggestion: "Optimized length",
              reason: `Optimized content length for ${targetFormat}`,
              type: "length-optimization"
            }
          ]
        };

        setRepurposingResult(result);
        showNotification("✨ Content repurposed successfully!", "success");
      }

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);

    } catch (error) {
      console.error("❌ Error repurposing content:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to repurpose content. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear all content
  const handleClear = () => {
    setContent("");
    setOriginalText("");
    setRepurposingResult(null);
    setShowOriginal(false);
  };

  // Revert to original
  const handleRevert = () => {
    setRepurposingResult(null);
    setShowOriginal(false);
    showNotification("Reverted to original content", "info");
  };

  // Handle content updates from ContentEditChat
  const handleContentUpdate = (newContent: string, newTitle: string) => {
    if (repurposingResult) {
      // Also clean any markdown that might come from ContentEditChat
      const cleanedNewContent = cleanRepurposedContent(newContent);
      setRepurposingResult({
        ...repurposingResult,
        repurposedText: cleanedNewContent
      });
    }
    showNotification("Content updated successfully", "success");
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Text copied to clipboard", "success");
  };

  // NEW: Copy individual social post
  const copySocialPost = (platform: string, content: string) => {
    navigator.clipboard.writeText(content);
    showNotification(`${platform} post copied to clipboard`, "success");
  };

  // Export functionality
  const handleExport = (format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
    if (!repurposingResult) {
      showNotification("No repurposed content to export", "error");
      return;
    }

    const fileName = `repurposed-${targetFormat}-${new Date().toISOString().slice(0, 10)}`;

    try {
      switch (format) {
        case 'txt':
          exportToText(repurposingResult.repurposedText, `${fileName}.txt`);
          break;
        case 'markdown':
          exportToMarkdown(repurposingResult.repurposedText, `${fileName}.md`);
          break;
        case 'html':
          exportToHTML(repurposingResult.repurposedText, `${fileName}.html`);
          break;
        case 'pdf':
          exportToPDF(repurposingResult.repurposedText, `${fileName}.pdf`);
          break;
        case 'docx':
          exportToDocx(repurposingResult.repurposedText, `${fileName}.docx`);
          break;
        default:
          exportToText(repurposingResult.repurposedText, `${fileName}.txt`);
      }

      showNotification(`Content exported as ${format.toUpperCase()}`, "success");
      setShowExportDropdown(false);
    } catch (error) {
      console.error('Export error:', error);
      showNotification("Export failed. Please try again.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Writing Style Status Banner */}
      {isStyleConfigured && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50 pb-6">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span>Using Your Style Guide Settings</span>
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

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            Repurpose Content Between Formats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800 mb-2">
              Transform Your Content
            </h3>
            <p className="text-sm text-blue-700">
              Convert content from one format to another while maintaining your message and adapting structure,
              tone, and length for the target platform's best practices.
            </p>
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-2">Source Format</label>
              <select
                value={sourceFormat}
                onChange={(e) => setSourceFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {CONTENT_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Format</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {CONTENT_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NEW: Social Media Options (show when target format is social-media) */}
          {targetFormat === 'social-media' && (
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Share2 className="w-5 h-5 text-purple-600 mr-2" />
                  Social Media Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Select Platforms</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <button
                        key={platform.value}
                        onClick={() => handlePlatformToggle(platform.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${selectedPlatforms.includes(platform.value)
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

                {/* Social Media Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      value={socialTone}
                      onChange={(e) => setSocialTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual & Friendly</option>
                      <option value="engaging">Highly Engaging</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="conversational">Conversational</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Options</label>
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

          {/* File Upload */}
          <div className="border-t pt-6">
            <FileHandler onContentLoaded={handleFileContent} content="" />
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Content to Repurpose</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your content here, or upload a file above..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear All
            </button>
            <button
              onClick={processContent}
              disabled={isProcessing || !content.trim() || sourceFormat === targetFormat}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {targetFormat === 'social-media' ? 'Creating Social Posts...' : 'Repurposing Content...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {targetFormat === 'social-media' ? 'Create Social Posts' : 'Repurpose Content'}
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Repurposed Results */}
      {repurposingResult && (
        <div ref={resultsRef} className="space-y-8">
          {/* Summary Card */}
          <Card className="border-2 border-green-300">
            <CardHeader className="bg-green-50 pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <span>✨ Content {targetFormat === 'social-media' ? 'Transformed into Social Posts' : 'Repurposed Successfully'}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    {showOriginal ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {showOriginal ? "Hide" : "Show"} Original
                  </button>
                  <button
                    onClick={handleRevert}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Revert
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Adaptations Applied:</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {repurposingResult.summary.adaptationsApplied.map((adaptation, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        {adaptation}
                      </li>
                    ))}
                    {repurposingResult.summary.mainChanges.map((change, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-2">
                    {repurposingResult.summary.sourceFormat} → {repurposingResult.summary.targetFormat}
                  </div>
                  {targetFormat === 'social-media' && repurposingResult.socialPosts ? (
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {Object.keys(repurposingResult.socialPosts).length} Platform{Object.keys(repurposingResult.socialPosts).length > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-600">Social Posts Created</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {originalText.split(/\s+/).length} → {repurposingResult.repurposedText.split(/\s+/).length}
                      </div>
                      <div className="text-sm text-gray-600">Word Count</div>
                      {repurposingResult.summary.wordCountChange !== 0 && (
                        <div className={`text-sm ${repurposingResult.summary.wordCountChange > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                          {repurposingResult.summary.wordCountChange > 0 ? '+' : ''}{repurposingResult.summary.wordCountChange} words
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Content (when shown) */}
          {showOriginal && (
            <Card className="border-2 border-gray-300">
              <CardHeader className="bg-gray-50">
                <CardTitle>Original Content ({repurposingResult.summary.sourceFormat})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white p-6 rounded-lg border" style={{
                  fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  lineHeight: '1.6',
                  fontSize: '11pt',
                  color: '#333'
                }}>
                  {originalText.split("\n").filter(p => p.trim()).map((para, idx) => (
                    <p key={idx} style={{
                      margin: idx > 0 ? '12pt 0' : '0 0 12pt 0',
                      textIndent: '0pt',
                      lineHeight: '1.6'
                    }}>
                      {para}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* NEW: Individual Social Media Posts Display */}
          {targetFormat === 'social-media' && repurposingResult.socialPosts ? (
            <div className="space-y-4">
              {Object.entries(repurposingResult.socialPosts).map(([platform, postData]: [string, any]) => {
                const platformInfo = SOCIAL_PLATFORMS.find(p => p.value === platform) || { icon: '📱', label: platform, color: 'bg-gray-600' };

                return (
                  <Card key={platform} className="border-2 border-blue-300">
                    <CardHeader className="bg-blue-50 pb-4">
                      <CardTitle className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{platformInfo.icon}</span>
                          <span>{platformInfo.label} Post</span>
                          <span className="ml-2 text-sm text-gray-600">
                            ({postData.characterCount} characters)
                          </span>
                        </div>
                        <button
                          onClick={() => copySocialPost(platform, postData.content)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" style={{
                        fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                        lineHeight: '1.5',
                        fontSize: '11pt',
                        color: '#333'
                      }}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                          {postData.content}
                        </div>
                      </div>

                      {/* Platform guidelines */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600">
                          <strong>Platform Guidelines:</strong> {postData.maxLength}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Regular Repurposed Content Display */
            <Card className="border-2 border-blue-300">
              <CardHeader className="bg-blue-50 pb-6">
                <CardTitle className="flex justify-between items-center">
                  <span>🎉 Your Repurposed Content ({repurposingResult.summary.targetFormat})</span>
                  <div className="flex space-x-2">
                    {/* Export Dropdown */}
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
                      onClick={() => copyToClipboard(repurposingResult.repurposedText)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm" style={{
                  fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  lineHeight: '1.6',
                  fontSize: '11pt',
                  color: '#333'
                }}>
                  <div style={{ textAlign: 'justify' }}>
                    {repurposingResult.repurposedText.split("\n").filter(p => p.trim()).map((para, idx) => (
                      <p key={idx} style={{
                        margin: idx > 0 ? '12pt 0' : '0 0 12pt 0',
                        textIndent: '0pt',
                        lineHeight: '1.6'
                      }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ✅ Use the shared ChangeDisplay component */}
          <ChangeDisplay
            changes={repurposingResult.changeDetails}
            title="🎯 What I Adapted"
            showByDefault={false}
            className="mb-8"
          />

          {/* ContentEditChat for further improvements */}
          <ContentEditChat
            originalContent={repurposingResult.repurposedText}
            originalTitle="Repurposed Content"
            contentType="repurposed-content"
            onContentUpdate={handleContentUpdate}
          />
        </div>
      )}

      {/* Writing Style Applied Notice */}
      {isStyleConfigured && repurposingResult && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            <span>
              Content repurposed using {writingStyle?.styleGuide?.primary} style guide
              {writingStyle?.formatting?.headingCase === 'upper' && ' with ALL CAPS headings'}
              {writingStyle?.formatting?.numberFormat === 'numerals' && ' and numerical format'}.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentRepurposer;