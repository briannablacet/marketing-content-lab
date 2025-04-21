// src/components/features/WritingStyleModule/index.tsx
import React, { useState, useEffect } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { HelpCircle, FileText, X, Info } from 'lucide-react';
import { useRouter } from 'next/router';
// Import our new FileHandler component
import FileHandler from '../../shared/FileHandler';

interface WritingStyleProps {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  returnTo?: string; // Optional URL to return to after saving
}

const STYLE_GUIDES = [
  { value: 'AP Style', label: 'AP Style - Journalism & News' },
  { value: 'Chicago Manual of Style', label: 'Chicago Manual - Academic & Publishing' },
  { value: 'APA Style', label: 'APA Style - Academic & Research' },
  { value: 'MLA Style', label: 'MLA Style - Humanities' },
  { value: 'Custom Style Guide', label: 'Start from Scratch (Custom Style Guide)' }
];

const HEADING_STYLES = [
  'Sentence case',
  'Title Case',
  'All caps for main headings',
  'Custom'
];

// New Voice & Tone options
const BRAND_PERSONALITIES = [
  'Professional',
  'Friendly',
  'Authoritative',
  'Innovative',
  'Playful',
  'Trustworthy',
  'Empathetic',
  'Bold'
];

const TONE_OPTIONS = [
  'Formal',
  'Neutral',
  'Conversational',
  'Technical',
  'Inspirational',
  'Educational',
  'Persuasive'
];

// Examples for different tones
const TONE_EXAMPLES = {
  'Formal': 'We are pleased to announce the launch of our new platform, which offers significant advantages to marketing professionals.',
  'Neutral': 'Our new platform is now available. It helps marketing professionals create better content more efficiently.',
  'Conversational': 'Guess what? We just launched our new platform! You\'re going to love how it makes content creation so much easier.',
  'Technical': 'The Marketing Content Lab platform utilizes advanced NLP algorithms to generate semantically coherent content with 37% higher engagement metrics.',
  'Inspirational': 'Transform your content marketing with a platform that empowers you to create authentic connections that resonate with your audience.',
  'Educational': 'Content marketing involves creating valuable content that attracts and engages your target audience. Our platform simplifies this process.',
  'Persuasive': 'Stop wasting time on ineffective content. Our platform delivers results that will dramatically improve your marketing ROI.'
};

// Examples for different personalities
const PERSONALITY_EXAMPLES = {
  'Professional': 'Our solution provides enterprise-grade capabilities for content marketing teams.',
  'Friendly': 'Hey there! We\'ve built something that\'ll make your content marketing so much easier!',
  'Authoritative': 'Based on our decade of marketing expertise, we\'ve developed the definitive content marketing platform.',
  'Innovative': 'We\'re reimagining content creation with breakthrough AI that thinks like a creative strategist.',
  'Playful': 'Ready to make content marketing fun again? Our platform brings joy back to the creative process!',
  'Trustworthy': 'With bank-level security and transparent analytics, our platform ensures your content strategy is built on reliable foundations.',
  'Empathetic': 'We understand the challenges you face as a marketer. That\'s why we designed our platform to address your specific pain points.',
  'Bold': 'Disrupt your industry with content that breaks through the noise. Our platform isn\'t for the faint-hearted.'
};

const WritingStyleModule: React.FC<WritingStyleProps> = ({ isWalkthrough, onNext, onBack, returnTo }) => {
  const { writingStyle, updateWritingStyle, applyStyleGuideRules, saveStyleToStorage } = useWritingStyle();
  const { showNotification } = useNotification();
  const [uploadedStyleGuide, setUploadedStyleGuide] = useState<File | null>(null);
  const router = useRouter();

  // Add new state for Voice & Tone
  const [showExampleModal, setShowExampleModal] = useState<{
    show: boolean;
    type: 'tone' | 'personality';
    value: string;
  }>({ show: false, type: 'tone', value: '' });

  // Initialize brandVoice if not present
  useEffect(() => {
    if (!writingStyle.brandVoice) {
      updateWritingStyle({
        brandVoice: {
          personality: [],
          tone: 'Conversational'
        }
      });
    }
  }, [writingStyle, updateWritingStyle]);

  // Explicitly save to storage on any change
  useEffect(() => {
    // Save the current writing style to localStorage
    saveStyleToStorage();
  }, [writingStyle, saveStyleToStorage]);

  // This function will handle the content loaded from the file
  const handleStyleGuideContent = (content: string | object) => {
    // Convert to string if it's not already
    const textContent = typeof content === 'string'
      ? content
      : JSON.stringify(content, null, 2);

    // Create a File object to maintain consistency with existing code
    const file = new File([textContent], "uploaded-style-guide.txt", { type: "text/plain" });
    setUploadedStyleGuide(file);

    // Update the writing style context
    updateWritingStyle({
      styleGuide: {
        primary: 'Custom Style Guide',
        overrides: false,
        uploadedGuide: file.name
      }
    });

    showNotification('success', 'Style guide uploaded and processed successfully');

    // Here you could add more sophisticated handling of the style guide content
    // For example, extracting specific rules and applying them automatically
  };

  const handleRemoveUpload = () => {
    setUploadedStyleGuide(null);
    if (writingStyle.styleGuide.primary === 'Custom Style Guide') {
      applyStyleGuideRules('Chicago Manual of Style');
    }
    updateWritingStyle({
      styleGuide: {
        ...writingStyle.styleGuide,
        uploadedGuide: undefined
      }
    });
  };

  const handleStyleGuideUpdate = (value: string) => {
    if (value === 'Custom Style Guide') {
      updateWritingStyle({
        styleGuide: {
          primary: value,
          overrides: false
        }
      });
    } else if (value) {
      applyStyleGuideRules(value);
    }
  };

  const handleFormattingUpdate = (field: string, value: string) => {
    updateWritingStyle({
      formatting: {
        ...writingStyle.formatting,
        [field]: value
      }
    });
  };

  const handlePunctuationUpdate = (field: string, value: boolean | string) => {
    updateWritingStyle({
      punctuation: {
        ...writingStyle.punctuation,
        [field]: value
      }
    });
  };

  // New handlers for Voice & Tone
  const togglePersonality = (personality: string) => {
    updateWritingStyle({
      brandVoice: {
        ...writingStyle.brandVoice,
        personality: writingStyle.brandVoice?.personality?.includes(personality)
          ? writingStyle.brandVoice.personality.filter(p => p !== personality)
          : [...(writingStyle.brandVoice?.personality || []), personality]
      }
    });
  };

  const handleToneUpdate = (tone: string) => {
    updateWritingStyle({
      brandVoice: {
        ...writingStyle.brandVoice,
        tone
      }
    });
  };

  const showExample = (type: 'tone' | 'personality', value: string) => {
    setShowExampleModal({
      show: true,
      type,
      value
    });
  };

  // Handle button text based on context
  const getButtonText = () => {
    if (isWalkthrough) {
      return "Next";
    } else if (returnTo) {
      return "Save Changes";
    } else {
      return "Save Writing Style";
    }
  };

  const handleSubmit = () => {
    // Force an explicit save to storage
    saveStyleToStorage();

    showNotification('success', 'Writing style preferences saved successfully');

    // Handle navigation based on context
    if (isWalkthrough && onNext) {
      // If in walkthrough, call the onNext function
      onNext();
    } else if (returnTo) {
      // If returnTo URL is provided, go back to that page
      router.push(returnTo);
    } else {
      // By default, stay on the current page (no navigation)
      // This ensures users aren't redirected unexpectedly
    }
  };

  return (
    <div className="space-y-8">
      {/* Voice & Tone Modal */}
      {showExampleModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {showExampleModal.type === 'tone' ? 'Tone Example' : 'Personality Example'}: {showExampleModal.value}
            </h3>
            <p className="mb-6 text-gray-700">
              {showExampleModal.type === 'tone'
                ? TONE_EXAMPLES[showExampleModal.value]
                : PERSONALITY_EXAMPLES[showExampleModal.value]}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowExampleModal({ ...showExampleModal, show: false })}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Guide Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Style Guide Selection</h2>
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </div>

          {/* Standard Style Guide Selection */}
          <div className="mb-6">
            <select
              value={writingStyle.styleGuide.primary}
              onChange={(e) => handleStyleGuideUpdate(e.target.value)}
              className="w-full px-3 py-2 rounded-md mb-3 border border-gray-300"
            >
              <option value="">Choose a starting point... (defaults to Chicago)</option>
              {STYLE_GUIDES.map(guide => (
                <option key={guide.value} value={guide.value}>{guide.label}</option>
              ))}
            </select>
          </div>

          {/* Upload Option */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 mb-3">Already have a company style guide?</p>

            {/* Display the uploaded file information if a file has been uploaded */}
            {uploadedStyleGuide ? (
              <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{uploadedStyleGuide.name}</span>
                <button
                  onClick={handleRemoveUpload}
                  className="ml-2 text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <FileHandler
                onContentLoaded={handleStyleGuideContent}
                acceptedFormats=".txt,.doc,.docx,.md,.pdf"
                showExport={false}
                onError={(message) => showNotification('error', message)}
              />
            )}
          </div>

          <div className="text-sm text-gray-600 space-y-2 mt-4">
            <p>
              ℹ️ You can:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Select an established style guide as your base</li>
              <li>Upload your company's existing style guide</li>
              <li>Customize any specific rules below</li>
              <li>Mix and match - upload a guide but use standard rules where your guide is silent</li>
            </ul>
          </div>
        </div>
      </div>

      {/* NEW Voice & Tone Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Voice & Tone</h2>
          <p className="text-sm text-gray-600 mt-2">
            Define how your brand sounds and feels to your audience
          </p>
        </div>

        <div className="space-y-6">
          {/* Brand Personality */}
          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium">Brand Personality</label>
              <button
                onClick={() => showNotification('info', 'Select attributes that describe your brand\'s character')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Choose up to 3 personality traits that define your brand</p>

            <div className="flex flex-wrap gap-2">
              {BRAND_PERSONALITIES.map(personality => (
                <div key={personality} className="flex items-center">
                  <button
                    onClick={() => togglePersonality(personality)}
                    className={`px-3 py-1.5 rounded-full text-sm mr-1 ${writingStyle.brandVoice?.personality?.includes(personality)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {personality}
                  </button>
                  <button
                    onClick={() => showExample('personality', personality)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Warning if more than 3 selected */}
            {writingStyle.brandVoice?.personality?.length > 3 && (
              <p className="text-yellow-600 text-xs mt-2">
                ⚠️ We recommend selecting no more than 3 personality traits for clarity
              </p>
            )}
          </div>

          {/* Tone Selection */}
          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium">Dominant Tone</label>
              <button
                onClick={() => showNotification('info', 'The general tone your brand uses in communication')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TONE_OPTIONS.map(tone => (
                <div key={tone} className="flex items-center">
                  <input
                    type="radio"
                    id={`tone-${tone}`}
                    name="tone"
                    checked={writingStyle.brandVoice?.tone === tone}
                    onChange={() => handleToneUpdate(tone)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                  />
                  <label htmlFor={`tone-${tone}`} className="text-sm text-gray-700">
                    {tone}
                  </label>
                  <button
                    onClick={() => showExample('tone', tone)}
                    className="ml-2 text-gray-400 hover:text-blue-600"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tone Examples */}
          {writingStyle.brandVoice?.tone && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium mb-2">Example: {writingStyle.brandVoice.tone} Tone</h4>
              <p className="text-sm text-gray-600 italic">
                "{TONE_EXAMPLES[writingStyle.brandVoice.tone]}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formatting Preferences Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Formatting Preferences</h2>
          <p className="text-sm text-gray-600 mt-2">
            {writingStyle.styleGuide.primary && writingStyle.styleGuide.primary !== 'Custom Style Guide'
              ? `Using ${writingStyle.styleGuide.primary} defaults. Override any specific rules below as needed.`
              : 'Set your custom formatting preferences below. All fields are optional.'}
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Heading Style <span className="text-gray-500">(optional)</span>
            </label>
            <select
              value={writingStyle.formatting?.headings || ''}
              onChange={(e) => handleFormattingUpdate('headings', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              {HEADING_STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Numbers <span className="text-gray-500">(optional)</span>
            </label>
            <select
              value={writingStyle.formatting?.numbers || ''}
              onChange={(e) => handleFormattingUpdate('numbers', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              <option value="Spell out numbers under 10">Spell out numbers under 10</option>
              <option value="Numerals for 10 and above">Numerals for 10 and above</option>
              <option value="Always use numerals">Always use numerals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date Format <span className="text-gray-500">(optional)</span>
            </label>
            <select
              value={writingStyle.formatting?.dates || ''}
              onChange={(e) => handleFormattingUpdate('dates', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="Month DD, YYYY">Month DD, YYYY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Punctuation and Grammar Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Punctuation and Grammar</h2>
          <p className="text-sm text-gray-600 mt-2">
            {writingStyle.styleGuide.primary && writingStyle.styleGuide.primary !== 'Custom Style Guide'
              ? `Using ${writingStyle.styleGuide.primary} defaults. Override any specific rules below as needed.`
              : 'Set your custom punctuation preferences below. All fields are optional.'}
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="oxford-comma"
                checked={writingStyle.punctuation?.oxfordComma || false}
                onChange={(e) => handlePunctuationUpdate('oxfordComma', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="oxford-comma" className="ml-2 block text-sm text-gray-900">
                Use Oxford Comma <span className="text-gray-500">(optional)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Bullet Point Style <span className="text-gray-500">(optional)</span>
            </label>
            <select
              value={writingStyle.punctuation?.bulletPoints || ''}
              onChange={(e) => handlePunctuationUpdate('bulletPoints', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              <option value="Period if complete sentence">Period if complete sentence</option>
              <option value="No punctuation">No punctuation</option>
              <option value="Always use periods">Always use periods</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quotation Marks <span className="text-gray-500">(optional)</span>
            </label>
            <select
              value={writingStyle.punctuation?.quotes || ''}
              onChange={(e) => handlePunctuationUpdate('quotes', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              <option value="Double quotes">Double quotes ("example")</option>
              <option value="Single quotes">Single quotes ('example')</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button - ONLY show if NOT in walkthrough mode */}
      {!isWalkthrough && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {getButtonText()}
          </button>
        </div>
      )}
    </div>
  );
};

export default WritingStyleModule;