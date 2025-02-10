// src/components/features/DemoWalkthrough/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../components/shared/UIComponents';
import dynamic from 'next/dynamic';

// Explicit imports with full path
const WelcomeStep = dynamic(() => import('../../components/features/MarketingWalkthrough/components/WelcomeStep'), { ssr: false });
const PersonaStep = dynamic(() => import('../../components/features/MarketingWalkthrough/components/PersonaStep'), { ssr: false });
const MessagingStep = dynamic(() => import('../../components/features/MarketingWalkthrough/components/MessagingStep'), { ssr: false });
const ContentStrategyStep = dynamic(() => import('../../components/features/MarketingWalkthrough/components/ContentStrategyStep'), { ssr: false });
const ReviewStep = dynamic(() => import('../../components/features/MarketingWalkthrough/components/ReviewStep'), { ssr: false });

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Simplified steps for demo
const DEMO_STEPS = [
  { id: '1', component: WelcomeStep, title: 'Welcome' },
  { id: '2', component: PersonaStep, title: 'Target Persona' },
  { id: '3', component: MessagingStep, title: 'Key Messages' },
  { 
    id: '4', 
    component: (props: StepProps) => <ContentStrategyStep isWalkthrough={true} onNext={props.onNext} />, 
    title: 'Content Strategy' 
  },
  { 
    id: '5', 
    component: (props: StepProps) => (
      <ReviewStep 
        selectedContentTypes={['Blog Posts', 'Case Studies']} 
        onNext={props.onNext} 
      />
    ), 
    title: 'Review & Next Steps' 
  }
];

const DemoWalkthrough: React.FC = () => {
  const router = useRouter();
  const { step } = router.query;
  
  const currentStepIndex = DEMO_STEPS.findIndex(s => s.id === step);
  const currentStep = DEMO_STEPS[currentStepIndex];
  
  React.useEffect(() => {
    if (!step || !DEMO_STEPS.find(s => s.id === step)) {
      router.replace('/demo/1');
    }
  }, [step, router]);

  const handleNext = () => {
    if (currentStep.id === '5') {
      router.push('/demo/complete');
      return;
    }
    
    const nextStep = DEMO_STEPS[currentStepIndex + 1];
    if (nextStep) {
      router.push(`/demo/${nextStep.id}`);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      router.push(`/demo/${DEMO_STEPS[currentStepIndex - 1].id}`);
    } else {
      router.push('/demo');
    }
  };

  if (!currentStep) {
    return null;
  }

  return (
    <ScreenTemplate
      title={currentStep.title}
      subtitle="Create targeted marketing programs with AI assistance"
      currentStep={currentStepIndex + 1}
      totalSteps={DEMO_STEPS.length}
      aiInsights={[
        "Our AI guides you through each step to create effective marketing programs",
        "See how content strategy and messaging work together"
      ]}
      onNext={handleNext}
      onBack={handleBack}
      isWalkthrough={true}
      nextButtonText={currentStep.id === '5' ? 'Complete Demo →' : 'Next →'}
    >
      {typeof currentStep.component === 'function' 
        ? currentStep.component({ onNext: handleNext, onBack: handleBack })
        : React.createElement(currentStep.component, { onNext: handleNext, onBack: handleBack })}
    </ScreenTemplate>
  );
};

export default DemoWalkthrough;