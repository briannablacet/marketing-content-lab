import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useContent } from '../../../context/ContentContext';
import { useRouter } from 'next/router';

const ContentStrategyStep = () => {
  const router = useRouter();
  const { selectedContentTypes, setSelectedContentTypes } = useContent();
  console.log('ContentStrategyStep:', selectedContentTypes);

  useEffect(() => {
    console.log('ContentStrategyStep useEffect:', selectedContentTypes);
  }, [selectedContentTypes]);

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

  const toggleChannel = (channelName) => {
    setSelectedContentTypes(prev => {
      const newTypes = prev.includes(channelName) 
        ? prev.filter(name => name !== channelName)
        : [...prev, channelName];
      console.log('Selected types:', newTypes);
      return newTypes;
    });
  };

  const startCreating = () => {
    console.log('Starting creation with:', selectedContentTypes);
    router.push('/creation-hub');
  };

  console.log('Rendering ContentStrategyStep, selectedContentTypes:', selectedContentTypes);
  
  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-2 gap-4">
        {channels.map(channel => (
   <Card
   key={channel.name}
   className={`p-6 cursor-pointer transition-all ${
     selectedContentTypes.includes(channel.name)
       ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
       : 'border border-gray-200 hover:border-blue-300'
   }`}
   onClick={() => toggleChannel(channel.name)}
 >
   <div className="flex justify-between items-start">
     <h3 className="font-semibold mb-2">{channel.name}</h3>
     {selectedContentTypes.includes(channel.name) && (
       <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
       </svg>
     )}
   </div>
   <p className="text-sm text-slate-600 mb-2">{channel.description}, such as:</p>
   <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
     {channel.activities.map(activity => (
       <li key={activity}>{activity}</li>
     ))}
   </ul>
 </Card>
        ))}
      </div>

      {selectedContentTypes.length > 0 && (
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

export default ContentStrategyStep;