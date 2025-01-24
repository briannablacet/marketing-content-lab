// src/components/shared/UIComponents.js
import React from 'react';

export function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="w-full h-2 bg-slate-200 rounded">
      <div
        className="h-full bg-blue-600 rounded"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );
}

export function AIInsight({ insights }) {
  if (!insights?.length) return null;
  
  return (
    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <p className="text-sm text-slate-600">
        ✨ {insights[0]}
      </p>
    </div>
  );
}

export function NavigationButtons({ onBack, onNext, currentStep, totalSteps, isWalkthrough, nextText }) {
  return (
    <div className="flex justify-between items-center w-full mt-8">
      {onBack && (
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-full border border-blue-600 text-blue-600"
        >
          ← Back
        </button>
      )}
      {!onBack && <div />}

      {isWalkthrough && currentStep && totalSteps && (
        <span className="text-slate-500">Step {currentStep} of {totalSteps}</span>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="px-6 py-2 rounded-full bg-blue-600 text-white"
        >
          {nextText || 'Next →'}
        </button>
      )}
    </div>
  );
}

export function MetricsCard({ title, metrics }) {
  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-slate-600">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ScreenTemplate = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  aiInsights,
  onNext,
  onBack,
  isWalkthrough = false,
  nextText,
  children
}) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {isWalkthrough && currentStep && totalSteps && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}

      <div className="mt-16">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>

      
{aiInsights && aiInsights.length > 0 && (
  <div className="mt-8 mb-8"> 
    <AIInsight insights={aiInsights} />
  </div>
)}

      {children}

      <NavigationButtons
        onBack={onBack}
        onNext={onNext}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isWalkthrough={isWalkthrough}
        nextText={nextText}
      />
    </div>
  );
};