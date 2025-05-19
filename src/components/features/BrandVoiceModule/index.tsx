// src/components/features/BrandVoiceModule/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { HelpCircle, Info } from 'lucide-react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

interface Props {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

const BRAND_ARCHETYPES = [
  { name: 'The Creator', description: 'Innovative, artistic, striving for authentic self-expression', example: 'Adobe, Lego, Apple', defaultTone: 'Inspirational', defaultPersonality: ['Innovative', 'Empathetic', 'Playful'] },
  { name: 'The Caregiver', description: 'Nurturing, compassionate, focused on helping others', example: 'Johnson & Johnson, UNICEF, Cleveland Clinic', defaultTone: 'Empathetic', defaultPersonality: ['Empathetic', 'Trustworthy', 'Friendly'] },
  { name: 'The Ruler', description: 'Authoritative, responsible, providing structure and control', example: 'Microsoft, Mercedes-Benz, American Express', defaultTone: 'Formal', defaultPersonality: ['Authoritative', 'Professional', 'Trustworthy'] },
  { name: 'The Jester', description: 'Playful, humorous, living in the moment', example: 'Old Spice, Dollar Shave Club, M&Ms', defaultTone: 'Conversational', defaultPersonality: ['Playful', 'Bold', 'Friendly'] },
  { name: 'The Regular Guy/Gal', description: 'Relatable, authentic, down-to-earth values', example: 'IKEA, Target, Budweiser', defaultTone: 'Neutral', defaultPersonality: ['Friendly', 'Trustworthy', 'Professional'] },
  { name: 'The Lover', description: 'Passionate, sensual, focused on relationships and experiences', example: "Victoria's Secret, Godiva, Häagen-Dazs", defaultTone: 'Inspirational', defaultPersonality: ['Empathetic', 'Bold', 'Playful'] },
  { name: 'The Hero', description: 'Brave, determined, overcoming challenges and adversity', example: 'Nike, FedEx, U.S. Army', defaultTone: 'Persuasive', defaultPersonality: ['Bold', 'Authoritative', 'Inspirational'] },
  { name: 'The Outlaw', description: 'Rebellious, disruptive, challenging the status quo', example: 'Harley-Davidson, Virgin, Red Bull', defaultTone: 'Bold', defaultPersonality: ['Bold', 'Rebellious', 'Playful'] },
  { name: 'The Magician', description: 'Visionary, transformative, making dreams reality', example: 'Disney, Tesla, Dyson', defaultTone: 'Inspirational', defaultPersonality: ['Innovative', 'Bold', 'Professional'] },
  { name: 'The Innocent', description: 'Optimistic, pure, honest and straightforward', example: 'Coca-Cola, Dove, Whole Foods', defaultTone: 'Conversational', defaultPersonality: ['Friendly', 'Empathetic', 'Trustworthy'] },
  { name: 'The Explorer', description: 'Adventurous, independent, seeking discovery and freedom', example: 'Jeep, Patagonia, National Geographic', defaultTone: 'Inspirational', defaultPersonality: ['Bold', 'Professional', 'Empathetic'] },
  { name: 'The Sage', description: 'Knowledgeable, wise, sharing expertise and insight', example: 'Google, BBC, The Economist', defaultTone: 'Educational', defaultPersonality: ['Professional', 'Authoritative', 'Trustworthy'] }
];

const TONE_OPTIONS = ['Formal', 'Neutral', 'Conversational', 'Technical', 'Inspirational', 'Educational', 'Persuasive'];
const PERSONALITY_OPTIONS = ['Professional', 'Friendly', 'Authoritative', 'Innovative', 'Playful', 'Trustworthy', 'Empathetic', 'Bold'];

const TONE_EXAMPLES: Record<string, string> = {
  Formal: 'We are pleased to announce the launch of our new platform, which offers significant advantages to marketing professionals.',
  Neutral: 'Our new platform is now available. It helps marketing professionals create better content more efficiently.',
  Conversational: "Guess what? We just launched our new platform! You're going to love how it makes content creation so much easier.",
  Technical: 'The Marketing Content Lab platform utilizes advanced NLP algorithms to generate semantically coherent content with 37% higher engagement metrics.',
  Inspirational: 'Transform your content marketing with a platform that empowers you to create authentic connections that resonate with your audience.',
  Educational: 'Content marketing involves creating valuable content that attracts and engages your target audience. Our platform simplifies this process.',
  Persuasive: 'Stop wasting time on ineffective content. Our platform delivers results that will dramatically improve your marketing ROI.'
};

const HelpText = ({ text, link }: { text: string; link?: string }) => (
  <div className="group relative inline-block">
    <HelpCircle className="h-4 w-4 inline text-gray-400 hover:text-gray-600 cursor-help ml-1" />
    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded p-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
      {text}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-300 hover:text-blue-200 mt-1 text-xs"
        >
          Learn more →
        </a>
      )}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
        <div className="border-8 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  </div>
);

const BrandVoiceModuleContent: React.FC<Props> = ({ isWalkthrough, onNext, onBack }) => {
  const { brandVoice, updateBrandVoice } = useBrandVoice();
  console.log('Current brand voice state:', JSON.stringify(brandVoice, null, 2));

  const [isSaving, setIsSaving] = useState(false);
  const [showExample, setShowExample] = useState<{ type: 'tone' | 'personality'; value: string } | null>(null);
  const router = useRouter();

  const handleBrandVoiceUpdate = (field: string, value: any) => {
    console.log('Updating field:', field, 'with value:', value);
    updateBrandVoice({
      brandVoice: {
        ...brandVoice.brandVoice,
        [field]: value
      }
    });
  };

  const handleArchetypeChange = (value: string) => {
    console.log('Selected value:', value);
    const selected = BRAND_ARCHETYPES.find(a => a.name === value);
    console.log('Found archetype:', selected);
    if (selected) {
      updateBrandVoice({
        brandVoice: {
          ...brandVoice.brandVoice,
          archetype: selected.name,
          tone: selected.defaultTone,
          personality: selected.defaultPersonality
        }
      });
    } else {
      updateBrandVoice({
        brandVoice: {
          ...brandVoice.brandVoice,
          archetype: ''
        }
      });
    }
  };

  const togglePersonality = (trait: string) => {
    const current = brandVoice.brandVoice.personality || [];
    const updated = current.includes(trait)
      ? current.filter((p: string) => p !== trait)
      : [...current, trait].slice(0, 3);
    handleBrandVoiceUpdate('personality', updated);
  };

  const saveAndContinue = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isWalkthrough && onNext) {
        onNext();
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Set the vibe with voice and tone!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brand Archetype
                  <span className="inline-block align-middle ml-1">
                    <a
                      href="https://iconicfox.com.au/brand-archetypes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Learn more
                    </a>
                  </span>
                </label>
                <select
                  value={brandVoice.brandVoice.archetype}
                  onChange={(e) => handleArchetypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a Brand Archetype</option>
                  {BRAND_ARCHETYPES.map(a => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
                {(() => {
                  console.log('Rendering with archetype:', brandVoice.brandVoice.archetype);
                  return null;
                })()}
                {brandVoice.brandVoice.archetype && (
                  <p className="text-sm text-gray-600 mt-2">
                    {BRAND_ARCHETYPES.find(a => a.name === brandVoice.brandVoice.archetype)?.description}<br />
                    <span className="text-gray-500">Examples: {BRAND_ARCHETYPES.find(a => a.name === brandVoice.brandVoice.archetype)?.example}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dominant Tone</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TONE_OPTIONS.map(tone => (
                    <div key={tone} className="flex items-center">
                      <input
                        type="radio"
                        id={`tone-${tone}`}
                        name="tone"
                        checked={brandVoice.brandVoice.tone === tone}
                        onChange={() => handleBrandVoiceUpdate('tone', tone)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                      />
                      <label htmlFor={`tone-${tone}`} className="text-sm text-gray-700">
                        {tone}
                      </label>
                      <button
                        onClick={() => setShowExample({ type: 'tone', value: tone })}
                        className="ml-2 text-gray-400 hover:text-blue-600"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {brandVoice.brandVoice.tone && (
                  <div className="mt-4 bg-gray-50 p-4 rounded border text-sm text-gray-600">
                    <strong>Example:</strong> {TONE_EXAMPLES[brandVoice.brandVoice.tone]}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand Personality</label>
                <p className="text-xs text-gray-500 mb-2">Select up to 3 traits</p>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITY_OPTIONS.map(trait => (
                    <button
                      key={trait}
                      onClick={() => togglePersonality(trait)}
                      className={`px-3 py-1.5 rounded-full text-sm ${brandVoice.brandVoice.personality?.includes(trait)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  If your brand was a person, what would their personality be like?
                  <HelpText text="Describe your brand's personality in your own words. This helps create a more nuanced understanding of your brand's character." />
                </label>
                <textarea
                  value={brandVoice.brandVoice.brandPersonality}
                  onChange={(e) => handleBrandVoiceUpdate('brandPersonality', e.target.value)}
                  placeholder="e.g., Our brand is like a wise mentor who's also approachable and friendly. We're knowledgeable but never condescending, and we always take time to explain things clearly."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px] resize-y"
                />
              </div>

              {showExample && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                    <h3 className="text-lg font-semibold mb-3">
                      {showExample.type === 'tone' ? 'Tone Example' : 'Personality Example'}: {showExample.value}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {TONE_EXAMPLES[showExample.value]}
                    </p>
                    <div className="text-right">
                      <button
                        onClick={() => setShowExample(null)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!isWalkthrough && (
          <div className="flex justify-between items-center pt-6">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              ← Back
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={saveAndContinue}
                disabled={isSaving}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create a client-side only version of the component
const BrandVoiceModule = dynamic(() => Promise.resolve(BrandVoiceModuleContent), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Set the vibe with voice and tone!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
});

export default BrandVoiceModule;
