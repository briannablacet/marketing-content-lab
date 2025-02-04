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
  hideNavigation = false,
  nextButtonText = 'Next →'
}) => {
  return (
    <div className="max-w-screen-xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
      </div>

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

      {!hideNavigation && (
        <div className="mt-8 flex justify-between items-center">
          {currentStep > 1 && (
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              ← Back
            </button>
          )}
          {currentStep === 1 && <div />} {/* Empty div for spacing when no back button */}
          <div className="text-slate-600">
            Step {currentStep} of {totalSteps}
          </div>
          {onNext && (
            <button
              onClick={onNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {nextButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};