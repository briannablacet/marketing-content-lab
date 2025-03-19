//src/components/features/WritingStyleModule/index.tsx
import React, { useState, useEffect } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { HelpCircle, Upload, FileText, X } from 'lucide-react';
import { useRouter } from 'next/router';

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

const WritingStyleModule: React.FC<WritingStyleProps> = ({ isWalkthrough, onNext, onBack, returnTo }) => {
  const { writingStyle, updateWritingStyle, applyStyleGuideRules, saveStyleToStorage } = useWritingStyle();
  const { showNotification } = useNotification();
  const [uploadedStyleGuide, setUploadedStyleGuide] = useState<File | null>(null);
  const router = useRouter();

  // Explicitly save to storage on any change
  useEffect(() => {
    // Save the current writing style to localStorage
    saveStyleToStorage();
  }, [writingStyle, saveStyleToStorage]);

  const handleStyleGuideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedStyleGuide(file);
      
      updateWritingStyle({
        styleGuide: {
          primary: 'Custom Style Guide',
          overrides: false,
          uploadedGuide: file.name
        }
      });
      
      showNotification('success', 'Style guide uploaded successfully');
    }
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
            <div className="flex items-center gap-4">
              <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
                <Upload className="w-5 h-5 mr-2" />
                <span>Upload Your Style Guide</span>
                <input
                  type="file"
                  onChange={handleStyleGuideUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
              {uploadedStyleGuide && (
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
              )}
            </div>
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