// src/components/features/ContentCreator/index.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ContentEnhancer from '../ContentEnhancer';

const ContentCreator = ({ contentType }) => {
  const [step, setStep] = useState('outline');

  const contentTypeDetails = {
    'Blog Post': {
      outline: ['Introduction', 'Key Points', 'Supporting Evidence', 'Conclusion'],
      wordCount: '800-1200 words',
      tips: ['Lead with value', 'Include industry examples', 'Add clear call-to-action']
    },
    'eBook': {
      outline: ['Executive Summary', 'Problem Overview', 'Solution Details', 'Implementation', 'Case Studies'],
      wordCount: '2500-5000 words',
      tips: ['Break into chapters', 'Include visuals', 'Add downloadable resources']
    },
    'Case Study': {
      outline: ['Challenge', 'Solution', 'Implementation', 'Results'],
      wordCount: '800-1000 words',
      tips: ['Include specific metrics', 'Quote customer feedback', 'Show clear ROI']
    }
  };

  const OutlineStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Content Outline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded">
            <h3 className="font-medium mb-2">Suggested Structure</h3>
            <div className="space-y-2">
              {contentTypeDetails[contentType]?.outline.map((section, index) => (
                <div key={index} className="p-2 bg-white rounded border">
                  {section}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-medium mb-2">Writing Tips</h3>
            <div className="space-y-2">
              {contentTypeDetails[contentType]?.tips.map((tip, index) => (
                <p key={index} className="text-sm text-slate-600">• {tip}</p>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setStep('write')}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Writing
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create {contentType}</h2>
        <div className="text-sm text-slate-600">
          Target length: {contentTypeDetails[contentType]?.wordCount}
        </div>
      </div>

      {step === 'outline' ? <OutlineStep /> : <ContentEnhancer />}
    </div>
  );
};

export default ContentCreator;