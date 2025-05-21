// src/components/shared/UIComponents.js
import React from 'react';
import { ArrowLeft, ArrowRight, XCircle, HelpCircle } from 'lucide-react';

export const ScreenTemplate = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onExit,
  showSkip = false,
  isWalkthrough = false,
  nextButtonText = 'Next →',
  hideExitButton = false,
  aiInsights = []
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        
        {/* Walkthrough progress bar */}
        {isWalkthrough && currentStep && totalSteps && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
              {!hideExitButton && onExit && (
                <button 
                  onClick={onExit}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Exit Walkthrough
                </button>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* AI Insights Box */}
      {aiInsights && aiInsights.length > 0 && (
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="font-medium mb-2 flex items-center text-indigo-800">
            <HelpCircle className="w-5 h-5 mr-2 text-indigo-500" />
            AI Insights
          </h3>
          <ul className="space-y-2">
            {aiInsights.map((insight, index) => (
              <li key={index} className="text-sm text-indigo-700 flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Main content */}
      <div className="mb-8">
        {children}
      </div>
      
      {/* Navigation buttons - Only show in walkthrough mode */}
      {isWalkthrough && (
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className={`px-4 py-2 text-gray-600 flex items-center ${!onBack ? 'invisible' : ''}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="flex gap-4">
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Skip this step
              </button>
            )}
            
            {onNext && (
              <button
                onClick={onNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                {nextButtonText}
                {!nextButtonText.includes('→') && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};