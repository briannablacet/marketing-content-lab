// src/components/features/WritingStyleModule/index.tsx
// COMPLETE WORKING VERSION - All functions included and property names fixed

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
  const { writingStyle, saveWritingStyle, setWritingStyle } = useWritingStyle();
  const { showNotification } = useNotification();
  const router = useRouter();

  // State
  const [uploadedStyleGuide, setUploadedStyleGuide] = useState<File | null>(null);
  const [internalConventions, setInternalConventions] = useState<string>('');

  // Initialize internal conventions from context on mount
  useEffect(() => {
    if (writingStyle?.terminology?.preferredTerms) {
      const conventions = Object.entries(writingStyle.terminology.preferredTerms)
        .map(([term, rule]) => `- ${term}: ${rule}`)
        .join('\n');
      setInternalConventions(conventions);
    }
  }, []);

  const handleStyleGuideContent = (content: string | object) => {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const file = new File([textContent], 'uploaded-style-guide.txt', { type: 'text/plain' });
    setUploadedStyleGuide(file);

    setWritingStyle({
      ...writingStyle,
      styleGuide: {
        ...writingStyle.styleGuide,
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
      handleStyleGuideUpdate('Chicago Manual of Style');
    }

    setWritingStyle({
      ...writingStyle,
      styleGuide: {
        ...writingStyle.styleGuide,
        uploadedGuide: undefined
      }
    });
  };

  const handleStyleGuideUpdate = (value: string) => {
    console.log('Updating style guide to:', value);

    if (value === 'Custom Style Guide') {
      setWritingStyle({
        ...writingStyle,
        styleGuide: {
          ...writingStyle.styleGuide,
          primary: value,
          overrides: false
        }
      });
    } else if (value) {
      const styleDefaults = getStyleGuideDefaults(value);

      setWritingStyle({
        ...writingStyle,
        styleGuide: {
          ...writingStyle.styleGuide,
          primary: value,
          overrides: false
        },
        formatting: {
          ...writingStyle?.formatting,
          ...styleDefaults.formatting
        },
        punctuation: {
          ...writingStyle?.punctuation,
          ...styleDefaults.punctuation
        }
      });
    }
  };

  const getStyleGuideDefaults = (styleName: string) => {
    const defaults = {
      formatting: {
        headingCase: 'title',
        numberFormat: 'mixed',
        dateFormat: 'american'
      },
      punctuation: {
        oxfordComma: true,
        bulletPoints: 'Period if complete sentence',
        quotationMarks: 'double'
      }
    };

    switch (styleName) {
      case 'AP Style':
        return {
          formatting: {
            headingCase: 'title',
            numberFormat: 'mixed',
            dateFormat: 'american'
          },
          punctuation: {
            oxfordComma: false,
            bulletPoints: 'No period for fragments',
            quotationMarks: 'double'
          }
        };
      case 'APA Style':
        return {
          formatting: {
            headingCase: 'title',
            numberFormat: 'numerals',
            dateFormat: 'american'
          },
          punctuation: {
            oxfordComma: true,
            bulletPoints: 'Period if complete sentence',
            quotationMarks: 'double'
          }
        };
      case 'MLA Style':
        return {
          formatting: {
            headingCase: 'title',
            numberFormat: 'words',
            dateFormat: 'international'
          },
          punctuation: {
            oxfordComma: true,
            bulletPoints: 'Period if complete sentence',
            quotationMarks: 'double'
          }
        };
      case 'Chicago Manual of Style':
      default:
        return defaults;
    }
  };

  // FIXED: Handle formatting updates with proper property mapping
  const handleFormattingUpdate = (field: string, value: string) => {
    console.log(`🔥 Updating formatting ${field} to:`, value);

    // Map UI values to context property names and values
    let contextField = field;
    let contextValue = value;

    if (field === 'headings') {
      contextField = 'headingCase';
      if (value === 'All caps for main headings') contextValue = 'upper';
      else if (value === 'Title Case') contextValue = 'title';
      else if (value === 'Sentence case') contextValue = 'sentence';
      else if (value === 'Custom') contextValue = 'lower';
    } else if (field === 'numbers') {
      contextField = 'numberFormat';
      if (value === 'Always use numerals') contextValue = 'numerals';
      else if (value === 'Spell out numbers under 10') contextValue = 'mixed';
      else if (value === 'Numerals for 10 and above') contextValue = 'mixed';
    } else if (field === 'dates') {
      contextField = 'dateFormat';
      if (value === 'MM/DD/YYYY') contextValue = 'american';
      else if (value === 'DD/MM/YYYY') contextValue = 'international';
      else if (value === 'YYYY-MM-DD') contextValue = 'iso';
    }

    console.log('🔥 Mapping:', { originalField: field, originalValue: value, contextField, contextValue });

    setWritingStyle({
      ...writingStyle,
      formatting: {
        ...writingStyle?.formatting,
        [contextField]: contextValue
      }
    });
  };

  // FIXED: Handle punctuation updates
  const handlePunctuationUpdate = (field: string, value: boolean | string) => {
    console.log(`🔥 Updating punctuation ${field} to:`, value);

    // Map UI field names to context field names
    let contextField = field;
    if (field === 'quotes') {
      contextField = 'quotationMarks';
    }

    setWritingStyle({
      ...writingStyle,
      punctuation: {
        ...writingStyle?.punctuation,
        [contextField]: value
      }
    });
  };

  // Handle internal conventions
  const handleInternalConventionsChange = (value: string) => {
    setInternalConventions(value);

    const lines = value.split('\n').filter(line => line.trim());
    const preferredTerms: Record<string, string> = {};

    lines.forEach(line => {
      const match = line.match(/^-?\s*(.+?):\s*(.+)$/);
      if (match) {
        preferredTerms[match[1].trim()] = match[2].trim();
      }
    });

    setWritingStyle({
      ...writingStyle,
      terminology: {
        ...writingStyle.terminology,
        preferredTerms
      }
    });
  };

  const getButtonText = () => {
    if (isWalkthrough) return 'Next';
    if (returnTo) return 'Save Changes';
    return 'Save Writing Style';
  };

  const handleSubmit = () => {
    console.log('🔥 SAVING - Current writingStyle:', writingStyle);
    saveWritingStyle({ ...writingStyle, completed: true });
    showNotification('Writing style preferences saved successfully', 'success');

    setTimeout(() => {
      if (isWalkthrough && onNext) {
        onNext();
      } else if (returnTo) {
        router.push(returnTo);
      }
    }, 100);
  };

  // Helper to get current UI value from context value
  const getCurrentHeadingStyle = () => {
    const headingCase = writingStyle?.formatting?.headingCase;
    if (headingCase === 'upper') return 'All caps for main headings';
    if (headingCase === 'title') return 'Title Case';
    if (headingCase === 'sentence') return 'Sentence case';
    if (headingCase === 'lower') return 'Custom';
    return '';
  };

  const getCurrentNumberStyle = () => {
    const numberFormat = writingStyle?.formatting?.numberFormat;
    if (numberFormat === 'numerals') return 'Always use numerals';
    if (numberFormat === 'mixed') return 'Spell out numbers under 10';
    if (numberFormat === 'words') return 'Spell out numbers under 10';
    return '';
  };

  const getCurrentDateStyle = () => {
    const dateFormat = writingStyle?.formatting?.dateFormat;
    if (dateFormat === 'american') return 'MM/DD/YYYY';
    if (dateFormat === 'international') return 'DD/MM/YYYY';
    if (dateFormat === 'iso') return 'YYYY-MM-DD';
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Style Guide Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Style Guide</h2>
        <div className="mb-6">
          <div className="mb-6">
            <select
              value={writingStyle?.styleGuide?.primary || ''}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Format Your Content</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mt-2">
            {writingStyle?.styleGuide?.primary && writingStyle?.styleGuide?.primary !== 'Custom Style Guide'
              ? `Using ${writingStyle?.styleGuide?.primary} defaults. Override any specific rules below as needed.`
              : 'Set your custom formatting preferences below. All fields are optional.'}
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Heading Style <span className="text-gray-500">(optional)</span></label>
            <select
              value={getCurrentHeadingStyle()}
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
              value={getCurrentNumberStyle()}
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
              value={getCurrentDateStyle()}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Punctuation & Grammar Rules</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Oxford Comma <span className="text-gray-500">(optional)</span></label>
            <select
              value={writingStyle?.punctuation?.oxfordComma !== undefined ? writingStyle?.punctuation?.oxfordComma.toString() : ''}
              onChange={(e) => handlePunctuationUpdate('oxfordComma', e.target.value === 'true')}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              <option value="true">Always use Oxford comma</option>
              <option value="false">Never use Oxford comma</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quotation Marks <span className="text-gray-500">(optional)</span></label>
            <select
              value={writingStyle?.punctuation?.quotationMarks || ''}
              onChange={(e) => handlePunctuationUpdate('quotes', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            >
              <option value="">Use style guide default</option>
              <option value="double">Double quotes ("...")</option>
              <option value="single">Single quotes ('...')</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internal Style Conventions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Team's Style Rules</h2>
        <p className="text-sm text-gray-600 mb-3">
          Add any specific language, formatting, or grammar rules your team uses internally.
          Separate each convention with a new line.
        </p>
        <textarea
          value={internalConventions}
          onChange={(e) => handleInternalConventionsChange(e.target.value)}
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