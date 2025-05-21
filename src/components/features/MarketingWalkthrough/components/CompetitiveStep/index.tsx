// src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, AlertCircle, PlusCircle, X, RefreshCw } from 'lucide-react';
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

  // NEW: Add ref for the newly added competitor input
  const newCompetitorRef = useRef<HTMLInputElement>(null);

  // NEW: Track which competitor should be focused
  const [focusCompetitorIndex, setFocusCompetitorIndex] = useState<number | null>(null);

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

      // Set a new timer for 800ms debounce
      const timer = setTimeout(() => {
        handleAnalyzeCompetitor(competitorToAnalyze.index, competitorToAnalyze.name);
        setCompetitorToAnalyze(null);
      }, 800);

      setAnalyzeTimer(timer);
    }

    return () => {
      if (analyzeTimer) {
        clearTimeout(analyzeTimer);
      }
    };
  }, [competitorToAnalyze]);

  // NEW: Effect to focus on newly added competitor input
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

  // UPDATED: Add competitor with focus handling
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
        weaknesses: []
      } : comp
    ));
  };

  const handleAnalyzeCompetitor = async (index: number, name: string) => {
    if (!name.trim()) return;

    setCompetitors(prev => prev.map((comp, i) =>
      i === index ? { ...comp, isLoading: true } : comp
    ));
    setError('');
    setIsAnalyzing(true);

    try {
      const requestData = {
        endpoint: 'analyze-competitors',
        data: {
          competitors: [{
            name,
            description: '',
            knownMessages: [],
            strengths: [],
            weaknesses: []
          }],
          industry: 'technology',
          userMessages: ['']
        }
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unable to analyze competitor. Please try again.');
      }

      const data = await response.json();

      if (!data.competitorInsights?.[0]) {
        throw new Error('No competitor insights returned from API');
      }

      const competitorInsight = data.competitorInsights[0];

      // Check if we have meaningful data
      const hasContent = competitorInsight.uniquePositioning?.length > 0 ||
        competitorInsight.keyThemes?.length > 0 ||
        competitorInsight.gaps?.length > 0;

      if (!hasContent) {
        throw new Error('Limited information available for this competitor');
      }

      setCompetitors(prev => prev.map((comp, i) =>
        i === index ? {
          ...comp,
          isLoading: false,
          description: competitorInsight.uniquePositioning.join(' '),
          knownMessages: competitorInsight.keyThemes || [],
          strengths: competitorInsight.uniquePositioning || [],
          weaknesses: competitorInsight.gaps || []
        } : comp
      ));

      showNotification(`Analysis for ${name} completed`, 'success');
    } catch (err) {
      console.error('Error in handleAnalyzeCompetitor:', err);
      setError(`Failed to analyze competitor: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);

      // Clear any previously generated analysis for this competitor
      clearCompetitorAnalysis(index);

      showNotification('Failed to analyze competitor. Please try again.', 'error');
    } finally {
      setCompetitors(prev => prev.map((comp, i) =>
        i === index ? { ...comp, isLoading: false } : comp
      ));
      setIsAnalyzing(false);
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setCompetitors(prev => prev.map((comp, i) =>
      i === index ? { ...comp, name } : comp
    ));

    // Set the competitor to analyze after a delay
    if (name.trim().length > 2) {
      setCompetitorToAnalyze({ index, name });
    }
  };

  const handleSubmitCompetitor = (index: number) => {
    const competitor = competitors[index];
    if (competitor.name.trim().length > 0) {
      handleAnalyzeCompetitor(index, competitor.name);
    }
  };

  // Check if we have any valid competitors (with names)
  const hasValidCompetitors = competitors.some(comp => comp.name.trim() !== '');

  // Save and continue function for walkthrough
  const handleSaveAndContinue = () => {
    // Only save if we have valid competitors
    if (hasValidCompetitors) {
      localStorage.setItem('marketingCompetitors',
        JSON.stringify(competitors.filter(comp => comp.name.trim() !== '')));
      showNotification('Competitor analysis saved', 'success');

      // Navigate to next step if in walkthrough
      if (onNext) {
        onNext();
      }
    } else {
      showNotification('No competitors added. You can come back to this step later.', 'info');
      // Allow skipping this step
      if (onNext) {
        onNext();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
        <div className="flex flex-col items-center text-center">
          <Sparkles className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Competitor Analysis</h3>
          <p className="text-gray-600 mb-4">
            Let AI analyze your competitors and provide strategic insights
          </p>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Here's how it works:</p>
            <ul className="list-disc text-left pl-4 space-y-1">
              <li>Enter a competitor's name or website URL</li>
              <li>Click the "Analyze" button to start the analysis</li>
              <li>You'll see insights about their positioning, messages, and gaps</li>
              <li>Add more competitors to build a complete analysis</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Competitor Cards */}
      {competitors.map((competitor, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-6">
            {/* Name Input */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  // NEW: Add ref to the most recently added competitor
                  ref={index === competitors.length - 1 ? newCompetitorRef : null}
                  type="text"
                  value={competitor.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Enter competitor name..."
                  className="w-full p-3 border rounded-lg pr-12"
                />
                {competitor.isLoading && (
                  <div className="absolute right-2 top-2 bg-blue-50 rounded-full p-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSubmitCompetitor(index)}
                disabled={competitor.isLoading || competitor.name.trim().length < 2}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Analyze
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

            {/* AI Generated Content */}
            {competitor.name && !competitor.isLoading && (competitor.description || competitor.knownMessages.length > 0) && (
              <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                {competitor.description && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Positioning</h4>
                    <p className="text-gray-600">{competitor.description}</p>
                  </div>
                )}

                {competitor.knownMessages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Messages</h4>
                    <ul className="space-y-2">
                      {competitor.knownMessages.map((message, i) => (
                        <li key={i} className="bg-white p-3 rounded text-gray-600">
                          {message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {competitor.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
                    <ul className="space-y-2">
                      {competitor.strengths.map((strength, i) => (
                        <li key={i} className="bg-white p-3 rounded text-gray-600">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {competitor.weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Gaps</h4>
                    <ul className="space-y-2">
                      {competitor.weaknesses.map((weakness, i) => (
                        <li key={i} className="bg-white p-3 rounded text-gray-600">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add a button to clear the analysis */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => clearCompetitorAnalysis(index)}
                    className="text-sm font-medium text-blue-600 hover:text-red-600 underline py-1 px-2"
                  >
                    Clear analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))
      }

      {/* Add Competitor Button */}
      <button
        onClick={addCompetitor}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2 mt-4"
      >
        <PlusCircle size={20} />
        Add Another Competitor
      </button>

      {/* Error Display */}
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
      {/* Navigation buttons – only show in walkthrough mode */}

    </div>
  );
};

export default CompetitiveStep;

