// src/components/features/StyleCompliance/index.tsx
import React, { useState, useRef } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  X, 
  Loader, 
  Settings, 
  Check, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Define types for style issues
interface StyleIssue {
  type: 'heading' | 'punctuation' | 'formatting' | 'grammar';
  text: string;
  suggestion: string;
  rule: string;
  severity: 'high' | 'medium' | 'low';
  position?: {
    startLine: number;
    startChar: number;
    endLine: number;
    endChar: number;
  };
}

// File uploader component
const ContentUploader = ({ onFileContent, onError }) => {
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

// Severity badge component
const SeverityBadge = ({ severity }: { severity: 'high' | 'medium' | 'low' }) => {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${colors[severity]}`}>
      {severity}
    </span>
  );
};

// Main component
const StyleComplianceChecker: React.FC = () => {
  const { writingStyle } = useWritingStyle();
  const { showNotification } = useNotification();
  
  // Local state
  const [content, setContent] = useState('');
  const [styleIssues, setStyleIssues] = useState<StyleIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [checkStats, setCheckStats] = useState({
    totalIssues: 0,
    headingIssues: 0,
    punctuationIssues: 0,
    formattingIssues: 0,
    grammarIssues: 0,
    complianceScore: 0
  });
  
  // Determine if we have style guide configured
  const hasStyleGuideConfigured = Boolean(
    writingStyle?.styleGuide?.primary && 
    writingStyle.styleGuide.primary !== ''
  );
  
  // Get style guide name for display
  const styleGuideName = hasStyleGuideConfigured 
    ? writingStyle.styleGuide.primary 
    : 'Chicago Manual of Style (Default)';

  // Handle content input via upload
  const handleFileContent = (fileContent: string) => {
    setContent(fileContent);
    setIsFileUploaded(true);
    setStyleIssues([]); // Reset issues when new content is uploaded
    showNotification('success', 'Document uploaded successfully');
  };

  const handleFileError = (errorMessage: string) => {
    showNotification('error', errorMessage);
  };

  // Check content against style guide
  const checkStyleCompliance = async () => {
    if (!content.trim()) {
      showNotification('error', 'Please enter or upload text to check');
      return;
    }

    setIsChecking(true);
    
    try {
      // In a real implementation, this would call your API to process the text
      // For now, we'll simulate the checking with mock data and a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock style issues - in a real app, this would come from your API
      // The issues should be based on the configured style guide rules
      const mockIssues: StyleIssue[] = [
        {
          type: 'heading',
          text: 'ACME SOFTWARE INTRODUCES',
          suggestion: 'Acme Software Introduces',
          rule: 'Headings should use Title Case, not ALL CAPS',
          severity: 'high',
          position: {
            startLine: 1,
            startChar: 0,
            endLine: 1,
            endChar: 24
          }
        },
        {
          type: 'punctuation',
          text: 'solutions announced',
          suggestion: 'solutions, announced',
          rule: 'Use a comma before the conjunction in a compound sentence',
          severity: 'medium',
          position: {
            startLine: 3,
            startChar: 42,
            endLine: 3,
            endChar: 61
          }
        },
        {
          type: 'formatting',
          text: 'machine learning artificial intelligence',
          suggestion: 'machine learning, artificial intelligence,',
          rule: 'Use Oxford commas in lists of three or more items',
          severity: 'medium',
          position: {
            startLine: 4,
            startChar: 20,
            endLine: 4,
            endChar: 56
          }
        },
        {
          type: 'grammar',
          text: 'Key benefits include',
          suggestion: 'Key benefits include:',
          rule: 'Use a colon when introducing a list',
          severity: 'low',
          position: {
            startLine: 6,
            startChar: 0,
            endLine: 6,
            endChar: 18
          }
        },
        {
          type: 'punctuation',
          text: '• Increased efficiency\n• Better results',
          suggestion: '• Increased efficiency.\n• Better results.',
          rule: 'Use periods at the end of bullet points with complete sentences',
          severity: 'low',
          position: {
            startLine: 7,
            startChar: 0,
            endLine: 8,
            endChar: 15
          }
        }
      ];
      
      setStyleIssues(mockIssues);
      
      // Calculate check statistics
      const headingIssues = mockIssues.filter(issue => issue.type === 'heading').length;
      const punctuationIssues = mockIssues.filter(issue => issue.type === 'punctuation').length;
      const formattingIssues = mockIssues.filter(issue => issue.type === 'formatting').length;
      const grammarIssues = mockIssues.filter(issue => issue.type === 'grammar').length;
      
      // Calculate compliance score (100 - weighted issues)
      const totalWeightedIssues = 
        (headingIssues * 3) + 
        (punctuationIssues * 2) + 
        (formattingIssues * 2) + 
        (grammarIssues * 1);
      
      // Score formula: higher is better, max 100, min 0
      const baseScore = Math.max(0, 100 - (totalWeightedIssues * 5));
      const complianceScore = Math.min(100, baseScore);
      
      setCheckStats({
        totalIssues: mockIssues.length,
        headingIssues,
        punctuationIssues,
        formattingIssues,
        grammarIssues,
        complianceScore
      });
      
      showNotification('success', 'Style check complete');
    } catch (error) {
      console.error('Error checking style compliance:', error);
      showNotification('error', 'Failed to check style compliance. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Clear all content
  const handleClear = () => {
    setContent('');
    setStyleIssues([]);
    setIsFileUploaded(false);
  };

  // Styling helper for compliance score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Style Guide Info Panel */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium flex items-center">
                <span className="mr-2">📝</span>
                Current Style Guide: <span className="font-bold ml-1">{styleGuideName}</span>
              </h3>
              
              {!hasStyleGuideConfigured && (
                <div className="mt-2 p-2 bg-amber-50 text-amber-800 text-sm rounded flex items-start">
                  <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p>No writing style configured. Using Chicago Manual of Style as default. 
                    Consider setting up your Writing Style for more accurate results.</p>
                </div>
              )}
            </div>
            
            <Link href="/writing-style" className="text-blue-600 hover:text-blue-800 flex items-center">
              <Settings className="w-4 h-4 mr-1" />
              <span className="text-sm">Style Settings</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card>
        <CardHeader>
          <CardTitle>Check Content Against Style Guide</CardTitle>
        </CardHeader>
        <CardContent>
          {/* File Upload */}
          <ContentUploader 
            onFileContent={handleFileContent}
            onError={handleFileError}
          />
          
          <textarea
            className="w-full h-64 p-4 border rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter text to check against your style guide..."
            disabled={isChecking}
          />
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handleClear}
              disabled={!content.trim() || isChecking}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            
            <button
              onClick={checkStyleCompliance}
              disabled={!content.trim() || isChecking}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {isChecking ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Check Style Compliance
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {styleIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Style Compliance Results</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Compliance Score */}
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Style Compliance Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(checkStats.complianceScore)}`}>
                {checkStats.complianceScore}%
              </p>
            </div>
            
            {/* Issue Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Heading Issues</p>
                <p className="text-xl font-bold text-gray-700">{checkStats.headingIssues}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Punctuation Issues</p>
                <p className="text-xl font-bold text-gray-700">{checkStats.punctuationIssues}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Formatting Issues</p>
                <p className="text-xl font-bold text-gray-700">{checkStats.formattingIssues}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-slate-600">Grammar Issues</p>
                <p className="text-xl font-bold text-gray-700">{checkStats.grammarIssues}</p>
              </div>
            </div>

            {/* Detailed Issues List */}
            <h3 className="text-lg font-semibold mb-3">Detailed Style Issues</h3>
            <div className="space-y-4">
              {styleIssues.map((issue, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium capitalize">
                        {issue.type}
                      </span>
                      <SeverityBadge severity={issue.severity} />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-1 font-mono">
                      {issue.text}
                    </div>
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded font-mono">
                      {issue.suggestion}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Rule:</span> {issue.rule}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StyleComplianceChecker;