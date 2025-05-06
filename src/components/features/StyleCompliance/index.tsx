// src/components/features/StyleCompliance/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const StyleComplianceChecker: React.FC = () => {
  const { writingStyle } = useWritingStyle();
  const { showNotification } = useNotification();
  
  const [content, setContent] = useState(
    "ACME SOFTWARE INTRODUCES NEW FEATURE\n\nAcme Software, the leading provider of AI solutions announced today a groundbreaking feature. The new capability combines machine learning artificial intelligence and automation to deliver results.\n\nKey benefits include\n• Increased efficiency\n• Better results\n• Enhanced productivity"
  );
  
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Check if style guide has been configured
  const hasStyleGuide = Boolean(
    writingStyle.styleGuide?.primary || 
    (writingStyle.formatting && Object.keys(writingStyle.formatting).length > 0) ||
    (writingStyle.punctuation && Object.keys(writingStyle.punctuation).length > 0)
  );

  const analyzeContent = async () => {
    if (!content.trim()) {
      showNotification('error', 'Please enter content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResults(null);

    try {
      // Prepare the payload - IMPORTANT CHANGE: Now explicitly using style-checker endpoint
      const payload = {
        endpoint: 'style-checker', // <-- Changed from 'content-humanizer' to 'style-checker'
        data: {
          content: content,
          styleGuide: {
            guide: writingStyle.styleGuide?.primary || 'Chicago Manual of Style',
            formatting: writingStyle.formatting || {},
            punctuation: writingStyle.punctuation || {},
            prohibited: writingStyle.prohibited || [],
            required: writingStyle.required || []
          }
        }
      };

      console.log('Sending request to API:', payload);

      // Call the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze content');
      }

      const data = await response.json();
      console.log('API response:', data);
      
      if (data && data.compliance !== undefined) {
        setResults(data);
        showNotification('success', 'Content analyzed successfully');
      } else {
        throw new Error('Invalid response from the API');
      }
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError(err.message || 'Failed to analyze content');
      showNotification('error', 'Failed to analyze content');
      
      // Fallback mock results for development testing
      setResults({
        compliance: 65,
        issues: [
          {
            type: 'CAPITALIZATION',
            text: 'ACME SOFTWARE INTRODUCES NEW FEATURE',
            suggestion: 'Use title case for headings: Acme Software Introduces New Feature',
            severity: 'medium'
          },
          {
            type: 'PUNCTUATION',
            text: 'solutions announced today',
            suggestion: 'Missing comma: solutions, announced today',
            severity: 'low'
          },
          {
            type: 'FORMATTING',
            text: 'Key benefits include•',
            suggestion: 'Use a colon: Key benefits include:',
            severity: 'low'
          }
        ],
        strengths: [
          'Appropriate paragraph length',
          'Clear benefit statements',
          'Product name used consistently'
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run analysis when component mounts
  useEffect(() => {
    if (hasStyleGuide) {
      analyzeContent();
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Style Compliance Checker
          {results && (
            <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
              results.compliance >= 80 
                ? 'bg-green-100 text-green-800'
                : results.compliance >= 60
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {results.compliance}% Compliant
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasStyleGuide ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertTriangle className="text-yellow-500 w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-yellow-700 font-medium">No style guide configured</p>
              <p className="text-sm text-yellow-600 mt-1">
                Please select a style guide or configure your formatting preferences first.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Content to Check
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Enter content to check against your style guide..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={analyzeContent}
                disabled={isAnalyzing || !content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Check Compliance'
                )}
              </button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {results && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Results</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            results.compliance >= 80 
                              ? 'bg-green-500'
                              : results.compliance >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${results.compliance}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 font-semibold">{results.compliance}%</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Issues Found</h4>
                        {results.issues && results.issues.length > 0 ? (
                          <ul className="space-y-3">
                            {results.issues.map((issue, index) => (
                              <li key={index} className="p-3 bg-white rounded border border-slate-200">
                                <div className="flex items-start">
                                  <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                                    issue.severity === 'high' 
                                      ? 'bg-red-100 text-red-800'
                                      : issue.severity === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {issue.type}
                                  </span>
                                </div>
                                <p className="text-sm mt-1">
                                  <span className="font-medium">Found:</span> "{issue.text}"
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {issue.suggestion}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            No issues found
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                        {results.strengths && results.strengths.length > 0 ? (
                          <ul className="space-y-1">
                            {results.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-600">No specific strengths identified</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StyleComplianceChecker;