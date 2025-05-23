// src/pages/review-program.tsx
// Fixed review program page with proper ReviewStep component import

import React from 'react';
import { useRouter } from 'next/router';
import ReviewStep from '@/components/features/MarketingWalkthrough/components/ReviewStep';
import ScreenTemplate from '@/components/shared/UIComponents';
import { ContentProvider } from '@/context/ContentContext';
import { MarketingProvider } from '@/context/MarketingContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { WalkthroughProvider } from '@/context/WalkthroughContext';

const ReviewProgramPage = () => {
  const router = useRouter();

  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WalkthroughProvider>
            <ScreenTemplate
              title="Your Marketing Program"
              subtitle="Review and manage your content marketing strategy"
              aiInsights={[
                "A documented content strategy increases effectiveness by 60%",
                "Regular strategy reviews help keep your content aligned with business goals",
                "Use these insights to guide your content creation process"
              ]}
              hideNavigation={true}
            >
              <ReviewStep
                onNext={() => router.push('/creation-hub')}
                onBack={() => router.push('/')}
              />

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={() => router.push('/walkthrough/1')}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Edit Program
                  </button>
                  <button
                    onClick={() => router.push('/creation-hub')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Content
                  </button>
                </div>
              </div>
            </ScreenTemplate>
          </WalkthroughProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default ReviewProgramPage;