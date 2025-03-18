// src/pages/creation-hub.tsx
import React from 'react';
import CreationHub from '../components/features/CreationHub';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';
import StyleGuideNotificationBanner from '../components/features/StyleGuideNotificationBanner';

export default function CreationHubPage() {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <StyleGuideNotificationBanner />
        <CreationHub />
      </WritingStyleProvider>
    </NotificationProvider>
  );
}