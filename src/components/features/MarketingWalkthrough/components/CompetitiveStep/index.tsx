// src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, AlertCircle, PlusCircle, X, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useNotification } from '../../../../../context/NotificationContext';

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
  const [competitorToAnalyze, setCompetitorToAnalyze] = useState<{index: number, name: string} | null>(null);
  
  // Timer for debounce
  const [analyzeTimer, setAnalyzeTimer] = useState<NodeJS.Timeout | null>(null);

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

  const addCompetitor = () => {
    setCompetitors([
      ...competitors,
      { name: '', description: '', knownMessages: [], strengths: [], weaknesses: [] }
    ]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  // Generate fallback data for when API fails
  const generateFallbackData = (name: string) => {
    // Create some generic yet somewhat tailored data based on company name
    return {
      description: `${name} appears to be a player in this market space with a defined strategy.`,
      knownMessages: [
        "Focus on customer experience",
        "Emphasis on innovation and quality",
        `${name}'s unique approach to solving problems`
      ],
      strengths: [
        "Established market presence",
        "Strong brand recognition",
        "Innovative product features"
      ],
      weaknesses: [
        "Potential gaps in customer service",
        "Areas for improvement in market coverage",
        "Opportunities for product enhancement"
      ]
    };
  };

  const handleAnalyzeCompetitor = async (index: number, name: string) => {
    if (!name.trim()) return;

    setCompetitors(prev => prev.map((comp, i) => 
      i === index ? { ...comp, isLoading: true } : comp
    ));
    setError('');
    setIsAnalyzing(true);

    // Set a timeout to handle API taking too long (15 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), 15000);
    });

    try {
      // Create the API request
      const apiRequest = fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      // Race between API request and timeout
      const response = await Promise.race([apiRequest, timeoutPromise]) as Response;
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get the data
      const data = await response.json();
      
      // Check if we have valid competitor insights
      if (data && data.competitorInsights && data.competitorInsights[0]) {
        const competitorInsight = data.competitorInsights[0];
        
        setCompetitors(prev => prev.map((comp, i) => 
          i === index ? {
            ...comp,
            isLoading: false,
            description: competitorInsight.uniquePositioning?.join(' ') || `Analysis of ${name}'s positioning.`,
            knownMessages: competitorInsight.keyThemes || [`${name}'s key messages`],
            strengths: competitorInsight.uniquePositioning || [`${name}'s strengths`],
            weaknesses: competitorInsight.gaps || [`Areas where ${name} could improve`]
          } : comp
        ));
        
        showNotification('success', `Analysis for ${name} completed`);
      } else {
        // Use fallback data if API response is empty or invalid
        const fallback = generateFallbackData(name);
        
        setCompetitors(prev => prev.map((comp, i) => 
          i === index ? {
            ...comp,
            isLoading: false,
            description: fallback.description,
            knownMessages: fallback.knownMessages,
            strengths: fallback.strengths,
            weaknesses: fallback.weaknesses
          } : comp
        ));
        
        showNotification('success', `Analysis for ${name} completed (with fallback data)`);
      }
    } catch (err) {
      console.error('Error analyzing competitor:', err);
      
      // When there's an error or timeout, use our fallback data
      const fallback = generateFallbackData(name);
      
      setCompetitors(prev => prev.map((comp, i) => 
        i === index ? {
          ...comp,
          isLoading: false,
          description: fallback.description,
          knownMessages: fallback.knownMessages,
          strengths: fallback.strengths,
          weaknesses: fallback.weaknesses
        } : comp
      ));
      
      // Show a more user-friendly error
      setError('Analysis is currently having issues. Using fallback data instead.');
      showNotification('info', `Using available data for ${name}`);
    } finally {
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
              <li>Enter a competitor's name</li>
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

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Analysis Note</h4>
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
      
      {/* Save button for standalone version - but not when used in the competitive-analysis page */}
      {!isWalkthrough && !isStandalone && (
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              showNotification('success', 'Competitor analysis saved successfully!');
              setTimeout(() => router.push('/'), 1500);
            }}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              !hasValidCompetitors ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!hasValidCompetitors}
          >
            Save Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default CompetitiveStep;