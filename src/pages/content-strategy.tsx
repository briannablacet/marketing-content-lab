
// pages/content-strategy.tsx
import React from 'react';
import { ContentProvider } from '../context/ContentContext';
import ContentStrategyModule from '../components/features/ContentStrategyModule';
import CreationHub from '../components/features/CreationHub';
import { ScreenTemplate } from '../components/shared/UIComponents';




export default function ContentStrategyPage() {
  return (
    <ContentProvider>
      <ScreenTemplate
        title="Choose Your Content Mix"
        subtitle="Select the types of content you want to create for your marketing strategy"
        aiInsights={[
          "Optimize your content mix for maximum marketing impact",
          "Balance different content types for comprehensive strategy",
          "Consider your target audience's preferences"
        ]}
      >
        <ContentStrategyModule />
      </ScreenTemplate>
    </ContentProvider>
  );
}



