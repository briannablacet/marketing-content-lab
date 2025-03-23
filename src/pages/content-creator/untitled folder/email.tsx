// src/pages/content-creator/email.tsx
import React from 'react';
import ContentCreator from '../../components/features/ContentCreator';
import { ContentProvider } from '../../context/ContentContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WalkthroughProvider } from '../../context/WalkthroughContext';
import { MarketingProvider } from '../../context/MarketingContext';

const EmailContentCreatorPage = () => {
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <ContentCreator 
                contentType="Email Campaign"
                description="Create email content that drives opens, clicks, and conversions for your business."
                steps={['Campaign Goal', 'Subject Line', 'Email Body', 'Call to Action']}
                insights={[
                  "Personalized subject lines increase open rates by 26%",
                  "Emails with a single clear CTA have higher conversion rates",
                  "Keep emails under 200 words for optimal engagement"
                ]}
              />
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default EmailContentCreatorPage;