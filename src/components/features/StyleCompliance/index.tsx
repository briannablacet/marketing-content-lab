// src/components/features/StyleCompliance/index.tsx
import React, { useState, useRef } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertCircle, Upload, FileText, X, Loader } from 'lucide-react';

interface ComplianceResult {
  rule: string;
  passed: boolean;
  message: string;
  category: 'formatting' | 'punctuation' | 'grammar';
  severity: 'error' | 'warning';
}

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
      <p className="text-sm text-gray-500 mb-2">Upload a document to check against style guidelines:</p>
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

const StyleComplianceChecker: React.FC = () => {
  // Access existing writing style context
  const { writingStyle } = useWritingStyle();
  const { showNotification } = useNotification();

  // Local state
  const [content, setContent] = useState('');
  const [results, setResults] = useState<ComplianceResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // Handle document upload via the component
  const handleFileContent = (fileContent: string) => {
    setContent(fileContent);
    setIsFileUploaded(true);
    showNotification('success', 'Document uploaded successfully');
  };

  const handleFileError = (errorMessage: string) => {
    showNotification('error', errorMessage);
  };

  // Check content against style rules
  const checkCompliance = async () => {
    if (!content) {
      showNotification('error', 'Please enter content or upload a document to check');
      return;
    }

    setIsChecking(true);
    const results: ComplianceResult[] = [];

    // Check formatting rules
    if (writingStyle.formatting?.headings) {
      const headingMatch = content.match(/^[A-Z]/gm);
      results.push({
        rule: 'Heading Style',
        passed: !!headingMatch,
        message: writingStyle.formatting.headings,
        category: 'formatting',
        severity: 'error'
      });
    }

    // Check punctuation rules
    if (writingStyle.punctuation?.oxfordComma) {
      const oxfordCommaCheck = content.match(/[^,]+ and /g);
      results.push({
        rule: 'Oxford Comma',
        passed: !oxfordCommaCheck,
        message: 'Use Oxford comma in lists of three or more items',
        category: 'punctuation',
        severity: 'warning'
      });
    }

    // Check bullet point style
    if (writingStyle.punctuation?.bulletPoints) {
      const bulletPointCheck = content.match(/•.*[.]/g);
      results.push({
        rule: 'Bullet Point Style',
        passed: !!bulletPointCheck,
        message: writingStyle.punctuation.bulletPoints,
        category: 'punctuation',
        severity: 'warning'
      });
    }

    // Add a slight delay to simulate processing for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    setResults(results);
    setIsChecking(false);
    
    // Show notification based on results
    if (results.every(r => r.passed)) {
      showNotification('success', 'Content complies with all style guidelines!');
    } else {
      const violationCount = results.filter(r => !r.passed).length;
      showNotification('warning', `Found ${violationCount} style guide violations.`);
    }
  };

  // Clear all
  const handleClear = () => {
    setContent('');
    setResults([]);
    setIsFileUploaded(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Style Compliance Checker</h1>
        <p className="text-gray-600">Check your content against {writingStyle.styleGuide?.primary || 'default'} style guide rules</p>
        
        {/* AI Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-2 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            AI Insights
          </h3>
          <ul className="space-y-2">
            {[
              "Style consistency improves brand recognition by up to 30%",
              "Proper style usage increases content professionalism and credibility",
              "Consistent writing style reduces reader cognitive load by 20%"
            ].map((insight, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Style Check</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Check Content</label>
              {(isFileUploaded || content) && (
                <button
                  onClick={handleClear}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {/* File Upload */}
              <FileUploader 
                onFileContent={handleFileContent}
                onError={handleFileError}
              />

              {/* Text Input */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Or paste your content here:</p>
                <textarea
                  className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your content to check..."
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={checkCompliance}
            disabled={!content || isChecking}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Style Compliance'
            )}
          </button>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Compliance Results</h3>
              {results.map((result, index) => (
                <Alert 
                  key={index}
                  variant={result.passed ? 'default' : result.severity === 'error' ? 'destructive' : 'default'}
                  className={result.passed ? 'bg-green-50 border-green-200' : 
                            result.severity === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {result.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${result.severity === 'error' ? 'text-red-600' : 'text-yellow-600'}`} />
                      )}
                    </div>
                    <div>
                      <AlertTitle>
                        {result.rule}
                      </AlertTitle>
                      <AlertDescription>
                        {result.message}
                        {!result.passed && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">{result.severity === 'error' ? 'Required action:' : 'Suggestion:'}</span> {
                              result.category === 'formatting' ? 'Check document formatting.' :
                              result.category === 'punctuation' ? 'Review punctuation usage.' :
                              'Review grammar rules.'
                            }
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleComplianceChecker;