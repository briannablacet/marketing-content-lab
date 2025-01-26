// src/pages/channel-mix.tsx
import React from 'react';
import ChannelSelectionStep from '../components/features/MarketingWalkthrough/components/ChannelSelectionStep';
import { ScreenTemplate } from '../components/shared/UIComponents';

const ChannelMixPage = () => (
  <ScreenTemplate
    title="Channel Mix"
    subtitle="Select and configure your marketing channels"
    aiInsights={[
      "Your target audience shows high engagement with content marketing and events",
      "Digital advertising could complement your organic reach strategy",
      "Consider expanding social presence based on industry benchmarks"
    ]}
    isWalkthrough={false}
  >
    <ChannelSelectionStep />
  </ScreenTemplate>
);

export default ChannelMixPage;