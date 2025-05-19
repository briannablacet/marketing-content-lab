// src/components/features/WritingStyleModule/index.tsx
import React, { useState, useEffect } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { HelpCircle, FileText, X } from 'lucide-react';
import { useRouter } from 'next/router';
import FileHandler from '../../shared/FileHandler';

interface WritingStyleProps {
  isWalkthrough?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  returnTo?: string;
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

const WritingStyleModule: React.FC<WritingStyleProps> = ({ isWalkthrough, onNext, onBack, returnTo }) => {
  const { writingStyle, updateWritingStyle, applyStyleGuideRules, saveStyleToStorage } = useWritingStyle();
  const { showNotification } = useNotification();
  const [uploadedStyleGuide, setUploadedStyleGuide] = useState<File | null>(null);
  const [internalConventions, setInternalConventions] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    saveStyleToStorage();
  }, [writingStyle, saveStyleToStorage]);

  const handleStyleGuideContent = (content: string | object) => {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const file = new File([textContent], 'uploaded-style-guide.txt', { type: 'text/plain' });
    setUploadedStyleGuide(file);
    updateWritingStyle({
      styleGuide: {
        primary: 'Custom Style Guide',
        overrides: false,
        uploadedGuide: file.name
      }
    });
    showNotification('Style guide uploaded and processed successfully', 'success');
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
        styleGuide: { primary: value, overrides: false }
      });
    } else if (value) {
      applyStyleGuideRules(value);
    }
  };

  const handleFormattingUpdate = (field: string, value: string) => {
    updateWritingStyle({
      formatting: { ...writingStyle.formatting, [field]: value }
    });
  };

  const handlePunctuationUpdate = (field: string, value: boolean | string) => {
    updateWritingStyle({
      punctuation: { ...writingStyle.punctuation, [field]: value }
    });
  };

  const getButtonText = () => {
    if (isWalkthrough) return 'Next';
    if (returnTo) return 'Save Changes';
    return 'Save Writing Style';
  };

  const handleSubmit = () => {
    saveStyleToStorage();
    showNotification('Writing style preferences saved successfully', 'success');
    if (isWalkthrough && onNext) onNext();
    else if (returnTo) router.push(returnTo);
  };

  return (
    <div className="space-y-8">
      {/* Style Guide Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Writing Style Configuration</h2>
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </div>
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
          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 mb-3">Already have a company style guide?</p>
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
              />
            )}
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
            <label className="block text-sm font-medium mb-2">Heading Style <span className="text-gray-500">(optional)</span></label>
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
            <label className="block text-sm font-medium mb-2">Numbers <span className="text-gray-500">(optional)</span></label>
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
            <label className="block text-sm font-medium mb-2">Date Format <span className="text-gray-500">(optional)</span></label>
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

          <div>
            <label className="block text-sm font-medium mb-2">Bullet Point Style <span className="text-gray-500">(optional)</span></label>
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
            <label className="block text-sm font-medium mb-2">Quotation Marks <span className="text-gray-500">(optional)</span></label>
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

      {/* Internal Style Conventions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Internal Style Conventions</h2>
        <p className="text-sm text-gray-600 mb-3">
          Add any specific language, formatting, or grammar rules your team uses internally.
          Separate each convention with a new line.
        </p>
        <textarea
          value={internalConventions}
          onChange={(e) => setInternalConventions(e.target.value)}
          rows={6}
          placeholder="Example:
- Always capitalize 'Client'
- Use em dashes (—), not hyphens (-)
- Never use contractions in product descriptions"
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
        />
      </div>

      {/* Submit Button */}
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
