// /src/components/features/MarketingWalkthrough/index.tsx

import React, { useState } from 'react';
import WelcomeStep from './components/WelcomeStep';
import ProductStep from './components/ProductStep';
import PersonaStep from './components/PersonaStep';
import ValuePropStep from './components/ValuePropStep';
import MessagingStep from './components/MessagingStep';
import CompetitiveStep from './components/CompetitiveStep';
import StyleGuideStep from './components/StyleGuideStep';
import BrandVoiceModule from '../BrandVoiceModule';
import { ScreenTemplate } from '../../shared/UIComponents';
import { AI_CUSTOMER_ENDPOINT } from 'src/pages/api/api_endpoints';

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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    productName: '',
    benefits: [],
    targetAudience: '',
    valueProp: '',
  });

  const currentStep = STEPS[currentStepIndex];
  const isSkippable = currentStep.id !== '1';

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleExit = () => {
    window.location.href = '/';
  };

  const buttonText = currentStepIndex === STEPS.length - 1 ? 'Finish' : 'Next';

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

  return (
    <ScreenTemplate
      title={currentStep.title}
      subtitle={
        currentStep.id === '1'
          ? 'Lay the foundation for a content engine based on your messaging and brand style.'
          : undefined
      }
      currentStep={currentStepIndex + 1}
      totalSteps={STEPS.length}
      aiInsights={
        currentStep.id === '1'
          ? [
            "Based on successful content strategies, we'll guide you through each essential step."
          ]
          : undefined
      }
      onNext={handleNext}
      onBack={handleBack}
      onSkip={isSkippable ? handleSkip : undefined}
      onExit={handleExit}
      showSkip={isSkippable}
      isWalkthrough={true}
      nextButtonText={buttonText}
      hideExitButton={true}
    >
      {renderComponent()}
    </ScreenTemplate>
  );
};

export default MarketingWalkthrough;
