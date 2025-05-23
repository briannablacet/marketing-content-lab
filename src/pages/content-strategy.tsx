// src/pages/content-strategy.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ContentProvider } from '@/context/ContentContext';
import ContentStrategyModule from '@/components/features/ContentStrategyModule';
import ScreenTemplate from '@/components/shared/UIComponents';

const ContentStrategyPage = () => {
  const router = useRouter();
  // Track the current view of ContentStrategyModule
  const [currentModuleView, setCurrentModuleView] = useState('selection');

  // Handle view changes from the module
  const handleViewChange = (view) => {
    setCurrentModuleView(view);
  };

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
      >
        <div className="w-full max-w-7xl mx-auto">
          {/* Pass the handler to notify parent about view changes */}
          <ContentStrategyModule onViewChange={handleViewChange} />
        </div>
        
        <div className="flex justify-between items-center mt-8">
          {/* Show different buttons based on current view */}
          {currentModuleView === 'selection' ? (
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          ) : (
            <button
              onClick={() => setCurrentModuleView('selection')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Selection
            </button>
          )}
        </div>
      </ScreenTemplate>
    </ContentProvider>
  );
};

export default ContentStrategyPage;