// src/pages/brand-voice.tsx
import React from 'react';
import BrandVoiceModule from '../components/features/BrandVoiceModule';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';

const BrandVoicePage = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Brand Personality</h1>
            <p className="text-gray-600">Define your brand's voice, tone, and personality to ensure consistency across all content.</p>
          </div>
          <BrandVoiceModule />
        </div>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default BrandVoicePage;