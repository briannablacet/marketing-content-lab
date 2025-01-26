import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ContentStrategyStep = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeContent, setActiveContent] = useState(null);
  
  // Here's Where the Magic Happens: Our Content Mix Options
  const CONTENT_TYPES = {
    'Thought Leadership': {
      description: 'Build authority through expert insights',
      formats: ['Blog Posts', 'Whitepapers', 'Industry Reports'],
      effort: 'High',
      frequency: 'Weekly',
      aiSupport: ['Topic Research', 'Outline Generation', 'SEO Optimization']
    },
    'Case Studies': {
      description: 'Showcase customer success stories',
      formats: ['Written', 'Video', 'Infographic'],
      effort: 'Medium',
      frequency: 'Monthly',
      aiSupport: ['Structure Templates', 'ROI Calculation', 'Story Arc']
    },
    'Influencer Content': {
      description: 'Leverage industry thought leaders',
      formats: ['Collaborations', 'Takeovers', 'Joint Content'],
      effort: 'Medium',
      frequency: 'Monthly',
      aiSupport: ['Influencer Matching', 'Campaign Ideas', 'ROI Tracking']
    },
    'Social Media': {
      description: 'Engage audience across platforms',
      formats: ['Posts', 'Stories', 'Live Sessions'],
      effort: 'Low',
      frequency: 'Daily',
      aiSupport: ['Post Ideas', 'Hashtag Research', 'Engagement Analysis']
    },
    'Lead Magnets': {
      description: 'Generate qualified leads',
      formats: ['Ebooks', 'Templates', 'Toolkits'],
      effort: 'High',
      frequency: 'Quarterly',
      aiSupport: ['Topic Selection', 'Content Structure', 'CTA Optimization']
    },
    'Email Campaigns': {
      description: 'Nurture and convert prospects',
      formats: ['Newsletters', 'Drip Campaigns', 'Announcements'],
      effort: 'Medium',
      frequency: 'Weekly',
      aiSupport: ['Subject Lines', 'Email Flow', 'Segmentation']
    }
  };

  const ContentTypeCard = ({ type, details, isSelected, onClick }) => (
    <div
      className={`p-6 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{type}</h3>
          <p className="mt-2 text-sm text-slate-600">{details.description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
        }`}>
          {isSelected && <span className="text-white">✓</span>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {details.formats.map(format => (
          <span key={format} className="px-2 py-1 bg-slate-100 rounded text-sm">
            {format}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Effort Level</p>
          <p className="text-sm font-medium text-slate-700">{details.effort}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Frequency</p>
          <p className="text-sm font-medium text-slate-700">{details.frequency}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-slate-500 mb-2">AI Assistance Available:</p>
        <div className="flex flex-wrap gap-2">
          {details.aiSupport.map(feature => (
            <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              ✨ {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const ContentCreationPanel = ({ contentType, details }) => {
    const [step, setStep] = useState('plan');
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Create {contentType}</span>
            <button 
              onClick={() => setActiveContent(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Back to Types
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2 border-b">
              {['plan', 'create', 'review'].map(stepName => (
                <button
                  key={stepName}
                  onClick={() => setStep(stepName)}
                  className={`px-4 py-2 ${
                    step === stepName 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-slate-600'
                  }`}
                >
                  {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                </button>
              ))}
            </div>

            {step === 'plan' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Planning Assistant</h3>
                <div className="grid gap-4">
                  {details.aiSupport.map(feature => (
                    <button
                      key={feature}
                      className="p-4 text-left border rounded-lg hover:border-blue-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <span>{feature}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'create' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Content Creation</h3>
                <div className="grid gap-4">
                  {details.formats.map(format => (
                    <button
                      key={format}
                      className="p-4 text-left border rounded-lg hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between">
                        <span>{format}</span>
                        <span className="text-sm text-slate-500">Create →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Quality Check</h3>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <p className="text-sm text-slate-600">
                    AI assistant will review your content for:
                  </p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Brand voice consistency</li>
                    <li>• Message clarity</li>
                    <li>• Target audience alignment</li>
                    <li>• SEO optimization</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const content = (
    <div className="space-y-6">
      {!activeContent ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(CONTENT_TYPES).map(([type, details]) => (
              <ContentTypeCard
                key={type}
                type={type}
                details={details}
                isSelected={selectedTypes.includes(type)}
                onClick={() => {
                  if (selectedTypes.includes(type)) {
                    setActiveContent(type);
                  } else {
                    setSelectedTypes(prev => [...prev, type]);
                  }
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <ContentCreationPanel 
          contentType={activeContent} 
          details={CONTENT_TYPES[activeContent]} 
        />
      )}
    </div>
  );

  // If being used in a walkthrough, wrap with ScreenTemplate
  if (typeof ScreenTemplate !== 'undefined') {
    return (
      <ScreenTemplate
        title="Choose Your Content Mix"
        subtitle="Select and customize your marketing content strategy"
        aiInsights={[
          "Influencer partnerships could amplify your reach by 3x",
          "Your audience engages best with technical deep-dives",
          "Mix of educational and thought leadership content recommended"
        ]}
      >
        {content}
      </ScreenTemplate>
    );
  }

  // Standalone version
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Choose Your Content Mix</h1>
      {content}
    </div>
  );
};

export default ContentStrategyStep;