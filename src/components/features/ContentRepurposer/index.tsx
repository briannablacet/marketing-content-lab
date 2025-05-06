// src/components/features/ContentRepurposer/index.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotification } from '../../../context/NotificationContext';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useMessaging } from '../../../context/MessagingContext';
import { ArrowRight, FileText, Copy, AlertCircle, Upload, X, Sparkles } from 'lucide-react';

const ContentRepurposer: React.FC = () => {
  const { showNotification } = useNotification();
  const { writingStyle } = useWritingStyle();
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
    
    const hasMessaging = messaging?.valueProposition || 
                        (messaging?.keyMessages && messaging.keyMessages.length > 0);
    
    if (!hasWritingStyle && !hasMessaging) {
      setStyleWarning('No Writing Style or Messaging configured. Content will use generic styling.');
    } else if (!hasWritingStyle) {
      setStyleWarning('No Writing Style configured. Content will use generic styling.');
    } else if (!hasMessaging) {
      setStyleWarning('No Messaging configured. Content may not align with your key messages.');
    } else {
      setStyleWarning(null);
    }
  }, [writingStyle, messaging]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 5) { // 5MB
      showNotification('File too large. Please select a file under 5MB.', 'error');
      return;
    }

    try {
      setSelectedFile(file);
      const text = await file.text();
      setContent(text);
      showNotification('File uploaded successfully', 'success');
    } catch (err) {
      showNotification('Error reading file', 'error');
      console.error('Error reading file:', err);
    }
  };

  const handleRepurpose = async () => {
    if (!content.trim()) {
      showNotification('Please enter content to repurpose', 'warning');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare writing style and messaging parameters
      const styleParameters = {
        styleGuide: writingStyle?.styleGuide?.primary || 'Default',
        tone: writingStyle?.brandVoice?.tone || 'Professional',
        formatting: writingStyle?.formatting || {},
        punctuation: writingStyle?.punctuation || {}
      };
      
      const messagingParameters = {
        valueProposition: messaging?.valueProposition || '',
        keyMessages: messaging?.keyMessages || [],
        keyBenefits: messaging?.keyBenefits || [],
        targetAudience: messaging?.targetAudience || ''
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'content-repurposer',
          data: {
            content,
            sourceFormat,
            targetFormat,
            styleGuide: styleParameters,
            messaging: messagingParameters
          }
        }),
      });

      const data = await response.json();

      if (data.repurposedContent) {
        setRepurposedContent(data.repurposedContent);
        if (data.contentStats) {
          setContentStats(data.contentStats);
        } else {
          // If the API doesn't return stats, calculate basic ones
          setContentStats({
            originalLength: content.length,
            newLength: data.repurposedContent.length,
          });
        }
        showNotification('Content repurposed successfully', 'success');
      } else {
        throw new Error('No content returned from API');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to repurpose content', 'error');
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
      {/* Style Warning Alert */}
      {styleWarning && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-700">{styleWarning}</p>
            <p className="text-sm text-yellow-600 mt-1">
              Consider setting up your <a href="/writing-style" className="underline">Writing Style</a> and <a href="/messaging" className="underline">Messaging</a> first.
            </p>
          </div>
        </div>
      )}
      
      {/* AI Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium mb-2 flex items-center">
          <span className="text-2xl mr-2">✨</span>
          AI Insights
        </h3>
        <ul className="space-y-2">
          {[
            "Repurposing existing content can save up to 60% of content creation time",
            "Each format has unique requirements the AI will automatically adapt to",
            writingStyle?.styleGuide?.primary 
              ? `Using your "${writingStyle.styleGuide.primary}" style guide for consistent brand voice` 
              : "Your brand voice will be preserved across all content versions"
          ].map((insight, index) => (
            <li key={index} className="text-sm text-slate-700 flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>
      
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
              <div>
                <label className="block text-sm font-medium mb-2">Upload File (Optional)</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
                    <Upload className="w-5 h-5 mr-2" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt,.doc,.docx,.md,.html"
                    />
                  </label>
                  {selectedFile && (
                    <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                      <button 
                        onClick={clearFile}
                        className="ml-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
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