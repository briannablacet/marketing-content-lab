// src/pages/content-strategy.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ContentProvider } from '../context/ContentContext';
import ContentStrategyModule from '../components/features/ContentStrategyModule';
import { ScreenTemplate } from '../components/shared/UIComponents';

export default function ContentStrategyPage() {
  const router = useRouter();

  return (
    <ContentProvider>
      <ScreenTemplate
        title="Choose Your Content Mix"
        subtitle="Select the types of content you want to create for your marketing strategy"
        aiInsights={[
          "Optimize your content mix for maximum marketing impact",
          "Balance different content types for comprehensive strategy",
          "Consider your target audience's preferences"
        ]}
        hideNavigation={true}  // Hide the walkthrough navigation
      >
        <ContentStrategyModule />
        
        {/* Back to Dashboard navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </ScreenTemplate>
    </ContentProvider>
  );
}