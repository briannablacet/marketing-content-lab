// src/pages/content-enhancer.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { MessagingProvider } from '../context/MessagingContext';

// Use dynamic import with SSR disabled to prevent SSR-related issues
const ContentEnhancer = dynamic(() => import('../components/features/ContentEnhancer'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Content Enhancer...</div>
});

export default function ContentEnhancerPage() {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MessagingProvider>
          <ContentEnhancer />
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
}