// src/components/features/MarketingWalkthrough/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../shared/UIComponents';
import dynamic from 'next/dynamic';

// Dynamic imports
const WelcomeStep = dynamic(() => import('./components/WelcomeStep'), { ssr: false });
const PersonaStep = dynamic(() => import('./components/PersonaStep'), { ssr: false });
const CompetitiveStep = dynamic(() => import('./components/CompetitiveStep'), { ssr: false });
const MessagingStep = dynamic(() => import('./components/MessagingStep'), { ssr: false });
const BudgetStep = dynamic(() => import('./components/BudgetStep'), { ssr: false });
const ChannelSelectionStep = dynamic(() => import('./components/ChannelSelectionStep'), { ssr: false });
const ContentStrategyStep = dynamic(() => import('./components/ContentStrategyStep'), { ssr: false });
const TimelinePlanningStep = dynamic(() => import('./components/TimelinePlanningStep'), { ssr: false });
const ReviewStep = dynamic(() => import('./components/ReviewStep'), { ssr: false });

const STEPS = [
  { id: '1', component: WelcomeStep, title: 'Welcome' },
  { id: '2', component: PersonaStep, title: 'Target Persona' },
  { id: '3', component: CompetitiveStep, title: 'Competitive Analysis' },
  { id: '4', component: MessagingStep, title: 'Key Messages' },
  { id: '5', component: BudgetStep, title: 'Your Budget' },
  { id: '6', component: ChannelSelectionStep, title: 'Channel Selection' },
  { id: '7', component: ContentStrategyStep, title: 'Content Strategy' },
  { id: '8', component: TimelinePlanningStep, title: 'Project Planner' },
  { id: '9', component: ReviewStep, title: 'Putting it All Together' }
];

const MarketingWalkthrough = () => {
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
    if (currentStep.id === '9') {
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

  if (!currentStep) {
    return null;
  }

  return (
    <ScreenTemplate
    title={currentStep.title}
    subtitle="Let's build your marketing program together."
    currentStep={currentStepIndex + 1}
    totalSteps={STEPS.length}
    aiInsights={[
      "Based on successful marketing programs, we'll guide you through each essential step."
    ]}
    onNext={handleNext}
    onBack={handleBack}
    isWalkthrough={true}
    nextText={currentStep.id === '9' ? 'Complete Program' : undefined}  // Add this line
  >
    {React.createElement(currentStep.component)}
  </ScreenTemplate>
);
};

export default MarketingWalkthrough;