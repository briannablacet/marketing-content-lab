// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
import React, { useEffect, useState } from 'react';
import { useContent } from '../../../../../context/ContentContext';
import { useWalkthrough } from '../../../../../context/WalkthroughContext';
import Link from 'next/link';

interface ReviewStepProps {
  onNext?: () => void;
  onBack?: () => void;
  selectedContentTypes?: string[];
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  onNext, 
  onBack, 
  selectedContentTypes: propSelectedTypes 
}) => {
  const { selectedContentTypes: contextSelectedTypes } = useContent();
  const { data } = useWalkthrough();
  const [hasCompetitors, setHasCompetitors] = useState(false);
  
  // Use the selectedContentTypes from props if provided, otherwise from context
  const selectedContentTypes = propSelectedTypes || contextSelectedTypes;

  // Check if competitors exist in walkthrough data
  useEffect(() => {
    if (data?.competitors && data.competitors.length > 0 && 
        data.competitors.some(comp => comp.name.trim() !== '')) {
      setHasCompetitors(true);
    }
  }, [data]);

  const completedSteps = [
    {
      title: "Product Definition",
      description: "You've defined your product features and benefits",
      items: ["Product Name", "Product Type", "Value Proposition", "Key Benefits"],
      icon: "🚀"
    },
    {
      title: "Ideal Customer",
      description: "You've defined your ideal customer's profile and key audience segments",
      items: ["Primary Role", "Industry Focus", "Key Challenges"],
      icon: "👥"
    },
    {
      title: "Key Messages",
      description: "You've crafted your core value propositions and content themes",
      items: ["Value Proposition", "Key Differentiators", "Key Benefits"],
      icon: "💡"
    },
    {
      title: "Competitive Analysis",
      description: "You've analyzed your content positioning against competitors",
      items: ["Competitor Positioning", "Market Gaps", "Unique Advantages"],
      icon: "📊",
      hasData: hasCompetitors
    },
    {
      title: "Selecting First Content Assets",
      description: "You've chosen your content types to engage your audience",
      items: selectedContentTypes,
      icon: "📝"
    },
    {
      title: "Setting Writing Style",
      description: "You've defined your writing style and formatting preferences",
      items: ["Style Guide", "Formatting Rules", "Punctuation Preferences"],
      icon: "✒️"
    },
    {
      title: "Defining Brand Voice",
      description: "You've established your brand's voice and tone",
      items: ["Brand Archetype", "Communication Style", "Key Terminology"],
      icon: "🔊"
    },
    {
      title: "SEO Keywords",
      description: "You've identified your target search terms and topics",
      items: ["Primary Keywords", "Secondary Keywords", "Keyword Groups"],
      icon: "🎯"
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-4">
          🎉 Strategy Complete
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Content Strategy is Ready!</h2>
        <p className="text-slate-600">
          You've built a data-driven content marketing strategy. Here's everything you've accomplished:
        </p>
      </div>

      <div className="space-y-6">
        {completedSteps.map((step, index) => (
          <div key={index} className="border rounded-lg p-6 bg-white hover:bg-blue-50 transition-colors">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-xl flex items-center justify-center mr-4 mt-1">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <span className="text-blue-600">✓</span>
                </div>
                <p className="text-slate-600 mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.items.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
                
                {/* Show Competitive Dashboard link if competitors data exists */}
                {step.title === "Competitive Analysis" && step.hasData && (
                  <div className="mt-4">
                    <Link href="/competitor-dashboard">
                      <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                        View Competitive Landscape Dashboard →
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">✨</span>
          <h3 className="text-xl font-semibold">Ready to Create</h3>
        </div>
        <p className="text-slate-600">
          Click "Finish Walkthrough" to start creating content that stands out in your market.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;