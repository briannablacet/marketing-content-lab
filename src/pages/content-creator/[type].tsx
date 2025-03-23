// src/pages/content-creator/[type].tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NotificationProvider } from '../../context/NotificationContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { MessagingProvider } from '../../context/MessagingContext';
import { useNotification } from '../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../../components/shared/UIComponents';
import FileHandler from '../../components/shared/FileHandler';
import StyleGuideNotificationBanner from '../../components/features/StyleGuideNotificationBanner';
// THIS IS THE FIX: The exact format of CONTENT_TYPES might be different than expected
// Let's define our own content types directly in this file for now
// import { CONTENT_TYPES } from '../../data/contentTypesData';
import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  Edit,
  Save,
  FileText,
  MessageSquare,
  Upload,
  Info,
  Settings
} from 'lucide-react';

// Define content types directly in this file to ensure proper format
const CONTENT_TYPES = [
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog content to establish your expertise and attract organic traffic.'
  },
  {
    id: 'social',
    title: 'Social Media Posts',
    description: 'Create engaging social media content that drives engagement and builds your audience.'
  },
  {
    id: 'email',
    title: 'Email Campaign',
    description: 'Create email content that drives opens, clicks, and conversions for your business.'
  },
  {
    id: 'case-study',
    title: 'Case Study',
    description: 'Create compelling case studies that showcase your success stories and build credibility.'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create high-converting landing pages that turn visitors into leads and customers.'
  },
  {
    id: 'video-script',
    title: 'Video Script',
    description: 'Create compelling video scripts that engage viewers and deliver your message effectively.'
  },
  {
    id: 'whitepaper',
    title: 'Whitepaper',
    description: 'Create authoritative whitepapers that position your brand as an industry leader.'
  }
];

const ContentCreatorPage: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;
  const { showNotification } = useNotification();
  
  // State for content information
  const [contentType, setContentType] = useState<any>(null);
  
  // New simplified state for user inputs - just a prompt and uploaded content
  const [promptText, setPromptText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  
  // State for advanced options - hidden by default
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    audience: '',
    tone: 'professional',
    keywords: '',
    additionalNotes: ''
  });
  
  // State for generated content
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null);
  
  // State for UI guidance
  const [showGuidanceCard, setShowGuidanceCard] = useState(true);
  
  // Load content type from URL parameter
  useEffect(() => {
    if (type) {
      // Find content type info based on URL parameter
      const typeFromUrl = Array.isArray(type) ? type[0] : type;
      const foundType = CONTENT_TYPES.find(t => t.id === typeFromUrl);
      
      if (foundType) {
        setContentType(foundType);
      } else {
        // If content type isn't found, redirect to content creator page
        router.push('/content-creator');
      }
    }
  }, [type, router]);

  // Handle file upload via the FileHandler component
  const handleFileContent = (content: string | object) => {
    if (typeof content === 'string') {
      setUploadedContent(content);
      showNotification('success', 'File content loaded successfully');
    } else {
      // If it's JSON or structured data, convert to string for display
      setUploadedContent(JSON.stringify(content, null, 2));
      showNotification('success', 'Structured content loaded successfully');
    }
  };

  // Handle changes in advanced options
  const handleAdvancedOptionChange = (option: string, value: string) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Handle content generation
  const handleGenerateContent = async () => {
    // Validate that we have either prompt text or uploaded content
    if (!promptText && !uploadedContent) {
      showNotification('error', 'Please enter a prompt or upload content');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Prepare request payload
      const payload = {
        endpoint: 'generate-content',
        data: {
          contentType: contentType?.id || 'blog-post',
          prompt: promptText,
          sourceContent: uploadedContent,
          parameters: {
            tone: advancedOptions.tone,
            audience: advancedOptions.audience,
            keywords: advancedOptions.keywords.split(',').map(k => k.trim()).filter(k => k),
            additionalNotes: advancedOptions.additionalNotes
          }
        }
      };
      
      // Call API
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the generated content
      if (data.content) {
        setGeneratedContent(data.content);
        
        if (data.title) {
          setGeneratedTitle(data.title);
        } else {
          // Extract first line as title if not provided
          const firstLine = data.content.split('\n')[0].replace(/^#\s*/, '');
          setGeneratedTitle(firstLine || 'Generated Content');
        }
        
        // Set metadata if available
        if (data.metadata) {
          setGeneratedMetadata(data.metadata);
        } else {
          // Generate basic metadata
          setGeneratedMetadata({
            title: data.title || 'Generated Content',
            description: data.content.substring(0, 160),
            keywords: advancedOptions.keywords.split(',').map(k => k.trim()).filter(k => k)
          });
        }
        
        showNotification('success', 'Content generated successfully!');
      } else {
        throw new Error('No content returned from API');
      }
    } catch (error) {
      console.error(`Error generating content:`, error);
      showNotification('error', 'Failed to generate content. Please try again.');
      
      // Generate fallback content for demo/development purposes
      const mockTitle = `Sample ${contentType?.title || 'Content'}`;
      const mockContent = [
        `# ${mockTitle}`,
        '',
        `This is a sample ${contentType?.title?.toLowerCase() || 'content'} ${promptText ? `about "${promptText}"` : ''}.`,
        '',
        '## Introduction',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        '',
        '## Main Point 1',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        '',
        '## Main Point 2',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        '',
        '## Conclusion',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      ].join('\n');
      
      setGeneratedTitle(mockTitle);
      setGeneratedContent(mockContent);
      setGeneratedMetadata({
        title: mockTitle,
        description: 'This is a sample meta description for the generated content.',
        keywords: ['sample', 'content', 'demo']
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle exporting content as a file
  const handleExportContent = (format = 'markdown') => {
    if (!generatedContent) {
      showNotification('error', 'No content to export');
      return;
    }
    
    // Create a file name based on the title
    const sanitizedTitle = generatedTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
      
    const fileName = `${sanitizedTitle}-${new Date().toISOString().slice(0, 10)}`;
    
    // Create content based on format
    let fileContent = generatedContent;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    switch (format) {
      case 'markdown':
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'html':
        mimeType = 'text/html';
        extension = 'html';
        // Simple markdown to HTML conversion for demonstration
        fileContent = `<!DOCTYPE html>
<html>
<head>
  <title>${generatedTitle}</title>
  <meta name="description" content="${generatedMetadata?.description || ''}">
  <meta name="keywords" content="${generatedMetadata?.keywords?.join(', ') || ''}">
</head>
<body>
  <article>
    ${generatedContent
      .replace(/# (.*)\n/g, '<h1>$1</h1>\n')
      .replace(/## (.*)\n/g, '<h2>$1</h2>\n')
      .replace(/### (.*)\n/g, '<h3>$1</h3>\n')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
    }
  </article>
</body>
</html>`;
        break;
      case 'text':
      default:
        // Use defaults
        break;
    }
    
    // Create a blob and download it
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('success', `Content exported as ${extension.toUpperCase()}`);
  };
  
  // Save content to library
  const handleSaveToLibrary = () => {
    if (!generatedContent) {
      showNotification('error', 'No content to save');
      return;
    }
    
    // In a real implementation, you would save to a database
    // For now, we'll just save to localStorage
    
    const savedContent = {
      id: Date.now(),
      title: generatedTitle,
      content: generatedContent,
      metadata: generatedMetadata,
      contentType: contentType?.title,
      createdAt: new Date().toISOString()
    };
    
    try {
      // Get existing content library or initialize a new one
      const existingLibrary = localStorage.getItem('contentLibrary');
      const library = existingLibrary ? JSON.parse(existingLibrary) : [];
      
      // Add new content
      library.push(savedContent);
      
      // Save back to localStorage
      localStorage.setItem('contentLibrary', JSON.stringify(library));
      
      showNotification('success', 'Content saved to library successfully');
    } catch (error) {
      console.error('Error saving to library:', error);
      showNotification('error', 'Failed to save to library');
    }
  };

  // Parse the markdown content for display
  const parseMarkdown = (markdown) => {
    if (!markdown) return { title: '', introduction: '', sections: [] };
    
    const lines = markdown.split('\n');
    let title = '';
    let introduction = '';
    const sections = [];
    
    let currentSection = { title: '', content: '' };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Get title (# Heading)
      if (line.startsWith('# ') && !title) {
        title = line.substring(2).trim();
        continue;
      }
      
      // Get sections (## Heading)
      if (line.startsWith('## ')) {
        if (currentSection.title) {
          sections.push({...currentSection});
        }
        currentSection = { 
          title: line.substring(3).trim(), 
          content: '' 
        };
        continue;
      }
      
      // If we haven't found a section yet, this is part of the introduction
      if (sections.length === 0 && !currentSection.title && line.trim() && !line.startsWith('#')) {
        introduction += line + '\n';
      }
      
      // Add content to current section
      if (currentSection.title && !line.startsWith('#')) {
        currentSection.content += line + '\n';
      }
    }
    
    // Add the last section if it exists
    if (currentSection.title) {
      sections.push(currentSection);
    }
    
    return { title, introduction: introduction.trim(), sections };
  };

  // If content type is not loaded yet, show loading
  if (!contentType && router.isReady && type) {
    return <div className="p-8 text-center">Loading content type...</div>;
  }
  
  // Parse the generated content for display
  const parsedContent = parseMarkdown(generatedContent);
  
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MessagingProvider>
          <StyleGuideNotificationBanner />
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link href="/content-creator">
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to content types
                </button>
              </Link>
            </div>
            
            {/* Content Type Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Create {contentType?.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {contentType?.description || 'Turn your ideas into engaging content'}
              </p>
            </div>
            
            {/* Input Form - Only show if no content is generated yet */}
            {!generatedContent && (
              <>
                {/* NEW: Guidance Card */}
                {showGuidanceCard && (
                  <Card className="mb-6 border-2 border-blue-200 overflow-hidden">
                    <CardHeader className="bg-blue-50 border-b">
                      <CardTitle className="flex items-center">
                        <Info className="w-5 h-5 text-blue-600 mr-2" />
                        <span>How to Create Content</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="p-4 mb-3 bg-blue-100 rounded-full">
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="font-medium mb-2">Option 1: Prompt</h3>
                          <p className="text-sm text-gray-600">
                            Describe what you want the AI to create. Be specific for best results.
                          </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <div className="p-4 mb-3 bg-blue-100 rounded-full">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="font-medium mb-2">Option 2: Upload</h3>
                          <p className="text-sm text-gray-600">
                            Alternatively, upload existing notes or a document to use as a starting point.
                          </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <div className="p-4 mb-3 bg-blue-100 rounded-full">
                            <Settings className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="font-medium mb-2">Additional Options</h3>
                          <p className="text-sm text-gray-600">
                            Click "Show Additional Options" to fine-tune tone, audience, and keywords.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={() => setShowGuidanceCard(false)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Don't show this again
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              
                <Card className="mb-6 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="flex items-center">
                      <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                      <span>AI-Powered Content Creation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Natural Language Prompt */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tell me what you'd like to create:
                        </label>
                        <textarea
                          value={promptText}
                          onChange={(e) => setPromptText(e.target.value)}
                          className="w-full p-3 border rounded-lg h-32"
                          placeholder={`Write a ${contentType?.title?.toLowerCase() || 'content piece'} about...`}
                        />
                      </div>
                      
                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white text-sm text-gray-500">OR</span>
                        </div>
                      </div>
                      
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Upload notes or starter content:
                        </label>
                        <FileHandler 
                          onContentLoaded={handleFileContent}
                          showExport={false}
                          acceptedFormats=".txt,.doc,.docx,.md,.rtf,.html,.csv,.xlsx"
                        />
                      </div>
                      
                      {/* Advanced Options Toggle with more attention-grabbing design */}
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                          className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            showAdvancedOptions 
                              ? 'bg-blue-50 border-blue-300 text-blue-700' 
                              : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            <span className="font-medium">Additional Options</span>
                          </div>
                          {showAdvancedOptions ? 
                            <ChevronDown className="w-5 h-5" /> : 
                            <ChevronRight className="w-5 h-5" />
                          }
                        </button>
                      </div>
                      
                      {/* Advanced Options (Collapsible) */}
                      {showAdvancedOptions && (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Target Audience (optional)
                            </label>
                            <input
                              type="text"
                              value={advancedOptions.audience}
                              onChange={(e) => handleAdvancedOptionChange('audience', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Who is this content for?"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Tone (optional)
                            </label>
                            <select
                              value={advancedOptions.tone}
                              onChange={(e) => handleAdvancedOptionChange('tone', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="professional">Professional</option>
                              <option value="conversational">Conversational</option>
                              <option value="enthusiastic">Enthusiastic</option>
                              <option value="authoritative">Authoritative</option>
                              <option value="friendly">Friendly</option>
                              <option value="technical">Technical</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              SEO Keywords (optional)
                            </label>
                            <input
                              type="text"
                              value={advancedOptions.keywords}
                              onChange={(e) => handleAdvancedOptionChange('keywords', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Enter keywords separated by commas"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              AI will also generate additional SEO keywords automatically
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Additional Notes (optional)
                            </label>
                            <textarea
                              value={advancedOptions.additionalNotes}
                              onChange={(e) => handleAdvancedOptionChange('additionalNotes', e.target.value)}
                              className="w-full p-2 border rounded-md h-24"
                              placeholder="Any other specific requirements or information"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Generate Button */}
                      <button
                        onClick={handleGenerateContent}
                        disabled={isGenerating || (!promptText && !uploadedContent)}
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Content
                          </>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
           {/* Generated Content Display */}
{generatedContent && (
  <div className="space-y-6">
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Your Generated {contentType?.title || selectedContentType}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">{parsedContent.title || generatedTitle}</h1>
          
          {/* Introduction */}
          {parsedContent.introduction && (
            <div className="text-gray-700 mb-6">
              {parsedContent.introduction.split('\n').map((para, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-4' : ''}>{para}</p>
              ))}
            </div>
          )}
          
          {/* Content Sections */}
          {parsedContent.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">{section.title}</h2>
              <div className="text-gray-700">
                {section.content.split('\n').filter(p => p.trim()).map((para, pIdx) => (
                  <p key={pIdx} className={pIdx > 0 ? 'mt-4' : ''}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    
  {/* SEO Metadata (Always Visible) */}
{generatedMetadata && (
  <div className="mt-4">
    <div className="flex items-center text-blue-600 mb-2">
      <ChevronRight className="w-4 h-4 mr-1" />
      <h3 className="font-medium">SEO Metadata (Auto-generated)</h3>
    </div>
    
    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Title tag:</p>
          <p className="text-sm text-gray-600">{generatedMetadata.title}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Meta description:</p>
          <p className="text-sm text-gray-600">{generatedMetadata.description}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Keywords:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {generatedMetadata.keywords && generatedMetadata.keywords.map((keyword, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    
    {/* Action Buttons */}
    <div className="flex flex-wrap gap-4 justify-between">
      <button
        onClick={() => {
          setGeneratedContent('');
          setGeneratedTitle('');
          setGeneratedMetadata(null);
        }}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Editor
      </button>
      
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <button
            onClick={() => handleExportContent('markdown')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          {/* Dropdown could be added here for different formats */}
        </div>
        
        <button
          onClick={handleSaveToLibrary}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save to Library
        </button>
        
        <button
          onClick={handleGenerateContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </button>
        </div>
                </div>
              </div>
            )}
          </div>
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ContentCreatorPage;