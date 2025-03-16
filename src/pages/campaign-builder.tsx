// src/pages/campaign-builder.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { PlusCircle, CheckCircle, ChevronRight, Calendar, Target, MessageCircle, Sparkles } from 'lucide-react';
import { CONTENT_TYPES } from '../data/contentTypesData';
import { useContent } from '../context/ContentContext';

// Goal recommendations mapping
const GOAL_RECOMMENDATIONS = {
  'awareness': {
    contentTypes: ['Blog Posts', 'Social Posts', 'Video Scripts'],
    channels: ['Social Media', 'Blog', 'Website'],
    insights: [
      "Brand awareness campaigns perform best with consistent visual identity across all assets",
      "Educational content typically outperforms promotional content for awareness goals",
      "Video content generates 157% more organic search traffic for awareness campaigns"
    ]
  },
  'lead_generation': {
    contentTypes: ['eBooks & White Papers', 'Landing Pages', 'Case Studies'],
    channels: ['Email', 'Paid Ads', 'Webinar'],
    insights: [
      "eBooks with clear value propositions convert 32% better than generic lead magnets",
      "Multi-step email nurture campaigns outperform single touchpoint campaigns by 48%",
      "Including customer testimonials improves landing page conversion rates by 34%"
    ]
  },
  'conversion': {
    contentTypes: ['Case Studies', 'Email Campaigns', 'Digital Ads'],
    channels: ['Email', 'Webinar', 'Paid Ads'],
    insights: [
      "Case studies with specific ROI metrics improve conversion rates by 27%",
      "Personalized email sequences increase conversion rates by up to 41%",
      "Ad copy addressing specific objections performs 58% better than generic messaging"
    ]
  },
  'retention': {
    contentTypes: ['Email Campaigns', 'Blog Posts', 'Case Studies'],
    channels: ['Email', 'Social Media', 'Webinar'],
    insights: [
      "Regular email updates increase customer retention rates by 29% on average",
      "Exclusive content for existing customers boosts engagement by 45%",
      "Product usage blogs and tips can improve customer satisfaction by 23%"
    ]
  }
};

// Campaign types that users can create
const CAMPAIGN_TYPES = [
  {
    id: 'awareness',
    name: 'Brand Awareness',
    description: 'Increase visibility and recognition of your brand',
    icon: <Target className="w-8 h-8 text-blue-500" />
  },
  {
    id: 'lead_generation',
    name: 'Lead Generation',
    description: 'Capture interest and information from potential customers',
    icon: <PlusCircle className="w-8 h-8 text-green-500" />
  },
  {
    id: 'conversion',
    name: 'Conversion',
    description: 'Turn leads into customers with targeted messaging',
    icon: <CheckCircle className="w-8 h-8 text-orange-500" />
  },
  {
    id: 'retention',
    name: 'Customer Retention',
    description: 'Keep existing customers engaged and loyal',
    icon: <MessageCircle className="w-8 h-8 text-purple-500" />
  }
];

// Available marketing channels
const CHANNELS = [
  'Email', 'Social Media', 'Blog', 'Webinar', 'Website', 'Paid Ads'
];

// Campaign type recommendations
const CAMPAIGN_TYPE_RECOMMENDATIONS = {
  'awareness': {
    contentTypes: ['Blog Posts', 'Social Posts', 'Video Scripts'],
    description: 'Brand awareness campaigns perform best with content that educates your audience and establishes your expertise.',
    insights: [
      "Visual consistency across all campaign assets increases brand recall by 49%",
      "Educational content performs 31% better than promotional content for awareness goals",
      "Thought leadership pieces are shared 3x more than product-focused content"
    ]
  },
  'lead_generation': {
    contentTypes: ['eBooks & White Papers', 'Case Studies', 'Landing Pages'],
    description: 'Lead generation campaigns need valuable content that motivates prospects to share their information.',
    insights: [
      "Gated content with clear value propositions converts 32% better",
      "Case studies are the most effective content type for B2B lead generation",
      "Interactive content generates 2x more conversions than static content"
    ]
  },
  'conversion': {
    contentTypes: ['Case Studies', 'Email Campaigns', 'Digital Ads'],
    description: 'Conversion campaigns should focus on addressing objections and demonstrating clear value.',
    insights: [
      "Case studies with specific ROI metrics improve conversion rates by 27%",
      "Personalized content sequences increase conversion rates by up to 41%",
      "Comparison content addressing objections converts 38% better than purely promotional content"
    ]
  },
  'retention': {
    contentTypes: ['Email Campaigns', 'Blog Posts', 'Case Studies'],
    description: 'Retention campaigns should provide ongoing value and strengthen the relationship with customers.',
    insights: [
      "Customer education content increases retention rates by 29% on average",
      "Exclusive content for existing customers boosts engagement by 45%",
      "Regular company updates and product news can improve retention by 23%"
    ]
  }
};

const CampaignBuilder: React.FC = () => {
  // State for campaign details
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [campaignChannels, setCampaignChannels] = useState<string[]>([]);
  const [keyMessages, setKeyMessages] = useState<string[]>(['']);
  const [contentPieces, setContentPieces] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [goalInsights, setGoalInsights] = useState<string[]>([]);
  const [campaignTypeInsights, setCampaignTypeInsights] = useState<string[]>([]);
  const [recommendedContentTypes, setRecommendedContentTypes] = useState<string[]>([]);

  // Content type selection state
  const { selectedContentTypes, setSelectedContentTypes } = useContent();

  // Clean up selected content types when component unmounts
  useEffect(() => {
    return () => {
      setSelectedContentTypes([]);
    };
  }, [setSelectedContentTypes]);

  // Handle campaign type selection
  const handleSelectCampaignType = (typeId: string) => {
    console.log("Setting campaign type to:", typeId);
    setCampaignType(typeId);
    if (CAMPAIGN_TYPE_RECOMMENDATIONS[typeId]) {
      setRecommendedContentTypes(CAMPAIGN_TYPE_RECOMMENDATIONS[typeId].contentTypes);
      setCampaignTypeInsights(CAMPAIGN_TYPE_RECOMMENDATIONS[typeId].insights);
    } else {
      setRecommendedContentTypes([]);
      setCampaignTypeInsights([]);
    }
  };

  // Handle goal selection with recommendations
  const handleGoalChange = (goalValue: string) => {
    setCampaignGoal(goalValue);
    
    if (goalValue && GOAL_RECOMMENDATIONS[goalValue]) {
      // Auto-suggest recommended content types (without forcing selection)
      const recommendedTypes = GOAL_RECOMMENDATIONS[goalValue].contentTypes;
      console.log("Recommending content types for goal:", recommendedTypes);
      
      // Update AI insights based on goal
      setGoalInsights(GOAL_RECOMMENDATIONS[goalValue].insights);
      
      // Pre-select recommended channels
      setCampaignChannels(GOAL_RECOMMENDATIONS[goalValue].channels);
    } else {
      setGoalInsights([]);
    }
  };

  // Calculate campaign effectiveness score
  const calculateCampaignEffectivenessScore = () => {
    if (!campaignGoal) return 0;
    
    let score = 70; // Base score
    const recommendations = GOAL_RECOMMENDATIONS[campaignGoal];
    
    // Check if recommended content types are selected
    if (recommendations) {
      // +5 points for each recommended content type that's selected
      recommendations.contentTypes.forEach(type => {
        if (selectedContentTypes.includes(type)) {
          score += 5;
        }
      });
      
      // +3 points for each recommended channel that's selected
      recommendations.channels.forEach(channel => {
        if (campaignChannels.includes(channel)) {
          score += 3;
        }
      });
    }
    
    // Points for completeness
    if (campaignName.length > 5) score += 2;
    if (targetAudience.length > 10) score += 3;
    if (keyMessages.length >= 3) score += 5;
    if (startDate && endDate) score += 2;
    
    // Cap at 100
    return Math.min(score, 100);
  };

  // Handle channel selection
  const toggleChannel = (channel: string) => {
    setCampaignChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Toggle content type selection (same as Content Strategy module)
  const toggleContentType = (typeName: string) => {
    console.log("Toggling content type:", typeName);
    setSelectedContentTypes((prev: string[]) => {
      const newTypes = prev.includes(typeName)
        ? prev.filter((name: string) => name !== typeName)
        : [...prev, typeName];
      console.log("New selected types:", newTypes);
      return newTypes;
    });
  };

  // Handle key message updates
  const updateKeyMessage = (index: number, value: string) => {
    setKeyMessages(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Add a new key message field
  const addKeyMessage = () => {
    setKeyMessages(prev => [...prev, '']);
  };

  // Generate campaign content
  const generateCampaignContent = () => {
    setIsGenerating(true);
    
    // Simulate content generation with timeout
    setTimeout(() => {
      // Example generated content
      const generatedContent = [
        {
          type: 'Email',
          name: 'Welcome Email',
          status: 'draft',
          description: 'Introduction to campaign and value proposition'
        },
        {
          type: 'Email',
          name: 'Feature Highlight',
          status: 'draft',
          description: 'Showcase key features and benefits'
        },
        {
          type: 'Social Media',
          name: 'Campaign Announcement',
          status: 'draft',
          description: 'Social media posts announcing the campaign'
        },
        {
          type: 'Blog',
          name: 'In-depth Article',
          status: 'draft',
          description: 'Detailed blog post about the campaign topic'
        }
      ];
      
      setContentPieces(generatedContent);
      setIsGenerating(false);
    }, 2000);
  };

  // Step 1: Campaign Type Selection
  const renderTypeSelection = () => (
    <div className="space-y-6">
      {/* Campaign Type Section */}
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-700">Campaign Type</h2>
        </div>
      </div>
      
      {/* Campaign type selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {CAMPAIGN_TYPES.map(type => (
         <div
         key={type.id}
         className={`p-6 cursor-pointer transition-all rounded-lg ${
           campaignType === type.id
             ? 'border-2 border-blue-500 shadow-md bg-white' // Changed to outline style
             : 'border border-gray-200 hover:border-blue-300 bg-white'
         }`}
         onClick={() => handleSelectCampaignType(type.id)}
       >
            <div className="flex items-start gap-4">
              <div className={campaignType === type.id ? 'text-white' : ''}>
                {type.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className={`text-sm ${campaignType === type.id ? 'text-black-100' : 'text-slate-600'}`}>
                  {type.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Campaign type-specific recommendations moved here, right after selection */}
      {campaignType && (
        <div className="mb-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-blue-800">AI Campaign Recommendations</h3>
          </div>
          
          <p className="text-blue-800 mb-3">
            {CAMPAIGN_TYPE_RECOMMENDATIONS[campaignType]?.description}
          </p>
          
          <div className="mb-4">
            <h4 className="text-base font-medium text-blue-700 mb-2">Recommended Content Types:</h4>
            <div className="flex flex-wrap gap-2">
              {CAMPAIGN_TYPE_RECOMMENDATIONS[campaignType]?.contentTypes.map(type => (
                <button
                  key={type}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedContentTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  onClick={() => {
                    if (!selectedContentTypes.includes(type)) {
                      setSelectedContentTypes(prev => [...prev, type]);
                    }
                  }}
                >
                  {type} {selectedContentTypes.includes(type) ? '✓' : '+'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-blue-700 mb-2">Campaign Insights:</h4>
            <ul className="space-y-1">
              {CAMPAIGN_TYPE_RECOMMENDATIONS[campaignType]?.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-blue-800 text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Content Types Section */}
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-700">Content Types</h2>
        </div>
      </div>
      
      {/* Content type selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CONTENT_TYPES).map(([type, details]) => (
          <Card
            key={type}
            className={`p-6 cursor-pointer transition-all ${
              selectedContentTypes.includes(type)
                ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                : 'border border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => toggleContentType(type)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold mb-2">{type}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedContentTypes.includes(type)
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedContentTypes.includes(type) && (
                  <span className="text-white">✓</span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">{details.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2 mb-4">
              {details.activities.slice(0, 3).map((activity: string) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-8">
        <button
          onClick={() => setStep(2)}
          disabled={!campaignType || selectedContentTypes.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Continue <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
  
  // Step 2: Campaign Details
  const renderCampaignDetails = () => (
    <div className="space-y-6">
      {/* Cleaner section header for Campaign Details */}
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-700">Campaign Details</h2>
        </div>
      </div>

      {/* Selected Content Summary */}
      <Card className="mb-6 bg-blue-50 border-blue-100">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Your Campaign Setup</h3>
          
          <div className="space-y-3">
            <div className="flex">
              <span className="font-medium text-blue-700 w-32">Campaign Type:</span>
              <span className="text-blue-700">{CAMPAIGN_TYPES.find(t => t.id === campaignType)?.name}</span>
            </div>
            
            <div className="flex items-start">
              <span className="font-medium text-blue-700 w-32">Content Types:</span>
              <div className="flex flex-wrap gap-1">
                {selectedContentTypes.map(type => (
                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter a descriptive name for your campaign"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-2 border rounded-lg h-24"
              placeholder="Describe who this campaign is targeting (job titles, industries, pain points, etc.)"
            />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!campaignName}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Continue <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
  
  // Step 3: Content Generation
  const renderContentGeneration = () => {
    return (
      <div className="space-y-6">
        {/* Section header for Messages & Content */}
        <div className="mb-6 border-2 border-blue-900 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
          <div className="p-4">
            <h2 className="text-lg font-bold text-blue-700">Campaign Messages & Content</h2>
          </div>
        </div>

        {/* Campaign Summary */}
        <Card className="mb-6 bg-blue-50 border-blue-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Campaign Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <span className="font-medium text-blue-700">Name:</span>
                <span className="ml-2 text-blue-900">{campaignName}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Type:</span>
                <span className="ml-2 text-blue-900">{CAMPAIGN_TYPES.find(t => t.id === campaignType)?.name}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Audience:</span>
                <span className="ml-2 text-blue-900">{targetAudience}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <span className="font-medium text-blue-700">Content Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedContentTypes.map(type => (
                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Key Messages</h3>
              <p className="text-sm text-gray-600 mb-4">Define the core messages that will be used across all content:</p>
              <div className="space-y-3">
                {keyMessages.map((message, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => updateKeyMessage(index, e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder={`Key message ${index + 1}`}
                    />
                  </div>
                ))}
                <button
                  onClick={addKeyMessage}
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add another message
                </button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Content Generation Card */}
        <Card className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Generate Content</h3>
            
            {isGenerating ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Generating your campaign content...</p>
              </div>
            ) : contentPieces.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium">Generated Content</h4>
                <div className="space-y-4">
                  {contentPieces.map((content, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{content.type}</span>
                          <h4 className="font-medium mt-2">{content.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full mr-2">
                            {content.status}
                          </span>
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => alert(`Editing ${content.name}`)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateCampaignContent}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Regenerate Content
                </button>
              </div>
            ) : (
              <div>
                {/* Generate All Content Button */}
                <button
                  onClick={generateCampaignContent}
                  disabled={keyMessages.some(msg => !msg.trim())}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center mb-6"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate All Campaign Content
                </button>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Or generate content by type:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedContentTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          // Function to generate just a single content type
                          alert(`Generating ${type} content`);
                        }}
                        className="p-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center justify-center"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(2)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          {contentPieces.length > 0 && (
            <button
              onClick={() => alert('Campaign created! Redirecting to Content Hub...')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save & Exit
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Render the current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderTypeSelection();
      case 2:
        return renderCampaignDetails();
      case 3:
        return renderContentGeneration();
      default:
        return renderTypeSelection();
    }
  };

  return (
    <ScreenTemplate
      title="Campaign Builder"
      subtitle="Create coordinated marketing campaigns across multiple channels"
      hideNavigation={true}
    >
      {renderCurrentStep()}
    </ScreenTemplate>
  );
};

export default CampaignBuilder;