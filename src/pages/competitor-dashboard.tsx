// src/pages/competitor-dashboard.tsx
import React from 'react';
import { useRouter } from 'next/router';
import CompetitorAnalysisDashboard from '../components/features/CompetitorAnalysisDashboard';

const CompetitorDashboardPage = () => {
  const router = useRouter();

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
      
      <CompetitorAnalysisDashboard />

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