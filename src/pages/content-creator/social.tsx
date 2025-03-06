// src/pages/content-creator/social.tsx
import React from 'react';
import ContentCreator from '../../components/features/ContentCreator';
import { ContentProvider } from '../../context/ContentContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WalkthroughProvider } from '../../context/WalkthroughContext';
import { MarketingProvider } from '../../context/MarketingContext';

const SocialContentCreatorPage = () => {
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <ContentCreator 
                contentType="Social Media Posts"
                description="Create engaging social media content that drives engagement and builds your audience."
                steps={['Content Theme', 'Platform Selection', 'Post Creation', 'Review & Schedule']}
                insights={[
                  "LinkedIn posts with 1-2 hashtags get 50% more engagement",
                  "Posts with questions receive twice as many comments",
                  "Share industry insights to establish thought leadership"
                ]}
              />
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default SocialContentCreatorPage;