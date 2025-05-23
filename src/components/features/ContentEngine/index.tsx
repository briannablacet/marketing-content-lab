// src/components/features/ContentEngine/index.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ScreenTemplate from "@/components/shared/UIComponents"
import { AutosaveIndicator } from '../../shared/AutosaveIndicator';
import SuccessModal from '../../shared/SuccessModal';
import UploadScreen from './screens/UploadScreen';
import CompetitorInput from './screens/CompetitorInput';
import KeyMessages from './screens/KeyMessages';
import ContentPreview from './screens/ContentPreview';
import ContentStrategyStep from '../MarketingWalkthrough/components/ContentStrategyStep';

const ContentEngine: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sample content items - you'd generate this based on actual content
  const contentItems = [
    { type: 'eBook', title: 'Building the Ultimate Defense', format: 'PDF' },
    { type: 'Social', title: 'LinkedIn Posts', format: 'Text & Images' },
    { type: 'Email', title: 'Email Sequence', format: 'HTML' },
    { type: 'SDR', title: 'SDR Email Templates', format: 'Text' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadScreen onFilesSelected={(files) => console.log('Files:', files)} />;
      case 2:
        return <CompetitorInput onCompetitorsUpdate={(competitors) => console.log('Competitors:', competitors)} />;
      case 3:
        return <KeyMessages onMessagesUpdate={(messages) => console.log('Messages:', messages)} />;
      case 4:
        return <ContentStrategyStep isWalkthrough={false} />;
      case 5:
        return <ContentPreview />;
      default:
        return <UploadScreen onFilesSelected={(files) => console.log('Files:', files)} />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Upload Documents";
      case 2:
        return "Competitor Analysis";
      case 3:
        return "Key Messages";
      case 4:
        return "Content Selection";
      case 5:
        return "Preview & Export";
      default:
        return "Upload Documents";
    }
  };

  const getStepInsights = () => {
    switch (currentStep) {
      case 1:
        return ['Upload your messaging and style guide to inform our AI engine'];
      case 2:
        return [
          'Analyzing competitors helps position your content effectively',
          'We will use this information to ensure your content stands out'
        ];
      case 3:
        return [
          'Define your key messages to maintain consistency across all content',
          'Clear messaging helps your content resonate with your audience'
        ];
      case 4:
        return [
          'Select the types of content you want to generate',
          'Our AI will adapt your messages for each format'
        ];
      case 5:
        return [
          'Review your generated content across all channels',
          'Make any final adjustments before exporting'
        ];
      default:
        return ['Preparing to generate your content...'];
    }
  };

  const getNextButtonText = () => {
    return currentStep === 5 ? 'Export Content →' : 'Next →';
  };

  const handleNext = () => {
    if (currentStep === 5) {
      setShowSuccessModal(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <>
      <ScreenTemplate
        title={getStepTitle()}
        subtitle="AI-Driven Content Development Accelerator"
        currentStep={currentStep}
        totalSteps={5}
        aiInsights={getStepInsights()}
        onNext={handleNext}
        onBack={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        hideNavigation={false}
        nextButtonText={getNextButtonText()}
      >
        {renderStep()}
      </ScreenTemplate>
      <AutosaveIndicator />
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        contentItems={contentItems}
      />
    </>
  );
};

export default ContentEngine;