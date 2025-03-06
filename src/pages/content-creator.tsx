// src/pages/content-creator.tsx
import React from 'react';
import ContentCreator from '../components/features/ContentCreator';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { ContentProvider } from '../context/ContentContext';
import { NotificationProvider } from '../context/NotificationContext';

const ContentCreatorPage = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <ContentProvider>
          <ContentCreator />
        </ContentProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ContentCreatorPage;