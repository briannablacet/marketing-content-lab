// src/components/features/MarketingWalkthrough/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../shared/UIComponents';
import dynamic from 'next/dynamic';

// Dynamic imports for step components
const WelcomeStep = dynamic(() => import('./components/WelcomeStep'), { ssr: false });
const ProductStep = dynamic(() => import('./components/ProductStep'), { ssr: false });
const PersonaStep = dynamic(() => import('./components/PersonaStep'), { ssr: false });
const MessagingStep = dynamic(() => import('./components/MessagingStep'), { ssr: false });
const CompetitiveStep = dynamic(() => import('./components/CompetitiveStep'), { ssr: false });
const ContentStrategyStep = dynamic(() => import('./components/ContentStrategyStep'), { ssr: false });
const StyleGuideStep = dynamic(() => import('./components/StyleGuideStep'), { ssr: false });
const BrandVoiceModule = dynamic(() => import('../BrandVoiceModule'), { ssr: false });
const ReviewStep = dynamic(() => import('./components/ReviewStep'), { ssr: false });

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
  isWalkthrough?: boolean;
}

// Define which steps can be skippable
const SKIPPABLE_STEPS = ['5', '9']; // Competitive Analysis and SEO are skippable

const STEPS = [
  { id: '1', component: WelcomeStep, title: 'Welcome' },
  { id: '2', component: ProductStep, title: 'Your Product/Service' },
  { id: '3', component: PersonaStep, title: 'Your Ideal Customer' },
  { id: '4', component: MessagingStep, title: 'Your Message Framework' },
  { id: '5', component: CompetitiveStep, title: 'Who\'s Your Competition?', skippable: true },
  {
    id: '6',
    component: (props: StepProps) => <ContentStrategyStep isWalkthrough={true} onNext={props.onNext} />,
    title: 'Select Your First Content Assets'
  },
  {
    id: '7',
    component: (props: StepProps) => <StyleGuideStep isWalkthrough={true} onNext={props.onNext} onBack={props.onBack} />,
    title: 'Select Your Writing Style'
  },
  {
    id: '8',
    component: (props: StepProps) => <BrandVoiceModule isWalkthrough={true} onNext={props.onNext} onBack={props.onBack} />,
    title: 'Your Brand Voice'
  },
  { id: '9', component: ReviewStep, title: 'Putting it All Together' }

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
    if (currentStep?.id === '9') {
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

  // Force a specific button text for the last step
  const buttonText = currentStep.id === '9' ? 'Finish Walkthrough →' : 'Next →';

  // For debugging
  console.log(`Current step: ${currentStep.id}, Button text: ${buttonText}`);

  return (
    <ScreenTemplate
      title={currentStep.title}
      subtitle="Let's build your content marketing plan together."
      currentStep={currentStepIndex + 1}
      totalSteps={STEPS.length}
      aiInsights={currentStep.id === '1' ? [
        "Based on successful content strategies, we'll guide you through each essential step."
      ] : undefined}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={isSkippable ? handleSkip : undefined}
      onExit={handleExit}
      showSkip={isSkippable}
      isWalkthrough={true}
      nextButtonText={buttonText}
      hideExitButton={true} // Add this prop to hide the duplicate exit button
    >
      {typeof currentStep.component === 'function'
        ? currentStep.component({ onNext: handleNext, onBack: handleBack, isWalkthrough: true })
        : React.createElement(currentStep.component, {
          onNext: handleNext,
          onBack: handleBack,
          isWalkthrough: true
        })}
    </ScreenTemplate>
  );
};

export default MarketingWalkthrough;