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
  
  // Content metadata
  const [contentMetadata, setContentMetadata] = useState({});
  const [keyMessages, setKeyMessages] = useState(['']);
  const [targetAudience, setTargetAudience] = useState('');
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
          goal: ''
        }
      }));
      
      setIsGenerating(prev => ({
        ...prev,
        [contentType]: false
      }));
    }
  };
  
  // Handle key message updates
  const updateKeyMessage = (index, value) => {
    setKeyMessages(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  
  // Add a new key message field
  const addKeyMessage = () => {
    setKeyMessages(prev => [...prev, '']);
  };
  
  // Update content name for a specific type
  const updateContentName = (contentType, name) => {
    setContentMetadata(prev => ({
      ...prev,
      [contentType]: {
        ...prev[contentType],
        name
      }
    }));
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
      // Generate different content based on content type
      const sampleContent = {
        'Blog Posts': {
          title: contentMetadata[contentType]?.name || 'Sample Blog Post',
          sections: [
            {
              heading: 'Introduction',
              content: 'This is a sample introduction for your blog post about ' + 
                (contentMetadata[contentType]?.name || contentType) + '. ' +
                'It addresses key points and targets ' + targetAudience + '.'
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
                'Did you know? ' + (contentMetadata[contentType]?.name || '') + ' is essential for your business growth. Learn more on our website!'
              ]
            },
            {
              name: 'Twitter',
              posts: [
                keyMessages[0] ? keyMessages[0].substring(0, 180) + ' #tweet' : 'Check out our latest insights!',
                'New content alert: ' + (contentMetadata[contentType]?.name || '') + ' - read more on our blog!'
              ]
            }
          ]
        },
        'Email Campaigns': {
          emails: [
            {
              subject: 'Introducing: ' + (contentMetadata[contentType]?.name || ''),
              body: 'Dear [Customer],\n\nWe\'re excited to share our latest insights on ' + 
                (contentMetadata[contentType]?.name || '') + '.\n\n' +
                (keyMessages.join('\n\n') || '') + '\n\nBest regards,\nYour Company'
            },
            {
              subject: 'Follow-up: ' + (contentMetadata[contentType]?.name || ''),
              body: 'Dear [Customer],\n\nJust checking in to see if you had a chance to review our information about ' + 
                (contentMetadata[contentType]?.name || '') + '.\n\nLet us know if you have any questions.\n\nBest regards,\nYour Company'
            }
          ]
        },
        'eBooks & White Papers': {
          title: contentMetadata[contentType]?.name || 'Sample eBook',
          chapters: [
            'Introduction to ' + (contentMetadata[contentType]?.name || ''),
            'Key Concepts and Strategies',
            'Implementation Guide',
            'Case Studies and Results',
            'Conclusion and Next Steps'
          ],
          summary: 'This comprehensive guide covers everything you need to know about ' + 
            (contentMetadata[contentType]?.name || '') + '. Designed specifically for ' + 
            (targetAudience || 'your target audience') + ', this resource addresses: ' + 
            (keyMessages.join(', ') || 'key topics in your industry') + '.'
        }
      };
      
      // Set the generated content
      setGeneratedContent(prev => ({
        ...prev,
        [contentType]: sampleContent[contentType] || {
          title: contentMetadata[contentType]?.name || 'Generated Content',
          content: 'Sample content for ' + contentType + ' using key messages: ' + 
            (keyMessages.join(', ') || '') + '. Targeting: ' + 
            (targetAudience || 'your audience') + '.'
        }
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
    
    let content = '';
    let filename = ((contentMetadata[contentType]?.name || contentType).replace(/\s+/g, '_')) + '.txt';
    
    if (contentType === 'Blog Posts') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      generatedContent[contentType].sections.forEach(section => {
        content += `## ${section.heading}\n\n${section.content}\n\n`;
      });
    } else if (contentType === 'Social Posts') {
      content = `# Social Media Posts for: ${contentMetadata[contentType]?.name || ''}\n\n`;
      generatedContent[contentType].platforms.forEach(platform => {
        content += `## ${platform.name}\n\n`;
        platform.posts.forEach((post, i) => {
          content += `${i+1}. ${post}\n\n`;
        });
      });
    } else if (contentType === 'Email Campaigns') {
      content = `# Email Campaign for: ${contentMetadata[contentType]?.name || ''}\n\n`;
      generatedContent[contentType].emails.forEach((email, i) => {
        content += `## Email ${i+1}\n\nSubject: ${email.subject}\n\n${email.body}\n\n---\n\n`;
      });
    } else if (contentType === 'eBooks & White Papers') {
      content = `# ${generatedContent[contentType].title}\n\n`;
      content += `## Summary\n\n${generatedContent[contentType].summary}\n\n## Table of Contents\n\n`;
      generatedContent[contentType].chapters.forEach((chapter, i) => {
        content += `${i+1}. ${chapter}\n`;
      });
    } else {
      // Generic format for other content types
      content = `# ${contentMetadata[contentType]?.name || contentType}\n\n`;
      content += `## Content\n\n${generatedContent[contentType].content}\n\n`;
      content += `## Key Messages\n\n`;
      keyMessages.forEach((message, i) => {
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
      markdownContent += `# ${type}: ${contentMetadata[type]?.name || ''}\n\n`;
      
      // Add metadata
      markdownContent += `## Metadata\n\n`;
      markdownContent += `**Target Audience:** ${targetAudience || 'N/A'}\n\n`;
      
      markdownContent += `**Key Messages:**\n\n`;
      keyMessages.forEach((msg, i) => {
        if (msg?.trim()) {
          markdownContent += `${i+1}. ${msg}\n`;
        }
      });
      markdownContent += `\n`;
      
      // Add content based on type
      markdownContent += `## Content\n\n`;
      
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
      } else {
        markdownContent += generatedContent[type].content + '\n\n';
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
  
  // Content Creation View
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
      
      {/* Shared information section */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Shared Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-2 border rounded-lg h-20"
              placeholder="Describe who this content is targeting"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Key Messages</label>
            <div className="space-y-2">
              {keyMessages.map((message, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => updateKeyMessage(index, e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder={`Key message ${index + 1}`}
                  />
                </div>
              ))}
              <button
                onClick={addKeyMessage}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add another message
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Individual content cards */}
      {selectedContentTypes.map(contentType => (
        <Card key={contentType} className="mb-8">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle>{contentType}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Content name */}
              <div>
                <label className="block text-sm font-medium mb-1">Content Nickname</label>
                <input
                  type="text"
                  value={contentMetadata[contentType]?.name || ''}
                  onChange={(e) => updateContentName(contentType, e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder={`Give your ${contentType.toLowerCase()} a nickname`}
                />
              </div>
              
              {/* Generate button */}
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
              
              {/* Generated content preview */}
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
                  
                  {/* Content preview based on type */}
                  {contentType === 'Blog Posts' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">{generatedContent[contentType].title}</h4>
                      {generatedContent[contentType].sections.map((section, index) => (
                        <div key={index} className="mb-4">
                          <h5 className="font-medium mb-2">{section.heading}</h5>
                          <p className="text-slate-700 whitespace-pre-line">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {contentType === 'Social Posts' && (
                    <div className="space-y-4">
                      {generatedContent[contentType].platforms.map((platform, platformIndex) => (
                        <div key={platformIndex} className="mb-4">
                          <h5 className="font-medium mb-2">{platform.name} Posts</h5>
                          <div className="space-y-2">
                            {platform.posts.map((post, postIndex) => (
                              <div key={postIndex} className="p-3 bg-gray-50 rounded-lg border">
                                {post}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {contentType === 'Email Campaigns' && (
                    <div className="space-y-4">
                      {generatedContent[contentType].emails.map((email, index) => (
                        <div key={index} className="mb-4 border p-4 rounded-lg">
                          <h5 className="font-medium mb-2">Subject: {email.subject}</h5>
                          <p className="text-slate-700 whitespace-pre-line">{email.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {contentType === 'eBooks & White Papers' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">{generatedContent[contentType].title}</h4>
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Summary</h5>
                        <p className="text-slate-700">{generatedContent[contentType].summary}</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Chapters</h5>
                        <ol className="list-decimal list-inside pl-2">
                          {generatedContent[contentType].chapters.map((chapter, index) => (
                            <li key={index} className="mb-1 text-slate-700">{chapter}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {!['Blog Posts', 'Social Posts', 'Email Campaigns', 'eBooks & White Papers'].includes(contentType) && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">{generatedContent[contentType].title || 'Generated Content'}</h4>
                      <p className="text-slate-700">{generatedContent[contentType].content}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Generate all button */}
      <div className="flex justify-between mt-8">
        <button
          onClick={generateAllContent}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate All Content
        </button>
        
        {Object.keys(generatedContent).length > 0 && (
          <button
            onClick={exportAllContent}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export All Content
          </button>
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