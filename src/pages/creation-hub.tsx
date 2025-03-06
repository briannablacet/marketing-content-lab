// src/pages/creation-hub.tsx
import React from 'react';
import CreationHub from '../components/features/CreationHub';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';

export default function CreationHubPage() {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <CreationHub />
      </WritingStyleProvider>
    </NotificationProvider>
  );
}