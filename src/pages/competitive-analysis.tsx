// src/pages/competitive-analysis.tsx
import React, { useState, useRef, useEffect } from 'react';
import CompetitiveStep from '../components/features/MarketingWalkthrough/components/CompetitiveStep';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { ContentProvider } from '../context/ContentContext';
import { NotificationProvider } from '../context/NotificationContext';
import { MarketingProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { useRouter } from 'next/router';
import { useNotification } from '../context/NotificationContext';

interface Competitor {
  name: string;
  description: string;
  knownMessages: string[];
  strengths: string[];
  weaknesses: string[];
  isLoading?: boolean;
}

const CompetitiveAnalysisPage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();
  const [competitorData, setCompetitorData] = useState<Competitor[]>([]);
  
  // Create refs for the navigation buttons
  const dashboardButtonRef = useRef<HTMLButtonElement>(null);
  const competitorDashboardButtonRef = useRef<HTMLButtonElement>(null);
  
  // Keep track if we have valid data to enable save button
  const hasValidData = competitorData.length > 0;
  
  // Use direct window.location navigation as a fallback
  useEffect(() => {
    if (dashboardButtonRef.current) {
      dashboardButtonRef.current.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/';
        return false;
      };
    }

    if (competitorDashboardButtonRef.current) {
      competitorDashboardButtonRef.current.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/competitor-dashboard';
        return false;
      };
    }
  }, []);
  
  const handleSave = async () => {
    if (!hasValidData) return;
    
    setIsSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('savedCompetitorAnalysis', JSON.stringify({
        data: competitorData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));
      
      // Wait a bit to show the saving state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showNotification('success', 'Competitor analysis saved successfully');
    } catch (error) {
      console.error('Error saving analysis:', error);
      showNotification('error', 'Failed to save analysis. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handler for competitor data changes
  const handleCompetitorDataChange = (data: Competitor[]) => {
    setCompetitorData(data);
  };

  // Force navigation with window.location
  const forceDashboardNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '/';
  };

  const forceCompetitorDashboardNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '/competitor-dashboard';
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
                {/* Pass data change handler to CompetitiveStep */}
                <CompetitiveStep 
                  isWalkthrough={false} 
                  isStandalone={true}
                  onDataChange={handleCompetitorDataChange}
                />
                
                {/* Custom Bottom Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <a href="/" className="inline-block">
                    <button
                      ref={dashboardButtonRef}
                      onClick={forceDashboardNavigation}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Back to Dashboard
                    </button>
                  </a>
                  
                  <div className="flex space-x-4">
                    <a href="/competitor-dashboard" className="inline-block">
                      <button
                        ref={competitorDashboardButtonRef}
                        onClick={forceCompetitorDashboardNavigation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Competitor Dashboard
                      </button>
                    </a>
                    
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !hasValidData}
                      className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                        !hasValidData ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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