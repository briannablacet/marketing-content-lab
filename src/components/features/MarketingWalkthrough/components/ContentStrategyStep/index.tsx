//src/components/features/MarketingWalthrough/components/ContentStrategyStep/index.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { useContent } from '../../../../../context/ContentContext';
import { useRouter } from 'next/router';
import { CONTENT_TYPES } from '../../../../../data/contentTypesData';

interface ContentStrategyStepProps {
  onNext?: () => void;
  isWalkthrough?: boolean;
}

const ContentStrategyStep: React.FC<ContentStrategyStepProps> = ({ 
  onNext, 
  isWalkthrough = false 
}) => {
  const router = useRouter();
  const { selectedContentTypes, setSelectedContentTypes } = useContent();

  const toggleChannel = (channelName: string) => {
    setSelectedContentTypes((prev: string[]) => {
      const newTypes = prev.includes(channelName) 
        ? prev.filter((name: string) => name !== channelName)
        : [...prev, channelName];
      return newTypes;
    });
  };

  return (
    <div className="space-y-6">
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
              {details.activities.map((activity: string) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {details.aiSupport.map((feature: string) => (
                <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  ✨ {feature}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentStrategyStep;