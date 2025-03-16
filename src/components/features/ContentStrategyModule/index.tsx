// src/components/features/ContentStrategyModule/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CONTENT_TYPES } from '../../../data/contentTypesData';
import { useContent } from '../../../context/ContentContext';
import { PlusCircle, ChevronRight, Sparkles, RefreshCw, Download, CheckCircle, Edit, Save } from 'lucide-react';

const ContentStrategyModule = () => {
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Stop any bubbling of events
              if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
              
              // Force state update with callback to ensure it completes
              setCurrentView('creation');
              
              // Block any default navigation behavior
              window.history.pushState({}, '', window.location.pathname);
              
              return false;
            }}
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
    {/* All your existing content here */}

    {/* Bottom action buttons - improved styling */}
    <div className="mt-12 border-t pt-6 flex justify-between items-center">
      
      
      <div className="flex space-x-4">
        <button
          onClick={generateAllContent}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          disabled={selectedContentTypes.length === 0}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate All
        </button>
        
        {Object.keys(generatedContent).length > 0 && (
          <div className="flex space-x-4">
            <button
              onClick={() => {
                localStorage.setItem('savedContentStrategy', JSON.stringify({
                  contentTypes: selectedContentTypes,
                  metadata: contentMetadata,
                  keyMessages: keyMessages,
                  targetAudience: targetAudience,
                  generatedContent: generatedContent
                }));
                alert('Content strategy saved successfully!');
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            
            <button
              onClick={exportAllContent}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        )}
      </div>
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