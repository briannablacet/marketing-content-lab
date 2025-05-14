// src/pages/content-creator/[type].tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useNotification } from '../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FileHandler from '../../components/shared/FileHandler';
import KeywordSuggestions from '../../components/shared/KeywordSuggestions';
import StyleGuideNotificationBanner from '../../components/features/StyleGuideNotificationBanner';
import ContentEditChat from '../../components/features/ContentEditChat';
import StrategicDataService from '../../services/StrategicDataService';
import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  Save,
  MessageSquare,
  Upload,
  Info,
  Settings,
  Search,
  FileText,
  Edit,
  FileCheck,
  AlertCircle,
  X,
  Check
} from 'lucide-react';

// A more reliable function to reset style and walkthrough
function resetStyleAndWalkthrough() {
  // Force set the writing style as completed
  localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify({
    completed: true,
    styleGuide: {
      primary: 'Chicago Manual of Style',
      completed: true
    }
  }));

  // Force set walkthrough as completed
  localStorage.setItem('content-creator-walkthrough-completed', 'true');
  localStorage.setItem('walkthrough-completed', 'true');
  localStorage.setItem('writing-style-completed', 'true');

  // Also clear any potential old flags that might interfere
  const keysToCheck = [
    'walkthrough-step-',
    'marketing-content-lab-writing',
    'writing-style-'
  ];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      for (const prefix of keysToCheck) {
        if (key.includes(prefix) &&
          !key.includes('completed') &&
          !key.includes('marketing-content-lab-writing-style')) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  console.log('Reset applied successfully');
}

// Define content types directly in this file to ensure proper format
const CONTENT_TYPES = [
  {
    id: 'web-page',
    title: 'Web Page',
    description: 'Create optimized web page content that engages visitors and improves conversion rates.'
  },
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
    title: 'Email',
    description: 'Create individual email content that drives opens, clicks, and conversions for your business.'
  },
  {
    id: 'internal-email',
    title: 'Internal or Exec Email Comms',
    description: 'Create effective internal communications or executive communications to keep your team informed and aligned.'
  },
  {
    id: 'email-campaign',
    title: 'Email Campaign',
    description: 'Create multi-email sequences designed to nurture leads and drive conversions.'
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

// Define tabs for the content creation process
const CONTENT_TABS = [
  {
    id: 'create',
    name: 'Create Content',
    icon: <FileText className="w-4 h-4 mr-2" />
  },
  {
    id: 'keywords',
    name: 'Keywords & SEO',
    icon: <Search className="w-4 h-4 mr-2" />
  },
  {
    id: 'options',
    name: 'Advanced Options',
    icon: <Settings className="w-4 h-4 mr-2" />
  },
  {
    id: 'edit',
    name: 'Edit & Refine',
    icon: <Edit className="w-4 h-4 mr-2" />
  }
];

// Helper component for check icons
const CheckIcon = ({ className }) => (
  <Check className={className || "h-5 w-5"} />
);

const ContentCreatorPage = () => {
  const router = useRouter();
  const { type } = router.query;
  const { showNotification } = useNotification();

  // State for content information
  const [contentType, setContentType] = useState(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState('create');

  // State for user inputs
  const [promptText, setPromptText] = useState('');
  const [uploadedContent, setUploadedContent] = useState('');

  // State for advanced options
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
  const [generatedMetadata, setGeneratedMetadata] = useState(null);

  // State for strategic data
  const [strategicData, setStrategicData] = useState(null);
  const [isLoadingStrategicData, setIsLoadingStrategicData] = useState(true);
  const [hasStrategicData, setHasStrategicData] = useState(false);

  // State for UI guidance
  const [showGuidanceCard, setShowGuidanceCard] = useState(false);

  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update edited content when generated content changes
  useEffect(() => {
    if (generatedContent) {
      setEditedContent(generatedContent);
    }
  }, [generatedContent]);

  // Skip walkthrough and writing style prompts on component mount
  useEffect(() => {
    // Mark walkthrough as completed in localStorage 
    resetStyleAndWalkthrough();
  }, []);

  // Load content type from URL parameter
  useEffect(() => {
    if (type && router.isReady) {
      // Find content type info based on URL parameter
      const typeFromUrl = Array.isArray(type) ? type[0] : type;
      const foundType = CONTENT_TYPES.find(t => t.id === typeFromUrl);

      if (foundType) {
        setContentType(foundType);

        // Reset state for new content type
        setAdvancedOptions({
          audience: '',
          tone: 'professional',
          keywords: '',
          additionalNotes: ''
        });

        setPromptText('');
        setUploadedContent('');
        setGeneratedContent('');
        setGeneratedTitle('');
        setGeneratedMetadata(null);
        setActiveTab('create');
      } else {
        // If content type isn't found, redirect to content creator page
        router.push('/content-creator');
      }
    }
  }, [type, router]);

  // Load Strategic Data
  useEffect(() => {
    const loadStrategicData = async () => {
      setIsLoadingStrategicData(true);
      try {
        const data = await StrategicDataService.getAllStrategicData();
        console.log('Loaded strategic data:', data);
        setStrategicData(data);

        // Check if we have any meaningful strategic data (product, audience, or messaging)
        const hasData = data && (
          data.isComplete ||
          (data.product && data.product.name) ||
          (data.audiences && data.audiences.length > 0) ||
          (data.messaging && data.messaging.valueProposition) ||
          (data.writingStyle && data.writingStyle.styleGuide && data.writingStyle.styleGuide.primary)
        );
        setHasStrategicData(hasData);

        // Pre-fill advanced options if we have strategic data
        if (hasData) {
          setAdvancedOptions(prev => {
            const updates = { ...prev };

            // Set audience from primary persona
            if (data.audiences && data.audiences.length > 0) {
              const primaryPersona = data.audiences[0];
              updates.audience = `${primaryPersona.role}${primaryPersona.industry ? ` in ${primaryPersona.industry}` : ''}`;
            }

            // Set tone from brand voice
            if (data.brandVoice?.brandVoice?.tone) {
              updates.tone = data.brandVoice.brandVoice.tone;
            }

            // Set keywords from SEO keywords
            if (data.seoKeywords) {
              const primaryTerms = (data.seoKeywords.primaryKeywords || [])
                .map(k => typeof k === 'string' ? k : k.term)
                .filter(Boolean);

              if (primaryTerms.length > 0) {
                updates.keywords = primaryTerms.join(', ');
              }
            }

            return updates;
          });
        }
      } catch (error) {
        console.error('Error loading strategic data:', error);
        showNotification('error', 'Could not load your strategic data. Some personalization features may be limited.');
      } finally {
        setIsLoadingStrategicData(false);
      }
    };

    loadStrategicData();
  }, []);

  // Automatically switch to edit tab when content is generated
  useEffect(() => {
    if (generatedContent) {
      setActiveTab('edit');
    }
  }, [generatedContent]);

  // Handle file upload
  const handleFileContent = (content) => {
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
  const handleAdvancedOptionChange = (option, value) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Handle content editing
  const handleContentEdit = (e) => {
    setEditedContent(e.target.value);
  };

  // Save content edits
  const saveContentEdits = () => {
    setGeneratedContent(editedContent);
    setIsEditMode(false);
    showNotification('success', 'Content updated successfully');

    // Update metadata description if needed
    if (generatedMetadata) {
      setGeneratedMetadata(prev => ({
        ...prev,
        description: editedContent.substring(0, 160).replace(/[#*_]/g, '')
      }));
    }
  };

  // Replace the handleGenerateContent function in [type].tsx with this version

  // Handle content generation with strategic data integration
  const handleGenerateContent = async () => {
    // Validate inputs
    if (!promptText && !uploadedContent) {
      showNotification('error', 'Please enter a prompt or upload content');
      return;
    }
  
    setIsGenerating(true);
  
    try {
      // Create base request
      const baseRequest = {
        contentType: contentType?.id || 'blog-post',
        prompt: promptText,
        sourceContent: uploadedContent,
        parameters: {
          audience: advancedOptions.audience,
          tone: advancedOptions.tone,
          keywords: advancedOptions.keywords.split(',').map(k => k.trim()).filter(k => k),
          additionalNotes: advancedOptions.additionalNotes,
        },
      };
  
      // Log the request details
      console.log('Content generation request details:', {
        contentType: contentType?.id,
        promptLength: promptText.length,
        selectedTone: advancedOptions.tone,
        keywordCount: advancedOptions.keywords ? advancedOptions.keywords.split(',').length : 0,
      });
  
      // Define the API endpoint
      const endpointName = 'generate-content';
  
      // Prepare the final API payload
      const payload = {
        endpoint: endpointName,
        data: baseRequest,
      };
  
      console.log('Sending API request with payload:', JSON.stringify(payload).substring(0, 500) + '...');
  
      // Call API with proper error handling
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      // Check if the response is ok before proceeding
      if (!response.ok) {
        const errorJson = await response.json();
        console.error('API response not OK:', response.status, errorJson);
        throw new Error(`API responded with status ${response.status}: ${JSON.stringify(errorJson)}`);
      }
  
      // Parse the response as JSON
      const jsonResponse = await response.json();
      const data = jsonResponse.data;
  
      console.log('API Response received:', data ? 'success' : 'empty');
  
      // Process the generated content
      if (data && data.document) {
        const document = data.document;
  
        // Set the generated content
        if (document.processedContent) {
          setGeneratedContent(document.processedContent);
        } else {
          throw new Error('Processed content is missing in the response');
        }
  
        // Set the title
        if (document.metadata && document.metadata.parameters && document.metadata.parameters.title) {
          setGeneratedTitle(document.metadata.parameters.title);
        } else if (document.processedContent) {
          const firstLine = document.processedContent.split('\n')[0].replace(/^#\s*/, '');
          setGeneratedTitle(firstLine || 'Generated Content');
        } else {
          setGeneratedTitle('Generated Content');
        }
  
        // Set metadata
        if (document.metadata) {
          setGeneratedMetadata(document.metadata);
        } else {
          const currentKeywords = advancedOptions.keywords
            .split(',')
            .map(k => k.trim())
            .filter(k => k);
  
          // Generate basic metadata
          setGeneratedMetadata({
            title: document.metadata?.parameters?.title || 'Generated Content',
            description: document.processedContent?.substring(0, 160) || '',
            keywords: currentKeywords,
          });
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      showNotification('error', `Failed to generate content: ${error.message || 'Unknown error'}`);
  
      // Important: Do NOT add any fallback "sample" content here
      // Instead, let the user know they need to try again
      showNotification('error', 'Please try again or check your internet connection');
    } finally {
      setIsGenerating(false);
    }
  };



  // Handle content updates from the chat component
  const handleContentUpdate = (newContent, newTitle) => {
    setGeneratedContent(newContent);
    if (newTitle && newTitle !== generatedTitle) {
      setGeneratedTitle(newTitle);
    }

    // Update metadata description if the content has changed substantially
    if (newContent !== generatedContent) {
      setGeneratedMetadata(prev => ({
        ...prev,
        description: newContent.substring(0, 160).replace(/[#*_]/g, '')
      }));
    }

    showNotification('success', 'Content updated successfully');
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
        // Simple markdown to HTML conversion
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
      case 'docx':
        // This would require a more complex library for DOCX generation
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        extension = 'docx';
        // For now, just use plain text as fallback
        showNotification('warning', 'DOCX export is coming soon. Exporting as plain text instead.');
        break;
      case 'pdf':
        // This would require a more complex library for PDF generation
        mimeType = 'application/pdf';
        extension = 'pdf';
        // For now, just use plain text as fallback
        showNotification('warning', 'PDF export is coming soon. Exporting as plain text instead.');
        break;
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
      createdAt: new Date().toISOString(),
      // Add strategic data references
      strategicDataUsed: hasStrategicData ? {
        productName: strategicData?.product?.name,
        audienceName: strategicData?.audiences?.length > 0 ? strategicData.audiences[0].role : null,
        messagingSource: strategicData?.messaging?.valueProposition ? 'Marketing Program' : 'Manual Entry',
        styleGuide: strategicData?.writingStyle?.styleGuide?.primary || null
      } : null
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

  // Reset the content and go back to content creation
  const handleResetContent = () => {
    setGeneratedContent('');
    setGeneratedTitle('');
    setGeneratedMetadata(null);
    setActiveTab('create');
    setIsEditMode(false);

    // Reset advanced options but keep strategic data
    setAdvancedOptions(prev => {
      const strategicDefaults = {
        audience: '',
        tone: 'professional',
        keywords: '',
        additionalNotes: ''
      };

      // If we have strategic data, use it to set defaults
      if (hasStrategicData) {
        if (strategicData.audiences && strategicData.audiences.length > 0) {
          const primaryPersona = strategicData.audiences[0];
          strategicDefaults.audience = `${primaryPersona.role}${primaryPersona.industry ? ` in ${primaryPersona.industry}` : ''}`;
        }

        if (strategicData.brandVoice?.brandVoice?.tone) {
          strategicDefaults.tone = strategicData.brandVoice.brandVoice.tone;
        }

        if (strategicData.seoKeywords) {
          const primaryTerms = (strategicData.seoKeywords.primaryKeywords || [])
            .map(k => typeof k === 'string' ? k : k.term)
            .filter(Boolean);

          if (primaryTerms.length > 0) {
            strategicDefaults.keywords = primaryTerms.join(', ');
          }
        }
      }

      return strategicDefaults;
    });
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
          sections.push({ ...currentSection });
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

  // Render tab contents based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <div className="space-y-6">
            {/* Strategic Data Banner - Show if we have meaningful strategic data */}
            {hasStrategicData && (
              <Card className="mb-6 border-2 border-green-200 overflow-hidden">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="flex items-center">
                    <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                    <span>Using Your Marketing Program</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Content will be created using:</h3>
                      <ul className="space-y-2">
                        {strategicData?.product?.name && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your product:</strong> {strategicData.product.name}
                            </span>
                          </li>
                        )}

                        {strategicData?.audiences?.length > 0 && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your audience:</strong> {strategicData.audiences[0].role}
                            </span>
                          </li>
                        )}

                        {strategicData?.messaging?.valueProposition && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your messaging framework</strong>
                            </span>
                          </li>
                        )}

                        {strategicData?.writingStyle?.styleGuide?.primary && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your writing style:</strong> {strategicData.writingStyle.styleGuide.primary}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-100">
                      <h3 className="font-medium text-gray-800 mb-2">Content will reflect:</h3>
                      <div className="space-y-2 text-gray-700 text-sm">
                        {strategicData?.product?.valueProposition && (
                          <p className="italic">"{strategicData.product.valueProposition.substring(0, 100)}..."</p>
                        )}

                        {strategicData?.messaging?.keyDifferentiators?.length > 0 && (
                          <div>
                            <p><strong>Key differentiators:</strong></p>
                            <ul className="list-disc pl-5 space-y-1">
                              {strategicData.messaging.keyDifferentiators.slice(0, 2).map((diff, idx) => (
                                <li key={idx}>{typeof diff === 'string' ? diff.substring(0, 60) : ''}{diff.length > 60 ? '...' : ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guidance Card */}
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
                        <Search className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-medium mb-2">Add Keywords</h3>
                      <p className="text-sm text-gray-600">
                        In the next tab, you can add keywords to optimize your content for search.
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

            {/* No Strategic Data Warning */}
            {!isLoadingStrategicData && !hasStrategicData && (
              <Card className="mb-6 border-2 border-yellow-200 overflow-hidden">
                <CardHeader className="bg-yellow-50 border-b">
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span>Enhance Your Content with a Marketing Program</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-yellow-800 mb-4">
                    Your content will be created without the benefit of your strategic marketing foundation.
                    For the best results, complete the marketing program walkthrough first.
                  </p>
                  <div className="flex justify-end">
                    <Link href="/walkthrough/1">
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                        Start Marketing Program
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center">
                  <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Create Your {contentType?.title}</span>
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

                  {/* File Upload Option */}
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-700 mb-4">Or upload a file to use as a starting point:</p>
                    <FileHandler onFileContent={handleFileContent} />

                    {uploadedContent && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm">Uploaded Content Preview</h4>
                          <button
                            onClick={() => setUploadedContent('')}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600">
                          {uploadedContent.substring(0, 200)}
                          {uploadedContent.length > 200 ? '...' : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Next button to go to Keywords tab */}
                  <div className="flex justify-between mt-4">
                    <div></div> {/* Empty div for spacing */}
                    <button
                      onClick={() => setActiveTab('keywords')}
                      disabled={!promptText && !uploadedContent}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Continue to Keywords
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'keywords':
        return (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center">
                  <Search className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Keywords & SEO</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Strategic Keywords Notice */}
                  {strategicData?.seoKeywords?.primaryKeywords?.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2" />
                        Keywords from Your Marketing Program
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        We've pre-selected keywords from your SEO strategy. You can add or remove keywords as needed.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {strategicData.seoKeywords.primaryKeywords.map((kw, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            {typeof kw === 'string' ? kw : kw.term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">Why Keywords Matter</h3>
                    <p className="text-sm text-blue-700">
                      Adding relevant keywords helps your content rank higher in search results and reach the right audience.
                      Click on suggested keywords below to add them to your content.
                    </p>
                  </div>

                  {/* Keyword Suggestions */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">Recommended Keywords</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      <strong>Click on a keyword to add it</strong> to your content. Selected keywords will be highlighted.
                    </p>

                    <KeywordSuggestions
                      contentTopic={promptText}
                      contentType={contentType?.id || 'blog-post'}
                      initialKeywords={advancedOptions.keywords}
                      onKeywordsChange={(keywordsString) => handleAdvancedOptionChange('keywords', keywordsString)}
                      showSelectionInstructions={true}
                    />
                  </div>

                  {/* Current selected keywords */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Selected Keywords:</label>
                    <div className="p-3 bg-gray-50 rounded-lg min-h-[50px]">
                      {advancedOptions.keywords ? (
                        <div className="flex flex-wrap gap-2">
                          {advancedOptions.keywords.split(',').map((keyword, idx) => (
                            keyword.trim() && (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {keyword.trim()}
                              </span>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No keywords selected yet. Click on suggestions above.</p>
                      )}
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setActiveTab('options')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Continue to Options
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'options':
        return (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center">
                  <Settings className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Advanced Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Strategic Brand Voice Notice */}
                  {strategicData?.brandVoice?.brandVoice?.tone && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2" />
                        Using Your Brand Voice
                      </h3>
                      <p className="text-sm text-green-700">
                        We're using your brand voice settings from your marketing program:
                      </p>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-green-700">Tone: </span>
                        <span className="text-sm text-green-800">{strategicData.brandVoice.brandVoice.tone}</span>
                      </div>
                      {strategicData.brandVoice.brandVoice.archetype && (
                        <div>
                          <span className="text-sm font-medium text-green-700">Archetype: </span>
                          <span className="text-sm text-green-800">{strategicData.brandVoice.brandVoice.archetype}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={advancedOptions.audience}
                        onChange={(e) => handleAdvancedOptionChange('audience', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Who is this content for? (e.g., Small business owners)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Being specific about your audience helps create more targeted content.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content Tone
                      </label>
                      <select
                        value={advancedOptions.tone}
                        onChange={(e) => handleAdvancedOptionChange('tone', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="professional">Professional</option>
                        <option value="conversational">Conversational</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="friendly">Friendly</option>
                        <option value="empathetic">Empathetic</option>
                        <option value="compassionate">Compassionate</option>
                        <option value="humorous">Jovial and funny</option>
                        <option value="technical">Technical</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        The tone will affect how your content resonates with readers.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Instructions (optional)
                    </label>
                    <textarea
                      value={advancedOptions.additionalNotes}
                      onChange={(e) => handleAdvancedOptionChange('additionalNotes', e.target.value)}
                      className="w-full p-3 border rounded-lg h-32"
                      placeholder="Any specific requirements for your content? (e.g., Include statistics, focus on specific aspects, etc.)"
                    />
                  </div>

                  {/* Navigation and generation buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab('keywords')}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGenerateContent}
                      disabled={isGenerating || (!promptText && !uploadedContent)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
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
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'edit':
        return (
          <>
            {generatedContent ? (
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="border-b flex justify-between items-center">
                    <CardTitle>Your Generated {contentType?.title}</CardTitle>
                    <div className="flex space-x-2">
                      {/* Toggle Edit Mode Button */}
                      <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`px-3 py-1 text-sm border rounded-md flex items-center ${isEditMode
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {isEditMode ? 'View Mode' : 'Edit Mode'}
                      </button>

                      {/* Show Save button when in edit mode */}
                      {isEditMode && (
                        <button
                          onClick={saveContentEdits}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save Edits
                        </button>
                      )}

                      {/* Download Button with Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                            <button
                              onClick={() => {
                                handleExportContent('markdown');
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Markdown (.md)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent('html');
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              HTML (.html)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent('text');
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Plain Text (.txt)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent('docx');
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Word (.docx)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent('pdf');
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              PDF (.pdf)
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleSaveToLibrary}
                        className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save to Library
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-6">
                      {isEditMode ? (
                        /* Edit Mode - Show textarea */
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-blue-800">Editing Content</h3>
                          <p className="text-sm text-gray-600">
                            Make direct edits to your content below. Use markdown formatting for headings, lists, and styling.
                          </p>
                          <textarea
                            value={editedContent}
                            onChange={handleContentEdit}
                            className="w-full p-4 border border-gray-300 rounded-lg min-h-[500px] font-mono"
                            placeholder="Edit your content here..."
                          />
                        </div>
                      ) : (
                        /* View Mode - Show formatted content */
                        <>
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
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Strategic Data Attribution */}
                {hasStrategicData && (
                  <Card className="mt-4 p-4 bg-gray-50 border border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileCheck className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Created using your marketing program for {strategicData?.product?.name || "your product"}.
                        {strategicData?.audiences?.length > 0 ? ` Targeted for ${strategicData.audiences[0].role}.` : ''}
                      </span>
                    </div>
                  </Card>
                )}

                {/* Chat for content improvements */}
                <Card className="mt-6">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Ask for Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ContentEditChat
                      originalContent={generatedContent}
                      originalTitle={generatedTitle}
                      contentType={contentType?.title || 'content'}
                      onContentUpdate={handleContentUpdate}
                      // Pass strategic context for better improvements
                      strategicContext={hasStrategicData ? {
                        productName: strategicData?.product?.name,
                        valueProposition: strategicData?.product?.valueProposition,
                        audience: strategicData?.audiences?.[0]?.role,
                        industry: strategicData?.audiences?.[0]?.industry,
                        tone: strategicData?.brandVoice?.brandVoice?.tone || advancedOptions.tone
                      } : null}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleResetContent}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12">
                <p className="text-lg text-gray-500">No content generated yet. Go back to create content.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Content Creation
                </button>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // Render the tabs and active tab content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/content-creator">
          <button className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Content Types
          </button>
        </Link>
        <h1 className="text-3xl font-bold">{contentType?.title || 'Content Creator'}</h1>
        <p className="text-gray-600 mt-2">{contentType?.description}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          {CONTENT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 flex items-center ${activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              disabled={tab.id === 'edit' && !generatedContent}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content for active tab */}
      {renderTabContent()}

      {/* Fix Prompts Button (kept for convenience) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={resetStyleAndWalkthrough}
          className="bg-red-600 text-white px-3 py-2 rounded-md text-sm shadow-lg"
        >
          Fix Prompts
        </button>
      </div>
    </div>
  );
};

export default ContentCreatorPage;