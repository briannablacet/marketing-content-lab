// File: src/pages/test-competitor-analysis.tsx

import React, { useState } from 'react';

interface Competitor {
  name: string;
  description?: string;
  differentiators: string[];
}

interface CompetitorAnalysis {
  competitors: Competitor[];
  _id?: string;
}

const TestCompetitorAnalysis: React.FC = () => {
  const [competitorInfo, setCompetitorInfo] = useState<CompetitorAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Test creating competitor analysis
  const createAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competitors: [
            {
              name: "Competitor A",
              description: "Leading enterprise solution",
              differentiators: [
                "Higher price point",
                "More complex interface",
                "Broader feature set"
              ]
            },
            {
              name: "Competitor B",
              description: "New market entrant",
              differentiators: [
                "Limited features",
                "Lower price point",
                "Simpler interface"
              ]
            }
          ]
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCompetitorInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to create competitor analysis');
      }
    } catch (err) {
      setError('Failed to create competitor analysis');
    } finally {
      setLoading(false);
    }
  };

  // Test getting competitor analysis
  const getAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/competitor-analysis');
      const data = await response.json();
      if (data.success) {
        setCompetitorInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch competitor analysis');
      }
    } catch (err) {
      setError('Failed to fetch competitor analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Competitor Analysis API Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-x-4 mb-6">
        <button
          onClick={createAnalysis}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Create Analysis
        </button>
        
        <button
          onClick={getAnalysis}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Get Analysis
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {competitorInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Competitor Analysis:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(competitorInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestCompetitorAnalysis;