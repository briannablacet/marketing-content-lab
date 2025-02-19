/**
 * File: src/pages/index.tsx
 * 
 * Streamlined home page maintaining value while reducing density
 */

import React from 'react';
import Link from 'next/link';
import { useMarketing } from '../context/MarketingContext';
import { useContent } from '../context/ContentContext';
import { Card } from '@/components/ui/card';

export default function Home() {
  const { state: marketingState } = useMarketing();
  const { contentTypes } = useContent();

  const renderToolCard = (title: string, description: string, href: string, isNew: boolean = false) => (
    <Link href={href}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative">
        {isNew && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            New
          </span>
        )}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Simplified Hero */}
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Market Multiplier
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Transform your product marketing with AI-powered competitive analysis 
          and authentic content creation
        </p>
        <Link 
          href="/walkthrough/1" 
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Start Building Your Program →
        </Link>
      </div>

      {/* Combined Value Props */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Strategic Analysis</h2>
          <p className="text-blue-800">Transform competitive research into actionable insights</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Content Excellence</h2>
          <p className="text-green-800">Enhance your team's capabilities while maintaining authenticity</p>
        </div>
      </div>

      {/* All Tools in One Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Marketing Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Strategic Tools */}
          {renderToolCard(
            "Competitive Analysis",
            "Analyze competitor messaging and identify opportunities",
            "/competitive-analysis",
            true
          )}
          
          {renderToolCard(
            "Value Proposition & Messaging",
            "Craft compelling value props and messaging frameworks",
            "/value-proposition",
            true
          )}

          {renderToolCard(
            "Content Creation Hub",
            "Create high-quality content with AI assistance",
            "/creation-hub"
          )}
          
          {renderToolCard(
            "Brand Voice Guardian",
            "Maintain consistent brand voice across all content",
            "/brand-voice"
          )}

          {renderToolCard(
            "Content Strategy",
            "Plan and optimize your content strategy",
            "/content-strategy"
          )}

          {renderToolCard(
            "Content Enhancement",
            "Improve and refine your existing content",
            "/content-engine"
          )}
        </div>
      </div>

      {/* Progress Section */}
      {marketingState.currentStep > 1 && (
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Continue Your Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Walkthrough Progress:</span>
              <span className="font-medium">
                {marketingState.completedSteps.length} steps completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${(marketingState.completedSteps.length / 8) * 100}%` }}
              ></div>
            </div>
            <Link 
              href={`/walkthrough/${marketingState.currentStep}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mt-4"
            >
              Continue Walkthrough →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}