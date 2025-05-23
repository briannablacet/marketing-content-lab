// src/pages/content-repurposer.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '@/context/NotificationContext';
import { WritingStyleProvider } from '@/context/WritingStyleContext';
import { MessagingProvider } from '@/context/MessagingContext';
import { ScreenTemplate } from '@/components/shared/UIComponents';

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
          <ScreenTemplate
            title="Content Repurposer"
            subtitle="Transform your content from one format to another while preserving key messages"
            aiInsights={[
              "Repurposing content can increase your content reach by up to 60%",
              "The AI will preserve your brand voice across different formats",
              "Each format is optimized for its specific platform and audience"
            ]}
          >
            <ContentRepurposer />
          </ScreenTemplate>
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
}