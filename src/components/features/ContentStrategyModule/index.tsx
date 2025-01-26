// ContentStrategyStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const ContentStrategyStep = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const contentTypes = {
    'Blog Posts': { frequency: 'Weekly', effort: 'Medium' },
    'Whitepapers': { frequency: 'Quarterly', effort: 'High' },
    'Case Studies': { frequency: 'Monthly', effort: 'Medium' },
    'Social Posts': { frequency: 'Daily', effort: 'Low' },
    'Email Campaigns': { frequency: 'Bi-weekly', effort: 'Medium' }
  };

  const toggleContentType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(contentTypes).map(([type, details]) => (
          <Card
            key={type}
            className={`p-6 cursor-pointer ${
              selectedTypes.includes(type) ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => toggleContentType(type)}
          >
            <h3 className="font-semibold mb-2">{type}</h3>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Frequency: {details.frequency}</span>
              <span>Effort: {details.effort}</span>
            </div>
          </Card>
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Publishing Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <div key={day} className="text-center">{day}</div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentStrategyStep;