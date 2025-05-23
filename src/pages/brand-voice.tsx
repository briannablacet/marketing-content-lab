// src/pages/brand-voice.tsx
import React from 'react';
import BrandVoiceModule from '../components/features/BrandVoiceModule';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import ScreenTemplate from '../components/shared/UIComponents';

const BrandVoicePage = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ScreenTemplate
              title="Brand Personality"
              subtitle="Define your brand's voice, tone, and personality to ensure consistency across all content."
              isWalkthrough={false}
              hideNavigation={true}
              currentStep={1}
              totalSteps={1}
              onNext={() => { }}
              onBack={() => { }}
              onSkip={() => { }}
              onExit={() => { }}
            >
              <BrandVoiceModule />
            </ScreenTemplate>
          </div>
        </div>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default BrandVoicePage;