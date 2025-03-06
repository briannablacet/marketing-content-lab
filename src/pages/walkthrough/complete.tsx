// src/pages/walkthrough/complete.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Card } from '@/components/ui/card';
import { Sparkles, FileText, PenTool } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const WalkthroughComplete = () => {
  const router = useRouter();
  const { selectedContentTypes } = useContent();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-4">
          ✨ Strategy Complete
        </div>
        <h2 className="text-2xl font-bold mb-4">Your Content Strategy is Ready!</h2>
        <p className="text-slate-600 mb-6">
          You've built a comprehensive content marketing strategy. Here's what you can do next:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Create Content Card */}
        <button
          onClick={() => router.push('/creation-hub')}
          className="p-6 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <PenTool className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Start Creating</h3>
          </div>
          <p className="text-gray-600 text-left">
            Jump into the Creation Hub to start producing your content with AI assistance.
          </p>
        </button>

        {/* Review Strategy Card - Update this link */}
        <button
          onClick={() => router.push('/review-program')}  // Change from '/content-strategy' to '/review-program'
          className="p-6 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Review Strategy</h3>
          </div>
          <p className="text-gray-600 text-left">
            Review and refine your content strategy anytime.
          </p>
        </button>
      </div>

      {/* Selected Content Types */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Your Content Plan Includes:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedContentTypes.map(type => (
            <span key={type} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* AI Assistant Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-blue-800 text-sm">
          AI assistance is available throughout the content creation process to help you create engaging, on-brand content.
        </p>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WalkthroughComplete;