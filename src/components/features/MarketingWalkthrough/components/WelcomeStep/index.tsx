// src/components/features/MarketingWalkthrough/components/WelcomeStep/index.tsx
import React from 'react';


interface WelcomeStepProps {
  onNext: () => void;
  onBack: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Congratulations on your launch! 🚀
        </h2>
        <p className="mt-2 text-gray-600">
          Let's set up your full-funnel marketing program. At the end, you'll have:
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Complete marketing plan</p>
            <p className="text-sm text-gray-600">Tailored to your business goals and target audience</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Budget breakdown and ROI projections</p>
            <p className="text-sm text-gray-600">Clear allocation of resources and expected returns</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Recommended media mix</p>
            <p className="text-sm text-gray-600">Optimized channel strategy for your audience</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <p className="text-gray-800">Lead & pipeline forecasts</p>
            <p className="text-sm text-gray-600">Projected results and growth metrics</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Tell us about your marketing goals. Shoot high! 🎯
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="revenue" className="block text-sm font-medium text-gray-700">
              Target revenue for year 1
            </label>
            <input
              type="text"
              id="revenue"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter target revenue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;