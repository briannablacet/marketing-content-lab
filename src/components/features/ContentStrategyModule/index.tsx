// src/components/features/ContentStrategyModule/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CONTENT_TYPES } from '../../../data/contentTypesData';
import { useContent } from '../../../context/ContentContext';
import { useRouter } from 'next/router';

const ContentStrategyModule = () => {
  const router = useRouter();
  const { selectedContentTypes, setSelectedContentTypes } = useContent();
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const toggleChannel = (channelName: string) => {
    setSelectedContentTypes((prev: string[]) => {
      const newTypes = prev.includes(channelName) 
        ? prev.filter((name: string) => name !== channelName)
        : [...prev, channelName];
      return newTypes;
    });
  };

  const startCreating = () => {
    router.push('/creation-hub');
  };

  return (
    <div className="space-y-6 pb-24">
      {!activeContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(CONTENT_TYPES).map(([type, details]) => (
            <Card
              key={type}
              className={`p-6 cursor-pointer transition-all ${
                selectedContentTypes.includes(type)
                  ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                  : 'border border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => toggleChannel(type)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold mb-2">{type}</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedContentTypes.includes(type)
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                }`}>
                  {selectedContentTypes.includes(type) && (
                    <span className="text-white">✓</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">{details.description}, such as:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 pl-2 mb-4">
                {details.activities.map(activity => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {details.aiSupport.map(feature => (
                  <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    ✨ {feature}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{activeContent}</h2>
              <button 
                onClick={() => setActiveContent(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to Types
              </button>
            </div>
          </div>
        </Card>
      )}

      {selectedContentTypes.length > 0 && !activeContent && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-2xl border-t">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                {selectedContentTypes.length} content type{selectedContentTypes.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-slate-600">Ready to start creating?</p>
            </div>
            <button
              onClick={startCreating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Creating →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentStrategyModule;