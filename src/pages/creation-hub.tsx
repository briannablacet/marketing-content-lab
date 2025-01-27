// pages/creation-hub.tsx
import React from 'react';
import { ContentProvider } from '../context/ContentContext';
import ContentStrategyModule from '../components/features/ContentStrategyModule';
import CreationHub from '../components/features/CreationHub';

export default function CreationHubPage() {
  return (
    <ContentProvider>
      <CreationHub />
    </ContentProvider>
  );
}