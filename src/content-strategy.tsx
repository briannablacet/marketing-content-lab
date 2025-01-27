// pages/content-strategy.tsx
import React from 'react';
import ContentStrategyStep from '../components/features/ContentStrategyModule';
import { ContentProvider } from '@/context/ContentContext';

export default function ContentStrategyPage() {
  return (
    <ContentProvider>
      <ContentStrategyStep />
    </ContentProvider>
  );
}