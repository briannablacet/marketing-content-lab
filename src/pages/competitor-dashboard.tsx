// src/pages/competitor-dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CompetitorAnalysisDashboard from '../components/features/CompetitorAnalysisDashboard';
import { useWalkthrough } from '../context/WalkthroughContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { ContentProvider } from '../context/ContentContext';
import { MarketingProvider } from '../context/MarketingContext';

const CompetitorDashboardPage = () => {
  const router = useRouter();
  
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <DashboardContent />
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

// Separated into a component to access context inside the providers
const DashboardContent = () => {
  const router = useRouter();
  const { data } = useWalkthrough();
  const [competitors, setCompetitors] = useState([]);

  useEffect(() => {
    // If we have competitor data from the walkthrough, use it to populate the dashboard
    if (data?.competitors && data.competitors.length > 0) {
      // Transform the data to match the dashboard component's expected format
      const transformedCompetitors = data.competitors
        .filter(comp => comp.name.trim())
        .map((comp, index) => ({
          name: comp.name,
          marketPosition: { 
            // Generate positions in a circle for better visualization
            x: 50 + Math.cos(index * Math.PI / 4) * 30, 
            y: 50 + Math.sin(index * Math.PI / 4) * 30
          },
          features: {},
          // Some arbitrary metrics based on strengths/weaknesses count
          wins: comp.strengths?.length || 0,
          losses: comp.weaknesses?.length || 0
        }));
      
      setCompetitors(transformedCompetitors);
    }
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Competitive Landscape Dashboard
        </h1>
        <p className="text-gray-600">
          Visualize your position relative to competitors in the market.
        </p>
      </div>
      
      <CompetitorAnalysisDashboard initialCompetitors={competitors} />

      <div className="mt-8">
        <button
          onClick={() => router.push('/competitive-analysis')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← Back to Competitor Analysis
        </button>
      </div>
    </div>
  );
};

export default CompetitorDashboardPage;