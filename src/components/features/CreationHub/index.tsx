// src/components/features/CreationHub/index.tsx
import React from 'react';
import { useContent } from '../../../context/ContentContext';
import ContentCreator from '../ContentCreator';

const CreationHub = () => {
  const { selectedContentTypes } = useContent();
  const [activeContent, setActiveContent] = useState(null);

  if (activeContent) {
    return <ContentCreator contentType={activeContent} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Your Content Creation Queue</h2>
      <div className="space-y-4">
        {selectedContentTypes.map(type => (
          <div key={type} className="p-6 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{type}</h3>
                <p className="text-sm text-slate-600">Ready to create</p>
              </div>
              <button
                onClick={() => setActiveContent(type)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create {type} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreationHub;