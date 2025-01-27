import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import ContentCreator from '../ContentCreator';

const CreationHub = () => {
  const { selectedContentTypes } = useContent();
  console.log('CreationHub received:', selectedContentTypes);
  const [activeContent, setActiveContent] = useState<string | null>(null);

  // If a specific content type is being created, show its creator
  if (activeContent) {
    return <ContentCreator contentType={activeContent} />;
  }

  // No content types selected
  if (selectedContentTypes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Content Types Selected</h2>
        <p className="text-slate-600 mb-6">
          Please go back to the Content Strategy step and choose your content mix.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return to Content Strategy
        </button>
      </div>
    );
  }

  // Show list of selected content types to create
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Your Content Creation Queue</h2>
      <div className="space-y-4">
        {selectedContentTypes.map(type => (
          <div 
            key={type} 
            className="p-6 border rounded-lg flex justify-between items-center hover:bg-slate-50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold">{type}</h3>
              <p className="text-sm text-slate-600">Ready to create</p>
            </div>
            <button
              onClick={() => setActiveContent(type)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create {type} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreationHub;