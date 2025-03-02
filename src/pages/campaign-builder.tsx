// src/pages/campaign-builder.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AutosaveIndicator } from '../components/shared/AutosaveIndicator';

// Campaign steps enumeration
enum CampaignStep {
  SETUP = 'setup',
  ASSETS = 'assets',
  CONTENT = 'content',
  REVIEW = 'review'
}

// Asset types with descriptions
const CAMPAIGN_ASSETS = {
  'Landing Page': {
    description: 'The destination page for your campaign',
    examples: ['Product launch page', 'Event registration', 'Lead capture form']
  },
  'Email Sequence': {
    description: 'Series of emails sent over time to nurture leads',
    examples: ['Welcome series', 'Nurture sequence', 'Event follow-up']
  },
  'Social Media': {
    description: 'Posts for social platforms to promote your campaign',
    examples: ['LinkedIn updates', 'Twitter posts', 'Instagram stories']
  },
  'Paid Ads': {
    description: 'Advertisements to drive traffic to your campaign',
    examples: ['Google Ads', 'LinkedIn Ads', 'Facebook/Instagram Ads']
  },
  'Blog Post': {
    description: 'Content piece to support your campaign message',
    examples: ['Thought leadership', 'How-to guide', 'Industry insights']
  },
  'Video Content': {
    description: 'Visual media to explain or showcase your offering',
    examples: ['Explainer video', 'Demo', 'Customer testimonial']
  },
  'Sales Enablement': {
    description: 'Materials to help your sales team close deals',
    examples: ['One-pagers', 'Battle cards', 'Email templates']
  }
};

const CampaignBuilder: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CampaignStep>(CampaignStep.SETUP);
  
  const [campaign, setCampaign] = useState({
    name: '',
    target: '',
    goal: '',
    selectedAssets: [] as string[],
    assetDetails: {} as Record<string, {
      description: string,
      aiGenerated: boolean,
      variations: number
    }>
  });

  // Handle asset selection
  const toggleAsset = (asset: string) => {
    setCampaign(prev => {
      const isSelected = prev.selectedAssets.includes(asset);
      const updatedAssets = isSelected
        ? prev.selectedAssets.filter(a => a !== asset)
        : [...prev.selectedAssets, asset];
        
      // If adding new asset, initialize details object
      const updatedDetails = {...prev.assetDetails};
      if (!isSelected) {
        updatedDetails[asset] = {
          description: '',
          aiGenerated: false,
          variations: 1
        };
      } else {
        // If removing, delete the details
        delete updatedDetails[asset];
      }
      
      return {
        ...prev,
        selectedAssets: updatedAssets,
        assetDetails: updatedDetails
      };
    });
  };

  // AI assist for asset description
  const generateDescription = async (asset: string) => {
    // In a real implementation, this would call your API
    setCampaign(prev => ({
      ...prev,
      assetDetails: {
        ...prev.assetDetails,
        [asset]: {
          ...prev.assetDetails[asset],
          description: `AI-generated description for ${asset} focused on ${prev.target} with the goal of ${prev.goal}.`,
          aiGenerated: true
        }
      }
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    switch (currentStep) {
      case CampaignStep.SETUP:
        setCurrentStep(CampaignStep.ASSETS);
        break;
      case CampaignStep.ASSETS:
        setCurrentStep(CampaignStep.CONTENT);
        break;
      case CampaignStep.CONTENT:
        setCurrentStep(CampaignStep.REVIEW);
        break;
      case CampaignStep.REVIEW:
        // Pass campaign data to creation hub
        const queryParams = new URLSearchParams({
          source: 'campaign-builder',
          campaignName: campaign.name,
          campaignTarget: campaign.target,
          campaignGoal: campaign.goal,
          selectedAssets: JSON.stringify(campaign.selectedAssets),
          assetDetails: JSON.stringify(campaign.assetDetails)
        }).toString();
        
        router.push(`/creation-hub?${queryParams}`);
        break;
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    switch (currentStep) {
      case CampaignStep.ASSETS:
        setCurrentStep(CampaignStep.SETUP);
        break;
      case CampaignStep.CONTENT:
        setCurrentStep(CampaignStep.ASSETS);
        break;
      case CampaignStep.REVIEW:
        setCurrentStep(CampaignStep.CONTENT);
        break;
      default:
        router.push('/');
    }
  };

  // Setup step content
  const renderSetupStep = () => (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => setCampaign({...campaign, name: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Q3 Product Launch, Annual Event Promotion"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <input
              type="text"
              value={campaign.target}
              onChange={(e) => setCampaign({...campaign, target: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., IT Decision Makers, SMB Owners"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Goal</label>
            <select
              value={campaign.goal}
              onChange={(e) => setCampaign({...campaign, goal: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a goal...</option>
              <option value="generate_leads">Generate Leads</option>
              <option value="increase_awareness">Increase Brand Awareness</option>
              <option value="drive_sales">Drive Sales</option>
              <option value="promote_event">Promote an Event</option>
              <option value="educate_market">Educate the Market</option>
              <option value="customer_retention">Customer Retention</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Asset selection step
  const renderAssetsStep = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Select Campaign Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-slate-600">
            Choose the assets you need for your "{campaign.name}" campaign.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CAMPAIGN_ASSETS).map(([asset, details]) => (
              <Card 
                key={asset}
                className={`p-4 cursor-pointer transition-all ${
                  campaign.selectedAssets.includes(asset) 
                    ? 'border-2 border-blue-500 bg-blue-50' 
                    : 'border hover:border-blue-300'
                }`}
                onClick={() => toggleAsset(asset)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{asset}</h3>
                    <p className="text-sm text-slate-600">{details.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    campaign.selectedAssets.includes(asset)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-slate-300'
                  }`}>
                    {campaign.selectedAssets.includes(asset) && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Content definition step
  const renderContentStep = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Define Your Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-slate-600">
            Describe what you want each asset to communicate. Our AI can help you define compelling content.
          </p>
          
          <div className="space-y-6">
            {campaign.selectedAssets.map(asset => (
              <div key={asset} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{asset}</h3>
                  <button
                    onClick={() => generateDescription(asset)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full flex items-center"
                    disabled={campaign.assetDetails[asset]?.aiGenerated}
                  >
                    <span className="text-yellow-500 mr-1">✨</span>
                    {campaign.assetDetails[asset]?.aiGenerated 
                      ? 'AI Generated' 
                      : 'Help Me Define'
                    }
                  </button>
                </div>
                
                <textarea
                  value={campaign.assetDetails[asset]?.description || ''}
                  onChange={(e) => setCampaign(prev => ({
                    ...prev,
                    assetDetails: {
                      ...prev.assetDetails,
                      [asset]: {
                        ...prev.assetDetails[asset],
                        description: e.target.value,
                        aiGenerated: false
                      }
                    }
                  }))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={`Describe what you want this ${asset} to communicate...`}
                />
                
                {asset === 'Email Sequence' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Number of emails in sequence</label>
                    <select
                      value={campaign.assetDetails[asset]?.variations || 1}
                      onChange={(e) => setCampaign(prev => ({
                        ...prev,
                        assetDetails: {
                          ...prev.assetDetails,
                          [asset]: {
                            ...prev.assetDetails[asset],
                            variations: Number(e.target.value)
                          }
                        }
                      }))}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {(asset === 'Social Media' || asset === 'Paid Ads') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Number of variations</label>
                    <select
                      value={campaign.assetDetails[asset]?.variations || 1}
                      onChange={(e) => setCampaign(prev => ({
                        ...prev,
                        assetDetails: {
                          ...prev.assetDetails,
                          [asset]: {
                            ...prev.assetDetails[asset],
                            variations: Number(e.target.value)
                          }
                        }
                      }))}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Review step
  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Target Audience:</span>
                  <span className="ml-2 font-medium">{campaign.target}</span>
                </div>
                <div>
                  <span className="text-slate-600">Goal:</span>
                  <span className="ml-2 font-medium">{campaign.goal.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg">Campaign Assets</h3>
            <div className="space-y-4">
              {campaign.selectedAssets.map(asset => (
                <div key={asset} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{asset}</h4>
                    {asset === 'Email Sequence' && campaign.assetDetails[asset]?.variations > 1 && (
                      <span className="text-sm text-slate-600">
                        {campaign.assetDetails[asset].variations} emails in sequence
                      </span>
                    )}
                    {(asset === 'Social Media' || asset === 'Paid Ads') && campaign.assetDetails[asset]?.variations > 1 && (
                      <span className="text-sm text-slate-600">
                        {campaign.assetDetails[asset].variations} variations
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {campaign.assetDetails[asset]?.description || 'No description provided'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-start space-x-4">
          <span className="text-yellow-500 text-xl">✨</span>
          <div>
            <h3 className="font-semibold text-lg mb-2">Ready to Create Your Campaign</h3>
            <p className="text-slate-700">
              Click "Start Creating" to begin building your campaign assets. Our AI will help craft compelling content based on your specifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case CampaignStep.SETUP:
        return renderSetupStep();
      case CampaignStep.ASSETS:
        return renderAssetsStep();
      case CampaignStep.CONTENT:
        return renderContentStep();
      case CampaignStep.REVIEW:
        return renderReviewStep();
      default:
        return renderSetupStep();
    }
  };

  // Get the step title
  const getStepTitle = () => {
    switch (currentStep) {
      case CampaignStep.SETUP:
        return 'Step 1: Campaign Setup';
      case CampaignStep.ASSETS:
        return 'Step 2: Choose Campaign Assets';
      case CampaignStep.CONTENT:
        return 'Step 3: Define Content';
      case CampaignStep.REVIEW:
        return 'Step 4: Review & Create';
      default:
        return 'Campaign Builder';
    }
  };

  // Get the next button text
  const getNextButtonText = () => {
    switch (currentStep) {
      case CampaignStep.REVIEW:
        return 'Start Creating →';
      default:
        return 'Continue →';
    }
  };

  // Get step-specific AI insights
  const getAIInsights = () => {
    switch (currentStep) {
      case CampaignStep.SETUP:
        return [
          "Clear campaign goals lead to 30% better performance",
          "Defining your target audience helps tailor content effectively"
        ];
      case CampaignStep.ASSETS:
        return [
          "Multi-channel campaigns typically see 3x higher engagement",
          "Email sequences show 24% higher conversion than single emails"
        ];
      case CampaignStep.CONTENT:
        return [
          "Content aligned with audience pain points converts better",
          "AI assistance can help maintain consistent messaging across assets"
        ];
      case CampaignStep.REVIEW:
        return [
          "Your campaign includes the key assets for this type of goal",
          "Creating variations can improve performance by testing different approaches"
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <ScreenTemplate
        title={getStepTitle()}
        subtitle="Build an integrated marketing campaign"
        currentStep={Object.values(CampaignStep).indexOf(currentStep) + 1}
        totalSteps={Object.values(CampaignStep).length}
        aiInsights={getAIInsights()}
        onNext={handleNext}
        onBack={handleBack}
        nextButtonText={getNextButtonText()}
        isWalkthrough={false} // Not a walkthrough
      >
        {renderCurrentStep()}
      </ScreenTemplate>
      <AutosaveIndicator />
    </>
  );
};

export default CampaignBuilder;