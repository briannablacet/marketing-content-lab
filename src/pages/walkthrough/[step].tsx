// src/pages/walkthrough/[step].tsx
import React from 'react';
import MarketingWalkthrough from '../../components/features/MarketingWalkthrough';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';

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