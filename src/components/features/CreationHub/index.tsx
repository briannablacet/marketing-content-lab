// src/components/features/CreationHub/index.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// Remove problematic imports and just keep the ones we know work
import { 
  Pencil, 
  Zap, 
  Maximize2, 
  Target, 
  Plus 
} from 'lucide-react';

// Content creation tools available in the hub
const CONTENT_TOOLS = [
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Create structured content with AI assistance',
    path: '/content-creator',
    icon: <Pencil className="w-6 h-6 text-blue-600" />
  },
  {
    id: 'content-enhancer',
    name: 'Content Enhancer',
    description: 'Improve your existing content',
    path: '/content-enhancer',
    icon: <span className="text-2xl">✨</span> // Simple emoji
  },
  {
    id: 'content-humanizer',
    name: 'Content Humanizer',
    description: 'Make AI-generated content sound more natural',
    path: '/content-humanizer',
    icon: <Zap className="w-6 h-6 text-purple-600" />
  },
  {
    id: 'content-repurposer',
    name: 'Content Repurposer',
    description: 'Transform content from one format to another',
    path: '/content-repurposer',
    icon: <Maximize2 className="w-6 h-6 text-amber-600" />
  }
];

// Common content types users can create
const QUICK_CREATE_TYPES = [
  'Blog Post', 'Social Media Post', 'Email', 'Landing Page', 'Case Study', 'White Paper'
];

// Sample recent projects - in a real app, these would come from a database
const SAMPLE_RECENT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Q1 Product Launch',
    type: 'Campaign',
    lastUpdated: '2025-03-01',
    contentCount: 6
  },
  {
    id: 'proj-2',
    name: 'Industry Trends Report',
    type: 'Blog Series',
    lastUpdated: '2025-02-28',
    contentCount: 3
  },
  {
    id: 'proj-3',
    name: 'Email Newsletter',
    type: 'Weekly Content',
    lastUpdated: '2025-02-25',
    contentCount: 4
  }
];

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
  
  const [isFromCampaignBuilder, setIsFromCampaignBuilder] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [recentProjects, setRecentProjects] = useState(SAMPLE_RECENT_PROJECTS);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, campaign
  
  // Process query params from campaign builder
  useEffect(() => {
    if (source === 'campaign-builder' && selectedAssets) {
      setIsFromCampaignBuilder(true);
      setActiveView('campaign');
      try {
        const parsedAssets = JSON.parse(selectedAssets as string);
        const parsedDetails = assetDetails ? JSON.parse(assetDetails as string) : {};
        
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

  // Handle navigation to a specific tool
  const navigateToTool = (toolId) => {
    const tool = CONTENT_TOOLS.find(t => t.id === toolId);
    if (tool) {
      router.push(tool.path);
    }
  };

  // Handle quick create for a content type
  const handleQuickCreate = (contentType) => {
    router.push({
      pathname: '/content-creator',
      query: { type: contentType }
    });
  };

  // Dashboard view - main hub interface
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Content Creation Tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Content Creation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTENT_TOOLS.map(tool => (
            <Card 
              key={tool.id} 
              className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigateToTool(tool.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="p-3 bg-blue-50 rounded-lg mr-4">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                    <p className="text-slate-600 text-sm">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Create Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Create</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {QUICK_CREATE_TYPES.map(type => (
            <Card 
              key={type} 
              className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleQuickCreate(type)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Plus className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium">{type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map(project => (
              <Card 
                key={project.id}
                className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Last updated: {project.lastUpdated}</span>
                    <span>{project.contentCount} content items</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create New Campaign Button */}
      <div className="text-center mt-8">
        <button 
          onClick={() => router.push('/campaign-builder')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
        >
          <Target className="w-5 h-5 mr-2" />
          Create New Campaign
        </button>
      </div>
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
          {campaignData.selectedAssets && campaignData.selectedAssets.map((asset, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{asset}</span>
                  {asset === 'Email Sequence' && campaignData.assetDetails && campaignData.assetDetails[asset]?.variations > 1 && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {campaignData.assetDetails[asset].variations} emails
                    </span>
                  )}
                  {(asset === 'Social Media' || asset === 'Paid Ads') && campaignData.assetDetails && campaignData.assetDetails[asset]?.variations > 1 && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {campaignData.assetDetails[asset].variations} variations
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  {campaignData.assetDetails && campaignData.assetDetails[asset]?.description || 'No description provided'}
                </p>
                <button 
                  onClick={() => {
                    const toolPath = asset === 'Email Sequence' ? '/content-creator' :
                                    asset === 'Social Media' ? '/content-creator' :
                                    '/content-creator';
                    router.push({
                      pathname: toolPath,
                      query: {
                        type: asset,
                        campaignId: campaignData.name,
                        goal: campaignData.goal,
                        audience: campaignData.target
                      }
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full flex items-center justify-center"
                >
                  <span className="text-yellow-300 mr-2">✨</span>
                  Create {asset}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push('/campaign-builder')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back to Campaign Builder
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Creation Hub
          </button>
        </div>
      </div>
    );
  };

  // Determine which view to render
  const renderContent = () => {
    if (isFromCampaignBuilder && activeView === 'campaign') {
      return renderCampaignCreationHub();
    } else {
      return renderDashboard();
    }
  };

  // Use a simpler layout without ScreenTemplate since we're having issues with it
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isFromCampaignBuilder ? `Creating ${campaignData?.name || 'Campaign'}` : "Content Creation Hub"}
        </h1>
        <p className="text-gray-600">
          {isFromCampaignBuilder 
            ? `Let's create all the assets for your campaign` 
            : "Create and manage your marketing content with AI assistance"
          }
        </p>
        
        {/* AI Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-2 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            AI Insights
          </h3>
          <ul className="space-y-2">
            {isFromCampaignBuilder ? [
              "Your campaign contains multiple assets that work together",
              "We'll maintain consistent messaging across all content",
              "Each asset will be optimized for its specific format"
            ] : [
              "Choose from various content tools to meet your specific needs",
              "Use quick create options for common content types",
              "Maintain consistent messaging across your marketing materials"
            ].map((insight, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default CreationHub;