// src/components/shared/UIComponents.js
import React from 'react';
import { Sparkles } from 'lucide-react';

export const ScreenTemplate = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  aiInsights,
  onNext,
  onBack,
  onSkip,
  onExit,
  hideNavigation = false,
  showSkip = false,
  isWalkthrough = false,
  nextButtonText = 'Next →',
  hideExitButton = false // Add this new prop
}) => {
  // For debugging purposes, log the nextButtonText prop
  console.log('ScreenTemplate nextButtonText:', nextButtonText);
  
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          
          {/* Only show Exit button if not hidden and in walkthrough mode */}
          {isWalkthrough && onExit && !hideExitButton && window.location.pathname.startsWith("/walkthrough/") && (
            <button
              onClick={onExit}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Exit Walkthrough
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {currentStep && totalSteps && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights Panel */}
      {aiInsights && aiInsights.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
          <div className="flex items-center mb-3">
            <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold text-blue-900">AI Insights</h2>
          </div>
          <ul className="space-y-2">
            {aiInsights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-blue-800">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Navigation */}
      {!hideNavigation && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 flex items-center"
          >
            <span className="mr-2">👈</span> Back
          </button>
          
          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Skip this step
            </button>
          )}
          
          <button
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            {nextButtonText}
          </button>
        </div>
      )}
    </div>
  );
};