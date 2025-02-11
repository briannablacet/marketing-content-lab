// src/components/features/WritingStyleModule/index.tsx
import React, { useState, useEffect } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useRouter } from 'next/router';
import { HelpCircle } from 'lucide-react';
import { checkStyleGuideOverrides, getStyleGuideRules } from '../../../utils/StyleGuides';
import { ScreenTemplate } from '../../shared/UIComponents';
import { WritingStyleProps, WritingStyleData } from '../../../types/WritingStyle';

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

const WritingStyleModule: React.FC<WritingStyleProps> = ({ isWalkthrough, onNext, onBack }) => {
  const { writingStyle, updateWritingStyle, applyStyleGuideRules } = useWritingStyle();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasOverrides, setHasOverrides] = useState<boolean>(false);
  const router = useRouter();

  // Set Chicago as default on first load if no style is selected
  useEffect(() => {
    if (!writingStyle.styleGuide.primary) {
      applyStyleGuideRules('Chicago Manual of Style');
    }
  }, []);

  useEffect(() => {
    if (writingStyle.styleGuide.primary && writingStyle.styleGuide.primary !== 'Custom Style Guide') {
      const overrides = checkStyleGuideOverrides(writingStyle, writingStyle.styleGuide.primary);
      setHasOverrides(overrides);
      updateWritingStyle({
        styleGuide: {
          ...writingStyle.styleGuide,
          overrides
        }
      });
    }
  }, [writingStyle, updateWritingStyle]);

  const handleStyleGuideUpdate = (value: string) => {
    if (value === 'Custom Style Guide') {
      // For custom style, keep current settings but mark as custom
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

  const handleFormattingUpdate = (field: keyof WritingStyleData['formatting'], value: string) => {
    updateWritingStyle({
      formatting: {
        ...writingStyle.formatting,
        [field]: value
      }
    });
  };

  const handlePunctuationUpdate = (field: keyof WritingStyleData['punctuation'], value: boolean | string) => {
    updateWritingStyle({
      punctuation: {
        ...writingStyle.punctuation,
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to local storage for persistence
      localStorage.setItem('writingStyle', JSON.stringify(writingStyle));
      
      if (isWalkthrough && onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAiInsights = () => {
    const insights = [];
    
    if (hasOverrides) {
      insights.push(
        "You've customized some settings that differ from the selected style guide's defaults. This is perfectly fine - you can mix and match rules to fit your needs!"
      );
    }

    if (writingStyle.styleGuide.primary === 'Custom Style Guide') {
      insights.push(
        "You're using a custom style guide. Feel free to set each option according to your preferences."
      );
    } else if (writingStyle.styleGuide.primary) {
      insights.push(
        "You can override any individual settings while keeping the rest of your chosen style guide's rules."
      );
    }

    // Add default style guide insight
    if (!writingStyle.styleGuide.primary) {
      insights.push(
        "The Chicago Manual of Style will be used as your default if no other style guide is selected."
      );
    }

    return insights;
  };

  // Get the default value for the selected style guide
  const getDefaultValue = (field: string, section: 'formatting' | 'punctuation') => {
    if (!writingStyle.styleGuide.primary || writingStyle.styleGuide.primary === 'Custom Style Guide') {
      return '';
    }
    const rules = getStyleGuideRules(writingStyle.styleGuide.primary);
    return rules?.[section]?.[field] || '';
  };

  return (
    <ScreenTemplate
      title="Writing Style Guide"
      subtitle="Define your organization's writing standards and formatting preferences. All fields are optional - you can use style guide defaults or set your own rules."
      currentStep={3}
      totalSteps={5}
      onNext={handleSave}
      onBack={onBack}
      nextButtonText={isSaving ? 'Saving...' : (isWalkthrough ? 'Save & Continue →' : 'Save Changes')}
      aiInsights={getAiInsights()}
    >
      <div className="space-y-8">
        {/* Style Guide Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">Style Guide Selection</h2>
              <HelpCircle className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={writingStyle.styleGuide.primary}
              onChange={(e) => handleStyleGuideUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            >
              <option value="">Choose a starting point... (defaults to Chicago)</option>
              {STYLE_GUIDES.map(guide => (
                <option key={guide.value} value={guide.value}>{guide.label}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                ℹ️ Select how you want to define your style guide:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Choose an established style guide and optionally customize specific rules</li>
                <li>Start from scratch with a fully custom style guide</li>
                <li>Leave any fields blank to use your style guide's defaults</li>
              </ul>
            </div>
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Heading Style <span className="text-gray-500">(optional)</span>
                </label>
                {getDefaultValue('headings', 'formatting') && (
                  <span className="text-xs text-gray-500">
                    Style guide default: {getDefaultValue('headings', 'formatting')}
                  </span>
                )}
              </div>
              <select
                value={writingStyle.formatting.headings}
                onChange={(e) => handleFormattingUpdate('headings', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Use style guide default</option>
                {HEADING_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Numbers <span className="text-gray-500">(optional)</span>
                </label>
                {getDefaultValue('numbers', 'formatting') && (
                  <span className="text-xs text-gray-500">
                    Style guide default: {getDefaultValue('numbers', 'formatting')}
                  </span>
                )}
              </div>
              <select
                value={writingStyle.formatting.numbers}
                onChange={(e) => handleFormattingUpdate('numbers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Use style guide default</option>
                <option value="Spell out numbers under 10">Spell out numbers under 10</option>
                <option value="Numerals for 10 and above">Numerals for 10 and above</option>
                <option value="Always use numerals">Always use numerals</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Date Format <span className="text-gray-500">(optional)</span>
                </label>
                {getDefaultValue('dates', 'formatting') && (
                  <span className="text-xs text-gray-500">
                    Style guide default: {getDefaultValue('dates', 'formatting')}
                  </span>
                )}
              </div>
              <select
                value={writingStyle.formatting.dates}
                onChange={(e) => handleFormattingUpdate('dates', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  checked={writingStyle.punctuation.oxfordComma}
                  onChange={(e) => handlePunctuationUpdate('oxfordComma', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="oxford-comma" className="ml-2 block text-sm text-gray-900">
                  Use Oxford Comma <span className="text-gray-500">(optional)</span>
                </label>
              </div>
              {getDefaultValue('oxfordComma', 'punctuation') !== '' && (
                <span className="text-xs text-gray-500">
                  Style guide default: {getDefaultValue('oxfordComma', 'punctuation') ? 'Yes' : 'No'}
                </span>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Bullet Point Style <span className="text-gray-500">(optional)</span>
                </label>
                {getDefaultValue('bulletPoints', 'punctuation') && (
                  <span className="text-xs text-gray-500">
                    Style guide default: {getDefaultValue('bulletPoints', 'punctuation')}
                  </span>
                )}
              </div>
              <select
                value={writingStyle.punctuation.bulletPoints}
                onChange={(e) => handlePunctuationUpdate('bulletPoints', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Use style guide default</option>
                <option value="Period if complete sentence">Period if complete sentence</option>
                <option value="No punctuation">No punctuation</option>
                <option value="Always use periods">Always use periods</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Quotation Marks <span className="text-gray-500">(optional)</span>
                </label>
                {getDefaultValue('quotes', 'punctuation') && (
                  <span className="text-xs text-gray-500">
                    Style guide default: {getDefaultValue('quotes', 'punctuation')}
                  </span>
                )}
              </div>
              <select
                value={writingStyle.punctuation.quotes}
                onChange={(e) => handlePunctuationUpdate('quotes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Use style guide default</option>
                <option value="Double quotes">Double quotes ("example")</option>
                <option value="Single quotes">Single quotes ('example')</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default WritingStyleModule;