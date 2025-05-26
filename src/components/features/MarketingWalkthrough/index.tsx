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
import { useRouter } from 'next/router';
import { Target, User, Package, MessageSquare, Users, Palette, Heart } from 'lucide-react';

const STEPS = [
  {
    id: '1',
    title: 'Welcome to the Branding Wizard! ✨',
    subtitle: 'Lay the foundation for a content engine based on your messaging and brand style.',
    component: WelcomeStep,
    icon: Heart
  },
  {
    id: '2',
    title: 'Product Information',
    subtitle: 'Tell us about your business and what makes it special',
    component: ProductStep,
    icon: Package
  },
  {
    id: '3',
    title: 'Ideal Customer',
    subtitle: 'Define who you\'re trying to reach with your marketing',
    component: PersonaStep,
    icon: User
  },
  {
    id: '4',
    title: 'Value Proposition Builder',
    subtitle: 'Craft compelling value propositions that resonate with your audience',
    component: ValuePropStep,
    icon: Target
  },
  {
    id: '5',
    title: 'Messaging Framework',
    subtitle: 'Develop your key messages and positioning',
    component: MessagingStep,
    icon: MessageSquare
  },
  {
    id: '6',
    title: 'Competitive Messaging Analysis',
    subtitle: 'Analyze your competitors\' messaging and identify gaps and opportunities',
    component: CompetitiveStep,
    icon: Users
  },
  {
    id: '7',
    title: 'Style Guide Builder',
    subtitle: 'Define your brand\'s visual and written style',
    component: StyleGuideStep,
    icon: Palette
  },
  {
    id: '8',
    title: 'Brand Personality',
    subtitle: 'Establish your brand\'s voice and tone',
    component: BrandVoiceModule,
    icon: Heart
  },
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

  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* BIG BEAUTIFUL HEADER AT THE TOP */}
        <div className="flex items-center gap-3 mb-2">
          <StepIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{currentStep.title}</h1>
        </div>
        <p className="text-gray-600 mb-8">{currentStep.subtitle}</p>

        {/* STEP INDICATOR AND NAVIGATION */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-center p-4">
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

          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="space-y-6">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default MarketingWalkthrough;