// src/pages/walkthrough/[step].tsx
import React from 'react';
import { NotificationProvider } from '../../context/NotificationContext';
import MarketingWalkthrough from '../../components/features/MarketingWalkthrough';

const WalkthroughStepPage: React.FC = () => {
  return (
    <NotificationProvider>
      <MarketingWalkthrough />
    </NotificationProvider>
  );
};

export default WalkthroughStepPage;