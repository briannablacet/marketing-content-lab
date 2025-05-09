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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/perfect-prose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prose Perfector</h1>
        <p className="text-gray-600">Enhance your writing with AI-powered suggestions based on professional editing standards</p>
        
        {/* AI Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-2 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            Editing Insights
          </h3>
          <ul className="space-y-2">
            {[
              "Active voice creates stronger, clearer statements than passive voice",
              "Varied sentence length improves reading rhythm and maintains reader interest",
              "Eliminating unnecessary words improves clarity by 30-40%",
              "Following established style guides ensures professional consistency"
            ].map((insight, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Options Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enhancement Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="improveClarity"
                  checked={options.improveClarity}
                  onChange={(e) => setOptions({...options, improveClarity: e.target.checked})}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="improveClarity" className="ml-2 block text-sm text-gray-900">
                  Improve Clarity
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enhanceEngagement"
                  checked={options.enhanceEngagement}
                  onChange={(e) => setOptions({...options, enhanceEngagement: e.target.checked})}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="enhanceEngagement" className="ml-2 block text-sm text-gray-900">
                  Enhance Engagement
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="adjustFormality"
                  checked={options.adjustFormality}
                  onChange={(e) => setOptions({...options, adjustFormality: e.target.checked})}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="adjustFormality" className="ml-2 block text-sm text-gray-900">
                  Adjust Formality
                </label>
                
                {options.adjustFormality && (
                  <select
                    value={options.formalityLevel}
                    onChange={(e) => setOptions({...options, formalityLevel: e.target.value})}
                    className="ml-4 p-1 text-sm border rounded max-w-xs"
                  >
                    <option value="formal">Formal</option>
                    <option value="neutral">Neutral</option>
                    <option value="casual">Casual</option>
                  </select>
                )}
              </div>
              
              {/* Style Guide Selection */}
              <div className="flex items-center">
                <label htmlFor="styleGuide" className="block text-sm text-gray-900 mr-4">
                  Style Guide:
                </label>
                <select
                  id="styleGuide"
                  value={options.styleGuide}
                  onChange={(e) => setOptions({...options, styleGuide: e.target.value})}
                  className="p-1 text-sm border rounded"
                >
                  {STYLE_GUIDES.map(guide => (
                    <option key={guide.id} value={guide.id}>{guide.name}</option>
                  ))}
                </select>
                <StyleGuideTooltip styleGuideId={options.styleGuide} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Text</CardTitle>
        </CardHeader>
        <CardContent>
          {/* File Upload */}
          <FileUploader 
            onFileContent={handleFileContent}
            onError={handleFileError}
          />
          
          <textarea
            className="w-full h-64 p-4 border rounded-md"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter text to enhance or upload a document..."
            disabled={isProcessing}
          />
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handleClear}
              disabled={!originalText && !enhancedText}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
            
            <button
              onClick={processText}
              disabled={!originalText.trim() || isProcessing}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enhance Text
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {enhancedText && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Enhanced Text</CardTitle>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
              >
                <Copy className="mr-1 w-4 h-4" />
                Copy
              </button>
              {suggestions.length > 0 && (
                <button
                  onClick={applyAllSuggestions}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  Apply All Changes
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap mb-4 border border-gray-200">
              {enhancedText}
            </div>
            
            {/* Enhanced Improvement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Readability</p>
                <p className="text-xl font-bold text-blue-700">{improvementStats.readabilityScore}%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Clarity</p>
                <p className="text-xl font-bold text-green-700">+{improvementStats.clarityImprovements}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Concision</p>
                <p className="text-xl font-bold text-purple-700">+{improvementStats.concisionImprovements}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Engagement</p>
                <p className="text-xl font-bold text-amber-700">+{improvementStats.engagementImprovements}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Passive Voice</p>
                <p className="text-xl font-bold text-red-700">{improvementStats.passiveVoiceCount}</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Avg. Sentence</p>
                <p className="text-xl font-bold text-teal-700">{improvementStats.averageSentenceLength} words</p>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Suggested Improvements</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-lg flex justify-between items-start gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            suggestion.type === 'clarity' ? 'bg-blue-100 text-blue-800' :
                            suggestion.type === 'conciseness' ? 'bg-purple-100 text-purple-800' :
                            suggestion.type === 'engagement' ? 'bg-amber-100 text-amber-800' :
                            suggestion.type === 'active voice' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {suggestion.type}
                          </span>
                          <p className="text-sm">
                            <span className="line-through text-red-500">{suggestion.original}</span>
                            {' → '}
                            <span className="text-green-500 font-medium">{suggestion.suggestion}</span>
                          </p>
                        </div>
                        <p className="text-xs text-slate-600">{suggestion.reason}</p>
                      </div>
                      <button
                        onClick={() => applySuggestion(index)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProsePerfector;