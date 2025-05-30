// src/components/features/StyleCompliance/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { CheckCircle, AlertTriangle, RefreshCw, FileText, Wand2 } from 'lucide-react';
import { callApiWithStrategicData } from '../../../services/ApiStrategicConnector';

const StyleComplianceChecker: React.FC = () => {
  const { writingStyle } = useWritingStyle();
  const { showNotification } = useNotification();

  const [content, setContent] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [error, setError] = useState('');
  const [fixedContent, setFixedContent] = useState('');

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
    setFixedContent('');

    try {
      // Prepare the payload
      const payload = {
        content: content,
        styleGuide: {
          guide: writingStyle.styleGuide?.primary || 'Chicago Manual of Style',
          formatting: writingStyle.formatting || {},
          punctuation: writingStyle.punctuation || {},
          prohibited: writingStyle.prohibited || [],
          required: writingStyle.required || []
        }
      };

      // Call the API using callApiWithStrategicData
      const data = await callApiWithStrategicData('styleChecker', payload);

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
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fixContent = async () => {
    if (!results || !content.trim()) {
      showNotification('error', 'Please analyze the content first');
      return;
    }

    setIsFixing(true);
    setError('');
    setFixedContent('');

    try {
      // Prepare the payload for fixing
      const payload = {
        content: content,
        issues: results.issues,
        styleGuide: {
          guide: writingStyle.styleGuide?.primary || 'Chicago Manual of Style',
          formatting: writingStyle.formatting || {},
          punctuation: writingStyle.punctuation || {},
          prohibited: writingStyle.prohibited || [],
          required: writingStyle.required || []
        }
      };

      // Call the API to fix the content
      const data = await callApiWithStrategicData('styleFixer', payload);

      if (data && data.fixedContent) {
        setFixedContent(data.fixedContent);
        showNotification('success', 'Content fixed successfully');
      } else {
        throw new Error('Invalid response from the API');
      }
    } catch (err) {
      console.error('Error fixing content:', err);
      setError(err.message || 'Failed to fix content');
      showNotification('error', 'Failed to fix content');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Style Compliance Checker
          {results && (
            <span className={`ml-2 text-sm px-2 py-1 rounded-full ${results.compliance >= 80
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
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48 font-mono text-sm"
                  placeholder="Enter or paste your content here to check against your style guide..."
                />
                {!content && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-400 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span>Enter or paste your content here</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={analyzeContent}
                disabled={isAnalyzing || !content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Content...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Check Compliance</span>
                  </>
                )}
              </button>
              {results && results.issues && results.issues.length > 0 && (
                <button
                  onClick={fixContent}
                  disabled={isFixing}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 flex items-center gap-2 transition-colors"
                >
                  {isFixing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fixing Content...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Fix It For Me</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertTriangle className="text-red-500 w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-red-700 font-medium">Analysis Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-blue-700">Analyzing your content against the style guide...</p>
                </div>
              </div>
            )}

            {results && !isAnalyzing && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                  <div className="bg-slate-50 p-6 rounded-lg space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${results.compliance >= 80
                              ? 'bg-green-500'
                              : results.compliance >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              }`}
                            style={{ width: `${results.compliance}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold min-w-[4rem] text-right">
                        {results.compliance}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Issues Found
                        </h4>
                        {results.issues && results.issues.length > 0 ? (
                          <ul className="space-y-3">
                            {results.issues.map((issue, index) => (
                              <li key={index} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-start gap-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${issue.severity === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : issue.severity === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {issue.type}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Found:</span> "{issue.text}"
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {issue.suggestion}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-green-600 flex items-center gap-2 p-4 bg-white rounded-lg border border-green-200">
                            <CheckCircle className="w-5 h-5" />
                            No issues found
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        {results.strengths && results.strengths.length > 0 ? (
                          <ul className="space-y-2">
                            {results.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-600 p-4 bg-white rounded-lg border border-slate-200">
                            No specific strengths identified
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {fixedContent && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Fixed Content</h3>
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <div className="prose max-w-none">
                        {fixedContent}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            setContent(fixedContent);
                            setFixedContent('');
                            setResults(null);
                            showNotification('success', 'Fixed content applied');
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StyleComplianceChecker;