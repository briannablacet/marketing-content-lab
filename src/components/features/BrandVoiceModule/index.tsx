// src/components/features/BrandVoiceModule/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { HelpCircle, Info, X } from 'lucide-react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

interface Props {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

const BRAND_ARCHETYPES = [
  {
    name: 'The Creator',
    description: 'Innovative, artistic, striving for authentic self-expression',
    example: 'Adobe, Lego, Apple',
    defaultTone: 'Inspirational',
    personalityDescription: 'Your brand is innovative and artistic, inspiring others to express their creativity and build something meaningful. You communicate with passion and authenticity, encouraging self-expression and original thinking.'
  },
  {
    name: 'The Caregiver',
    description: 'Nurturing, compassionate, focused on helping others',
    example: 'Johnson & Johnson, UNICEF, Cleveland Clinic',
    defaultTone: 'Empathetic',
    personalityDescription: 'Your brand is nurturing and compassionate, focused on helping others and building trust through genuine care and support. You communicate with warmth and understanding, always putting people first.'
  },
  {
    name: 'The Ruler',
    description: 'Authoritative, responsible, providing structure and control',
    example: 'Microsoft, Mercedes-Benz, American Express',
    defaultTone: 'Formal',
    personalityDescription: 'Your brand represents authority and excellence, providing structure and stability that people can rely on. You communicate with confidence and professionalism, establishing clear leadership in your field.'
  },
  {
    name: 'The Jester',
    description: 'Playful, humorous, living in the moment',
    example: 'Old Spice, Dollar Shave Club, M&Ms',
    defaultTone: 'Conversational',
    personalityDescription: 'Your brand brings joy and humor to everyday experiences, helping people have fun and not take life too seriously. You communicate with wit and playfulness, making interactions light-hearted and memorable.'
  },
  {
    name: 'The Regular Guy/Gal',
    description: 'Relatable, authentic, down-to-earth values',
    example: 'IKEA, Target, Budweiser',
    defaultTone: 'Conversational',
    personalityDescription: 'Your brand is authentic and relatable, representing real people with real values. You communicate honestly and directly, without pretension, making everyone feel welcome and understood.'
  },
  {
    name: 'The Lover',
    description: 'Passionate, sensual, focused on relationships and experiences',
    example: "Victoria's Secret, Godiva, Häagen-Dazs",
    defaultTone: 'Inspirational',
    personalityDescription: 'Your brand celebrates passion, beauty, and meaningful connections. You communicate with elegance and emotion, creating experiences that touch the heart and strengthen relationships.'
  },
  {
    name: 'The Hero',
    description: 'Brave, determined, overcoming challenges and adversity',
    example: 'Nike, FedEx, U.S. Army',
    defaultTone: 'Bold',
    personalityDescription: 'Your brand inspires courage and determination, helping people overcome challenges and achieve their goals. You communicate with strength and conviction, motivating others to push their limits and succeed.'
  },
  {
    name: 'The Outlaw',
    description: 'Rebellious, disruptive, challenging the status quo',
    example: 'Harley-Davidson, Virgin, Red Bull',
    defaultTone: 'Bold',
    personalityDescription: 'Your brand challenges conventions and breaks rules to create positive change. You communicate with rebellious energy and authenticity, encouraging others to think differently and forge their own path.'
  },
  {
    name: 'The Magician',
    description: 'Visionary, transformative, making dreams reality',
    example: 'Disney, Tesla, Dyson',
    defaultTone: 'Inspirational',
    personalityDescription: 'Your brand transforms dreams into reality through innovation and vision. You communicate with wonder and possibility, showing people that extraordinary things are achievable through imagination and determination.'
  },
  {
    name: 'The Innocent',
    description: 'Optimistic, pure, honest and straightforward',
    example: 'Coca-Cola, Dove, Whole Foods',
    defaultTone: 'Conversational',
    personalityDescription: 'Your brand represents purity, optimism, and simple pleasures. You communicate with honesty and positivity, reminding people of life\'s simple joys and the goodness in the world.'
  },
  {
    name: 'The Explorer',
    description: 'Adventurous, independent, seeking discovery and freedom',
    example: 'Jeep, Patagonia, National Geographic',
    defaultTone: 'Inspirational',
    personalityDescription: 'Your brand embodies adventure and freedom, encouraging people to explore new horizons and discover their potential. You communicate with excitement and independence, inspiring others to break free from limitations.'
  },
  {
    name: 'The Sage',
    description: 'Knowledgeable, wise, sharing expertise and insight',
    example: 'Google, BBC, The Economist',
    defaultTone: 'Educational',
    personalityDescription: 'Your brand represents wisdom and knowledge, helping people understand complex topics and make informed decisions. You communicate with clarity and authority, sharing insights that enlighten and educate.'
  }
];

const TONE_OPTIONS = ['Formal', 'Conversational', 'Educational', 'Inspirational', 'Empathetic', 'Bold'];

const TONE_EXAMPLES: Record<string, string> = {
  Formal: 'We are pleased to announce the launch of our new platform, which offers significant advantages to marketing professionals.',
  Conversational: "Guess what? We just launched our new platform! You're going to love how it makes content creation so much easier.",
  Educational: 'Content marketing involves creating valuable content that attracts and engages your target audience. Our platform simplifies this process.',
  Inspirational: 'Transform your content marketing with a platform that empowers you to create authentic connections that resonate with your audience.',
  Empathetic: 'We understand how challenging it can be to find the right solution. That\'s why we\'re here to support you every step of the way.',
  Bold: 'Don\'t settle for ordinary. Break the rules, challenge expectations, and create something extraordinary that makes a real impact.'
};

const BrandVoiceModuleContent: React.FC<Props> = ({ isWalkthrough, onNext, onBack }) => {
  const { brandVoice, updateBrandVoice } = useBrandVoice();
  console.log('Current brand voice state:', JSON.stringify(brandVoice, null, 2));

  const [isSaving, setIsSaving] = useState(false);
  const [showExample, setShowExample] = useState<string | null>(null);
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
          personalityDescription: selected.personalityDescription
        }
      });
    } else {
      updateBrandVoice({
        brandVoice: {
          ...brandVoice.brandVoice,
          archetype: '',
          personalityDescription: ''
        }
      });
    }
  };

  const saveAndContinue = async () => {
    setIsSaving(true);
    try {
      const updatedBrandVoice = {
        brandVoice: {
          ...brandVoice?.brandVoice,
          tone: brandVoice?.brandVoice?.tone || '',
          archetype: brandVoice?.brandVoice?.archetype || '',
          personalityDescription: brandVoice?.brandVoice?.personalityDescription || ''
        }
      };

      await updateBrandVoice(updatedBrandVoice);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isWalkthrough) {
        router.push('/walkthrough/complete');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedArchetype = BRAND_ARCHETYPES.find(a => a.name === brandVoice?.brandVoice?.archetype);

  return (
    <div className="w-full">
      {!isWalkthrough && (
        <div className="flex justify-end mb-6">
          <button
            onClick={saveAndContinue}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-6">
            {/* Brand Archetype Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Brand Archetype</h3>
              <label className="block text-sm font-medium mb-1">
                Select your brand's archetype
                <span className="inline-block align-middle ml-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        'https://iconicfox.com.au/brand-archetypes/',
                        'popupWindow',
                        'width=600,height=800,scrollbars=yes'
                      );
                    }}
                    className="text-blue-500 hover:underline text-xs"
                  >
                    Learn more
                  </a>
                </span>
              </label>
              <select
                value={brandVoice?.brandVoice?.archetype || ''}
                onChange={(e) => handleArchetypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a Brand Archetype</option>
                {BRAND_ARCHETYPES.map(a => (
                  <option key={a.name} value={a.name}>{a.name}</option>
                ))}
              </select>
              {selectedArchetype && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>{selectedArchetype.description}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Examples: {selectedArchetype.example}
                  </p>
                  <div className="border-t border-blue-200 pt-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Your Brand Personality:</h4>
                    <p className="text-sm text-blue-800">
                      {selectedArchetype.personalityDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Voice & Tone */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Voice & Tone</h3>
              <label className="block text-sm font-medium mb-3">Choose your communication style</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TONE_OPTIONS.map(tone => (
                  <div key={tone} className="flex items-center">
                    <input
                      type="radio"
                      id={`tone-${tone}`}
                      name="tone"
                      checked={brandVoice?.brandVoice?.tone === tone}
                      onChange={() => handleBrandVoiceUpdate('tone', tone)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                    />
                    <label htmlFor={`tone-${tone}`} className="text-sm text-gray-700">
                      {tone}
                    </label>
                    <button
                      onClick={() => setShowExample(showExample === tone ? null : tone)}
                      className="ml-2 text-gray-400 hover:text-blue-600"
                    >
                      <Info className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tone Example */}
        {showExample && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {showExample} Tone Example
                </h3>
                <p className="text-sm text-gray-600">
                  {TONE_EXAMPLES[showExample]}
                </p>
              </div>
              <button
                onClick={() => setShowExample(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
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