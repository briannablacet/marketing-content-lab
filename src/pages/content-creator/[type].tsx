// src/pages/content-creator/[type].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ContentProvider } from '../../context/ContentContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WalkthroughProvider } from '../../context/WalkthroughContext';
import { MarketingProvider } from '../../context/MarketingContext';
import { ScreenTemplate } from '../../components/shared/UIComponents';
import { ArrowLeft, Sparkles, Download, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CONTENT_TYPES } from '../../data/contentTypeData'; 
import { useNotification } from '../../context/NotificationContext';

const DynamicContentCreator = () => {
  const router = useRouter();
  const { type } = router.query;
  const { showNotification } = useNotification();
  const [contentType, setContentType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: '',
    keywords: '',
    tone: 'professional'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  // Load saved items on component mount
  useEffect(() => {
    const loadSavedItems = () => {
      try {
        const savedContentItems = localStorage.getItem('savedContentItems');
        if (savedContentItems) {
          setSavedItems(JSON.parse(savedContentItems));
        }
      } catch (error) {
        console.error("Error loading saved items:", error);
      }
    };
    
    loadSavedItems();
  }, []);

  useEffect(() => {
    if (type) {
      const typeInfo = CONTENT_TYPES.find(t => t.id === type);
      if (typeInfo) {
        setContentType(typeInfo);
      } else {
        // If content type doesn't exist, redirect to content creator page
        router.push('/content-creator');
      }
    }
  }, [type, router]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleGenerateContent = async () => {
    if (!contentType) return;
    
    setIsGenerating(true);
    
    try {
      // Call our real API endpoint
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'generate-content',
          data: {
            contentType: contentType.id,
            parameters: {
              title: formData.title || 'Untitled',
              topic: formData.description,
              audience: formData.audience,
              keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
              tone: formData.tone
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.content) {
        setGeneratedContent(data.content);
        showNotification('success', 'Content generated successfully!');
      } else {
        throw new Error('No content returned from API');
      }
    } catch (error) {
      console.error(`Error generating content:`, error);
      showNotification('error', 'Failed to generate content. Please try again.');
      
      // Fallback content generation if API fails
      const mockContent = [
        `# ${formData.title || 'Untitled'}`,
        '',
        `This is a sample ${contentType.title.toLowerCase()} about "${formData.description || 'your topic'}".`,
        '',
        '## Introduction',
        `Setting the stage for this fascinating topic with a clear value proposition for ${formData.audience || 'your audience'}.`,
        '',
        '## Main Point 1',
        `Exploring the key aspects and implications with a ${formData.tone} tone.`,
        '',
        '## Main Point 2',
        `Analyzing important factors to consider based on keywords like ${formData.keywords || 'your keywords'}.`,
        '',
        '## Main Point 3',
        'Providing valuable insights that are relevant and actionable.',
        '',
        '## Conclusion',
        'Summarizing the important takeaways and including a clear next step for the reader.'
      ].join('\n');
      
      setGeneratedContent(mockContent);
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW FUNCTION: Handle exporting content as a file
  const handleExportContent = () => {
    if (!generatedContent) {
      showNotification('error', 'Please generate content first before exporting');
      return;
    }

    // Create a file name based on the title or content type
    const fileName = `${formData.title || contentType?.title || 'content'}`
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      + '.md';

    // Create a blob from the content
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('success', 'Content exported successfully!');
  };

  // NEW FUNCTION: Handle saving content to localStorage
  const handleSaveContent = () => {
    if (!generatedContent || !formData.title) {
      showNotification('error', 'Please generate content and provide a title before saving');
      return;
    }

    setIsSaving(true);

    try {
      // Create a new saved item
      const newItem = {
        id: Date.now(), // Generate a unique ID
        type: contentType?.id,
        title: formData.title,
        content: generatedContent,
        metadata: { ...formData },
        createdAt: new Date().toISOString()
      };

      // Add to local array
      const updatedItems = [...savedItems, newItem];
      setSavedItems(updatedItems);
      
      // Save to localStorage
      localStorage.setItem('savedContentItems', JSON.stringify(updatedItems));
      
      showNotification('success', 'Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('error', 'Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Parse the markdown content for rendering
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
  if (!contentType) {
    return <div>Loading...</div>;
  }

  // Parse the generated content for display
  const parsedContent = parseMarkdown(generatedContent);

  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <ScreenTemplate
                title={contentType.title}
                subtitle={contentType.description}
                aiInsights={contentType.insights}
                hideNavigation={true}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <Link href="/content-creator">
                      <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to content types
                      </button>
                    </Link>
                  </div>
                  
                  {/* Content Creation Form */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Create Your {contentType.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder={`Enter a compelling title for your ${contentType.title.toLowerCase()}`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description/Topic</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={3}
                            placeholder="What is this content about? What's the main message?"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Target Audience</label>
                          <input
                            type="text"
                            value={formData.audience}
                            onChange={(e) => handleChange('audience', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Who is this content for? (e.g., Marketing Directors, SMB Owners)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Keywords</label>
                          <input
                            type="text"
                            value={formData.keywords}
                            onChange={(e) => handleChange('keywords', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter keywords separated by commas"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Tone</label>
                          <select
                            value={formData.tone}
                            onChange={(e) => handleChange('tone', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="professional">Professional</option>
                            <option value="conversational">Conversational</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="friendly">Friendly</option>
                            <option value="technical">Technical</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={handleGenerateContent}
                          disabled={isGenerating || !formData.description}
                          className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate {contentType.title}
                            </>
                          )}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Generated Content Display */}
                  {generatedContent && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Your Generated {contentType.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white border rounded-md overflow-hidden">
                          {/* Formatted Content Section */}
                          <div className="p-6">
                            {/* Title */}
                            <h1 className="text-2xl font-bold mb-4">
                              {parsedContent.title || formData.title || 'Untitled'}
                            </h1>
                            
                            {/* Introduction */}
                            <div className="text-gray-700 mb-6">
                              {parsedContent.introduction.split('\n').map((para, idx) => (
                                <p key={idx} className={idx > 0 ? 'mt-4' : ''}>{para}</p>
                              ))}
                            </div>
                            
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
                        </div>
                        
                        {/* Action Buttons - NEW SECTION */}
                        <div className="flex justify-end mt-4 space-x-4">
                          <button
                            onClick={handleExportContent}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Content
                          </button>
                          
                          <button
                            onClick={handleSaveContent}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Content
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={handleGenerateContent}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Regenerate
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScreenTemplate>
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default DynamicContentCreator;