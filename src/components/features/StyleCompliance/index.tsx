// src/components/features/StyleCompliance/index.tsx
// Simplified, clean version focused on what actually matters - WITH DEBUG

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
import { CheckCircle, AlertTriangle, RefreshCw, FileText, Wand2, Copy, Download } from 'lucide-react';
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../../utils/exportUtils';
import FileHandler from '@/components/shared/FileHandler';

interface ComplianceResult {
  compliance: number;
  issues: Array<{
    type: string;
    text: string;
    suggestion: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  strengths: string[];
}

const StyleComplianceChecker: React.FC = () => {
  const { writingStyle } = useWritingStyle();
  const { showNotification } = useNotification();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState('');
  const [results, setResults] = useState<ComplianceResult | null>(null);
  const [fixedContent, setFixedContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Get the actual style guide name
  const getStyleGuideName = () => {
    return writingStyle?.styleGuide?.primary || 
           writingStyle?.guide || 
           writingStyle?.primary || 
           'Chicago Manual of Style';
  };

  // Check if style guide has been configured (including defaults)
  const hasStyleGuide = Boolean(
    writingStyle?.styleGuide?.primary ||
    writingStyle?.guide ||
    writingStyle?.primary ||
    (writingStyle?.formatting && Object.keys(writingStyle.formatting).length > 0) ||
    (writingStyle?.punctuation && Object.keys(writingStyle.punctuation).length > 0) ||
    // Always true if WritingStyleContext is providing defaults
    true
  );

  // DEBUG: Log the writing style object in detail
  React.useEffect(() => {
    console.log('🔍 StyleCompliance Debug - FULL writingStyle object:');
    console.log(JSON.stringify(writingStyle, null, 2));
    console.log('🔍 StyleCompliance Debug - All possible style guide paths:');
    console.log('- writingStyle.styleGuide?.primary:', writingStyle?.styleGuide?.primary);
    console.log('- writingStyle.guide:', writingStyle?.guide);
    console.log('- writingStyle.primary:', writingStyle?.primary);
    console.log('- writingStyle.styleGuide:', writingStyle?.styleGuide);
    console.log('🔍 StyleCompliance Debug - Final style guide name:', getStyleGuideName());
    console.log('🔍 StyleCompliance Debug - hasStyleGuide result:', hasStyleGuide);
  }, [writingStyle, hasStyleGuide]);

  // Clear all content
  const handleClear = () => {
    setContent('');
    setResults(null);
    setFixedContent('');
  };

  // Use this version - move fixed content to main editor
  const handleUseThisVersion = () => {
    setContent(fixedContent);
    setFixedContent('');
    setResults(null);
    showNotification('success', 'Style-compliant content is now in your editor - ready for further editing or export');
  };

  // Handle file upload
  const handleFileContent = (fileContent: string | object) => {
    if (typeof fileContent === "string") {
      setContent(fileContent);
      showNotification('success', 'File content loaded successfully');
    } else {
      const jsonContent = JSON.stringify(fileContent, null, 2);
      setContent(jsonContent);
      showNotification('success', 'Structured content loaded successfully');
    }
  };

  // Filter out "fixes" that are identical to original text OR are generic/nonsensical
  const filterRealIssues = (issues: any[]) => {
    return issues.filter(issue => {
      const original = issue.text?.trim().toLowerCase();
      const suggestion = issue.suggestion?.trim().toLowerCase();

      // Remove if identical
      if (original === suggestion) return false;

      // Remove if suggestion is empty
      if (!suggestion || suggestion.length === 0) return false;

      // Remove generic/nonsensical feedback
      const isGeneric =
        original.includes('no specific example') ||
        original.includes('no example given') ||
        original.includes('not applicable') ||
        suggestion.startsWith('ensure') ||
        suggestion.startsWith('make sure') ||
        suggestion.startsWith('consider') ||
        (original.length < 10 && suggestion.length > 50); // Tiny "issue" with long generic advice

      return !isGeneric;
    });
  };

  const analyzeContent = async () => {
    if (!content.trim()) {
      showNotification('error', 'Please enter content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setFixedContent('');

    try {
      // Step 1: Analyze the content
      const analyzeResponse = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'styleChecker',
          data: {
            content: content,
            styleGuide: {
              guide: getStyleGuideName(),
              formatting: writingStyle?.formatting || {},
              punctuation: writingStyle?.punctuation || {},
              prohibited: writingStyle?.prohibited || [],
              required: writingStyle?.required || []
            }
          }
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }

      const analysisResult = await analyzeResponse.json();

      if (analysisResult && analysisResult.compliance !== undefined) {
        // Filter out identical "fixes"
        const realIssues = filterRealIssues(analysisResult.issues || []);

        if (realIssues.length === 0) {
          showNotification('success', `${analysisResult.compliance}% compliant - no issues found!`);
          setResults({
            ...analysisResult,
            issues: realIssues
          });
        } else {
          // Step 2: Automatically fix the issues
          try {
            const fixResponse = await fetch('/api/api_endpoints', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mode: 'styleFixer',
                data: {
                  content: content,
                  issues: realIssues,
                  styleGuide: {
                    guide: getStyleGuideName(),
                    formatting: writingStyle?.formatting || {},
                    punctuation: writingStyle?.punctuation || {},
                    prohibited: writingStyle?.prohibited || [],
                    required: writingStyle?.required || []
                  }
                }
              }),
            });

            if (!fixResponse.ok) {
              throw new Error('Failed to fix content');
            }

            const fixResult = await fixResponse.json();

            if (fixResult && fixResult.fixedContent) {
              setFixedContent(fixResult.fixedContent);
              setResults({
                ...analysisResult,
                issues: realIssues
              });
              showNotification('success', `Fixed ${realIssues.length} issue${realIssues.length === 1 ? '' : 's'} automatically!`);
            } else {
              throw new Error('No fixed content returned');
            }
          } catch (fixError) {
            console.error('Fix error:', fixError);
            // If fixing fails, just show the analysis
            setResults({
              ...analysisResult,
              issues: realIssues
            });
            showNotification('warning', `Found ${realIssues.length} issues but couldn't auto-fix them`);
          }
        }

        // Auto-scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      } else {
        throw new Error('Invalid response from the API');
      }
    } catch (err) {
      console.error('Error analyzing content:', err);
      showNotification('error', err.message || 'Failed to analyze content');
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fixContent = async () => {
    if (!results || !results.issues.length) {
      showNotification('error', 'No issues to fix');
      return;
    }

    setIsFixing(true);

    try {
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'styleFixer',
          data: {
            content: content,
            issues: results.issues,
            styleGuide: {
              guide: getStyleGuideName(),
              formatting: writingStyle?.formatting || {},
              punctuation: writingStyle?.punctuation || {},
              prohibited: writingStyle?.prohibited || [],
              required: writingStyle?.required || []
            }
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fix content');
      }

      const result = await response.json();

      if (result && result.fixedContent) {
        setFixedContent(result.fixedContent);
        showNotification('success', 'Content fixed successfully');
      } else {
        throw new Error('Invalid response from the API');
      }
    } catch (err) {
      console.error('Error fixing content:', err);
      showNotification('error', err.message || 'Failed to fix content');
    } finally {
      setIsFixing(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'Text copied to clipboard');
  };

  // Export functionality
  const handleExport = (format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
    const contentToExport = fixedContent || content;
    if (!contentToExport) {
      showNotification('error', 'No content to export');
      return;
    }

    const fileName = `style-compliant-content-${new Date().toISOString().slice(0, 10)}`;

    try {
      switch (format) {
        case 'txt':
          exportToText(contentToExport, `${fileName}.txt`);
          break;
        case 'markdown':
          exportToMarkdown(contentToExport, `${fileName}.md`);
          break;
        case 'html':
          exportToHTML(contentToExport, `${fileName}.html`);
          break;
        case 'pdf':
          exportToPDF(contentToExport, `${fileName}.pdf`);
          break;
        case 'docx':
          exportToDocx(contentToExport, `${fileName}.docx`);
          break;
        default:
          exportToText(contentToExport, `${fileName}.txt`);
      }

      showNotification('success', `Content exported as ${format.toUpperCase()}`);
      setShowExportDropdown(false);
    } catch (error) {
      console.error('Export error:', error);
      showNotification('error', 'Export failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Style Guide Status */}
      {hasStyleGuide && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center text-sm text-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>
                Using {getStyleGuideName()} style guide
                {writingStyle?.formatting?.headingCase && ` • ${writingStyle.formatting.headingCase} headings`}
                {writingStyle?.punctuation?.oxfordComma !== undefined &&
                  ` • Oxford comma ${writingStyle.punctuation.oxfordComma ? 'required' : 'omitted'}`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            Upload or Paste Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasStyleGuide ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
              <AlertTriangle className="text-yellow-500 w-5 h-5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-yellow-700 font-medium">No style guide configured</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Please configure your style guide in Settings first.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Upload - hide ALL export options from FileHandler */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                <div className="text-center mb-4">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 mb-1">
                    Upload Document
                  </h3>
                  <p className="text-sm text-gray-600">
                    Supports Word docs, PDFs, text files, and more
                  </p>
                </div>
                {/* Use FileHandler with export options disabled */}
                <FileHandler
                  onContentLoaded={handleFileContent}
                  content={content}
                  showExport={false}
                />
              </div>

              {/* Content Input - keep original only */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Original Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-80 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Or paste your content here..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Clear
                </button>
                <button
                  onClick={analyzeContent}
                  disabled={isAnalyzing || !content.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Check Style
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div ref={resultsRef} className="space-y-6">
          {/* Fixed Content with clean table of changes */}
          {fixedContent && (
            <div className="space-y-6">
              {/* Green success box with EDITABLE fixed content */}
              <Card className="border-2 border-green-300">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex justify-between items-center">
                    <div>
                      <span>✅ Content Fixed</span>
                      <p className="text-sm font-normal text-green-700 mt-1">
                        Fixed {results.issues.length} issue{results.issues.length === 1 ? '' : 's'}: {results.issues.map(i => i.type).join(', ')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowExportDropdown(!showExportDropdown)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </button>
                        {showExportDropdown && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                            {['txt', 'markdown', 'html', 'pdf', 'docx'].map(format => (
                              <button
                                key={format}
                                onClick={() => handleExport(format as any)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                              >
                                {format === 'txt' ? 'Text' : format}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(fixedContent)}
                        className="px-3 py-1 text-sm text-green-600 hover:text-green-700 flex items-center"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* EDITABLE textarea for fixed content */}
                  <textarea
                    value={fixedContent}
                    onChange={(e) => setFixedContent(e.target.value)}
                    className="w-full h-96 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                    style={{ fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif', lineHeight: '1.6', fontSize: '11pt' }}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFixedContent('');
                          setResults(null);
                          showNotification('info', 'Cleared fixed content');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-700"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          showNotification('success', 'Content saved!');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Edit directly in this box, then export or copy when ready
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clean table of what was fixed and why */}
              {results.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-800">What Was Fixed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Issue Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Original Text</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Fixed To</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Why</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.issues.map((issue, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {issue.type}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 max-w-xs">
                                <div className="truncate" title={issue.text}>
                                  "{issue.text}"
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-800 max-w-xs">
                                <div className="truncate" title={issue.suggestion}>
                                  "{issue.suggestion}"
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                Style guide compliance
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StyleComplianceChecker;