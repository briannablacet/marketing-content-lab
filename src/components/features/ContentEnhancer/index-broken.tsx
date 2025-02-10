// src/components/features/ContentEnhancer/index.tsx
// Enhanced content creator focused on making content compelling and accessible

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CONTENT_GUIDELINES, validateContent } from './contentGuidelines';

// Function to add transitions between paragraphs
const addTransitions = (content: string) => {
  const transitions = [
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
    paragraphs[i] = `${randomTransition}, ${paragraphs[i].toLowerCase()}`;
  }

  return paragraphs.join('\n\n');
};

const ContentEnhancer = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  
  const ENHANCEMENT_TOOLS = {
    'Content Enhancer': {
      description: 'Make content compelling and accessible',
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
    'Social Optimizer': {
      description: 'Create social-ready content',
      capabilities: [
        'Key takeaway extraction',
        'Post suggestions',
        'Hashtag recommendations'
      ]
    }
  };

  const WritingEnhancementPanel = () => {
    const [content, setContent] = useState('');
    const [analysis, setAnalysis] = useState(null);
  
    const enhanceContent = async () => {
      // Check content structure
      const analysis = validateContent(content);
      
      if (analysis.needsRevision) {
        // Transform lists into narrative flow
        let enhanced = content
          .replace(/^[-*•]\s(.+)$/gm, (match, p1) => `This capability ${p1.toLowerCase()} by...`)
          .replace(/\n\n[-*•]/g, '\n\nAdditionally, ');
          
        // Add transitions
        enhanced = addTransitions(enhanced);
        
        return enhanced;
      }
      
      return content;
    };
  
    return (
      <div className="space-y-4">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] p-4 border rounded"
        />
        
        {analysis?.needsRevision && (
          <div className="p-4 bg-yellow-50 rounded">
            <p className="text-sm text-yellow-800">
              Content contains too many lists. Consider converting some to narrative paragraphs.
            </p>
          </div>
        )}
        
        <button 
          onClick={enhanceContent}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Enhance Content
        </button>
      </div>
    );
  };

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
                    <p className="font-medium">2024 Marketing Report</p>
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

  const SocialPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Social Content Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source Content
            </label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Paste your content to generate social posts..."
            />
          </div>
          <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ✨ Generate Social Posts
          </button>
          
          <div className="p-4 bg-slate-50 rounded">
            <h4 className="font-medium mb-2">Suggested Posts:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm mb-2">LinkedIn Post:</p>
                <p className="text-slate-600">
                  [Generated post preview]
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const content = (
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

      {selectedTool && (
        <>
          {selectedTool === 'Content Enhancer' && <WritingEnhancementPanel />}
          {selectedTool === 'Research Assistant' && <ResearchPanel />}
          {selectedTool === 'Social Optimizer' && <SocialPanel />}
        </>
      )}
    </div>
  );

  if (typeof ScreenTemplate !== 'undefined') {
    return (
      <ScreenTemplate
        title="Enhance Your Content"
        subtitle="Make your content compelling and impactful"
        aiInsights={[
          "Your audience responds well to clear business benefits",
          "Adding relevant stats increases engagement by 40%",
          "Consider including customer success examples"
        ]}
      >
        {content}
      </ScreenTemplate>
    );
  }

   return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Enhance Your Content</h1>
      {/* Existing content rendering logic */}
    </div>
  );
};

export default ContentEnhancer;