// src/components/features/ProsePerfector/index.tsx
import React, { useState, useRef } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, FileText, X, Loader, Sparkles, ArrowRight, Copy, Info } from 'lucide-react';

interface ImprovementSuggestion {
  original: string;
  suggestion: string;
  reason: string;
  type: 'clarity' | 'conciseness' | 'engagement' | 'formality' | 'active voice';
}

// Available style guides
const STYLE_GUIDES = [
  { id: 'chicago', name: 'Chicago Manual of Style' },
  { id: 'ap', name: 'AP Style' },
  { id: 'apa', name: 'APA Style' },
  { id: 'mla', name: 'MLA Style' },
  { id: 'custom', name: 'Custom Style Guide' }
];

// File uploader component
const FileUploader = ({ onFileContent, onError }) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      try {
        const fileSize = file.size / 1024 / 1024; // size in MB
        if (fileSize > 5) {
          onError('File size exceeds 5MB limit');
          return;
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['txt', 'doc', 'docx', 'md', 'rtf', 'html'];

        if (!allowedExtensions.includes(fileExtension)) {
          onError('Unsupported file format. Please upload a text document.');
          return;
        }

        const text = await file.text();
        onFileContent(text);
      } catch (error) {
        console.error('Error reading file:', error);
        onError('Failed to read file. Please try again.');
      }
    }
  };

  const clearFile = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-2">Upload a document to enhance your prose:</p>
      <div className="flex items-center gap-2">
        <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
          <Upload className="w-5 h-5 mr-2" />
          <span>Upload File</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.doc,.docx,.md,.rtf,.html"
          />
        </label>
        {fileName && (
          <div className="flex items-center p-2 bg-gray-50 rounded">
            <FileText className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">{fileName}</span>
            <button
              onClick={clearFile}
              className="ml-2 text-gray-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">Supports .txt, .doc, .docx, .md, .rtf, .html (max 5MB)</p>
    </div>
  );
};

// Style guide tooltip component
const StyleGuideTooltip = ({ styleGuideId }) => {
  const tooltips = {
    'chicago': 'Comprehensive style guide for American English, widely used in publishing',
    'ap': 'Associated Press style, commonly used in journalism and news writing',
    'apa': 'American Psychological Association style, often used in academic and scientific writing',
    'mla': 'Modern Language Association style, preferred in humanities and liberal arts',
    'custom': 'Your own defined style rules and preferences'
  };

  return (
    <div className="relative inline-block group">
      <Info className="w-4 h-4 text-gray-400 cursor-help ml-1" />
      <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
        {tooltips[styleGuideId] || 'A formal writing style guide'}
      </div>
    </div>
  );
};

// Main component
const ProsePerfector: React.FC = () => {
  const { showNotification } = useNotification();

  // Local state
  const [originalText, setOriginalText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [improvementStats, setImprovementStats] = useState({
    readabilityScore: 0,
    clarityImprovements: 0,
    concisionImprovements: 0,
    engagementImprovements: 0,
    passiveVoiceCount: 0,
    averageSentenceLength: 0
  });

  // Processing options
  const [options, setOptions] = useState({
    improveClarity: true,
    enhanceEngagement: true,
    adjustFormality: false,
    formalityLevel: 'neutral', // 'formal', 'neutral', 'casual'
    styleGuide: 'chicago' // Default to Chicago style
  });

  // Handle document upload via the component
  const handleFileContent = (fileContent: string) => {
    setOriginalText(fileContent);
    setIsFileUploaded(true);
    setEnhancedText(''); // Reset enhanced text when new content is uploaded
    setSuggestions([]); // Reset suggestions
    showNotification('success', 'Document uploaded successfully');
  };

  const handleFileError = (errorMessage: string) => {
    showNotification('error', errorMessage);
  };

  // Process text for improvement
  const processText = async () => {
    if (!originalText.trim()) {
      showNotification('error', 'Please enter or upload text to enhance');
      return;
    }

    setIsProcessing(true);

    try {
      // Map the styleGuide ID to the full name
      const styleGuideName = STYLE_GUIDES.find(sg => sg.id === options.styleGuide)?.name || 'Chicago Manual of Style';

      // Call the API endpoint to process the text
      const response = await fetch('api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          endpoint: 'persona-generator',
          data: {
            text: originalText,
            options: {
              ...options,
              styleGuide: styleGuideName
            }
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enhance text');
      }

      const data = await response.json();
      console.log('API Response:', data); // Helpful for debugging

      // Set the enhanced text from the API response
      setEnhancedText(data.enhancedText);

      // Map the suggestions from the API to match our expected format
      const mappedSuggestions = (data.suggestions || []).map(suggestion => ({
        original: suggestion.original,
        suggestion: suggestion.suggestion,
        reason: suggestion.reason,
        type: suggestion.type || 'clarity' // Default to clarity if type is not provided
      }));

      setSuggestions(mappedSuggestions);

      // Set improvement stats with enhanced metrics
      setImprovementStats({
        readabilityScore: data.stats?.readabilityScore || 0,
        clarityImprovements: data.stats?.clarityImprovements || 0,
        concisionImprovements: data.stats?.concisionImprovements || 0,
        engagementImprovements: data.stats?.engagementImprovements || 0,
        passiveVoiceCount: data.stats?.passiveVoiceCount || 0,
        averageSentenceLength: data.stats?.averageSentenceLength || 0
      });

      showNotification('success', 'Text enhanced successfully');
    } catch (error) {
      console.error('Error processing text:', error);
      showNotification('error', error.message || 'Failed to enhance text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear all content
  const handleClear = () => {
    setOriginalText('');
    setEnhancedText('');
    setSuggestions([]);
    setIsFileUploaded(false);
  };

  // Apply individual suggestion
  const applySuggestion = (index: number) => {
    const suggestion = suggestions[index];

    // Simple replacement (in a real app, you'd need more sophisticated text manipulation)
    const updatedText = enhancedText.replace(suggestion.original, suggestion.suggestion);
    setEnhancedText(updatedText);

    // Remove the applied suggestion
    const updatedSuggestions = [...suggestions];
    updatedSuggestions.splice(index, 1);
    setSuggestions(updatedSuggestions);
  };

  // Apply all suggestions at once
  const applyAllSuggestions = () => {
    if (suggestions.length === 0) return;

    let text = enhancedText;
    for (const suggestion of suggestions) {
      text = text.replace(suggestion.original, suggestion.suggestion);
    }

    setEnhancedText(text);
    setSuggestions([]);
    showNotification('success', 'All suggestions applied');
  };

  // Copy enhanced text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedText);
    showNotification('success', 'Enhanced text copied to clipboard');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enhance Your Writing</h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload a document or paste your text to improve clarity, engagement, and style. Choose your preferred style guide and enhancement options below.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Style Guide</label>
            <select
              value={options.styleGuide}
              onChange={(e) => setOptions({ ...options, styleGuide: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
            >
              {STYLE_GUIDES.map(guide => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">Enhancement Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.improveClarity}
                  onChange={(e) => setOptions({ ...options, improveClarity: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Improve clarity and readability</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.enhanceEngagement}
                  onChange={(e) => setOptions({ ...options, enhanceEngagement: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enhance engagement and impact</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.adjustFormality}
                  onChange={(e) => setOptions({ ...options, adjustFormality: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Adjust formality level</span>
              </label>
            </div>
          </div>

          {options.adjustFormality && (
            <div>
              <label className="block text-sm font-medium mb-2">Formality Level</label>
              <select
                value={options.formalityLevel}
                onChange={(e) => setOptions({ ...options, formalityLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
              >
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          )}

          <FileUploader onFileContent={handleFileContent} onError={handleFileError} />

          <div>
            <label className="block text-sm font-medium mb-2">Your Text</label>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste your text here or upload a document..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
              rows={6}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear
            </button>
            <button
              onClick={processText}
              disabled={isProcessing || !originalText.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {enhancedText && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Text</h2>
          <div className="space-y-4">
            <textarea
              value={enhancedText}
              readOnly
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm bg-gray-50"
              rows={6}
            />
            <div className="flex justify-end">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h2>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">{suggestion.type}</span>
                  <button
                    onClick={() => applySuggestion(index)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Original</p>
                    <p className="text-sm text-gray-700">{suggestion.original}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Suggestion</p>
                    <p className="text-sm text-gray-700">{suggestion.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={applyAllSuggestions}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Apply All Suggestions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsePerfector;