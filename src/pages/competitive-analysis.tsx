// src/pages/competitive-analysis.tsx
import React, { useState, useRef, useEffect } from 'react';
import CompetitiveStep from '@/components/features/MarketingWalkthrough/components/CompetitiveStep';
import ScreenTemplate from '@/components/shared/UIComponents';
import { ContentProvider } from '@/context/ContentContext';
import { NotificationProvider, useNotification } from '@/context/NotificationContext';
import { MarketingProvider } from '@/context/MarketingContext';
import { WalkthroughProvider } from '@/context/WalkthroughContext';
import { useRouter } from 'next/router';

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
  const [showAnalysisNote, setShowAnalysisNote] = useState(false);

  // Create refs for the navigation buttons
  const dashboardButtonRef = useRef<HTMLButtonElement>(null);
  const competitorDashboardButtonRef = useRef<HTMLButtonElement>(null);

  // Keep track if we have valid data to enable save button
  const hasValidData = competitorData.length > 0 && competitorData.some(comp => comp.name.trim() !== '');

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
        data: competitorData.filter(comp => comp.name.trim() !== ''),
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
    // We'll check if the data seems to be using fallback values
    const usedFallback = data.some(comp =>
      comp.description?.includes("sample data") ||
      (comp.strengths.length === 3 &&
        comp.strengths.includes("Strong brand recognition") &&
        comp.strengths.includes("Established market presence"))
    );

    // Only show the analysis note if we're using fallback data
    setShowAnalysisNote(usedFallback);
  };

  // Function to dismiss the analysis note
  const dismissAnalysisNote = () => {
    setShowAnalysisNote(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScreenTemplate
          title="Competitive Messaging Analysis"
          subtitle="Analyze your competitors' messaging and identify gaps and opportunities"
          isWalkthrough={false}
          hideNavigation={true}
          currentStep={1}
          totalSteps={1}
          onNext={() => { }}
          onBack={() => { }}
          onSkip={() => { }}
          onExit={() => { }}
        >
          {/* Pass data change handler to CompetitiveStep */}
          <CompetitiveStep
            isWalkthrough={false}
            isStandalone={true}
            onDataChange={handleCompetitorDataChange}
          />

          {/* Analysis Note - Only shown when using fallback data */}
          {showAnalysisNote && (
            <div className="bg-white rounded-lg border border-red-200 p-4 mt-6 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 4h.01"></path>
                </svg>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">Analysis Note</h3>
                  <p className="text-red-700">Analysis is currently having issues. Using fallback data instead.</p>
                </div>
                <button
                  onClick={dismissAnalysisNote}
                  className="text-gray-500 hover:text-red-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Custom Bottom Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              ref={dashboardButtonRef}
              onClick={forceDashboardNavigation}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Dashboard
            </button>

            <div className="flex space-x-4">
              <button
                ref={competitorDashboardButtonRef}
                onClick={forceCompetitorDashboardNavigation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Competitor Dashboard
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !hasValidData}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${!hasValidData ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isSaving ? 'Saving...' : 'Save Analysis'}
              </button>
            </div>
          </div>
        </ScreenTemplate>
      </div>
    </div>
  );
};

// Wrap the main component with all providers
const CompetitiveAnalysisPageWithProviders = () => (
  <NotificationProvider>
    <MarketingProvider>
      <ContentProvider>
        <WalkthroughProvider>
          <CompetitiveAnalysisPage />
        </WalkthroughProvider>
      </ContentProvider>
    </MarketingProvider>
  </NotificationProvider>
);

export default CompetitiveAnalysisPageWithProviders;