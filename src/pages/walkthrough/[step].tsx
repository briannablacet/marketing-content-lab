import React from 'react';
import { NotificationProvider } from '../../context/NotificationContext';
import MarketingWalkthrough from '../../components/features/MarketingWalkthrough';

const WalkthroughStepPage: React.FC = () => {
  return (
    <NotificationProvider>
      {/* REMOVED: WritingStyleProvider - this should be in _app.tsx */}
      <MarketingWalkthrough />
    </NotificationProvider>
  );
};

export default WalkthroughStepPage;