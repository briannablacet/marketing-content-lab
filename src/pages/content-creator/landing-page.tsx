// src/pages/content-creator/landing-page.tsx
import React from 'react';
import ContentCreator from '../../components/features/ContentCreator';
import { ContentProvider } from '../../context/ContentContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WalkthroughProvider } from '../../context/WalkthroughContext';
import { MarketingProvider } from '../../context/MarketingContext';

const LandingPageContentCreatorPage = () => {
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <ContentCreator 
                contentType="Landing Page"
                description="Create high-converting landing pages that turn visitors into leads and customers."
                steps={['Objective', 'Headline & Hero', 'Features & Benefits', 'Call to Action']}
                insights={[
                  "Landing pages with social proof convert 40% better",
                  "Benefit-focused headlines outperform feature-focused ones",
                  "Clear, contrasting CTAs increase click-through rates by 32%"
                ]}
              />
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default LandingPageContentCreatorPage;