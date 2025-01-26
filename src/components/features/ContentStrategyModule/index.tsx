// src/components/features/ContentStrategyStep/index.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ContentCreator from '../ContentCreator';
import { CreationHub } from '../CreationHub';

const ContentStrategyStep = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showCreationHub, setShowCreationHub] = useState(false);

  const channels = [
    {
      name: 'Blog Post',
      description: 'Build authority through valuable content',
      activities: ['Industry Insights', 'How-to Guides', 'Thought Leadership']
    },
    {
      name: 'Case Study',
      description: 'Showcase customer success stories',
      activities: ['Customer Wins', 'Implementation Stories', 'ROI Analysis']
    },
    {
      name: 'eBook',
      description: 'Deep dive into key topics',
      activities: ['Comprehensive Guides', 'Industry Reports', 'Best Practices']
    },
    {
      name: 'Social Media',
      description: 'Engage and build community',
      activities: ['LinkedIn', 'Twitter', 'Community Management']
    }
  ];

  const handleSelectAll = () => {
    setSelectedTypes(channels.map(channel => channel.name));
  };

  const toggleChannel = (channelName) => {
    setSelectedTypes(prev => 
      prev.includes(channelName) 
        ? prev.filter(name => name !== channelName)
        : [...prev, channelName]
    );
  };

  const startCreating = () => {
    setShowCreationHub(true);
  };

  if (showCreationHub) {
    return <CreationHub selectedTypes={selectedTypes} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button 
            onClick={handleSelectAll}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Select All
          </button>
          <span className="text-slate-600">
            Selected: {selectedTypes.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {channels.map(channel => (
          <Card
            key={channel.name}
            className={`p-6 cursor-pointer ${
              selectedTypes.includes(channel.name)
                ? 'border-blue-500 bg-blue-50'
                : ''
            }`}
            onClick={() => toggleChannel(channel.name)}
          >
            <h3 className="font-semibold mb-2">{channel.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{channel.description}</p>
            <div className="flex flex-wrap gap-2">
              {channel.activities.map(activity => (
                <span
                  key={activity}
                  className="px-2 py-1 bg-white rounded text-sm border"
                >
                  {activity}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      {selectedTypes.length > 0 && (
        <div className="text-center p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Great selection! Ready to start creating?
          </h3>
          <p className="text-slate-600 mb-4">
            You've selected {selectedTypes.length} content types
          </p>
          <button
            onClick={startCreating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Creating Content →
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentStrategyStep;