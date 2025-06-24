// src/pages/prose-perfector.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import StyleGuideNotificationBanner from '../components/features/StyleGuideNotificationBanner';
import ScreenTemplate from '../components/shared/UIComponents';

// Use dynamic import with SSR disabled to prevent SSR-related issues with file handling
const ProsePerfector = dynamic(() => import('../components/features/ProsePerfector'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Prose Perfector...</div>
});

const ProsePerfectorPage: React.FC = () => {
  return (
    <NotificationProvider>
      <StyleGuideNotificationBanner />
      <ScreenTemplate
        title="Prose Perfector"
        subtitle="Enhance your writing with AI-powered suggestions for clarity, conciseness, and engagement"
        aiInsights={[
          "Clear, concise content improves engagement by 58%",
          "Enhanced content gets 27% more social shares",
          "Professional editing can increase conversion rates by 30%"
        ]}
      >
        <ProsePerfector />
      </ScreenTemplate>
    </NotificationProvider>
  );
};

export default ProsePerfectorPage;