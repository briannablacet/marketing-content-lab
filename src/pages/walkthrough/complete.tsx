// src/pages/walkthrough/complete.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Card } from '@/components/ui/card';

const WalkthroughComplete = () => {
  const router = useRouter();

  const nextSteps = [
    {
      title: 'Review Program',
      description: 'Access your marketing program',
      path: '/dashboard'
    },
    {
      title: 'Start Content',
      description: 'Begin creating content',
      path: '/content-strategy'
    },
    {
      title: 'Track Leads',
      description: 'Monitor lead scoring',
      path: '/lead-scoring'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-full bg-green-100 mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Marketing Program Complete! 🎉
        </h1>
        <p className="text-lg text-gray-600">
          You've successfully built your marketing program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {nextSteps.map((step, index) => (
          <Card key={index} className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{step.description}</p>
            <button
              onClick={() => router.push(step.path)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              Go to {step.title} →
            </button>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WalkthroughComplete;