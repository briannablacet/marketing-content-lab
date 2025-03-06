// src/pages/content-creator/case-study.tsx
import React from 'react';
import ContentCreator from '../../components/features/ContentCreator';
import { ContentProvider } from '../../context/ContentContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WalkthroughProvider } from '../../context/WalkthroughContext';
import { MarketingProvider } from '../../context/MarketingContext';

const CaseStudyContentCreatorPage = () => {
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <ContentCreator 
                contentType="Case Study"
                description="Create compelling case studies that showcase your success stories and build credibility."
                steps={['Customer Selection', 'Challenge Definition', 'Solution Description', 'Results & Metrics']}
                insights={[
                  "Case studies with specific metrics have 68% higher engagement",
                  "Include direct customer quotes to enhance credibility",
                  "Focus on the transformation and concrete results"
                ]}
              />
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default CaseStudyContentCreatorPage;