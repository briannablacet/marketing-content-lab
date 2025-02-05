// src/components/features/CreationHub/index.tsx

import React, { useState } from 'react';
const CreationHub = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testContentGeneration = async () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      setTestResult("This is a test result from content generation.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Content Creation Hub</h2>
      <button 
        onClick={testContentGeneration}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Testing...' : 'Test Content Generation'}
      </button>
      {testResult && (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-left">
          <h3 className="font-bold mb-2">Test Result:</h3>
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default CreationHub;