// src/components/features/ContentHumanizer/index.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Check, AlertTriangle, X, Copy, Eye, EyeOff, Upload, FileText } from 'lucide-react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';

// Enhanced TypeScript interfaces
interface HumanizerOptions {
  tone: string;
  formality: 'formal' | 'neutral' | 'casual';
  simplify: boolean;
  styleGuideId?: string;
  industryContext?: string;
}

interface ContentState {
  original: string;
  enhanced: string | null;
  processing: boolean;
  error: string | null;
  progress: number;
  changes: Array<{
    original: string;
    modified: string;
    reason: string;
  }>;
  statistics: {
    originalLength: number;
    enhancedLength: number;
    readabilityScore?: number;
    styleCompliance?: number;
  };
}

interface StyleViolation {
  text: string;
  rule: string;
  suggestion: string;
}

const ContentHumanizer: React.FC = () => {
  // Context and state management
  const { styleGuide, styleRules } = useWritingStyle();
  const { showNotification } = useNotification();
  const [content, setContent] = useState<ContentState>({
    original: '',
    enhanced: null,
    processing: false,
    error: null,
    progress: 0,
    changes: [],
    statistics: {
      originalLength: 0,
      enhancedLength: 0
    }
  });

  const [options, setOptions] = useState<HumanizerOptions>({
    tone: 'conversational',
    formality: 'neutral',
    simplify: false,
    styleGuideId: styleGuide?.id,
    industryContext: ''
  });

  const [showComparison, setShowComparison] = useState(false);
  const [keywords, setKeywords] = useState<string>('');
  const [violations, setViolations] = useState<StyleViolation[]>([]);
  const [showDiffView, setShowDiffView] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();

  // Effect to update statistics when content changes
  useEffect(() => {
    setContent(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        originalLength: prev.original.length,
        enhancedLength: prev.enhanced?.length || 0
      }
    }));
  }, [content.original, content.enhanced]);

  // Handle keyword updates
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value);
    setOptions(prev => ({
      ...prev,
      preserveKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
    }));
  };

  // Enhanced file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'text/plain', 
        'text/markdown', 
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/html',
        'application/rtf'
      ];
      if (!allowedTypes.includes(file.type)) {
        showNotification('Only text, markdown, doc, docx, html, and rtf files are supported', 'error');
        return;
      }

      setUploadedFile(file);
      
      try {
        // Read file content
        const text = await file.text();
        setContent(prev => ({
          ...prev,
          original: text,
          enhanced: null,
          statistics: {
            ...prev.statistics,
            originalLength: text.length,
            enhancedLength: 0
          }
        }));
        showNotification('Document uploaded successfully', 'success');
      } catch (err) {
        showNotification('Error reading file', 'error');
        setContent(prev => ({
          ...prev,
          error: 'Failed to read file content'
        }));
      }
    }
  };

  // Style compliance checker
  const checkStyleCompliance = (text: string): StyleViolation[] => {
    const violations: StyleViolation[] = [];
    if (styleRules) {
      // Check each style rule against the text
      styleRules.forEach(rule => {
        // This is a simplified example - expand based on your style rules
        if (rule.pattern && new RegExp(rule.pattern, 'gi').test(text)) {
          violations.push({
            text: text.match(new RegExp(rule.pattern, 'gi'))?.[0] || '',
            rule: rule.name,
            suggestion: rule.suggestion || 'Consider revising'
          });
        }
      });
    }
    return violations;
  };

  // Enhanced humanization process
  const humanizeContent = async () => {
    if (!content.original.trim()) {
      showNotification('Please enter content to humanize', 'warning');
      return;
    }

    setContent(prev => ({
      ...prev,
      processing: true,
      error: null,
      progress: 0
    }));

    try {
      // Simulated progress updates
      const progressInterval = setInterval(() => {
        setContent(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      console.log('Sending request to humanize content:', {
        content: content.original,
        parameters: options
      });

      const response = await fetch('/api/content-humanizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          content: content.original,
          parameters: {
            ...options,
            styleGuideParameters: styleGuide ? {
              prohibited: styleGuide.prohibited || [],
              required: styleGuide.required || []
            } : undefined
          }
        })
      });

      clearInterval(progressInterval);

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Failed to humanize content');
      }

      // Check style compliance
      const styleViolations = checkStyleCompliance(responseData.content);
      setViolations(styleViolations);

      setContent(prev => ({
        ...prev,
        enhanced: responseData.content,
        processing: false,
        progress: 100,
        changes: responseData.changes || [],
        statistics: {
          ...prev.statistics,
          enhancedLength: responseData.content.length,
          readabilityScore: responseData.readabilityScore,
          styleCompliance: styleViolations.length ? 
            100 - (styleViolations.length * 5) : 100
        }
      }));

      showNotification('Content humanized successfully', 'success');
      setShowComparison(true);
    } catch (err) {
      showNotification('Failed to humanize content', 'error');
      setContent(prev => ({
        ...prev,
        processing: false,
        error: 'Failed to humanize content. Please try again.',
        progress: 0
      }));
    }
  };

  // Handle removing the uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setContent(prev => ({
      ...prev,
      original: '',
      enhanced: null,
      statistics: {
        ...prev.statistics,
        originalLength: 0,
        enhancedLength: 0
      }
    }));
  };

  // UI Components
  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${content.progress}%` }}
      />
    </div>
  );

  const renderStatistics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-gray-50 rounded">
        <h4 className="text-sm font-medium">Original Length</h4>
        <p className="text-2xl">{content.statistics.originalLength}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded">
        <h4 className="text-sm font-medium">Enhanced Length</h4>
        <p className="text-2xl">{content.statistics.enhancedLength}</p>
      </div>
      {content.statistics.readabilityScore && (
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="text-sm font-medium">Readability</h4>
          <p className="text-2xl">{content.statistics.readabilityScore}%</p>
        </div>
      )}
      {content.statistics.styleCompliance && (
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="text-sm font-medium">Style Compliance</h4>
          <p className="text-2xl">{content.statistics.styleCompliance}%</p>
        </div>
      )}
    </div>
  );

  const renderFileUploadSection = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Upload Document</label>
        {uploadedFile && (
          <button
            onClick={handleRemoveFile}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Remove
          </button>
        )}
      </div>
      
      {uploadedFile ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">{uploadedFile.name}</span>
          <span className="text-xs text-gray-500">
            ({Math.round(uploadedFile.size / 1024)} KB)
          </span>
          <button
            onClick={handleRemoveFile}
            className="ml-auto text-gray-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.doc,.docx,.md,.rtf,.html"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">Upload a document to humanize</span>
            <span className="text-xs text-gray-500">TXT, DOC, DOCX, MD, RTF, or HTML (max 5MB)</span>
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Content Humanizer</h1>
      
      {/* Enhanced Options Panel */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select 
                className="w-full p-2 border rounded"
                value={options.tone}
                onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="Conversational">Conversational</option>
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Authoritative">Authoritative</option>
                <option value="Friendly">Friendly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Formality</label>
              <select 
                className="w-full p-2 border rounded"
                value={options.formality}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  formality: e.target.value as 'formal' | 'neutral' | 'casual' 
                }))}
              >
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry Context</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={options.industryContext}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  industryContext: e.target.value 
                }))}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* File Upload Section */}
          {renderFileUploadSection()}
          
          <div className="mb-2 text-sm text-gray-600">
            Or enter your content directly:
          </div>
          
          <textarea
            value={content.original}
            onChange={(e) => setContent(prev => ({
              ...prev,
              original: e.target.value,
              enhanced: null
            }))}
            placeholder="Upload or paste your content here..."
            className="w-full h-64 p-4 border rounded"
          />
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setShowDiffView(!showDiffView)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              {showDiffView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDiffView ? ' Hide Changes' : ' View Detailed Changes'}
            </button>
            <button
              onClick={humanizeContent}
              disabled={content.processing || !content.original.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {content.processing ? 'Processing...' : 'Humanize Content'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Errors */}
      {content.processing && renderProgressBar()}
      
      {content.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{content.error}</AlertDescription>
        </Alert>
      )}

      {/* Style Violations */}
      {violations.length > 0 && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Style Guide Violations:</div>
            <ul className="list-disc pl-4">
              {violations.map((v, i) => (
                <li key={i} className="text-sm">
                  {v.text}: {v.suggestion}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {content.enhanced && showComparison && (
        <>
          {renderStatistics()}
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Enhanced Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Original</h3>
                  <div className="p-4 bg-gray-50 rounded">
                    {content.original}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Enhanced</h3>
                  <div className="p-4 bg-gray-50 rounded">
                    {content.enhanced}
                  </div>
                </div>
              </div>

              {/* Changes List */}
              {content.changes.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Changes Made</h3>
                  <ul className="space-y-2">
                    {content.changes.map((change, index) => (
                      <li key={index} className="text-sm">
                        <span className="line-through text-red-500">{change.original}</span>
                        {' → '}
                        <span className="text-green-500">{change.modified}</span>
                        <span className="text-gray-500 ml-2">({change.reason})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => navigator.clipboard.writeText(content.enhanced || '')}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Enhanced
                </button>
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Hide Comparison
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ContentHumanizer;