//src/pages/test-target-audience.tsx

import React, { useState } from 'react';

interface Persona {
  name: string;
  description: string;
  problems: string[];
}

interface TargetAudience {
  personas: Persona[];
  _id?: string;
}

const TestTargetAudience: React.FC = () => {
  const [audienceInfo, setAudienceInfo] = useState<TargetAudience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Test creating target audience info
  const createAudience = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/target-audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personas: [
            {
              name: "IT Manager",
              description: "Responsible for IT infrastructure and security",
              problems: [
                "Managing security risks",
                "Budget constraints",
                "Team efficiency"
              ]
            }
          ]
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAudienceInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to create target audience info');
      }
    } catch (err) {
      setError('Failed to create target audience info');
    } finally {
      setLoading(false);
    }
  };

  // Test getting target audience info
  const getAudience = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/target-audience');
      const data = await response.json();
      if (data.success) {
        setAudienceInfo(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch target audience info');
      }
    } catch (err) {
      setError('Failed to fetch target audience info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Target Audience API Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-x-4 mb-6">
        <button
          onClick={createAudience}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Create Target Audience
        </button>
        
        <button
          onClick={getAudience}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Get Target Audience
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {audienceInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Target Audience Info:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(audienceInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestTargetAudience;