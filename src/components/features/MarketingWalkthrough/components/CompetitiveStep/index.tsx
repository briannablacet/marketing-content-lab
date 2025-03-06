// src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, AlertCircle, PlusCircle, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useWalkthrough } from '../../../../../context/WalkthroughContext';

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
  isStandalone?: boolean;
}

const CompetitiveStep: React.FC<CompetitiveStepProps> = ({ 
  onNext, 
  onBack, 
  isStandalone = false 
}) => {
  const { data, updateData } = useWalkthrough();
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: '', description: '', knownMessages: [], strengths: [], weaknesses: [] }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  // Create a reference to store timeout IDs for debouncing
  const [debounceTimers, setDebounceTimers] = useState<{[key: number]: NodeJS.Timeout}>({});

  // Load data from context if available
  useEffect(() => {
    if (data?.competitors && data.competitors.length > 0) {
      setCompetitors(data.competitors);
    }
  }, [data]);

  // Save data to context when competitors change
  useEffect(() => {
    if (competitors.some(c => c.name) && updateData) {
      updateData({ competitors });
    }
  }, [competitors, updateData]);
  
  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => {
      // Clear all debounce timers
      Object.values(debounceTimers).forEach(timerId => {
        clearTimeout(timerId);
      });
    };
  }, [debounceTimers]);

  const addCompetitor = () => {
    setCompetitors([
      ...competitors,
      { name: '', description: '', knownMessages: [], strengths: [], weaknesses: [] }
    ]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const handleAnalyzeCompetitor = async (index: number, name: string) => {
    if (!name.trim()) return;

    setCompetitors(prev => prev.map((comp, i) => 
      i === index ? { ...comp, isLoading: true } : comp
    ));
    setError('');

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
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError('Sorry, we encountered an error. Please try again in a moment.');
        return;
      }

      if (response.status === 500) {
        console.error('Server error:', data);
        setCompetitors(prev => prev.map((comp, i) => 
          i === index ? {
            ...comp,
            isLoading: false,
            description: "We're having trouble analyzing this competitor right now.",
            knownMessages: ["Please try again in a moment"],
            strengths: [],
            weaknesses: []
          } : comp
        ));
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Unable to analyze competitor. Please try again.');
        return;
      }

      if (!data.competitorInsights?.[0]) {
        setCompetitors(prev => prev.map((comp, i) => 
          i === index ? {
            ...comp,
            isLoading: false,
            description: "Limited information available for this competitor.",
            knownMessages: ["No key messages found"],
            strengths: ["Information not available"],
            weaknesses: ["Information not available"]
          } : comp
        ));
        return;
      }

      const competitorInsight = data.competitorInsights[0];
      
      // Check if we have meaningful data
      const hasContent = competitorInsight.uniquePositioning?.length > 0 || 
                        competitorInsight.keyThemes?.length > 0 ||
                        competitorInsight.gaps?.length > 0;

      if (!hasContent) {
        setCompetitors(prev => prev.map((comp, i) => 
          i === index ? {
            ...comp,
            isLoading: false,
            description: "We couldn't find detailed information about this competitor.",
            knownMessages: ["Try entering a more specific company name"],
            strengths: ["Information not available"],
            weaknesses: ["Information not available"]
          } : comp
        ));
        return;
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
    } catch (err) {
      console.error('Error in handleAnalyzeCompetitor:', err);
      setError('Failed to analyze competitor. Please try again.');
    } finally {
      setCompetitors(prev => prev.map((comp, i) => 
        i === index ? { ...comp, isLoading: false } : comp
      ));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    // Update the name immediately
    setCompetitors(prev => prev.map((comp, i) => 
      i === index ? { ...comp, name } : comp
    ));
    
    // Clear any existing timeout for this index
    if (debounceTimers[index]) {
      clearTimeout(debounceTimers[index]);
    }
    
    // Only set a timeout if the name is long enough
    if (name.length > 2) {
      // Set a new timeout for this index
      const timerId = setTimeout(() => {
        handleAnalyzeCompetitor(index, name);
        // Clear the timer ID from state after execution
        setDebounceTimers(prev => {
          const newTimers = {...prev};
          delete newTimers[index];
          return newTimers;
        });
      }, 800); // Wait 800ms after typing stops before analyzing
      
      // Store the timer ID
      setDebounceTimers(prev => ({...prev, [index]: timerId}));
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Card - At the top */}
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
              <li>Start typing a competitor's name below</li>
              <li>After you pause typing, AI will automatically analyze the competitor</li>
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
                  type="text"
                  value={competitor.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Type competitor name for instant AI analysis..."
                  className="w-full p-3 border rounded-lg pr-12"
                />
                {competitor.isLoading && (
                  <div className="absolute right-2 top-2 bg-blue-50 rounded-full p-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
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

      {/* Dashboard Link - Only show when we have some competitors and in standalone mode */}
      {isStandalone && competitors.filter(comp => comp.name.trim()).length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Ready to visualize your competitive landscape?</h3>
          <p className="text-blue-800 mb-4">
            Explore the visual dashboard to see your market position and identify opportunities.
          </p>
          <Link href="/competitor-dashboard">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Competitive Landscape Dashboard →
            </button>
          </Link>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
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
    </div>
  );
};

export default CompetitiveStep;