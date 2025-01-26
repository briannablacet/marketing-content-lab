// src/pages/content-strategy.tsx
import React from 'react';
import ContentStrategyStep from '../components/features/MarketingWalkthrough/components/ContentStrategyStep';
import { ScreenTemplate } from '../components/shared/UIComponents';

const ContentStrategyPage = () => (
  <ScreenTemplate
    title="Content Strategy"
    subtitle="Plan and manage your content creation"
    aiInsights={[
      "Based on your industry, long-form content performs best for lead generation",
      "Your audience responds well to technical deep-dives and case studies",
      "Consider increasing webinar frequency based on engagement metrics"
    ]}
    isWalkthrough={false}
  >
    <ContentStrategyStep />
  </ScreenTemplate>
);

export default ContentStrategyPage;