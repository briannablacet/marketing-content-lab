// src/pages/content-humanizer.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '@/context/NotificationContext';
import { WritingStyleProvider } from '@/context/WritingStyleContext';
import { MessagingProvider } from '@/context/MessagingContext';
import ScreenTemplate from '@/components/shared/UIComponents';



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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ContentHumanizer />
          </div>
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ContentHumanizerPage;