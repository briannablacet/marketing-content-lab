// src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx
// Enhanced competitive analysis with better URL support and error handling

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, AlertCircle, PlusCircle, X, RefreshCw, ExternalLink, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { useNotification } from '../../../../../context/NotificationContext';

// Define notification types
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Competitor {
  name: string;
  description: string;
  knownMessages: string[];
  strengths: string[];
  weaknesses: string[];
  isLoading?: boolean;
  error?: string;
  metadata?: {
    searchPerformed?: boolean;
    isUrl?: boolean;
    analysisTimestamp?: string;
  };
}

interface CompetitiveStepProps {
  onNext?: () => void;
  onBack?: () => void;
  isWalkthrough?: boolean;
  isStandalone?: boolean;
  onDataChange?: (competitors: Competitor[]) => void;
}

const CompetitiveStep: React.FC<CompetitiveStepProps> = ({
  onNext,
  onBack,
  isWalkthrough = true,
  isStandalone = false,
  onDataChange
}) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: '', description: '', knownMessages: [], strengths: [], weaknesses: [] }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // New state to track when to analyze
  const [competitorToAnalyze, setCompetitorToAnalyze] = useState<{ index: number, name: string } | null>(null);

  // Timer for debounce
  const [analyzeTimer, setAnalyzeTimer] = useState<NodeJS.Timeout | null>(null);

  // Add ref for the newly added competitor input
  const newCompetitorRef = useRef<HTMLInputElement>(null);

  // Track which competitor should be focused
  const [focusCompetitorIndex, setFocusCompetitorIndex] = useState<number | null>(null);

  // Add state for current competitor being analyzed
  const [currentCompetitor, setCurrentCompetitor] = useState('');

  // Add state for controlling which competitor analysis is expanded
  const [expandedCompetitor, setExpandedCompetitor] = useState<number | null>(null);

  // Helper function to detect if input looks like a URL
  const isURL = (input: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(input.toLowerCase()) ||
      input.toLowerCase().includes('.com') ||
      input.toLowerCase().includes('.org') ||
      input.toLowerCase().includes('.net') ||
      input.toLowerCase().includes('www.') ||
      input.toLowerCase().includes('http');
  };

  // Load competitors from localStorage when component mounts
  useEffect(() => {
    try {
      const savedCompetitors = localStorage.getItem('marketingCompetitors');
      if (savedCompetitors) {
        const parsedCompetitors = JSON.parse(savedCompetitors);
        if (Array.isArray(parsedCompetitors) && parsedCompetitors.length > 0) {
          setCompetitors(parsedCompetitors);
        }
      }
    } catch (error) {
      console.error('Error loading saved competitors:', error);
    }
  }, []);

  // Effect to process analysis requests with a debounce
  useEffect(() => {
    if (competitorToAnalyze && competitorToAnalyze.name.trim().length > 2) {
      // Clear any existing timer
      if (analyzeTimer) {
        clearTimeout(analyzeTimer);
      }

      // Set a new timer for 1200ms debounce (longer for URLs)
      const timer = setTimeout(() => {
        handleAnalyzeCompetitor(competitorToAnalyze.name);
        setCompetitorToAnalyze(null);
      }, 1200);

      setAnalyzeTimer(timer);
    }

    return () => {
      if (analyzeTimer) {
        clearTimeout(analyzeTimer);
      }
    };
  }, [competitorToAnalyze]);

  // Effect to focus on newly added competitor input
  useEffect(() => {
    if (focusCompetitorIndex !== null && newCompetitorRef.current) {
      newCompetitorRef.current.focus();
      // Reset focus index after focusing
      setFocusCompetitorIndex(null);
    }
  }, [focusCompetitorIndex]);

  // Save competitors to local storage and notify parent component
  useEffect(() => {
    // Only save non-empty competitors
    const validCompetitors = competitors.filter(comp => comp.name.trim() !== '');
    if (validCompetitors.length > 0) {
      localStorage.setItem('marketingCompetitors', JSON.stringify(validCompetitors));
      if (onDataChange) {
        onDataChange(validCompetitors);
      }
    }
  }, [competitors, onDataChange]);

  // Add competitor with focus handling
  const addCompetitor = () => {
    setCompetitors([
      ...competitors,
      { name: '', description: '', knownMessages: [], strengths: [], weaknesses: [] }
    ]);

    // Set focus on the newly added competitor
    setFocusCompetitorIndex(competitors.length);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const clearCompetitorAnalysis = (index: number) => {
    setCompetitors(prev => prev.map((comp, i) =>
      i === index ? {
        ...comp,
        description: '',
        knownMessages: [],
        strengths: [],
        weaknesses: [],
        error: undefined,
        metadata: undefined
      } : comp
    ));
    // Close the accordion when clearing
    if (expandedCompetitor === index) {
      setExpandedCompetitor(null);
    }
  };

  // ENHANCED: Proper API call with better error handling and URL support
  const handleAnalyzeCompetitor = async (competitorName: string) => {
    if (!competitorName.trim()) {
      showNotification('error', 'Please enter a competitor name or URL');
      return;
    }

    setIsAnalyzing(true);
    setCurrentCompetitor(competitorName);
    setError(''); // Clear any previous errors

    try {
      console.log(`🎯 Starting enhanced analysis for: ${competitorName}`);

      // Determine if input is a URL
      const inputIsUrl = isURL(competitorName);
      console.log(`🔍 Input type: ${inputIsUrl ? 'URL' : 'Company Name'}`);

      // Show different notification based on input type
      if (inputIsUrl) {
        showNotification('info', `Analyzing website: ${competitorName}`);
      } else {
        showNotification('info', `Researching company: ${competitorName}`);
      }

      // Use the enhanced API structure
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'competitors',
          data: {
            competitors: [{ name: competitorName }],
            industry: 'technology' // You could make this dynamic based on user's industry
          }
        }),
      });

      console.log(`📡 API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error: ${response.status} - ${errorText}`);
        throw new Error(`Analysis failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ API response received:', result);

      // Handle the enhanced response format
      if (Array.isArray(result) && result.length > 0) {
        const analysisResult = result[0];

        // Check if this specific competitor had an error
        if (analysisResult.error) {
          throw new Error(analysisResult.error);
        }

        // Validate that we have meaningful data
        if (!analysisResult.uniquePositioning ||
          !analysisResult.keyThemes ||
          !analysisResult.gaps ||
          (analysisResult.uniquePositioning.length === 0 &&
            analysisResult.keyThemes.length === 0 &&
            analysisResult.gaps.length === 0)) {
          throw new Error(`No analysis data found for ${competitorName}. This might be a very small company or the URL might not be accessible.`);
        }

        // Update the competitor in the state with the analysis
        setCompetitors(prev => prev.map(comp =>
          comp.name === competitorName ? {
            ...comp,
            description: analysisResult.uniquePositioning.length > 0
              ? analysisResult.uniquePositioning.join('. ')
              : 'No positioning information found',
            knownMessages: analysisResult.keyThemes || [],
            strengths: analysisResult.uniquePositioning || [],
            weaknesses: analysisResult.gaps || [],
            error: undefined,
            metadata: analysisResult.metadata || {
              searchPerformed: true,
              isUrl: inputIsUrl,
              analysisTimestamp: new Date().toISOString()
            }
          } : comp
        ));

        // Auto-expand the newly analyzed competitor
        const competitorIndex = competitors.findIndex(comp => comp.name === competitorName);
        if (competitorIndex !== -1) {
          setExpandedCompetitor(competitorIndex);
        }

        // Show success with details about what we found
        const foundData = [
          analysisResult.uniquePositioning?.length > 0 && 'positioning',
          analysisResult.keyThemes?.length > 0 && 'messaging',
          analysisResult.gaps?.length > 0 && 'opportunities'
        ].filter(Boolean);

        if (foundData.length > 0) {
          showNotification('success', `Analysis complete! Found: ${foundData.join(', ')}`);
        } else {
          showNotification('warning', 'Analysis complete, but limited data was found');
        }

      } else {
        throw new Error('No analysis results returned from the API');
      }

    } catch (error) {
      console.error('❌ Error analyzing competitor:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Update the competitor with error information
      setCompetitors(prev => prev.map(comp =>
        comp.name === competitorName ? {
          ...comp,
          error: errorMessage,
          description: '',
          knownMessages: [],
          strengths: [],
          weaknesses: []
        } : comp
      ));

      // Show specific error message
      if (errorMessage.includes('No analysis data found')) {
        showNotification('warning', `Limited data available for ${competitorName}. Try a larger competitor or check the URL.`);
      } else {
        showNotification('error', `Analysis failed: ${errorMessage}`);
      }

      setError(`Failed to analyze ${competitorName}: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
      setCurrentCompetitor('');
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setCompetitors(prev => prev.map((comp, i) =>
      i === index ? { ...comp, name, error: undefined } : comp
    ));

    // Set the competitor to analyze after a delay (only if substantial input)
    if (name.trim().length > 2) {
      setCompetitorToAnalyze({ index, name });
    }
  };

  const handleSubmitCompetitor = (index: number) => {
    const competitor = competitors[index];
    if (competitor.name.trim().length > 0) {
      handleAnalyzeCompetitor(competitor.name);
    }
  };

  // Toggle function for accordion
  const toggleCompetitorExpanded = (index: number) => {
    setExpandedCompetitor(expandedCompetitor === index ? null : index);
  };

  // Check if we have any valid competitors (with names)
  const hasValidCompetitors = competitors.some(comp => comp.name.trim() !== '');

  // Save and continue function for walkthrough
  const handleSaveAndContinue = () => {
    // Only save if we have valid competitors
    if (hasValidCompetitors) {
      localStorage.setItem('marketingCompetitors',
        JSON.stringify(competitors.filter(comp => comp.name.trim() !== '')));
      showNotification('success', 'Competitor analysis saved');

      // Navigate to next step if in walkthrough
      if (onNext) {
        onNext();
      }
    } else {
      showNotification('info', 'No competitors added. You can come back to this step later.');
      // Allow skipping this step
      if (onNext) {
        onNext();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced AI Analysis Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Competitor Analysis</h3>
            <p className="text-gray-600 mb-6">
              Advanced competitive intelligence with URL analysis and web research capabilities.
            </p>

            {/* Two-column layout for features */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* What's New Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-blue-600">✨</span>
                  Enhanced Features
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>URL Analysis:</strong> Paste competitor websites for direct analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Smart Research:</strong> Better data for smaller and niche companies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Detailed Insights:</strong> Positioning, messaging, and opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Real Analysis:</strong> No generic placeholders or fallback data</span>
                  </li>
                </ul>
              </div>

              {/* Pro Tips Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-orange-500">💡</span>
                  Best Practices
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Use main website URLs (e.g., "competitor.com")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Company names work best for well-known brands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Analysis takes 10-15 seconds for thorough research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Try multiple competitors for comprehensive insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Analysis Status */}
      {isAnalyzing && currentCompetitor && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <div className="flex-1">
              <span className="text-blue-800 font-medium">
                {isURL(currentCompetitor) ? 'Analyzing website:' : 'Researching company:'} {currentCompetitor}
              </span>
              <p className="text-blue-600 text-sm mt-1">
                {isURL(currentCompetitor)
                  ? 'Examining website content and positioning...'
                  : 'Gathering competitive intelligence...'
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Competitor Cards */}
      {competitors.map((competitor, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-6">
            {/* Name Input with Enhanced Visual Cues */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  ref={index === competitors.length - 1 ? newCompetitorRef : null}
                  type="text"
                  value={competitor.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Enter competitor name or website URL (e.g., competitor.com)..."
                  className={`w-full p-3 border rounded-lg pr-12 ${competitor.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isURL(competitor.name) ? 'text-blue-700 font-medium' : ''
                    }`}
                />

                {/* Visual indicator for URL vs company name */}
                {competitor.name && (
                  <div className="absolute right-12 top-3">
                    {isURL(competitor.name) ? (
                      <Globe className="w-5 h-5 text-blue-500" title="Website URL detected" />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-gray-400" title="Company name" />
                    )}
                  </div>
                )}

                {competitor.isLoading && (
                  <div className="absolute right-2 top-2 bg-blue-50 rounded-full p-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSubmitCompetitor(index)}
                disabled={isAnalyzing || competitor.name.trim().length < 2}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAnalyzing && currentCompetitor === competitor.name ? 'Analyzing...' : 'Analyze'}
              </button>

              {competitors.length > 1 && (
                <button
                  onClick={() => removeCompetitor(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Error Display for Individual Competitor */}
            {competitor.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">Analysis Error</h4>
                    <p className="text-red-700 text-sm mt-1">{competitor.error}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAnalyzeCompetitor(competitor.name)}
                        disabled={isAnalyzing}
                        className="text-red-700 text-sm hover:text-red-800 underline"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => clearCompetitorAnalysis(index)}
                        className="text-red-700 text-sm hover:text-red-800 underline ml-4"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Generated Content - Enhanced Display with Accordion */}
            {competitor.name && !competitor.isLoading && !competitor.error &&
              (competitor.description || competitor.knownMessages.length > 0) && (
                <div className="border rounded-lg bg-gray-50">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleCompetitorExpanded(index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex items-center gap-2">
                        {competitor.metadata?.isUrl ? (
                          <Globe className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          Analysis Results
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {competitor.description && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Positioning
                          </span>
                        )}
                        {competitor.knownMessages.length > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {competitor.knownMessages.length} Messages
                          </span>
                        )}
                        {competitor.weaknesses.length > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                            {competitor.weaknesses.length} Opportunities
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {expandedCompetitor === index ? 'Hide Details' : 'View Details'}
                      </span>
                      {expandedCompetitor === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {expandedCompetitor === index && (
                    <div className="px-4 pb-4 space-y-6 border-t border-gray-200">
                      {/* Analysis Metadata */}
                      {competitor.metadata && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 pt-4">
                          <div className="flex items-center gap-1">
                            {competitor.metadata.isUrl ? (
                              <>
                                <Globe className="w-3 h-3" />
                                <span>Website Analysis</span>
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-3 h-3" />
                                <span>Company Research</span>
                              </>
                            )}
                          </div>
                          {competitor.metadata.analysisTimestamp && (
                            <span>• {new Date(competitor.metadata.analysisTimestamp).toLocaleString()}</span>
                          )}
                        </div>
                      )}

                      {/* Key Positioning */}
                      {competitor.description && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-700">🎯 Key Positioning</h4>
                          </div>
                          <p className="text-gray-600 bg-white p-3 rounded border-l-4 border-blue-400">
                            {competitor.description}
                          </p>
                        </div>
                      )}

                      {/* Key Messages */}
                      {competitor.knownMessages.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-700">📢 Key Messages</h4>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {competitor.knownMessages.length} found
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {competitor.knownMessages.map((message, i) => (
                              <li key={i} className="bg-white p-3 rounded border-l-4 border-green-400 text-gray-600">
                                {message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Strengths */}
                      {competitor.strengths.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-700">💪 Competitive Strengths</h4>
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              {competitor.strengths.length} identified
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="bg-white p-3 rounded border-l-4 border-emerald-400 text-gray-600">
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Gaps/Opportunities */}
                      {competitor.weaknesses.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-700">🎯 Opportunities & Gaps</h4>
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                              {competitor.weaknesses.length} found
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="bg-white p-3 rounded border-l-4 border-orange-400 text-gray-600">
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleAnalyzeCompetitor(competitor.name)}
                          disabled={isAnalyzing}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 underline py-1 px-2 disabled:opacity-50"
                        >
                          🔄 Re-analyze
                        </button>
                        <button
                          onClick={() => clearCompetitorAnalysis(index)}
                          className="text-sm font-medium text-red-600 hover:text-red-700 underline py-1 px-2"
                        >
                          🗑️ Clear analysis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </Card>
      ))}

      {/* Add Competitor Button */}
      <button
        onClick={addCompetitor}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2 mt-4"
      >
        <PlusCircle size={20} />
        Add Another Competitor
      </button>

      {/* Global Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 mt-4">
          <div className="flex items-center gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Analysis Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-700 text-sm mt-2 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Card - Show when we have successful analyses */}
      {competitors.some(comp => comp.description && !comp.error) && (
        <Card className="bg-green-50 border-green-200 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Analysis Complete! 🎉</h3>
              <p className="text-green-700 text-sm mb-3">
                You now have competitive intelligence on {competitors.filter(comp => comp.description && !comp.error).length} competitor(s).
                Use this data to:
              </p>
              <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                <li>Identify messaging gaps in your market</li>
                <li>Differentiate your positioning</li>
                <li>Discover new market opportunities</li>
                <li>Refine your value proposition</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CompetitiveStep;