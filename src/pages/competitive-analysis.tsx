// src/pages/competitive-analysis.tsx
import React from 'react';
import CompetitiveStep from '../components/features/MarketingWalkthrough/components/CompetitiveStep';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { ContentProvider } from '../context/ContentContext';
import { NotificationProvider } from '../context/NotificationContext';
import { MarketingProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { ScreenTemplate } from '../components/shared/UIComponents';

const CompetitiveAnalysisPage = () => (
  <NotificationProvider>
    <MarketingProvider>
      <ContentProvider>
        <WritingStyleProvider>
          <WalkthroughProvider>
            <ScreenTemplate
              title="Competitive Analysis"
              subtitle="Analyze your competitors and identify market opportunities"
              aiInsights={[
                "Analyze competitor messaging to find untapped opportunities",
                "Identify competitive gaps in the market",
                "Develop stronger positioning through competitor insights"
              ]}
              isWalkthrough={false}
            >
              <CompetitiveStep isStandalone={true} />
            </ScreenTemplate>
          </WalkthroughProvider>
        </WritingStyleProvider>
      </ContentProvider>
    </MarketingProvider>
  </NotificationProvider>
);

export default CompetitiveAnalysisPage;