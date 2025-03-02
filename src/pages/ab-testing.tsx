// src/pages/ab-testing.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { NotificationProvider } from '../context/NotificationContext';
import { Copy, CheckCircle } from 'lucide-react';

// Content types that can be A/B tested
const CONTENT_TYPES = [
  {
    id: 'email_subject',
    name: 'Email Subject Lines',
    description: 'Test different subject lines to improve open rates',
    examples: ['Benefit-focused', 'Question-based', 'Curiosity-driven']
  },
  {
    id: 'cta',
    name: 'Call-to-Action Variations',
    description: 'Test different CTAs to improve click-through rates',
    examples: ['Action-oriented', 'Benefit-focused', 'Urgency-driven']
  },
  {
    id: 'headline',
    name: 'Content Headlines',
    description: 'Test headline variations to improve engagement',
    examples: ['Question headlines', 'How-to headlines', 'List headlines']
  },
  {
    id: 'value_prop',
    name: 'Value Proposition Phrasing',
    description: 'Test different ways to communicate your value',
    examples: ['Feature-focused', 'Benefit-focused', 'Problem-solution']
  },
  {
    id: 'ad_copy',
    name: 'Ad Copy',
    description: 'Test different ad variations to improve conversions',
    examples: ['Feature highlight', 'Social proof', 'Limited time offer']
  }
];

const ABTesting: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [contentContext, setContentContext] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [numVariations, setNumVariations] = useState(2);
  const [variations, setVariations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Get the currently selected content type
  const selectedContentType = CONTENT_TYPES.find(type => type.id === selectedType);

  // Function to generate content variations
  const generateVariations = async () => {
    if (!selectedType || !contentContext) return;
    
    setIsGenerating(true);
    
    // In a real implementation, this would call your API
    setTimeout(() => {
      const fakeVariations = [];
      for (let i = 0; i < numVariations; i++) {
        fakeVariations.push(`[Variation ${i + 1}] AI-generated ${selectedContentType?.name} based on: "${contentContext}" for audience: "${targetAudience || 'general'}"`);
      }
      setVariations(fakeVariations);
      setIsGenerating(false);
    }, 2000);
  };

  // Handle copy to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Type selection view
  const renderTypeSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {CONTENT_TYPES.map(type => (
        <Card 
          key={type.id}
          className={`cursor-pointer hover:shadow-md transition-all ${
            selectedType === type.id ? 'border-2 border-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => setSelectedType(type.id)}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{type.description}</p>
            <div className="text-xs text-slate-500">
              Examples: {type.examples.join(', ')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Content input view
  const renderContentInput = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{selectedContentType?.name} A/B Testing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Content Context</label>
            <textarea
              value={contentContext}
              onChange={(e) => setContentContext(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows={4}
              placeholder={`Describe what you're trying to communicate (e.g., "Announcing our new feature that helps users save time")`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., Marketing professionals, IT decision makers"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Number of Variations</label>
            <select
              value={numVariations}
              onChange={(e) => setNumVariations(Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
            >
              {[2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={generateVariations}
            disabled={!contentContext || isGenerating}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
          >
            <span className="text-yellow-300 mr-1">✨</span>
            {isGenerating ? 'Generating Variations...' : 'Generate Variations'}
          </button>
        </div>
      </CardContent>
    </Card>
  );

  // Variations display
  const renderVariations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Generated Variations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {variations.map((variation, index) => (
            <div key={index} className="p-4 border rounded-lg bg-slate-50 relative group">
              <div className="flex justify-between">
                <div className="flex-1 pr-10">
                  <p className="text-slate-900">{variation}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(variation, index)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 group-hover:opacity-100 transition-all"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-slate-500">Variation {index + 1}</span>
                <div className="flex gap-2">
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <NotificationProvider>
      <ScreenTemplate
        title="A/B Content Creator"
        subtitle="Generate multiple content variations to test with your audience"
        aiInsights={[
          "A/B testing can improve conversion rates by 20-30%",
          "Testing 3-5 variations provides the most reliable results",
          "Focus on testing one element at a time for clearest insights"
        ]}
      >
        <div className="space-y-6">
          {!selectedType ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Select Content Type to Test</h2>
              {renderTypeSelection()}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create {selectedContentType?.name} Variations</h2>
                <button 
                  onClick={() => {
                    setSelectedType(null);
                    setVariations([]);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Change type
                </button>
              </div>
              
              {renderContentInput()}
              
              {variations.length > 0 && renderVariations()}
            </>
          )}
        </div>
      </ScreenTemplate>
    </NotificationProvider>
  );
};

export default ABTesting;