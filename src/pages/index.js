// src/pages/index.js
import { useMarketingProgram } from '../context/MarketingProgramContext';
import Link from 'next/link';

export default function Home() {
  const { programData } = useMarketingProgram();
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Market Multiplier AI 
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to MarketMultiplier!
        </p>

        {/* Primary CTA Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to accelerate your growth?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's create your customized marketing program. We'll guide you through each step, 
            from strategy to execution.
          </p>
          <Link 
            href="/walkthrough/welcome"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-sm hover:shadow"
          >
            Build My Marketing Program →
          </Link>
        </div>

        {/* Tools Section - Temporary layout until we decide on final navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Marketing Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <Link 
              href="/budget"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              Budget Planner
            </Link>
            <Link 
              href="/competitor-analysis"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              Competitor Analysis
            </Link>
            <Link 
              href="/marketing-roi"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              Marketing ROI
            </Link>
            <Link 
              href="/sdr"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              SDR Workspace
            </Link>
            <Link 
              href="/pipeline-forecast"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              Pipeline Forecast
            </Link>
            <Link 
              href="/content-strategy"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              Content Strategy
            </Link>
            <Link 
              href="/lead-scoring"
              className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700"
            >
              Lead Scoring
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}