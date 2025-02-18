// src/pages/index.js
import { useMarketingProgram } from '../context/MarketingContext';
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
          Craft compelling content that resonates with your audience
        </p>

        {/* Primary CTA Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to create engaging content?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's build your content marketing strategy. We'll guide you through understanding your audience, 
            crafting your message, and creating content that connects.
          </p>
          <Link 
            href="/walkthrough/1"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-sm hover:shadow"
          >
            Build My Content Strategy →
          </Link>
        </div>

        {/* Content Tools Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Content Creation Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link 
              href="/content-strategy"
              className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700 flex items-center justify-center"
            >
              Content Strategy
            </Link>
            <Link 
              href="/key-messages"
              className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700 flex items-center justify-center"
            >
              Key Messages
            </Link>
            <Link 
              href="/seo-keywords"
              className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700 flex items-center justify-center"
            >
              SEO Keywords
            </Link>
            <Link 
              href="/creation-hub"
              className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700 flex items-center justify-center"
            >
              Creation Hub
            </Link>
            <Link 
              href="/competitor-analysis"
              className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-center text-sm font-medium text-gray-700 flex items-center justify-center"
            >
              Competitor Analysis
            </Link>
          </div>
        </div>

        {/* AI Assistant Preview */}
        <div className="mt-8 grid gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 flex items-center">
              <span className="mr-2">🤖</span>
              AI Assistant available to help with competitor analysis, key messages, and SEO keywords!
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 flex items-center">
              <span className="mr-2">✨</span>
              More features coming soon! We're continually expanding our content creation capabilities.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}