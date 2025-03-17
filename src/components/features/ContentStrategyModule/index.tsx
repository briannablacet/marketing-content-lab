// src/components/features/ContentStrategyModule/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CONTENT_TYPES } from '../../../data/contentTypesData';
import { useContent } from '../../../context/ContentContext';
import { PlusCircle, ChevronRight, Sparkles, RefreshCw, Download, CheckCircle, Edit, Save } from 'lucide-react';

const ContentStrategyModule = ({ onViewChange }) => {
  // Use the content context
  const { selectedContentTypes, setSelectedContentTypes } = useContent();
  
  // State for steps - simplified to just two steps
  const [currentView, setCurrentView] = useState('selection');
  
  // Content metadata with per-content type information
  const [contentMetadata, setContentMetadata] = useState({});
  const [isGenerating, setIsGenerating] = useState({});
  const [generatedContent, setGeneratedContent] = useState({});
  
  // Notify parent component when view changes
  useEffect(() => {
    if (typeof onViewChange === 'function') {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);
  
  // Toggle content type selection
  const toggleContentType = (contentType) => {
    setSelectedContentTypes((prev) => {
      if (prev.includes(contentType)) {
        return prev.filter(type => type !== contentType);
      } else {
        return [...prev, contentType];
      }
    });
    
    // Initialize metadata for newly added content types
    if (!contentMetadata[contentType]) {
      setContentMetadata(prev => ({
        ...prev,
        [contentType]: {
          name: '',
          keyMessages: ['']
        }
      }));
      
      setIsGenerating(prev => ({
        ...prev,
        [contentType]: false
      }));
    }
  };
  
  // Update content metadata for a specific type
  const updateContentMetadata = (contentType, field, value) => {
    setContentMetadata(prev => ({
      ...prev,
      [contentType]: {
        ...prev[contentType],
        [field]: value
      }
    }));
  };
  
  // Add a new key message for a specific content type
  const addKeyMessage = (contentType) => {
    setContentMetadata(prev => ({
      ...prev,
      [contentType]: {
        ...prev[contentType],
        keyMessages: [...(prev[contentType]?.keyMessages || []), '']
      }
    }));
  };
  
  // Update a key message for a specific content type
  const updateKeyMessage = (contentType, index, value) => {
    setContentMetadata(prev => {
      const updated = {...prev};
      if (!updated[contentType]) {
        updated[contentType] = { keyMessages: [''] };
      }
      
      const keyMessages = [...(updated[contentType].keyMessages || [''])];
      keyMessages[index] = value;
      
      updated[contentType] = {
        ...updated[contentType],
        keyMessages
      };
      
      return updated;
    });
  };
  
  // Generate content for all selected types
  const generateAllContent = () => {
    // Mark all as generating
    const generating = {};
    selectedContentTypes.forEach(type => {
      generating[type] = true;
    });
    setIsGenerating(generating);
    
    // Generate for each content type (with a slight delay between each for better UX)
    selectedContentTypes.forEach((contentType, index) => {
      setTimeout(() => {
        generateContentForType(contentType);
      }, index * 300);
    });
  };
  
  // Generate content for a specific type
  const generateContentForType = (contentType) => {
    // This would normally call your API
    setTimeout(() => {
      const metadata = contentMetadata[contentType] || {};
      const keyMessages = metadata.keyMessages || [''];
      
      // Generate different content based on content type
      const sampleContent = {
        'Blog Posts': {
          title: metadata.name || 'Sample Blog Post',
          sections: [
            {
              heading: 'Introduction',
              content: 'This is a sample introduction for your blog post about ' + 
                (metadata.name || contentType) + '.'
            },
            {
              heading: 'Key Points',
              content: keyMessages.join('\n\n') || 'Key message content would go here.'
            },
            {
              heading: 'Conclusion',
              content: 'This concludes our discussion on this topic. For more information, please contact us.'
            }
          ]
        },
        'Social Posts': {
          platforms: [
            {
              name: 'LinkedIn',
              posts: [
                (keyMessages[0] || '') + ' #business #professional',
                'Did you know? ' + (metadata.name || '') + ' is essential for your business growth. Learn more on our website!'
              ]
            },
            {
              name: 'Twitter',
              posts: [
                keyMessages[0] ? keyMessages[0].substring(0, 180) + ' #tweet' : 'Check out our latest insights!',
                'New content alert: ' + (metadata.name || '') + ' - read more on our blog!'
              ]
            }
          ]
        },
        'Email Campaigns': {
          emails: [
            {
              subject: 'Introducing: ' + (metadata.name || ''),
              body: 'Dear [Customer],\n\nWe\'re excited to share our latest insights on ' + 
                (metadata.name || '') + '.\n\n' +
                (keyMessages.join('\n\n') || '') + '\n\nBest regards,\nYour Company'
            },
            {
              subject: 'Follow-up: ' + (metadata.name || ''),
              body: 'Dear [Customer],\n\nJust checking in to see if you had a chance to review our information about ' + 
                (metadata.name || '') + '.\n\nLet us know if you have any questions.\n\nBest regards,\nYour Company'
            }
          ]
        },
        'eBooks & White Papers': {
          title: metadata.name || 'Sample eBook',
          chapters: [
            'Introduction to ' + (metadata.name || ''),
            'Key Concepts and Strategies',
            'Implementation Guide',
            'Case Studies and Results',
            'Conclusion and Next Steps'
          ],
          summary: 'This comprehensive guide covers everything you need to know about ' + 
            (metadata.name || '') + '. This resource addresses: ' + 
            (keyMessages.join(', ') || 'key topics in your industry') + '.'
        },
        'Landing Pages': {
          title: metadata.name || 'Sample Landing Page',
          headline: keyMessages[0] || 'Transform Your Business Today',
          subheadline: metadata.name ? `Discover how ${metadata.name} can help you succeed` : 'Discover how our solution can help you succeed',
          sections: [
            {
              heading: 'Benefits',
              points: keyMessages.map(msg => msg || 'Key benefit point')
            },
            {
              heading: 'Features',
              points: ['Feature 1', 'Feature 2', 'Feature 3']
            }
          ],
          cta: 'Get Started Now'
        },
        'Case Studies': {
          title: metadata.name || 'Sample Case Study',
          clientName: 'Acme Corporation',
          industry: 'Technology',
          challenge: 'Acme was struggling with ' + (keyMessages[0] || 'a specific challenge'),
          solution: 'We implemented a comprehensive solution that addressed their needs by ' + (keyMessages[1] || 'providing specific capabilities'),
          results: [
            '35% increase in efficiency',
            '45% reduction in costs',
            'Improved customer satisfaction scores'
          ],
          testimonial: `"${metadata.name || 'This solution'} has transformed how we operate. We're seeing incredible results across all our KPIs." - CEO, Acme Corp`
        },
        'Whitepapers': {
          title: metadata.name || 'Industry Whitepaper',
          abstract: keyMessages[0] || 'This whitepaper explores key industry trends and provides actionable insights.',
          sections: [
            {
              heading: 'Executive Summary',
              content: 'This whitepaper examines ' + (metadata.name || 'important industry trends') + ' and their impact on business operations.'
            },
            {
              heading: 'Industry Challenges',
              content: (keyMessages[1] || 'Organizations face numerous challenges') + ' in today\'s rapidly evolving landscape.'
            },
            {
              heading: 'Solution Approach',
              content: 'A strategic approach combining technology and process optimization can address these challenges effectively.'
            },
            {
              heading: 'Implementation Framework',
              content: 'We recommend a phased implementation focusing on key areas of opportunity.'
            },
            {
              heading: 'Conclusion',
              content: 'By adopting these strategies, organizations can position themselves for success in an increasingly competitive environment.'
            }
          ]
        }
      };
      
      // For any other content type, create a reasonable structure
      if (!sampleContent[contentType]) {
        sampleContent[contentType] = {
          title: metadata.name || contentType,
          description: keyMessages[0] || 'Main content description goes here',
          mainContent: 'This is the primary content for ' + (metadata.name || contentType) + '. ' + 
                      'It incorporates key messages and focuses on delivering value to the target audience.',
          sections: [
            {
              heading: 'Main Section',
              content: 'This section explores the key aspects of ' + (metadata.name || contentType) + '.'
            },
            {
              heading: 'Benefits',
              content: keyMessages.join('\n\n') || 'List of benefits would appear here.'
            },
            {
              heading: 'Conclusion',
              content: 'Final thoughts and next steps regarding ' + (metadata.name || contentType) + '.'
            }
          ]
        };
      }
      
      // Set the generated content
      setGeneratedContent(prev => ({
        ...prev,
        [contentType]: sampleContent[contentType]
      }));
      
      // Mark as no longer generating
      setIsGenerating(prev => ({
        ...prev,
        [contentType]: false
      }));
    }, 1500);
  };
  
  // Download content as text file
  const downloadContent = (contentType) => {
    if (!generatedContent[contentType]) return;
    
    const metadata = contentMetadata[contentType] || {};
    let content = '';
    let filename = ((metadata.name || contentType).replace(/\s+/g, '_')) + '.txt';
    
    if (contentType === 'Blog Posts') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      generatedContent[contentType].sections.forEach(section => {
        content += `## ${section.heading}\n\n${section.content}\n\n`;
      });
    } else if (contentType === 'Social Posts') {
      content = `# Social Media Posts for: ${metadata.name || ''}\n\n`;
      generatedContent[contentType].platforms.forEach(platform => {
        content += `## ${platform.name}\n\n`;
        platform.posts.forEach((post, i) => {
          content += `${i+1}. ${post}\n\n`;
        });
      });
    } else if (contentType === 'Email Campaigns') {
      content = `# Email Campaign for: ${metadata.name || ''}\n\n`;
      generatedContent[contentType].emails.forEach((email, i) => {
        content += `## Email ${i+1}\n\nSubject: ${email.subject}\n\n${email.body}\n\n---\n\n`;
      });
    } else if (contentType === 'eBooks & White Papers') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      content += `## Summary\n\n${generatedContent[contentType].summary}\n\n## Table of Contents\n\n`;
      generatedContent[contentType].chapters.forEach((chapter, i) => {
        content += `${i+1}. ${chapter}\n`;
      });
    } else if (contentType === 'Landing Pages') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      content += `## Headline\n\n${generatedContent[contentType].headline}\n\n`;
      content += `## Subheadline\n\n${generatedContent[contentType].subheadline}\n\n`;
      generatedContent[contentType].sections.forEach(section => {
        content += `## ${section.heading}\n\n`;
        section.points.forEach((point, i) => {
          content += `* ${point}\n`;
        });
        content += `\n`;
      });
      content += `## Call to Action\n\n${generatedContent[contentType].cta}\n\n`;
    } else if (contentType === 'Case Studies') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      content += `## Client\n\n${generatedContent[contentType].clientName} - ${generatedContent[contentType].industry}\n\n`;
      content += `## Challenge\n\n${generatedContent[contentType].challenge}\n\n`;
      content += `## Solution\n\n${generatedContent[contentType].solution}\n\n`;
      content += `## Results\n\n`;
      generatedContent[contentType].results.forEach((result, i) => {
        content += `* ${result}\n`;
      });
      content += `\n## Testimonial\n\n${generatedContent[contentType].testimonial}\n\n`;
    } else if (contentType === 'Whitepapers') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      content += `## Abstract\n\n${generatedContent[contentType].abstract}\n\n`;
      generatedContent[contentType].sections.forEach(section => {
        content += `## ${section.heading}\n\n${section.content}\n\n`;
      });
    } else {
      // Generic format for other content types
      content = `# ${generatedContent[contentType].title || metadata.name || contentType}\n\n`;
      content += `## Description\n\n${generatedContent[contentType].description || ''}\n\n`;
      content += `## Main Content\n\n${generatedContent[contentType].mainContent || ''}\n\n`;
      if (generatedContent[contentType].sections) {
        generatedContent[contentType].sections.forEach(section => {
          content += `## ${section.heading}\n\n${section.content}\n\n`;
        });
      }
      content += `## Key Messages\n\n`;
      (metadata.keyMessages || []).forEach((message, i) => {
        if (message?.trim()) {
          content += `${i+1}. ${message}\n`;
        }
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Export all content as a single file
  const exportAllContent = () => {
    if (Object.keys(generatedContent).length === 0) {
      alert('Please generate at least one content piece before exporting.');
      return;
    }
    
    // Create a full markdown document with all content
    let markdownContent = `# Content Strategy Export\n\n`;
    
    Object.keys(generatedContent).forEach(type => {
      const metadata = contentMetadata[type] || {};
      markdownContent += `# ${type}: ${metadata.name || ''}\n\n`;
      
      // Add metadata
      markdownContent += `## Metadata\n\n`;
      
      markdownContent += `**Key Messages:**\n\n`;
      (metadata.keyMessages || []).forEach((msg, i) => {
        if (msg?.trim()) {
          markdownContent += `${i+1}. ${msg}\n`;
        }
      });
      markdownContent += `\n`;
      
      // Add content based on type (similar to download function)
      markdownContent += `## Content\n\n`;
      
      // Add similar handling for all content types as in downloadContent function
      if (type === 'Blog Posts') {
        markdownContent += `### ${generatedContent[type].title}\n\n`;
        generatedContent[type].sections.forEach(section => {
          markdownContent += `#### ${section.heading}\n\n${section.content}\n\n`;
        });
      } else if (type === 'Social Posts') {
        generatedContent[type].platforms.forEach(platform => {
          markdownContent += `### ${platform.name}\n\n`;
          platform.posts.forEach((post, i) => {
            markdownContent += `Post ${i+1}: ${post}\n\n`;
          });
        });
      } else if (type === 'Email Campaigns') {
        generatedContent[type].emails.forEach((email, i) => {
          markdownContent += `### Email ${i+1}\n\n`;
          markdownContent += `**Subject:** ${email.subject}\n\n${email.body}\n\n`;
        });
      } else if (type === 'eBooks & White Papers') {
        markdownContent += `### ${generatedContent[type].title}\n\n`;
        markdownContent += `**Summary:** ${generatedContent[type].summary}\n\n`;
        markdownContent += `**Chapters:**\n\n`;
        generatedContent[type].chapters.forEach((chapter, i) => {
          markdownContent += `${i+1}. ${chapter}\n`;
        });
        markdownContent += `\n`;
      } else if (type === 'Landing Pages') {
        markdownContent += `### ${generatedContent[type].title}\n\n`;
        markdownContent += `**Headline:** ${generatedContent[type].headline}\n\n`;
        markdownContent += `**Subheadline:** ${generatedContent[type].subheadline}\n\n`;
        generatedContent[type].sections.forEach(section => {
          markdownContent += `#### ${section.heading}\n\n`;
          section.points.forEach((point, i) => {
            markdownContent += `* ${point}\n`;
          });
          markdownContent += `\n`;
        });
        markdownContent += `**Call to Action:** ${generatedContent[type].cta}\n\n`;
      } else if (type === 'Case Studies') {
        markdownContent += `### ${generatedContent[type].title}\n\n`;
        markdownContent += `**Client:** ${generatedContent[type].clientName} - ${generatedContent[type].industry}\n\n`;
        markdownContent += `**Challenge:** ${generatedContent[type].challenge}\n\n`;
        markdownContent += `**Solution:** ${generatedContent[type].solution}\n\n`;
        markdownContent += `**Results:**\n\n`;
        generatedContent[type].results.forEach((result, i) => {
          markdownContent += `* ${result}\n`;
        });
        markdownContent += `\n**Testimonial:** ${generatedContent[type].testimonial}\n\n`;
      } else if (type === 'Whitepapers') {
        markdownContent += `### ${generatedContent[type].title}\n\n`;
        markdownContent += `**Abstract:** ${generatedContent[type].abstract}\n\n`;
        generatedContent[type].sections.forEach(section => {
          markdownContent += `#### ${section.heading}\n\n${section.content}\n\n`;
        });
      } else {
        // Generic format for other content types
        if (generatedContent[type].title) {
          markdownContent += `### ${generatedContent[type].title}\n\n`;
        }
        if (generatedContent[type].description) {
          markdownContent += `${generatedContent[type].description}\n\n`;
        }
        if (generatedContent[type].mainContent) {
          markdownContent += `${generatedContent[type].mainContent}\n\n`;
        }
        if (generatedContent[type].sections) {
          generatedContent[type].sections.forEach(section => {
            markdownContent += `#### ${section.heading}\n\n${section.content}\n\n`;
          });
        }
      }
      
      markdownContent += `${'='.repeat(50)}\n\n`;
    });
    
    // Download as markdown
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = 'content_strategy_export.md';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Content Type Selection View
  const renderContentTypeSelection = () => (
    <div className="space-y-6">
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-700">Select Content Types</h2>
          <p className="text-sm text-slate-600">Choose the types of content you want to create for your strategy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CONTENT_TYPES).map(([type, details]) => (
          <Card
            key={type}
            className={`p-6 cursor-pointer transition-all ${
              selectedContentTypes.includes(type)
                ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                : 'border border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => toggleContentType(type)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold mb-2">{type}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedContentTypes.includes(type)
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedContentTypes.includes(type) && (
                  <span className="text-white">✓</span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">{details.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2 mb-4">
              {details.activities.slice(0, 3).map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {details.aiSupport.map((feature) => (
                <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  ✨ {feature}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {selectedContentTypes.length > 0 && (
        <div className="flex justify-end mt-8">
          <button
            onClick={() => setCurrentView('creation')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            Continue to Content Creation <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
  
  // Content Creation View - Now each card has its own key messages
  const renderContentCreation = () => (
    <div className="space-y-8">
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-blue-700">Content Creation</h2>
              <p className="text-sm text-slate-600">Configure and generate each content piece</p>
            </div>
            <button
              onClick={() => setCurrentView('selection')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            >
              Back to Selection
            </button>
          </div>
        </div>
      </div>
      
      {/* Individual content cards with their own key messages */}
      {selectedContentTypes.map(contentType => (
        <Card key={contentType} className="mb-8">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle>{contentType}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Content Nickname</label>
                <input
                  type="text"
                  value={contentMetadata[contentType]?.name || ''}
                  onChange={(e) => updateContentMetadata(contentType, 'name', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder={`Give your ${contentType.toLowerCase()} a nickname`}
                />
              </div>
              
              {/* Key Messages for this content type */}
              <div>
                <label className="block text-sm font-medium mb-2">Key Messages</label>
                <div className="space-y-2">
                  {(contentMetadata[contentType]?.keyMessages || ['']).map((message, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => updateKeyMessage(contentType, index, e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder={`Key message ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addKeyMessage(contentType)}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add another message
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => generateContentForType(contentType)}
                  disabled={isGenerating[contentType]}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating[contentType] ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
              
              {/* Generated content preview with specialized formatting for each content type */}
              {generatedContent[contentType] && (
                <div className="mt-6 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Generated Content</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateContentForType(contentType)}
                        className="p-1 text-slate-600 hover:text-blue-600 border rounded"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadContent(contentType)}
                        className="p-1 text-slate-600 hover:text-blue-600 border rounded"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* eBooks & White Papers */}
                  {contentType === 'eBooks & White Papers' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">{generatedContent[contentType].title}</h3>
                      
                      <div>
                        <h4 className="text-base font-medium mb-2">Summary</h4>
                        <p className="text-gray-700">{generatedContent[contentType].summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-base font-medium mb-2">Chapters</h4>
                        <ol className="list-decimal list-inside pl-4 space-y-1">
                          {generatedContent[contentType].chapters.map((chapter, i) => (
                            <li key={i} className="text-gray-700">{chapter}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {/* Blog Posts */}
                  {contentType === 'Blog Posts' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">{generatedContent[contentType].title}</h3>
                      
                      {generatedContent[contentType].sections.map((section, i) => (
                        <div key={i} className="mb-4">
                          <h4 className="text-lg font-medium mb-2">{section.heading}</h4>
                          <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Social Posts */}
                  {contentType === 'Social Posts' && (
                    <div className="space-y-4">
                      {generatedContent[contentType].platforms.map((platform, platformIndex) => (
                        <div key={platformIndex} className="mb-4">
                          <h4 className="text-base font-medium mb-2">{platform.name} Posts</h4>
                          <div className="space-y-2">
                            {platform.posts.map((post, postIndex) => (
                              <div key={postIndex} className="p-3 bg-gray-50 rounded-md border">
                                {post}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
              {/* Email Campaigns */}
{contentType === 'Email Campaigns' && (
  <div className="space-y-4">
    {generatedContent[contentType].emails.map((email, index) => (
      <div key={index} className="p-4 border rounded-md">
        <h4 className="font-medium mb-2">Subject: {email.subject}</h4>
        <p className="text-gray-700 whitespace-pre-line">{email.body}</p>
      </div>
    ))}
  </div>
)}
                    {/* Landing Pages */}
                    {contentType === 'Landing Pages' && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{generatedContent[contentType].title}</h3>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="text-2xl font-bold text-blue-800 mb-2">{generatedContent[contentType].headline}</h4>
                          <p className="text-lg text-blue-700">{generatedContent[contentType].subheadline}</p>
                        </div>
                        
                        {generatedContent[contentType].sections.map((section, i) => (
                          <div key={i} className="mb-4">
                            <h4 className="text-lg font-medium mb-2">{section.heading}</h4>
                            <ul className="space-y-1 list-disc pl-5">
                              {section.points.map((point, j) => (
                                <li key={j} className="text-gray-700">{point}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        
                        <div className="mt-4 text-center">
                          <span className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg">
                            {generatedContent[contentType].cta}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Case Studies */}
                    {contentType === 'Case Studies' && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{generatedContent[contentType].title}</h3>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">Client</span>
                            <p className="font-semibold">{generatedContent[contentType].clientName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Industry</span>
                            <p className="font-semibold">{generatedContent[contentType].industry}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-base font-medium mb-2">Challenge</h4>
                          <p className="text-gray-700">{generatedContent[contentType].challenge}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-base font-medium mb-2">Solution</h4>
                          <p className="text-gray-700">{generatedContent[contentType].solution}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-base font-medium mb-2">Results</h4>
                          <ul className="space-y-1 list-disc pl-5">
                            {generatedContent[contentType].results.map((result, i) => (
                              <li key={i} className="text-gray-700">{result}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg italic">
                          {generatedContent[contentType].testimonial}
                        </div>
                      </div>
                    )}
                    
                    {/* Whitepapers */}
                    {contentType === 'Whitepapers' && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{generatedContent[contentType].title}</h3>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-base font-medium mb-2">Abstract</h4>
                          <p className="text-gray-700">{generatedContent[contentType].abstract}</p>
                        </div>
                        
                        {generatedContent[contentType].sections.map((section, i) => (
                          <div key={i} className="mb-4">
                            <h4 className="text-lg font-medium mb-2">{section.heading}</h4>
                            <p className="text-gray-700">{section.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Generic format for other content types */}
                    {!['eBooks & White Papers', 'Blog Posts', 'Social Posts', 'Email Campaigns', 
                       'Landing Pages', 'Case Studies', 'Whitepapers'].includes(contentType) && 
                      generatedContent[contentType] && (
                      <div className="space-y-4">
                        {generatedContent[contentType].title && (
                          <h3 className="text-xl font-semibold">{generatedContent[contentType].title}</h3>
                        )}
                        
                        {generatedContent[contentType].description && (
                          <p className="text-gray-700">{generatedContent[contentType].description}</p>
                        )}
                        
                        {generatedContent[contentType].mainContent && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{generatedContent[contentType].mainContent}</p>
                          </div>
                        )}
                        
                        {generatedContent[contentType].sections && generatedContent[contentType].sections.map((section, i) => (
                          <div key={i} className="mb-4">
                            <h4 className="text-lg font-medium mb-2">{section.heading}</h4>
                            <p className="text-gray-700">{section.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button
                      onClick={() => downloadContent(contentType)}
                      className="mt-3 flex items-center text-blue-600"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download this content
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
  
        {/* Action buttons - only show Generate All and Save/Export buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={generateAllContent}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate All Content
          </button>
          
          {Object.keys(generatedContent).length > 0 && (
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  localStorage.setItem('savedContentStrategy', JSON.stringify({
                    contentTypes: selectedContentTypes,
                    metadata: contentMetadata,
                    generatedContent: generatedContent
                  }));
                  alert('Content strategy saved successfully!');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Strategy
              </button>
              
              <button
                onClick={exportAllContent}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Export All Content
              </button>
            </div>
          )}
        </div>
      </div>
    );
  
    return (
      <div className="container mx-auto">
        {currentView === 'selection' ? renderContentTypeSelection() : renderContentCreation()}
      </div>
    );
  };
  
  export default ContentStrategyModule;