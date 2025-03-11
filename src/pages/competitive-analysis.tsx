// src/pages/competitive-analysis.tsx
import React, { useState } from 'react';
import CompetitiveStep from '../components/features/MarketingWalkthrough/components/CompetitiveStep';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { ContentProvider } from '../context/ContentContext';
import { NotificationProvider } from '../context/NotificationContext';
import { MarketingProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { useRouter } from 'next/router';
import { useNotification } from '../context/NotificationContext';

const CompetitiveAnalysisPage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving process
    await new Promise(resolve => setTimeout(resolve, 1000));
    showNotification('success', 'Competitor analysis saved successfully');
    setIsSaving(false);
  };

  return (
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
                hideNavigation={true}
              >
                {/* Pass isStandalone=true to hide the dashboard link in the CompetitiveStep component */}
                <CompetitiveStep isWalkthrough={false} isStandalone={true} />
                
                {/* Custom Bottom Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Back to Dashboard
                  </button>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => router.push('/competitor-dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Competitor Dashboard
                    </button>
                    
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                    >
                      {isSaving ? 'Saving...' : 'Save Analysis'}
                    </button>
                  </div>
                </div>
              </ScreenTemplate>
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default CompetitiveAnalysisPage;