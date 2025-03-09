// src/pages/walkthrough/[step].tsx
import React from 'react';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import MarketingWalkthrough from '../../components/features/MarketingWalkthrough';

const WalkthroughStepPage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MarketingWalkthrough />
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default WalkthroughStepPage;