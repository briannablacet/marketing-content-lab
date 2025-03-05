// src/pages/content-repurposer.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { MessagingProvider } from '../context/MessagingContext';

// Use dynamic import with SSR disabled to prevent SSR-related issues
const ContentRepurposer = dynamic(() => import('../components/features/ContentRepurposer'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Content Repurposer...</div>
});

export default function ContentRepurposerPage() {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MessagingProvider>
          <ContentRepurposer />
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
}