// src/pages/demo/index.js
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../components/shared/UIComponents';

function DemoLanding() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/demo/1');
  };

  return (
    <ScreenTemplate
      title="Welcome to MarketMultiplier"
      subtitle="Experience how AI can transform your marketing program development"
      aiInsights={[
        "See how our AI-powered platform can help you create more effective marketing programs",
        "Explore our content strategy and enhancement capabilities"
      ]}
      hideNavigation={true}
    >
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg text-slate-600 mb-8">
          This demo will walk you through our streamlined process for creating
          data-driven marketing programs with AI assistance.
        </p>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Start Demo
        </button>
      </div>
    </ScreenTemplate>
  );
}

export default DemoLanding;