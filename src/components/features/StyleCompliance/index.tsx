import React, { useState } from 'react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface ComplianceResult {
  rule: string;
  passed: boolean;
  message: string;
  category: 'formatting' | 'punctuation' | 'grammar';
  severity: 'error' | 'warning';
}

const StyleComplianceChecker: React.FC = () => {
  // Access existing writing style context
  const { writingStyle } = useWritingStyle();
  const { showNotification } = useNotification();

  // Local state
  const [content, setContent] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [results, setResults] = useState<ComplianceResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      setIsFileUploaded(true);

      // Read file content
      try {
        const text = await file.text();
        setContent(text);
        showNotification('success', 'Document uploaded successfully');
      } catch (error) {
        console.error('Error reading file:', error);
        showNotification('error', 'Error reading document. Please try again.');
      }
    }
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
    if (writingStyle.formatting.headings) {
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
    if (writingStyle.punctuation.oxfordComma) {
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
    if (writingStyle.punctuation.bulletPoints) {
      const bulletPointCheck = content.match(/•.*[.]/g);
      results.push({
        rule: 'Bullet Point Style',
        passed: !!bulletPointCheck,
        message: writingStyle.punctuation.bulletPoints,
        category: 'punctuation',
        severity: 'warning'
      });
    }

    setResults(results);
    setIsChecking(false);
  };

  // Clear all
  const handleClear = () => {
    setContent('');
    setDocumentFile(null);
    setResults([]);
    setIsFileUploaded(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Style Compliance Checker</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Check your content against {writingStyle.styleGuide.primary || 'default'} style guide rules
          </p>
        </CardHeader>
        <CardContent>
          {/* Upload Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Check Content</label>
              {isFileUploaded && (
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
              <div className="flex items-center gap-2">
                <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>Upload Document</span>
                  <input
                    type="file"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    accept=".txt,.doc,.docx,.pdf"
                  />
                </label>
                {documentFile && (
                  <span className="text-sm text-gray-600">
                    {documentFile.name}
                  </span>
                )}
              </div>

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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isChecking ? 'Checking...' : 'Check Style Compliance'}
          </button>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Compliance Results</h3>
              {results.map((result, index) => (
                <Alert 
                  key={index}
                  variant={result.passed ? 'success' : 'error'}
                >
                  <div className="mr-3 mt-1">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <AlertTitle>
                      {result.rule}
                    </AlertTitle>
                    <AlertDescription>
                      {result.message}
                    </AlertDescription>
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