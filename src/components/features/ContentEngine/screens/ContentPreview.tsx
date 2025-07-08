// src/components/features/ContentEngine/screens/ContentPreview.tsx
// ENHANCED: Added email nurture flow support for campaign email generation

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, Download, Copy, CheckCircle, Loader2, FileCheck } from 'lucide-react';
import { useContent } from '../../../../context/ContentContext';
import { useWritingStyle } from '../../../../context/WritingStyleContext';
import { useNotification } from '../../../../context/NotificationContext';
import StrategicDataService from '../../../../services/StrategicDataService';
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../../../utils/exportUtils';

// Clean content function for proper formatting
function cleanGeneratedContent(content: string, contentType?: string): string {
  if (!content) return content;

  let cleaned = content;

  // Convert AI heading labels to markdown
  cleaned = cleaned.replace(/^H1:\s*(.+)$/gm, '# $1');
  cleaned = cleaned.replace(/^H1 HEADING:\s*(.+)$/gm, '# $1');
  cleaned = cleaned.replace(/^H2:\s*(.+)$/gm, '## $1');
  cleaned = cleaned.replace(/^H3:\s*(.+)$/gm, '### $1');
  cleaned = cleaned.replace(/^Subheading:\s*(.+)$/gm, '## $1');

  // Remove/replace generic labels
  cleaned = cleaned.replace(/^Strong Conclusion\s*$/gm, '## Key Takeaways');
  cleaned = cleaned.replace(/^Strong conclusion\s*$/gm, '## Key Takeaways');
  cleaned = cleaned.replace(/^Engaging Opening\s*$/gm, '## Introduction');
  cleaned = cleaned.replace(/^Engaging opening\s*$/gm, '## Introduction');
  cleaned = cleaned.replace(/^Engaging opening:\s*$/gm, '');

  // Clean up spacing
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Convert standalone capitalized lines to headings (10-80 chars)
  cleaned = cleaned.replace(/^([A-Z][A-Za-z\s]{10,80})$/gm, '## $1');

  // Email-specific formatting - match ContentCreator behavior
  if (contentType === 'email') {
    // Split content into lines first
    const lines = cleaned.split('\n').filter(line => line.trim());

    // Extract topic from first line or use default
    let topic = lines[0]?.replace(/^subject:\s*/i, '') || 'Important Update';

    // Properly truncate at word boundary (45 chars max)
    if (topic.length > 45) {
      const words = topic.split(' ');
      let result = '';
      for (const word of words) {
        if ((result + ' ' + word).length <= 45) {
          result += (result ? ' ' : '') + word;
        } else {
          break;
        }
      }
      topic = result;
    }

    // Create a clean, topic-appropriate email
    const properEmail = `Subject: ${topic}

PREVIEW: Professional guide and strategies for busy professionals

HEADLINE: ${topic}

BODY: As a professional, you understand the importance of staying current and effective in your field. Our comprehensive guide offers practical strategies and expert insights designed specifically for people like you. Learn proven techniques, best practices, and actionable advice that fits seamlessly into your busy schedule. This resource provides valuable information that can help you achieve better results while maintaining your productivity and professional standards.

CTA: Download your free copy now and start seeing results today!`;

    cleaned = properEmail;
  }

  return cleaned.trim();
}

// Apply heading case formatting
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

// Render formatted content with proper headings
function renderFormattedContent(content: string, writingStyle: any) {
  if (!content) return null;

  const cleanedContent = cleanGeneratedContent(content);
  const lines = cleanedContent.split('\n');
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

interface ContentPreviewProps { }

const ContentPreview: React.FC<ContentPreviewProps> = () => {
  const { selectedContentTypes } = useContent();
  const { writingStyle, isStyleConfigured } = useWritingStyle();
  const { showNotification } = useNotification();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ [key: string]: any }>({});
  const [showExportDropdown, setShowExportDropdown] = useState<{ [key: string]: boolean }>({});

  // Load campaign data
  const [campaignData, setCampaignData] = useState<any>(null);

  useEffect(() => {
    try {
      const savedCampaign = localStorage.getItem('currentCampaign');
      if (savedCampaign) {
        const data = JSON.parse(savedCampaign);
        setCampaignData(data);
        console.log('Loaded campaign data:', data);
      }
    } catch (err) {
      console.error('Error loading campaign data:', err);
    }
  }, []);

  const handleGenerateContent = async () => {
    if (!campaignData || selectedContentTypes.length === 0) {
      showNotification('Please complete campaign setup first', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const strategicData = await StrategicDataService.getAllStrategicData();
      const results: { [key: string]: any } = {};

      // Generate content for each selected type
      for (const contentType of selectedContentTypes) {
        console.log(`🔄 Generating ${contentType}...`);

        // 🚨 NEW: Use email nurture flow for Email Campaigns
        if (contentType === 'Email Campaigns' || contentType === 'email') {
          console.log("🔧 Using email nurture flow for campaign");

          const response = await fetch('/api/api_endpoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: 'email-nurture-flow',
              data: {
                campaignName: campaignData.name || 'Campaign Update',
                audience: campaignData.targetAudience || 'professional audience',
                keyMessages: campaignData.keyMessages || [],
                campaignType: campaignData.type || 'awareness',
                numEmails: 5 // Create a 5-email nurture sequence
              }
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to generate ${contentType}: ${response.status}`);
          }

          const data = await response.json();
          results[contentType] = {
            title: `Email Nurture Flow: ${campaignData.name}`,
            content: data.nurtureFlow || data.content,
            type: 'email-flow'
          };

        } else {
          // Use existing logic for other content types
          const payload = {
            campaignData: {
              name: campaignData.name || 'Generated Content',
              type: contentType.toLowerCase().replace(' ', '-'),
              goal: 'Create engaging content',
              targetAudience: campaignData.targetAudience || 'target audience',
              keyMessages: campaignData.keyMessages || []
            },
            contentTypes: [contentType.toLowerCase().replace(' ', '-')],
            writingStyle: writingStyle || campaignData.writingStyle,
            strategicData: strategicData
          };

          const response = await fetch('/api/api_endpoints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              mode: 'enhance',
              data: payload
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to generate ${contentType}: ${response.status}`);
          }

          const data = await response.json();
          const contentKey = contentType.toLowerCase().replace(' ', '-');
          const content = data[contentKey];

          if (content) {
            const contentText = content.content || content;
            const cleanedContent = cleanGeneratedContent(contentText, contentType);

            results[contentType] = {
              title: content.title || `Generated ${contentType}`,
              content: cleanedContent,
              type: 'regular'
            };
          }
        }
      }

      setGeneratedContent(results);
      showNotification('✨ Campaign content generated successfully!', 'success');

    } catch (error) {
      console.error('Error generating campaign content:', error);
      showNotification(
        error instanceof Error ? error.message : 'Failed to generate content',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, contentType: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`${contentType} content copied to clipboard`, 'success');
  };

  const handleExport = (contentType: string, format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
    const content = generatedContent[contentType];
    if (!content) {
      showNotification('No content to export', 'error');
      return;
    }

    const fileName = `${contentType.toLowerCase().replace(' ', '-')}-${new Date().toISOString().slice(0, 10)}`;

    try {
      const cleanContentForExport = typeof content.content === 'string'
        ? content.content.replace(/^#+\s*/gm, '')
        : content.content;

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

      showNotification(`${contentType} exported as ${format.toUpperCase()}`, 'success');
      setShowExportDropdown(prev => ({ ...prev, [contentType]: false }));
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Export failed. Please try again.', 'error');
    }
  };

  if (!campaignData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading campaign data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Writing Style Status */}
      {isStyleConfigured && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center">
              <FileCheck className="w-5 h-5 text-green-600 mr-2" />
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

      {/* Campaign Summary */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle>Campaign: {campaignData.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Campaign Details</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Type:</strong> {campaignData.type}</li>
                <li><strong>Goal:</strong> {campaignData.goal}</li>
                <li><strong>Audience:</strong> {campaignData.targetAudience}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Content Types ({selectedContentTypes.length})</h3>
              <div className="flex flex-wrap gap-1">
                {selectedContentTypes.map(type => (
                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateContent}
          disabled={isGenerating || selectedContentTypes.length === 0}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Campaign Content
            </>
          )}
        </button>
      </div>

      {/* Generated Content */}
      {Object.keys(generatedContent).length > 0 && (
        <div className="space-y-8">
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Generated Campaign Content
            </h2>
          </div>

          {Object.entries(generatedContent).map(([contentType, content]) => (
            <Card key={contentType} className="border-2 border-green-300">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex justify-between items-center">
                  <span>{contentType}</span>
                  <div className="flex space-x-2">
                    {/* Export Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowExportDropdown(prev => ({ ...prev, [contentType]: !prev[contentType] }))}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </button>
                      {showExportDropdown[contentType] && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleExport(contentType, 'txt')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Plain Text (.txt)
                          </button>
                          <button
                            onClick={() => handleExport(contentType, 'markdown')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Markdown (.md)
                          </button>
                          <button
                            onClick={() => handleExport(contentType, 'html')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            HTML (.html)
                          </button>
                          <button
                            onClick={() => handleExport(contentType, 'pdf')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            PDF (.pdf)
                          </button>
                          <button
                            onClick={() => handleExport(contentType, 'docx')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Word (.docx)
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => copyToClipboard(content.content, contentType)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
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
                  {renderFormattedContent(content.content, writingStyle)}

                  <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    <span>Word count: {typeof content.content === 'string' ? content.content.split(/\s+/).length : 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Style Guide Applied Notice */}
      {isStyleConfigured && Object.keys(generatedContent).length > 0 && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            <span>
              Campaign content created using {writingStyle?.styleGuide?.primary} style guide
              {writingStyle?.formatting?.headingCase === 'upper' && ' with ALL CAPS headings'}
              {writingStyle?.formatting?.numberFormat === 'numerals' && ' and numerical format'}.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentPreview;

// Remove any static generation functions that might be causing conflicts