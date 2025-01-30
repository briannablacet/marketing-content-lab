// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
import React from 'react';
import { useContent } from '../../../../../context/ContentContext';

const ReviewStep = () => {
  const { selectedContentTypes } = useContent();

  const completedSteps = [
    {
      title: "Target Persona",
      description: "You've defined your ideal customer profile and key audience segments",
      items: ["B2B Technology Decision Makers", "Security-Focused IT Leaders"]
    },
    {
      title: "Competitive Analysis",
      description: "You've mapped out your market position and competitive advantages",
      items: ["Market Differentiators", "Competitor Strengths/Weaknesses"]
    },
    {
      title: "Key Messages",
      description: "You've crafted your core value propositions",
      items: ["Primary Value Props", "Key Benefits"]
    },
    {
      title: "Budget Allocation",
      description: "You've planned your marketing investment strategy",
      items: ["Resource Distribution", "ROI Targets"]
    },
    {
      title: "Channel Strategy",
      description: "You've selected your marketing channels for maximum impact",
      items: ["Primary Channels", "Channel Mix"]
    },
    {
      title: "Content Strategy",
      description: "You've chosen your content types to engage your audience",
      items: selectedContentTypes
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Congratulations! Your Marketing Program is Ready</h2>
        <p className="text-slate-600">
          You've built a comprehensive marketing program. Here's everything you've accomplished:
        </p>
      </div>

      <div className="space-y-6">
        {completedSteps.map((step, index) => (
          <div key={index} className="border rounded-lg p-6 bg-white hover:bg-blue-50 transition-colors">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 mt-1">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600 mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.items.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-blue-50">
        <h3 className="text-xl font-semibold mb-2">Ready to Take Action</h3>
        <p className="text-slate-600">
          Click "Finish Walkthrough" to start creating your content and implementing your marketing program.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;