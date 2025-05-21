// /src/components/features/MarketingWalkthrough/index.tsx

import React, { useState, useEffect } from 'react';
import WelcomeStep from './components/WelcomeStep';
import ProductStep from './components/ProductStep';
import PersonaStep from './components/PersonaStep';
import ValuePropStep from './components/ValuePropStep';
import MessagingStep from './components/MessagingStep';
import CompetitiveStep from './components/CompetitiveStep';
import StyleGuideStep from './components/StyleGuideStep';
import BrandVoiceModule from '../BrandVoiceModule';
import PageLayout from '../../shared/PageLayout';
import { useRouter } from 'next/router';

const STEPS = [
  { id: '1', title: 'Welcome to the Branding Wizard! ✨', component: WelcomeStep },
  { id: '2', title: 'Product Information', component: ProductStep },
  { id: '3', title: 'Ideal Customer', component: PersonaStep },
  { id: '4', title: 'Value Proposition', component: ValuePropStep },
  { id: '5', title: 'Messaging Framework', component: MessagingStep },
  { id: '6', title: 'Competitive Analysis', component: CompetitiveStep },
  { id: '7', title: 'Style Guide Builder', component: StyleGuideStep },
  { id: '8', title: 'Brand Personality', component: BrandVoiceModule },
];

const MarketingWalkthrough: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: '',
    benefits: [],
    targetAudience: '',
    valueProp: '',
  });

  // Get current step from URL or default to first step
  const currentStepIndex = STEPS.findIndex(step => step.id === router.query.step);
  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : STEPS[0];
  const isSkippable = currentStep.id !== '1';

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentStepIndex + 1];
      router.push(`/walkthrough/${nextStep.id}`);
    } else {
      // If we're on the last step, navigate to complete page
      router.push('/walkthrough/complete');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = STEPS[currentStepIndex - 1];
      router.push(`/walkthrough/${prevStep.id}`);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleExit = () => {
    router.push('/');
  };

  const buttonText = currentStepIndex === STEPS.length - 1 ? 'Complete Walkthrough' : 'Next';

  const renderComponent = () => {
    const StepComponent = currentStep.component;
    return (
      <StepComponent
        onNext={handleNext}
        onBack={handleBack}
        isWalkthrough={true}
        formData={formData}
        setFormData={setFormData}
      />
    );
  };

  // If no step is specified in the URL, redirect to the first step
  useEffect(() => {
    if (!router.query.step) {
      router.push('/walkthrough/1');
    }
  }, [router.query.step]);

  return (
    <PageLayout
      title={currentStep.title}
      description={
        currentStep.id === '1'
          ? 'Lay the foundation for a content engine based on your messaging and brand style.'
          : ''
      }
      showHelpPrompt={currentStep.id === '1'}
      helpPromptText="Based on successful content strategies, we'll guide you through each essential step."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {STEPS.length}
          </div>
          <div className="flex gap-2">
            {isSkippable && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Skip
              </button>
            )}
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {buttonText}
            </button>
          </div>
        </div>
        {renderComponent()}
      </div>
    </PageLayout>
  );
};

export default MarketingWalkthrough;
