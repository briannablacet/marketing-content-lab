// src/components/features/BrandVoiceModule/index.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { Upload, FileText, X, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/router';

interface Props {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

const BRAND_ARCHETYPES = [
  {
    name: 'The Creator',
    description: 'Innovative, artistic, striving for authentic self-expression',
    example: 'Adobe, Lego, Apple'
  },
  {
    name: 'The Ruler',
    description: 'Authority, leadership, setting high standards',
    example: 'Microsoft, Mercedes-Benz, American Express'
  },
  {
    name: 'The Caregiver',
    description: 'Nurturing, supportive, focused on helping others',
    example: 'Johnson & Johnson, UNICEF, Volvo'
  },
  {
    name: 'The Innocent',
    description: 'Optimistic, honest, values simplicity',
    example: 'Coca-Cola, Disney, Dove'
  },
  {
    name: 'The Sage',
    description: 'Thoughtful, analytical, focused on sharing knowledge',
    example: 'Google, BBC, McKinsey'
  },
  {
    name: 'The Explorer',
    description: 'Adventure, discovery, pushing boundaries',
    example: 'REI, Jeep, National Geographic'
  },
  {
    name: 'The Rebel',
    description: 'Disruptive, revolutionary, challenging status quo',
    example: 'Virgin, Harley-Davidson, Tesla'
  },
  {
    name: 'The Hero',
    description: 'Inspiring, conquering challenges, achieving the impossible',
    example: 'Nike, FedEx, Army'
  },
  {
    name: 'The Magician',
    description: 'Transformative, making dreams reality, innovative solutions',
    example: 'Disney, Mastercard, Sony'
  },
  {
    name: 'The Regular Guy/Gal',
    description: 'Authentic, relatable, down-to-earth',
    example: 'Target, IKEA, Ford'
  },
  {
    name: 'The Jester',
    description: 'Fun, playful, living in the moment',
    example: 'Old Spice, M&Ms, Dollar Shave Club'
  },
  {
    name: 'The Lover',
    description: 'Passionate, relationship-focused, appreciation for beauty',
    example: "Victoria's Secret, Godiva, Chanel"
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
  const { brandVoice, updateBrandVoice, addUploadedGuide, removeUploadedGuide } = useBrandVoice();
  const [fileError, setFileError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      setFileError('File size must be less than 5MB');
      return;
    }

    try {
      const content = await file.text();
      addUploadedGuide({
        name: file.name,
        content,
        type: 'messaging-doc'
      });
      setFileError('');
    } catch (error) {
      setFileError('Error reading file. Please try again.');
    }
  };

  const handleBrandVoiceUpdate = (field: string, value: string): void => {
    updateBrandVoice({
      brandVoice: {
        ...brandVoice.brandVoice,
        [field]: value
      }
    });
  };

  const handleGuidelineUpdate = (type: 'preferred' | 'avoided', value: string): void => {
    updateBrandVoice({
      contentGuidelines: {
        ...brandVoice.contentGuidelines,
        [type]: value
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isWalkthrough && onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Brand Voice and Tone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Brand Archetype
                <HelpText 
                  text="Brand archetypes are universal character patterns that help define your brand's personality and connect with your audience." 
                  link="https://www.brandarchetype.com/learn-more"
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Primary Audience
                <HelpText text="Your main target audience - helps ensure your voice and content resonate with the right people" />
              </label>
              <input
                type="text"
                placeholder="e.g., Technical Decision Makers, C-Suite Executives"
                value={brandVoice.brandVoice.audience}
                onChange={(e) => handleBrandVoiceUpdate('audience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Terms and Messaging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Key Terms to Emphasize
                <HelpText text="Terms that reinforce your brand positioning and should be used consistently in your content" />
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Enter multiple terms separated by commas (e.g., "machine learning, cloud security, zero trust")
              </p>
              <textarea
                placeholder="e.g., machine learning, advanced threat protection, zero-trust architecture"
                value={brandVoice.contentGuidelines.preferred}
                onChange={(e) => handleGuidelineUpdate('preferred', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Terms to Avoid
                <HelpText text="Terms that don't align with your positioning or could weaken your message" />
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Enter multiple terms separated by commas (e.g., "basic security, simple solution")
              </p>
              <textarea
                placeholder="e.g., basic security, simple solution, entry-level"
                value={brandVoice.contentGuidelines.avoided}
                onChange={(e) => handleGuidelineUpdate('avoided', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Company Messaging Platform
            <span className="text-gray-500 text-sm ml-2">(Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".doc,.docx,.pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">Upload your company messaging document</span>
                <span className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (max 5MB)</span>
              </label>
            </div>

            {fileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                {fileError}
              </div>
            )}

            <div className="space-y-2">
              {brandVoice.uploadedGuides.map((guide) => (
                <div 
                  key={guide.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{guide.name}</span>
                  </div>
                  <button
                    onClick={() => removeUploadedGuide(guide.name)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {(isWalkthrough || onBack) && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        )}
        
        <div className="flex space-x-4 ml-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
              ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : isWalkthrough ? 'Save & Continue →' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandVoiceModule;