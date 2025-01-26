// src/components/features/ContentEnhancer/index.tsx
// Marketing content enhancement tools focused on written content improvement,
// research integration, and social optimization

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ContentEnhancer = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeTab, setActiveTab] = useState('enhance');

  const ENHANCEMENT_TOOLS = {
    'Content Optimizer': {
      type: 'writing',
      description: 'Make technical topics clear and compelling',
      capabilities: [
        'Benefit-focused language',
        'Technical term simplification',
        'Audience engagement checks'
      ]
    },
    'Research Assistant': {
      type: 'research',
      description: 'Find relevant statistics and market insights',
      capabilities: [
        'Industry stats lookup',
        'Market trend data',
        'ROI metrics'
      ]
    },
    'Social Optimizer': {
      type: 'social',
      description: 'Extract and optimize key points for social',
      capabilities: [
        'Key takeaway extraction',
        'Post suggestions',
        'Hashtag recommendations'
      ]
    }
  };

  const WritingEnhancementPanel = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Enhancement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paste your content
              </label>
              <textarea
                className="w-full p-2 border rounded min-h-[200px]"
                placeholder="Paste your content here for enhancement suggestions..."
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                ✨ Enhance Content
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                Readability Check
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded">
              <h4 className="font-medium mb-2">Enhancement Suggestions:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Make Benefits Clearer</p>
                      <p className="text-sm text-slate-600">
                        Consider rephrasing "advanced data processing" to highlight business impact
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">Apply</button>
                  </div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Add Social Proof</p>
                      <p className="text-sm text-slate-600">
                        Opportunity to include customer success metrics here
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">Readability</p>
              <p className="text-2xl font-bold text-green-600">Good</p>
              <p className="text-sm text-slate-600">Professional level</p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">Engagement</p>
              <p className="text-2xl font-bold text-blue-600">High</p>
              <p className="text-sm text-slate-600">Benefit-focused</p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">Tech Terms</p>
              <p className="text-2xl font-bold text-yellow-600">Check</p>
              <p className="text-sm text-slate-600">Some simplification needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ResearchPanel = () => (
    <div className="space-y-6">
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
                placeholder="e.g., B2B SaaS adoption rates, marketing ROI stats..."
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
                      <p className="font-medium">2024 B2B Marketing Report</p>
                      <p className="text-sm text-slate-600">
                        "73% of B2B buyers rely on thought leadership when making decisions"
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">Add</button>
                  </div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">ROI Study</p>
                      <p className="text-sm text-slate-600">
                        "Marketing automation increases sales productivity by 14.5%"
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
    </div>
  );

  const SocialPanel = () => (
    <div className="space-y-6">
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
                placeholder="Paste your article or content to generate social posts..."
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
                    🚀 New research shows 73% of B2B buyers rely on thought leadership...
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs text-blue-600">#B2BMarketing</span>
                    <span className="text-xs text-blue-600">#ThoughtLeadership</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm mb-2">Twitter Post:</p>
                  <p className="text-slate-600">
                    Did you know? Marketing automation boosts sales productivity by 14.5%...
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs text-blue-600">#MarketingROI</span>
                    <span className="text-xs text-blue-600">#B2B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* Tool Selection */}
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

      {/* Enhancement Interface */}
      {selectedTool && (
        <>
          {selectedTool === 'Content Optimizer' && <WritingEnhancementPanel />}
          {selectedTool === 'Research Assistant' && <ResearchPanel />}
          {selectedTool === 'Social Optimizer' && <SocialPanel />}
        </>
      )}
    </div>
  );

  // If being used in a walkthrough, wrap with ScreenTemplate
  if (typeof ScreenTemplate !== 'undefined') {
    return (
      <ScreenTemplate
        title="Enhance Your Content"
        subtitle="Make your content more engaging and impactful"
        aiInsights={[
          "Your audience responds well to ROI-focused content",
          "Consider adding recent industry statistics for credibility",
          "Key technical terms could be simplified for better engagement"
        ]}
      >
        {content}
      </ScreenTemplate>
    );
  }

  // Standalone version
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Enhance Your Content</h1>
      {content}
    </div>
  );
};

export default ContentEnhancer;