// src/components/shared/UIComponents.js
import React from 'react';
import { Card } from '../../components/ui/card';
import { Sparkles } from 'lucide-react';

export const ScreenTemplate = ({
  title,
  subtitle,
  children,
  aiInsights,
  onNext,
  onBack,
  onSkip,
  onExit,
  isWalkthrough = false,
  currentStep,
  totalSteps,
  nextButtonText = 'Next →',
  hideNavigation = false,
  showSkip = false,
  showExitButton = true // Default to showing the exit button
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>

          {/* Exit button - only show in walkthrough and if showExitButton is true */}
          {isWalkthrough && showExitButton !== false && (
            <button
              onClick={onExit}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Exit Walkthrough
            </button>
          )}
        </div>

        {/* Step progress indicator for walkthrough */}
        {isWalkthrough && currentStep && totalSteps && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights panel */}
      {aiInsights && aiInsights.length > 0 && (
        <Card className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">AI Insights</h3>
              <ul className="space-y-2">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Main content */}
      <div className="mb-8">{children}</div>

      {/* Navigation buttons */}
      {!hideNavigation && (
        <div className="flex justify-between items-center mt-8 border-t pt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip this step
              </button>
            )}
            
            <button
              onClick={onNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              {nextButtonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};