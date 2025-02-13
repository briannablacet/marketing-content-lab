import * as React from 'react';
import { useState } from 'react';
import type { WritingStyle, StyleGuideType } from '../types/WritingStyle';

const TestWritingStyle: React.FC = () => {
  const [style, setStyle] = useState<WritingStyle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Test creating a style
  const createStyle = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/writing-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          styleGuideType: StyleGuideType.AP,
          preferences: {
            tone: 'Professional',
            vocabulary: 'Technical',
            formatting: 'Standard'
          }
        }),
      });
      const data = await response.json();
      setStyle(data.data);
    } catch (err) {
      setError('Failed to create style');
    } finally {
      setLoading(false);
    }
  };

  // Test getting the style
  const getStyle = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/writing-style');
      const data = await response.json();
      setStyle(data.data);
    } catch (err) {
      setError('Failed to fetch style');
    } finally {
      setLoading(false);
    }
  };

  // Test updating the style
  const updateStyle = async () => {
    if (!style?._id) return;
    try {
      setLoading(true);
      const response = await fetch('/api/writing-style', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...style,
          preferences: {
            ...style.preferences,
            tone: 'Casual' // Change tone as a test
          }
        }),
      });
      const data = await response.json();
      setStyle(data.data);
    } catch (err) {
      setError('Failed to update style');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Writing Style API Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-x-4 mb-6">
        <button
          onClick={createStyle}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Create Style
        </button>
        
        <button
          onClick={getStyle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Get Style
        </button>
        
        <button
          onClick={updateStyle}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          disabled={loading || !style}
        >
          Update Style (Change Tone)
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {style && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Style:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(style, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestWritingStyle;