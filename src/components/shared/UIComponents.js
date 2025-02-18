// src/components/shared/UIComponents.js
import React from 'react';

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
  nextButtonText = 'Next →',
  showSkip = false,
  isWalkthrough = false
}) => {
  return (
    <div className="max-w-screen-xl mx-auto p-8">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
        </div>
        
        {/* Exit button - only show in walkthrough mode */}
        {isWalkthrough && onExit && (
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center"
          >
            <span className="mr-2">✕</span>
            Exit Walkthrough
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {currentStep && totalSteps && (
        <div className="mb-6">
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* AI Insights Section */}
      {aiInsights && aiInsights.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start">
              <span className="mr-2">✨</span>
              <p className="text-slate-700">{insight}</p>
            </div>
          ))}
        </div>
      )}

      {children}

      {/* Navigation Section */}
      {!hideNavigation && (
        <div className="mt-8 flex justify-between items-center">
          {/* Left side - Back button */}
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 flex items-center"
              >
                <span className="mr-1">←</span> Back
              </button>
            )}
          </div>

          {/* Right side - Skip and Next buttons */}
          <div className="flex gap-4 items-center">
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100"
              >
                Skip This Step
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                {nextButtonText}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};