// src/components/features/MarketingWalkthrough/components/WelcomeStep/index.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

interface WelcomeStepProps {
  onNext: () => void;
  onBack: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onBack }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">What we'll cover together:</h2>
            <p className="text-gray-600">Build a complete strategic foundation for your content marketing</p>
          </div>

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

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ready to build something that actually sounds like <em>you</em>? 🎯
            </h3>
            <p className="text-gray-600">
              We'll guide you through it—step by step. Click "Next" to begin!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeStep;