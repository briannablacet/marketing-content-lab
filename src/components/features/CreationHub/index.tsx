// src/components/features/CreationHub/index.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../../shared/UIComponents';

const CreationHub = () => {
  const router = useRouter();
  const { 
    source, 
    campaignName, 
    campaignTarget, 
    campaignGoal, 
    selectedAssets, 
    assetDetails 
  } = router.query;
  
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromCampaignBuilder, setIsFromCampaignBuilder] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  
  // Process query params from campaign builder
  useEffect(() => {
    if (source === 'campaign-builder' && selectedAssets) {
      setIsFromCampaignBuilder(true);
      try {
        const parsedAssets = JSON.parse(selectedAssets as string);
        const parsedDetails = JSON.parse(assetDetails as string);
        
        setCampaignData({
          name: campaignName,
          target: campaignTarget,
          goal: campaignGoal,
          selectedAssets: parsedAssets,
          assetDetails: parsedDetails
        });
      } catch (e) {
        console.error('Error parsing campaign data', e);
      }
    }
  }, [router.query]);

  const testContentGeneration = async () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      setTestResult("This is a test result from content generation.");
      setIsLoading(false);
    }, 2000);
  };

  // Standard creation hub view
  const renderStandardCreationHub = () => (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Content Creation Hub</h2>
      <button 
        onClick={testContentGeneration}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Testing...' : 'Test Content Generation'}
      </button>
      {testResult && (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-left">
          <h3 className="font-bold mb-2">Test Result:</h3>
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );

  // Campaign builder specialized view
  const renderCampaignCreationHub = () => {
    if (!campaignData) return <div>Loading campaign data...</div>;
    
    return (
      <div className="space-y-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Campaign: {campaignData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Target Audience</p>
                <p className="text-lg">{campaignData.target}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Campaign Goal</p>
                <p className="text-lg">{String(campaignData.goal).replace('_', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-bold">Campaign Assets to Create</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaignData.selectedAssets.map((asset, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{asset}</span>
                  {asset === 'Email Sequence' && campaignData.assetDetails[asset]?.variations > 1 && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {campaignData.assetDetails[asset].variations} emails
                    </span>
                  )}
                  {(asset === 'Social Media' || asset === 'Paid Ads') && campaignData.assetDetails[asset]?.variations > 1 && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {campaignData.assetDetails[asset].variations} variations
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  {campaignData.assetDetails[asset]?.description || 'No description provided'}
                </p>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full flex items-center justify-center"
                >
                  <span className="text-yellow-300 mr-2">✨</span>
                  Create {asset}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Determine which view to render
  return (
    <ScreenTemplate
      title={isFromCampaignBuilder ? `Creating ${campaignData?.name || 'Campaign'}` : "Content Creation Hub"}
      subtitle={isFromCampaignBuilder 
        ? `Let's create all the assets for your campaign` 
        : "Generate content with AI assistance"
      }
      aiInsights={isFromCampaignBuilder ? [
        "Your campaign contains multiple assets that work together",
        "We'll maintain consistent messaging across all content",
        "Each asset will be optimized for its specific format"
      ] : [
        "Explore different content types to reach your audience",
        "Start with a clear content structure for best results",
        "Use AI assistance to enhance your content quality"
      ]}
    >
      {isFromCampaignBuilder ? renderCampaignCreationHub() : renderStandardCreationHub()}
    </ScreenTemplate>
  );
};

export default CreationHub;