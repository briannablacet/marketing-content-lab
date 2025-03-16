// src/pages/content-strategy.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ContentProvider } from '../context/ContentContext';
import ContentStrategyModule from '../components/features/ContentStrategyModule';
import { ScreenTemplate } from '../components/shared/UIComponents';

const ContentStrategyPage = () => {
  const router = useRouter();
  
  // This is used to intercept the action button in ScreenTemplate
  useEffect(() => {
    // Override any global navigation handlers
    const originalPushState = window.history.pushState;
    
    window.history.pushState = function() {
      // Only allow navigation to specific paths, block creation-hub
      const url = arguments[2];
      if (url && url.includes('/creation-hub')) {
        console.log('Blocked navigation to creation-hub');
        return;
      }
      
      return originalPushState.apply(this, arguments);
    };
    
    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

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
        hideNavigation={true}
        // Try different approaches to disable the action button
        actionButton={null}
        disableActionButton={true}
        showActionButton={false}
      >
        <ContentStrategyModule />
        
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
};

export default ContentStrategyPage;