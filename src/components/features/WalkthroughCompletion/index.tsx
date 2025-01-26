// src/components/features/WalkthroughCompletion/index.tsx
import React from 'react';
import { useContent } from '../../../context/ContentContext';
import { useRouter } from 'next/router';

const WalkthroughCompletion = () => {
  const router = useRouter();
  const { selectedContentTypes } = useContent();

  const startCreating = () => {
    router.push('/creation-hub');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Your Marketing Program is Ready!</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Selected Content Types:</h3>
        <div className="inline-flex gap-2 flex-wrap justify-center">
          {selectedContentTypes.map(type => (
            <span key={type} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
              {type}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={startCreating}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Start Creating Content →
      </button>
    </div>
  );
};

export default WalkthroughCompletion;