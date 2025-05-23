//src/pages/writing-style.tsx
import React from 'react';
import WritingStyleModule from '../components/features/WritingStyleModule';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';
import PageLayout from '../components/shared/PageLayout';

const WritingStylePage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <PageLayout
          title="Style Guide Compliance Checker"
          description="Define your brand's writing style and content guidelines to ensure consistent messaging across all channels."
          showHelpPrompt={true}
          helpPromptText="Need help defining your writing style? Let AI analyze your content and suggest a style that matches your brand voice."
          helpPromptLink="/brand-voice"
          helpPromptLinkText="Brand Personality Settings"
        >
          <WritingStyleModule isWalkthrough={false} />
        </PageLayout>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default WritingStylePage;