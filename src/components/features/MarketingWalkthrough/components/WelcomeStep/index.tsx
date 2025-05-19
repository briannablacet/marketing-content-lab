// src/components/features/MarketingWalkthrough/components/WelcomeStep/index.tsx
import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
  onBack: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onBack }) => {
  return (
    <div className="space-y-8 w-full pl-10">
      <div className="space-y-4">
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="mt-1.5 mr-3 h-2 w-2 rounded-full bg-indigo-500" />
            <span>Lock in your value proposition</span>
          </li>
          <li className="flex items-start">
            <div className="mt-1.5 mr-3 h-2 w-2 rounded-full bg-indigo-500" />
            <span>Identify your ideal customer</span>
          </li>
          <li className="flex items-start">
            <div className="mt-1.5 mr-3 h-2 w-2 rounded-full bg-indigo-500" />
            <span>Sharpen your messaging</span>
          </li>
          <li className="flex items-start">
            <div className="mt-1.5 mr-3 h-2 w-2 rounded-full bg-indigo-500" />
            <span>Define your brand voice</span>
          </li>
          <li className="flex items-start">
            <div className="mt-1.5 mr-3 h-2 w-2 rounded-full bg-indigo-500" />
            <span>Make every piece of content feel intentional</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg -ml-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Ready to build something that actually sounds like <em>you</em>? 🎯
        </h3>
        <p className="text-gray-600">
          We’ll guide you through it—step by step. Click “Next” to begin!
        </p>
      </div>
    </div>

  );
};

export default WelcomeStep;