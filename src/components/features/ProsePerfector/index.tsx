// src/components/features/ProsePerfector/index.tsx
import React, { useState, useRef } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, FileText, X, Loader, Sparkles, ArrowRight, Copy } from 'lucide-react';

interface ImprovementSuggestion {
  original: string;
  suggestion: string;
  reason: string;
  type: 'clarity' | 'conciseness' | 'engagement' | 'formality';
}

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
    engagementImprovements: 0
  });
  
  // Processing options
  const [options, setOptions] = useState({
    improveClarity: true,
    enhanceEngagement: true,
    adjustFormality: false,
    formalityLevel: 'neutral' // 'formal', 'neutral', 'casual'
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
      // Here you would typically call your API to process the text
      // For now, we'll simulate the processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock improvement logic - in a real app, this would come from your API
      const improved = originalText
        .replace(/very/g, 'exceptionally')
        .replace(/good/g, 'excellent')
        .replace(/bad/g, 'suboptimal')
        .replace(/lots of/g, 'numerous');
      
      // Generate some mock suggestions
      const mockSuggestions: ImprovementSuggestion[] = [
        {
          original: 'very good',
          suggestion: 'exceptional',
          reason: 'More specific and impactful adjective',
          type: 'clarity'
        },
        {
          original: 'in order to',
          suggestion: 'to',
          reason: 'More concise without changing meaning',
          type: 'conciseness'
        },
        {
          original: 'lots of examples',
          suggestion: 'numerous examples',
          reason: 'More formal and precise quantifier',
          type: 'formality'
        }
      ];
      
      setEnhancedText(improved);
      setSuggestions(mockSuggestions);
      
      // Mock improvement statistics
      setImprovementStats({
        readabilityScore: Math.floor(Math.random() * 30) + 70, // 70-99
        clarityImprovements: Math.floor(Math.random() * 5) + 2,
        concisionImprovements: Math.floor(Math.random() * 3) + 1,
        engagementImprovements: Math.floor(Math.random() * 4) + 1
      });
      
      showNotification('success', 'Text enhanced successfully');
    } catch (error) {
      console.error('Error processing text:', error);
      showNotification('error', 'Failed to enhance text. Please try again.');
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

  // Copy enhanced text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedText);
    showNotification('success', 'Enhanced text copied to clipboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prose Perfector</h1>
        <p className="text-gray-600">Enhance your writing with AI-powered suggestions for clarity, engagement, and style</p>
        
        {/* AI Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-2 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            AI Insights
          </h3>
          <ul className="space-y-2">
            {[
              "Improving clarity can enhance reader comprehension by up to 50%",
              "Engaging content increases time spent on page by an average of 30%",
              "Properly formatted content is 80% more likely to be read in full"
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
            
            <div className="flex items-center">
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
          
          <button
            onClick={processText}
            disabled={!originalText.trim() || isProcessing}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
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
        </CardContent>
      </Card>

      {/* Results Section */}
      {enhancedText && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap mb-4">
              {enhancedText}
            </div>
            
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
            >
              <Copy className="mr-2 w-4 h-4" />
              Copy to Clipboard
            </button>

            {/* Improvement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
            </div>

            {/* Improvement Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Suggested Improvements</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
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
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
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