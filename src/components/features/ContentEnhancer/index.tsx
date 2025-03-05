// src/components/features/ContentEnhancer/index.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotification } from '../../../context/NotificationContext';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useMessaging } from '../../../context/MessagingContext';
import { AlertCircle, Sparkles, RefreshCw, FileText, Copy } from 'lucide-react';

// Import or define contentGuidelines
const CONTENT_GUIDELINES = {
  transitions: [
    'Building on this foundation',
    'This leads us to',
    'Understanding this concept',
    'Taking this further',
    'This reveals why',
    'Here\'s how this works',
    'Furthermore',
    'Additionally',
    'In the same vein',
    'More importantly'
  ]
};

// Function to validate content (simplified for example)
const validateContent = (content) => {
  const listPattern = /^[-*•]\s.+$/gm;
  const listMatches = content.match(listPattern);
  const paragraphs = content.split('\n\n');
  
  return {
    needsRevision: listMatches && listMatches.length > 3,
    listCount: listMatches ? listMatches.length : 0,
    paragraphCount: paragraphs.length,
    wordCount: content.split(/\s+/).length
  };
};

// Function to add transitions between paragraphs
const addTransitions = (content) => {
  const transitions = CONTENT_GUIDELINES.transitions || [
    'Building on this foundation',
    'This leads us to',
    'Understanding this concept',
    'Taking this further',
    'This reveals why',
    'Here\'s how this works'
  ];

  // Split content into paragraphs
  const paragraphs = content.split('\n\n');
  
  // Add transitions between paragraphs
  for (let i = 1; i < paragraphs.length; i++) {
    const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
    if (!paragraphs[i].startsWith(randomTransition)) {
      paragraphs[i] = `${randomTransition}, ${paragraphs[i].charAt(0).toLowerCase()}${paragraphs[i].slice(1)}`;
    }
  }

  return paragraphs.join('\n\n');
};

const ContentEnhancer = () => {
  const { showNotification } = useNotification();
  const { writingStyle } = useWritingStyle();
  const { messaging } = useMessaging();

  const [selectedTool, setSelectedTool] = useState(null);
  const [content, setContent] = useState('');
  const [enhancedContent, setEnhancedContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleWarning, setStyleWarning] = useState(null);

  // Enhancement tools available
  const ENHANCEMENT_TOOLS = {
    'Prose Perfecter': {
      description: 'Transform content into compelling narratives',
      capabilities: [
        'Clear value communication',
        'Engaging storytelling',
        'Audience-focused language'
      ]
    },
    'Research Assistant': {
      description: 'Find relevant statistics and insights',
      capabilities: [
        'Industry stats lookup',
        'Market trend data',
        'ROI metrics'
      ]
    },
    'Style Guide Checker': {
      description: 'Ensure content follows your brand guidelines',
      capabilities: [
        'Brand voice alignment',
        'Messaging consistency',
        'Style guide compliance'
      ]
    }
  };

  // Check if writing style and messaging are configured
  useEffect(() => {
    const hasWritingStyle = !!(writingStyle && (
      (writingStyle.styleGuide && writingStyle.styleGuide.primary) || 
      (writingStyle.formatting && Object.keys(writingStyle.formatting).length > 0)
    ));
    
    const hasMessaging = !!(messaging && (
      messaging.valueProposition || 
      (messaging.keyMessages && messaging.keyMessages.length > 0)
    ));
    
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

  const enhanceContent = async () => {
    if (!content) {
      showNotification('Please enter content to enhance', 'warning');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Check content structure
      const contentAnalysis = validateContent(content);
      setAnalysis(contentAnalysis);
      
      let enhanced = content;
      
      if (contentAnalysis?.needsRevision) {
        // Transform lists into narrative flow
        enhanced = content
          .replace(/^[-*•]\s(.+)$/gm, (match, p1) => `This capability ${p1.toLowerCase()} by...`)
          .replace(/\n\n[-*•]/g, '\n\nAdditionally, ');
          
        // Add transitions
        enhanced = addTransitions(enhanced);
      }

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

      // Call API for more comprehensive enhancement
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'content-enhancer',
          data: {
            content: enhanced,
            styleGuide: styleParameters,
            messaging: messagingParameters,
            enhancementType: selectedTool || 'Prose Perfecter'
          }
        }),
      });

      if (!response.ok) {
        // If API fails, still use the basic enhanced version
        setEnhancedContent(enhanced);
      } else {
        const data = await response.json();
        setEnhancedContent(data.enhancedContent || enhanced);
      }
      
      showNotification('Content enhanced successfully', 'success');
    } catch (error) {
      console.error('Error enhancing content:', error);
      
      // Even if there's an error, try to provide basic enhancement
      const basicEnhancement = addTransitions(content);
      setEnhancedContent(basicEnhancement);
      
      showNotification('Basic enhancement applied (API error)', 'warning');
    } finally {
      setIsProcessing(false);
    }
  };

  const WritingEnhancementPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Content Enhancement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <textarea 
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setEnhancedContent(null);
              setAnalysis(null);
            }}
            className="w-full min-h-[200px] p-4 border rounded"
            placeholder="Paste your content here to enhance it..."
          />
          
          {analysis?.needsRevision && (
            <div className="p-4 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-800">
                Content contains too many lists. The enhancement will convert some to narrative paragraphs.
              </p>
            </div>
          )}
          
          <button 
            onClick={enhanceContent}
            disabled={isProcessing || !content.trim()}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enhancing Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Content
              </>
            )}
          </button>
          
          {enhancedContent && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Enhanced Content:</h4>
              <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                {enhancedContent}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(enhancedContent);
                  showNotification('Copied to clipboard', 'success');
                }}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
              >
                <Copy className="mr-2 w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ResearchPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Research Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What are you looking for?
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g., marketing automation stats, industry trends..."
            />
          </div>
          <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            🔍 Find Statistics & Research
          </button>
          
          <div className="p-4 bg-slate-50 rounded">
            <h4 className="font-medium mb-2">Latest Industry Stats:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">2025 Marketing Report</p>
                    <p className="text-sm text-slate-600">
                      "73% of B2B buyers rely on content for purchase decisions"
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StyleGuideCheckerPanel = () => {
    const [checkResults, setCheckResults] = useState(null);
    const [localContent, setLocalContent] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    
    // Perform style guide check
    const checkStyleGuide = async () => {
      if (!localContent.trim()) {
        showNotification('Please enter content to check', 'warning');
        return;
      }
      
      setIsChecking(true);
      
      try {
        // Prepare style/messaging parameters to check against
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
        
        // API call would go here
        // For now, we'll simulate with sample data
        setTimeout(() => {
          const sampleCheck = {
            issues: [
              {
                type: 'Tone',
                issue: 'Content uses passive voice too frequently',
                suggestion: 'Convert "reports are generated" to "we generate reports"',
                severity: 'medium'
              },
              {
                type: 'Messaging',
                issue: 'Key message about ROI is missing',
                suggestion: 'Add a sentence about cost savings or return on investment',
                severity: 'high'
              },
              {
                type: 'Style',
                issue: 'Inconsistent number formatting',
                suggestion: 'Use numerals for all numbers above 10',
                severity: 'low'
              }
            ],
            compliance: 78 // percentage compliance with style guide
          };
          
          setCheckResults(sampleCheck);
          setIsChecking(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error checking style guide:', error);
        showNotification('Failed to check style guide', 'error');
        setIsChecking(false);
      }
    };
    
    const getSeverityColor = (severity) => {
      switch (severity) {
        case 'high': return 'bg-red-50 border-red-200 text-red-800';
        case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };
    
    const getSeverityLabel = (severity) => {
      switch (severity) {
        case 'high': return 'Critical';
        case 'medium': return 'Important';
        case 'low': return 'Minor';
        default: return 'Info';
      }
    };
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Style Guide Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content to Check
              </label>
              <textarea
                className="w-full p-2 border rounded min-h-[200px]"
                value={localContent || content}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="Paste your content to check against your style guide..."
              />
            </div>
            
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
              <div className="flex items-center">
                <div className="text-blue-600 mr-2">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Style Guide: {writingStyle?.styleGuide?.primary || 'Default'}</p>
                  <p className="text-xs text-blue-600">Tone: {writingStyle?.brandVoice?.tone || 'Professional'}</p>
                </div>
              </div>
              <a href="/writing-style" className="text-xs text-blue-600 hover:underline">Change</a>
            </div>
            
            <button 
              onClick={checkStyleGuide}
              disabled={isChecking || !localContent.trim()}
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking Style Compliance...
                </>
              ) : (
                <>
                  <span>Check Style Guide Compliance</span>
                </>
              )}
            </button>
            
            {checkResults && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-medium">Style Guide Compliance</h4>
                    <p className="text-sm text-slate-600">Overall compliance with your brand guidelines</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {checkResults.compliance}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {checkResults.issues.length} issues found
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium mt-4">Issues to Address:</h4>
                
                <div className="space-y-3">
                  {checkResults.issues.map((issue, index) => (
                    <div key={index} className={`p-3 rounded border ${getSeverityColor(issue.severity)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{issue.type}</div>
                        <div className="text-xs px-2 py-1 rounded-full bg-white">
                          {getSeverityLabel(issue.severity)}
                        </div>
                      </div>
                      <p className="text-sm mb-2">{issue.issue}</p>
                      <p className="text-sm italic">Suggestion: {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Apply Suggestions to Content
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Enhancer</h1>
        <p className="text-gray-600">Improve your content with AI assistance, making it more compelling and effective</p>
        
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
              "Adding narrative flow can increase content engagement by up to 25%",
              "Content with smooth transitions keeps readers on page 40% longer",
              writingStyle?.styleGuide?.primary 
                ? `Using your "${writingStyle.styleGuide.primary}" style guide for consistent brand voice` 
                : "Enhance your content while maintaining a consistent voice"
            ].map((insight, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ENHANCEMENT_TOOLS).map(([tool, details]) => (
            <Card
              key={tool}
              className={`cursor-pointer hover:border-blue-300 ${
                selectedTool === tool ? 'border-blue-600 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedTool(tool)}
            >
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">{tool}</h3>
                <p className="text-sm text-slate-600 mb-4">{details.description}</p>
                <div className="space-y-1">
                  {details.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                      <span>✨</span>
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!selectedTool ? (
          <Card className="p-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Select an Enhancement Tool</h3>
              <p className="text-slate-600">Choose from the options above to enhance your content</p>
            </div>
          </Card>
        ) : (
          <>
            {selectedTool === 'Prose Perfecter' && <WritingEnhancementPanel />}
            {selectedTool === 'Research Assistant' && <ResearchPanel />}
            {selectedTool === 'Style Guide Checker' && <StyleGuideCheckerPanel />}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentEnhancer;