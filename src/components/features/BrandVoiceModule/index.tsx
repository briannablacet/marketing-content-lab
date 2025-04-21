// src/components/features/BrandVoiceModule/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { HelpCircle } from 'lucide-react';
import { useRouter } from 'next/router';

interface Props {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

// Complete Brand Archetypes for BrandVoiceModule/index.tsx
const BRAND_ARCHETYPES = [
  {
    name: 'The Creator',
    description: 'Innovative, artistic, striving for authentic self-expression',
    example: 'Adobe, Lego, Apple'
  },
  {
    name: 'The Caregiver',
    description: 'Nurturing, compassionate, focused on helping others',
    example: 'Johnson & Johnson, UNICEF, Cleveland Clinic'
  },
  {
    name: 'The Ruler',
    description: 'Authoritative, responsible, providing structure and control',
    example: 'Microsoft, Mercedes-Benz, American Express'
  },
  {
    name: 'The Jester',
    description: 'Playful, humorous, living in the moment',
    example: 'Old Spice, Dollar Shave Club, M&Ms'
  },
  {
    name: 'The Regular Guy/Gal',
    description: 'Relatable, authentic, down-to-earth values',
    example: 'IKEA, Target, Budweiser'
  },
  {
    name: 'The Lover',
    description: 'Passionate, sensual, focused on relationships and experiences',
    example: 'Victoria\'s Secret, Godiva, Häagen-Dazs'
  },
  {
    name: 'The Hero',
    description: 'Brave, determined, overcoming challenges and adversity',
    example: 'Nike, FedEx, U.S. Army'
  },
  {
    name: 'The Outlaw',
    description: 'Rebellious, disruptive, challenging the status quo',
    example: 'Harley-Davidson, Virgin, Red Bull'
  },
  {
    name: 'The Magician',
    description: 'Visionary, transformative, making dreams reality',
    example: 'Disney, Tesla, Dyson'
  },
  {
    name: 'The Innocent',
    description: 'Optimistic, pure, honest and straightforward',
    example: 'Coca-Cola, Dove, Whole Foods'
  },
  {
    name: 'The Explorer',
    description: 'Adventurous, independent, seeking discovery and freedom',
    example: 'Jeep, Patagonia, National Geographic'
  },
  {
    name: 'The Sage',
    description: 'Knowledgeable, wise, sharing expertise and insight',
    example: 'Google, BBC, The Economist'
  }
];

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

const BrandVoiceModule: React.FC<Props> = ({ isWalkthrough, onNext, onBack }) => {
  const { brandVoice, updateBrandVoice } = useBrandVoice();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  // Load saved messaging data from previous steps
  useEffect(() => {
    // Try to load audience data
    try {
      const audienceData = localStorage.getItem('marketingTargetAudience');
      const messagingData = localStorage.getItem('marketingMessages');

      if (audienceData) {
        const audience = JSON.parse(audienceData);
        // Pre-populate the primary audience field
        if (audience.role) {
          updateBrandVoice({
            brandVoice: {
              ...brandVoice.brandVoice,
              audience: `${audience.role} in ${audience.industry}`
            }
          });
        }
      }

      if (messagingData) {
        const messaging = JSON.parse(messagingData);
        // Pre-populate key terms from differentiators or benefits if available
        let keyTerms = '';
        if (messaging.differentiators && messaging.differentiators.length > 0) {
          // Extract key terms from differentiators
          const terms = messaging.differentiators
            .filter(diff => diff.trim())
            .map(diff => {
              // Extract important words or phrases
              const words = diff.split(' ');
              return words.filter(word => word.length > 3).slice(0, 2).join(' ');
            })
            .join(', ');

          keyTerms = terms;
        }

        if (keyTerms) {
          updateBrandVoice({
            contentGuidelines: {
              ...brandVoice.contentGuidelines,
              preferred: keyTerms
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading data from previous steps:', error);
    }
  }, []);

  const handleBrandVoiceUpdate = (field: string, value: string): void => {
    updateBrandVoice({
      brandVoice: {
        ...brandVoice.brandVoice,
        [field]: value
      }
    });
  };

  const saveAndContinue = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isWalkthrough && onNext) {
        onNext();
      } else {
        // If not in walkthrough, redirect to dashboard or handle accordingly
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
            <CardTitle>Set the vibe with voice and tone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brand Archetype
                  <HelpText
                    text="Brand archetypes are universal character patterns that help define your brand's personality and connect with your audience."
                    link="https://iconicfox.com.au/brand-archetypes/"
                  />
                  <span className="text-gray-500 text-sm ml-2">(Optional)</span>
                </label>
                <select
                  value={brandVoice.brandVoice.archetype || ''}
                  onChange={(e) => handleBrandVoiceUpdate('archetype', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a Brand Archetype</option>
                  {BRAND_ARCHETYPES.map(archetype => (
                    <option key={archetype.name} value={archetype.name}>{archetype.name}</option>
                  ))}
                </select>
                {brandVoice.brandVoice.archetype && (
                  <p className="text-sm text-gray-600 mt-2">
                    {BRAND_ARCHETYPES.find(a => a.name === brandVoice.brandVoice.archetype)?.description}
                    <br />
                    <span className="text-gray-500">
                      Examples: {BRAND_ARCHETYPES.find(a => a.name === brandVoice.brandVoice.archetype)?.example}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Brand Voice
                  <HelpText text="How your brand speaks and expresses itself - the personality and tone that comes through in your communications" />
                </label>
                <input
                  type="text"
                  placeholder="e.g., Authoritative but approachable, Technical yet clear"
                  value={brandVoice.brandVoice.tone}
                  onChange={(e) => handleBrandVoiceUpdate('tone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Communication Style
                  <HelpText text="The specific way your brand delivers messages - your preferred approach to explaining and engaging" />
                </label>
                <input
                  type="text"
                  placeholder="e.g., Direct and solution-focused, Educational and consultative"
                  value={brandVoice.brandVoice.style}
                  onChange={(e) => handleBrandVoiceUpdate('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                  ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default BrandVoiceModule;