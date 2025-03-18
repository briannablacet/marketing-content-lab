// src/pages/content-humanizer.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { MessagingProvider } from '../context/MessagingContext';
import { ScreenTemplate } from '../components/shared/UIComponents';



// Use dynamic import with SSR disabled to prevent SSR-related issues with file handling
const ContentHumanizer = dynamic(() => import('../components/features/ContentHumanizer'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Content Humanizer...</div>
});

const ContentHumanizerPage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MessagingProvider>
          <div className="container mx-auto">
            <ContentHumanizer />
          </div>
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ContentHumanizerPage;