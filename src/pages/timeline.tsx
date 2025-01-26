// src/pages/timeline.tsx
import React from 'react';
import TimelinePlanningStep from '../components/features/MarketingWalkthrough/components/TimelinePlanningStep';
import { ScreenTemplate } from '../components/shared/UIComponents';

const TimelinePage = () => (
  <ScreenTemplate
    title="Timeline Planning"
    subtitle="Schedule your marketing activities"
  >
    <TimelinePlanningStep />
  </ScreenTemplate>
);

export default TimelinePage;