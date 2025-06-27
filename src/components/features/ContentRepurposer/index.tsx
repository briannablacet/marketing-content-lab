// src/components/features/ContentRepurposer/index.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotification } from '../../../context/NotificationContext';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { useMessaging } from '../../../context/MessagingContext';
import { ArrowRight, FileText, Copy, AlertCircle, Upload, X, Sparkles } from 'lucide-react';
import FileHandler from "@/components/shared/FileHandler";
import StrategicDataService from "@/services/StrategicDataService";

const ContentRepurposer: React.FC = () => {
  const { showNotification } = useNotification();
  const { writingStyle } = useWritingStyle();
  const { brandVoice } = useBrandVoice();
  const { messaging } = useMessaging();

  const [content, setContent] = useState('');
  const [sourceFormat, setSourceFormat] = useState('Blog Post');
  const [targetFormat, setTargetFormat] = useState('Social Media');
  const [repurposedContent, setRepurposedContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleWarning, setStyleWarning] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contentStats, setContentStats] = useState<{
    originalLength: number;
    newLength: number;
    readabilityScore?: number;
  } | null>(null);
  const [uploadedContent, setUploadedContent] = useState<string>("");

  const contentFormats = [
    'Blog Post',
    'Social Media',
    'Email Newsletter',
    'Landing Page',
    'Video Script',
    'Whitepaper',
    'Case Study',
    'Press Release'
  ];

  // Check if writing style and messaging are configured
  useEffect(() => {
    const hasWritingStyle = writingStyle?.styleGuide?.primary ||
      (writingStyle?.formatting && Object.keys(writingStyle.formatting).length > 0);

    const hasBrandVoice = brandVoice?.brandVoice?.tone ||
      (brandVoice?.brandVoice?.personality && brandVoice.brandVoice.personality.length > 0);

    const hasMessaging = messaging?.valueProposition ||
      (messaging?.keyMessages && messaging.keyMessages.length > 0);

    if (!hasWritingStyle && !hasBrandVoice && !hasMessaging) {
      setStyleWarning('No Writing Style, Brand Voice, or Messaging configured. Content will use generic styling.');
    } else if (!hasWritingStyle && !hasBrandVoice) {
      setStyleWarning('No Writing Style or Brand Voice configured. Content will use generic styling.');
    } else if (!hasWritingStyle) {
      setStyleWarning('No Writing Style configured. Content will use generic styling.');
    } else if (!hasBrandVoice) {
      setStyleWarning('No Brand Voice configured. Content may not match your brand personality.');
    } else if (!hasMessaging) {
      setStyleWarning('No Messaging configured. Content may not align with your key messages.');
    } else {
      setStyleWarning(null);
    }
  }, [writingStyle, brandVoice, messaging]);

  // Update handleFileContent
  const handleFileContent = (content: string | object) => {
    if (typeof content === "string") {
      setContent(content);
    } else {
      setUploadedContent(JSON.stringify(content, null, 2));
      showNotification("Structured content loaded successfully", "success");
    }
  };

  const handleRepurpose = async () => {
    if (!content.trim()) {
      showNotification('Please enter content to repurpose', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      // Get strategic data
      const strategicData = await StrategicDataService.getAllStrategicData();

      // Prepare writing style and messaging parameters
      const styleParameters = {
        styleGuide: writingStyle?.styleGuide?.primary || 'Default',
        tone: brandVoice?.brandVoice?.tone || 'Professional',
        personality: brandVoice?.brandVoice?.personality || [],
        archetype: brandVoice?.brandVoice?.archetype || '',
        formatting: writingStyle?.formatting || {},
        punctuation: writingStyle?.punctuation || {}
      };

      const messagingParameters = {
        valueProposition: messaging?.valueProposition || '',
        keyMessages: messaging?.keyMessages || [],
        keyBenefits: messaging?.keyBenefits || [],
        targetAudience: messaging?.targetAudience || ''
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'contentRepurposer',
          data: {
            content,
            sourceFormat,
            targetFormat,
            styleGuide: styleParameters,
            messaging: messagingParameters,
            writingStyle: writingStyle || null,
            strategicData: strategicData
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to repurpose content');
      }

      const data = await response.json();

      if (data.repurposedContent) {
        // Format the content in markdown style
        let formattedContent = `# ${targetFormat}\n\n`;

        // Add metadata section
        formattedContent += `## Content Details\n\n`;
        formattedContent += `**Source Format:** ${sourceFormat}\n`;
        formattedContent += `**Target Format:** ${targetFormat}\n`;
        formattedContent += `**Style Guide:** ${styleParameters.styleGuide}\n`;
        formattedContent += `**Tone:** ${styleParameters.tone}\n\n`;

        // Add the main content
        formattedContent += `## Content\n\n${data.repurposedContent}\n\n`;

        // Add key messages if available
        if (messagingParameters.keyMessages.length > 0) {
          formattedContent += `## Key Messages\n\n`;
          messagingParameters.keyMessages.forEach((message, index) => {
            formattedContent += `${index + 1}. ${message}\n`;
          });
          formattedContent += `\n`;
        }

        // Add benefits if available
        if (messagingParameters.keyBenefits.length > 0) {
          formattedContent += `## Key Benefits\n\n`;
          messagingParameters.keyBenefits.forEach((benefit, index) => {
            formattedContent += `${index + 1}. ${benefit}\n`;
          });
          formattedContent += `\n`;
        }

        setRepurposedContent(formattedContent);

        if (data.contentStats) {
          setContentStats(data.contentStats);
        } else {
          // If the API doesn't return stats, calculate basic ones
          setContentStats({
            originalLength: content.length,
            newLength: formattedContent.length,
          });
        }
        showNotification('Content repurposed successfully! ✨', 'success');
      } else {
        throw new Error('No content returned from API');
      }
    } catch (error) {
      console.error('Error repurposing content:', error);
      showNotification(error instanceof Error ? error.message : 'Failed to repurpose content', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showNotification('Copied to clipboard', 'success'))
      .catch(() => showNotification('Failed to copy to clipboard', 'error'));
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Source Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Format Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Source Format</label>
                <select
                  value={sourceFormat}
                  onChange={(e) => setSourceFormat(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {contentFormats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div className="border-t pt-6">
                    <p className="text-sm text-gray-700 mb-4">
                    Upload File (Optional)
                    </p>
                    <FileHandler
                      onContentLoaded={handleFileContent}
                      content={uploadedContent}
                    />

                    {uploadedContent && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm">
                            Uploaded Content Preview
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setPromptText(uploadedContent); // Set the promptText
                                setActiveTab("keywords"); // Proceed to next step
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Use This
                            </button>
                            <button
                              onClick={() => setUploadedContent("")}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                          {uploadedContent}
                        </pre>
                      </div>
                    )}
                  </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste or type your content here..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Target Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Target Format Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Transform To</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {contentFormats
                    .filter(format => format !== sourceFormat)
                    .map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                </select>
              </div>

              {/* Format Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">About {targetFormat}</h4>
                {targetFormat === 'Blog Post' && (
                  <p className="text-sm text-slate-600">Blog posts are informal, conversational content pieces that explore a specific topic, typically 800-1500 words with a clear introduction, body, and conclusion.</p>
                )}
                {targetFormat === 'Social Media' && (
                  <p className="text-sm text-slate-600">Social media content is concise, engaging, and shareable. It usually includes hooks, hashtags, and calls to action optimized for the platform.</p>
                )}
                {targetFormat === 'Email Newsletter' && (
                  <p className="text-sm text-slate-600">Email newsletters are direct communications with clear sections, personal tone, and specific calls to action designed for subscriber engagement.</p>
                )}
                {targetFormat === 'Landing Page' && (
                  <p className="text-sm text-slate-600">Landing pages are focused on conversion with compelling headlines, clear value propositions, benefit statements, and strong CTAs.</p>
                )}
                {targetFormat === 'Video Script' && (
                  <p className="text-sm text-slate-600">Video scripts are written for spoken delivery with clear visual cues, shorter sentences, and dialogue-friendly language.</p>
                )}
                {targetFormat === 'Whitepaper' && (
                  <p className="text-sm text-slate-600">Whitepapers are authoritative, detailed documents that present research or solutions to specific problems with a formal tone.</p>
                )}
                {targetFormat === 'Case Study' && (
                  <p className="text-sm text-slate-600">Case studies follow a challenge-solution-results framework with specific metrics and outcomes showcasing your solution's impact.</p>
                )}
                {targetFormat === 'Press Release' && (
                  <p className="text-sm text-slate-600">Press releases follow a formal news format with a headline, dateline, lead paragraph, quotes, and boilerplate in third-person perspective.</p>
                )}
              </div>

              {/* Transformation Button */}
              <div className="mt-8">
                <button
                  onClick={handleRepurpose}
                  disabled={isProcessing || !content.trim()}
                  className="w-full p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Transforming Content...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Transform Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {repurposedContent && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              Transformed Content: {sourceFormat} → {targetFormat}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content Stats */}
            {contentStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-slate-600">Original Length</p>
                  <p className="text-2xl font-semibold">{contentStats.originalLength}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-slate-600">New Length</p>
                  <p className="text-2xl font-semibold">{contentStats.newLength}</p>
                </div>
                {contentStats.readabilityScore !== undefined && (
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-slate-600">Readability</p>
                    <p className="text-2xl font-semibold">{contentStats.readabilityScore}%</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-slate-600">Size Change</p>
                  <p className={`text-2xl font-semibold ${contentStats.newLength > contentStats.originalLength ? 'text-green-600' : 'text-blue-600'}`}>
                    {contentStats.newLength > contentStats.originalLength
                      ? `+${Math.round((contentStats.newLength / contentStats.originalLength - 1) * 100)}%`
                      : `-${Math.round((1 - contentStats.newLength / contentStats.originalLength) * 100)}%`}
                  </p>
                </div>
              </div>
            )}

            {/* Repurposed Content */}
            <div className="mb-4">
              <div className="relative">
                <div className="p-4 bg-white border rounded-lg whitespace-pre-wrap">
                  {repurposedContent}
                </div>
                <button
                  onClick={() => copyToClipboard(repurposedContent)}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm"
                  title="Copy to clipboard"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setRepurposedContent(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => copyToClipboard(repurposedContent)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Content Repurposing</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Start with comprehensive content (like blog posts or whitepapers) for the best transformation results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Content with clear structure and subheadings transforms more effectively</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Review and edit the transformed content for platform-specific optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>For best results, set up your brand voice and messaging guidelines first</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentRepurposer;