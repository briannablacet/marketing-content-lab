// src/pages/competitive-analysis.tsx
import React from 'react';
import CompetitiveStep from '../components/features/MarketingWalkthrough/components/CompetitiveStep';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/router';

const CompetitiveAnalysisPage = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Competitive Analysis
        </h1>
        <p className="text-gray-600">
          Analyze your competitors and identify market opportunities.
        </p>
      </div>
      
      <CompetitiveStep />

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/competitor-dashboard')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Competitive Landscape Dashboard →
        </button>
      </div>
    </div>
  );
};

export default CompetitiveAnalysisPage;