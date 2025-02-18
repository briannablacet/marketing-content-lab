// src/components/features/MarketingWalkthrough/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../shared/UIComponents';
import dynamic from 'next/dynamic';

// Dynamic imports for step components
const WelcomeStep = dynamic(() => import('./components/WelcomeStep'), { ssr: false });
const PersonaStep = dynamic(() => import('./components/PersonaStep'), { ssr: false });
const MessagingStep = dynamic(() => import('./components/MessagingStep'), { ssr: false });
const CompetitiveStep = dynamic(() => import('./components/CompetitiveStep'), { ssr: false });
const ContentStrategyStep = dynamic(() => import('./components/ContentStrategyStep'), { ssr: false });
const SeoKeywordsStep = dynamic(() => import('./components/SeoKeywordsStep'), { ssr: false });
const ReviewStep = dynamic(() => import('./components/ReviewStep'), { ssr: false });

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Define which steps can be skipped (Competitive Analysis and SEO)
const SKIPPABLE_STEPS = ['4', '6'];

const STEPS = [
  { id: '1', component: WelcomeStep, title: 'Welcome' },
  { id: '2', component: PersonaStep, title: 'Target Persona' },
  { id: '3', component: MessagingStep, title: 'Key Messages' },
  { id: '4', component: CompetitiveStep, title: 'Competitive Analysis', skippable: true },
  { 
    id: '5', 
    component: (props: StepProps) => <ContentStrategyStep isWalkthrough={true} onNext={props.onNext} />, 
    title: 'Content Strategy' 
  },
  { id: '6', component: SeoKeywordsStep, title: 'SEO Keywords', skippable: true },
  { id: '7', component: ReviewStep, title: 'Putting it All Together' }
];

const MarketingWalkthrough: React.FC = () => {
  const router = useRouter();
  const { step } = router.query;
  
  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  const currentStep = STEPS[currentStepIndex];
  
  React.useEffect(() => {
    if (step && !currentStep) {
      router.replace('/walkthrough/1');
    }
  }, [step, currentStep, router]);

  const handleNext = () => {
    if (currentStep.id === '7') {
      router.push('/walkthrough/complete');
      return;
    }
    
    const nextStep = STEPS[currentStepIndex + 1];
    if (nextStep) {
      router.push(`/walkthrough/${nextStep.id}`);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      router.push(`/walkthrough/${STEPS[currentStepIndex - 1].id}`);
    } else {
      router.push('/');
    }
  };

  const handleSkip = () => {
    console.log('Skipping step...'); // Debug log
    const nextStep = STEPS[currentStepIndex + 1];
    if (nextStep) {
      router.push(`/walkthrough/${nextStep.id}`);
    }
  };

  const handleExit = () => {
    const confirmExit = window.confirm(
      'Are you sure you want to exit the walkthrough? Your progress will be saved.'
    );
    
    if (confirmExit) {
      router.push('/');
    }
  };

  if (!currentStep) {
    return null;
  }

  // Determine if current step is skippable
  const isSkippable = SKIPPABLE_STEPS.includes(currentStep.id);

  return (
    <ScreenTemplate
      title={currentStep.title}
      subtitle="Let's build your content marketing plan together."
      currentStep={currentStepIndex + 1}
      totalSteps={STEPS.length}
      aiInsights={[
        "Based on successful content strategies, we'll guide you through each essential step."
      ]}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={isSkippable ? handleSkip : undefined}
      onExit={handleExit}
      showSkip={isSkippable}
      isWalkthrough={true}
      nextButtonText={currentStep.id === '7' ? 'Finish Walkthrough →' : 'Next →'}
    >
      {typeof currentStep.component === 'function' 
        ? currentStep.component({ onNext: handleNext, onBack: handleBack })
        : React.createElement(currentStep.component, { onNext: handleNext, onBack: handleBack })}
    </ScreenTemplate>
  );
};

export default MarketingWalkthrough;