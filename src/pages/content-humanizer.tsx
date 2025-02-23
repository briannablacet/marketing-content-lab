//src/pages/content-humanizer.tsx

import React from 'react';
import ContentHumanizer from '../components/features/ContentHumanizer';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';

const ContentHumanizerPage: React.FC = () => {
  return (
    <WritingStyleProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <ContentHumanizer />
        </div>
      </NotificationProvider>
    </WritingStyleProvider>
  );
};

export default ContentHumanizerPage;