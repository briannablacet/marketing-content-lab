// src/components/features/MarketingWalkthrough/components/WelcomeStep/index.tsx
import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
  onBack: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onBack }) => {
  return (
    <div className="space-y-8 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to Your Content Marketing Journey! ✨
        </h2>
        <p className="mt-2 text-gray-600">
          Let's create a content strategy that engages your audience and establishes your expertise. Here's what you'll get:
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Comprehensive Content Strategy</p>
            <p className="text-sm text-gray-600">Tailored to your audience and business goals</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Content Type Mix</p>
            <p className="text-sm text-gray-600">Optimized selection of content formats for your audience</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Competitive Content Analysis</p>
            <p className="text-sm text-gray-600">Understanding your content positioning in the market</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">AI-Powered Content Creation</p>
            <p className="text-sm text-gray-600">Tools to help you create and enhance your content</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Ready to start creating content that resonates? 🎯
        </h3>
        <p className="text-gray-600">
          We'll guide you through building a content strategy that helps you connect with your audience 
          and achieve your goals. Click "Next" to begin!
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;