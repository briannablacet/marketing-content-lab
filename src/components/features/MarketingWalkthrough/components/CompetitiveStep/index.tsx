// CompetitiveStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Globe, AlertCircle } from 'lucide-react';

interface Competitor {
  name: string;
  url: string;
  strengths: string;
  weaknesses: string;
  messaging: string[];
}

interface AIAnalysis {
  keyThemes: string[];
  gaps: string[];
  opportunities: string[];
  differentiators: string[];
}

const CompetitiveStep = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: '', url: '', strengths: '', weaknesses: '', messaging: [] }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState('');

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', url: '', strengths: '', weaknesses: '', messaging: [] }]);
  };

  const handleAnalyzeCompetitors = async () => {
    setIsAnalyzing(true);
    setError('');

    try {
      // TODO: Replace with actual API call to your OpenAI endpoint
      const response = await fetch('/api/analyze-competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competitors: competitors.map(c => ({
            name: c.name,
            url: c.url
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze competitors');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze competitors. Please check the URLs and try again.');
      console.error('Error analyzing competitors:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Button */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center text-center">
          <Sparkles className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Competitor Analysis</h3>
          <p className="text-gray-600 mb-4">
            Let AI analyze your competitors' content and compare it with your key messages
          </p>
          <button
            onClick={handleAnalyzeCompetitors}
            disabled={isAnalyzing || competitors.every(c => !c.url)}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              isAnalyzing
                ? 'bg-blue-100 text-blue-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white" />
                Analyzing Content...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Competitors
              </>
            )}
          </button>
        </div>
      </Card>

      {/* Competitor Forms */}
      {competitors.map((competitor, index) => (
        <Card key={index} className="p-6">
          <h3 className="text-lg font-semibold mb-4">Competitor {index + 1}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={competitor.name}
                  onChange={(e) => {
                    const newCompetitors = [...competitors];
                    newCompetitors[index].name = e.target.value;
                    setCompetitors(newCompetitors);
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter competitor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={competitor.url}
                    onChange={(e) => {
                      const newCompetitors = [...competitors];
                      newCompetitors[index].url = e.target.value;
                      setCompetitors(newCompetitors);
                    }}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Content Strengths</label>
              <textarea
                value={competitor.strengths}
                onChange={(e) => {
                  const newCompetitors = [...competitors];
                  newCompetitors[index].strengths = e.target.value;
                  setCompetitors(newCompetitors);
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="What do they do well in their content?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Content Gaps</label>
              <textarea
                value={competitor.weaknesses}
                onChange={(e) => {
                  const newCompetitors = [...competitors];
                  newCompetitors[index].weaknesses = e.target.value;
                  setCompetitors(newCompetitors);
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="What opportunities do you see in their content strategy?"
              />
            </div>
          </div>
        </Card>
      ))}

      {/* Add Competitor Button */}
      <button
        onClick={addCompetitor}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
      >
        + Add Another Competitor
      </button>

      {/* AI Analysis Results */}
      {analysis && (
        <Card className="p-6 bg-blue-50">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            AI Analysis Results
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Key Themes Found</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keyThemes.map((theme, i) => (
                  <span key={i} className="px-3 py-1 bg-white rounded-full text-blue-700 text-sm">
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Content Gaps</h4>
              <ul className="space-y-2">
                {analysis.gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Opportunities</h4>
              <ul className="space-y-2">
                {analysis.opportunities.map((opportunity, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Your Differentiators</h4>
              <ul className="space-y-2">
                {analysis.differentiators.map((diff, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-600">★</span>
                    {diff}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default CompetitiveStep;