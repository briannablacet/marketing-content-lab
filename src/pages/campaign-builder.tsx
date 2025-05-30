// src/pages/campaign-builder.tsx
// This component handles the campaign creation process across multiple steps

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ScreenTemplate from '@/components/shared/UIComponents';
import { PlusCircle, CheckCircle, ChevronRight, Calendar, Target, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';
import { CONTENT_TYPES } from '@/data/contentTypesData';
import { useContent } from '@/context/ContentContext';
import ContentPreview from '@/components/features/ContentEngine/screens/ContentPreview';
import StyleGuideNotificationBanner from '@/components/features/StyleGuideNotificationBanner';
import { WritingStyleProvider, useWritingStyle } from '@/context/WritingStyleContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { MessagingProvider } from '@/context/MessagingContext';

// Goal recommendations mapping
const GOAL_RECOMMENDATIONS = {
  'awareness': {
    contentTypes: ['Blog Posts', 'Social Posts', 'Video Scripts', 'Web Pages'],
    channels: ['Social Media', 'Blog', 'Website'],
    insights: [
      "Brand awareness campaigns perform best with consistent visual identity across all assets",
      "Educational content typically outperforms promotional content for awareness goals",
      "Video content generates 157% more organic search traffic for awareness campaigns"
    ]
  },
  'lead_generation': {
    contentTypes: ['eBooks & White Papers', 'Landing Pages', 'Case Studies', 'Web Pages'],
    channels: ['Email', 'Paid Ads', 'Webinar'],
    insights: [
      "eBooks with clear value propositions convert 32% better than generic lead magnets",
      "Multi-step email nurture campaigns outperform single touchpoint campaigns by 48%",
      "Including customer testimonials improves landing page conversion rates by 34%"
    ]
  },
  'conversion': {
    contentTypes: ['Case Studies', 'Email Campaigns', 'Digital Ads', 'Landing Pages'],
    channels: ['Email', 'Webinar', 'Paid Ads'],
    insights: [
      "Case studies with specific ROI metrics improve conversion rates by 27%",
      "Personalized email sequences increase conversion rates by up to 41%",
      "Ad copy addressing specific objections performs 58% better than generic messaging"
    ]
  },
  'retention': {
    contentTypes: ['Email Campaigns', 'Blog Posts', 'Case Studies', 'Internal Email Comms'],
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
    contentTypes: ['Blog Posts', 'Social Posts', 'Video Scripts', 'Web Pages'],
    description: 'Brand awareness campaigns perform best with content that educates your audience and establishes your expertise.',
    insights: [
      "Visual consistency across all campaign assets increases brand recall by 49%",
      "Educational content performs 31% better than promotional content for awareness goals",
      "Thought leadership pieces are shared 3x more than product-focused content"
    ]
  },
  'lead_generation': {
    contentTypes: ['eBooks & White Papers', 'Case Studies', 'Landing Pages', 'Web Pages'],
    description: 'Lead generation campaigns need valuable content that motivates prospects to share their information.',
    insights: [
      "Gated content with clear value propositions converts 32% better",
      "Case studies are the most effective content type for B2B lead generation",
      "Interactive content generates 2x more conversions than static content"
    ]
  },
  'conversion': {
    contentTypes: ['Case Studies', 'Email Campaigns', 'Digital Ads', 'Landing Pages'],
    description: 'Conversion campaigns should focus on addressing objections and demonstrating clear value.',
    insights: [
      "Case studies with specific ROI metrics improve conversion rates by 27%",
      "Personalized content sequences increase conversion rates by up to 41%",
      "Comparison content addressing objections converts 38% better than purely promotional content"
    ]
  },
  'retention': {
    contentTypes: ['Email Campaigns', 'Blog Posts', 'Case Studies', 'Internal Email Comms'],
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
  // Add state for showing reset button and tracking reset status
  const [showResetButton, setShowResetButton] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  // Add state to track whether we've saved campaign data
  const [hasSavedCampaign, setHasSavedCampaign] = useState(false);

  // Add this ref to track the newly added input field
  const newMessageInputRef = useRef<HTMLInputElement>(null);

  // Content type selection state
  const { selectedContentTypes, setSelectedContentTypes } = useContent();

  // Writing style state
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // Load any existing campaign data on mount
  useEffect(() => {
    try {
      const savedCampaign = localStorage.getItem('currentCampaign');
      if (savedCampaign) {
        const campaignData = JSON.parse(savedCampaign);

        // Only update state with saved values if they exist
        if (campaignData.type) setCampaignType(campaignData.type);
        if (campaignData.name) setCampaignName(campaignData.name);
        if (campaignData.goal) setCampaignGoal(campaignData.goal);
        if (campaignData.targetAudience) setTargetAudience(campaignData.targetAudience);
        if (campaignData.keyMessages && campaignData.keyMessages.length > 0) {
          setKeyMessages(campaignData.keyMessages);
        }
        if (campaignData.channels) setCampaignChannels(campaignData.channels);

        // Update selected content types in context
        if (campaignData.contentTypes && campaignData.contentTypes.length > 0) {
          setSelectedContentTypes(campaignData.contentTypes);
        }

        // Set campaign type insights if a type is loaded
        if (campaignData.type && CAMPAIGN_TYPE_RECOMMENDATIONS[campaignData.type]) {
          setRecommendedContentTypes(CAMPAIGN_TYPE_RECOMMENDATIONS[campaignData.type].contentTypes);
          setCampaignTypeInsights(CAMPAIGN_TYPE_RECOMMENDATIONS[campaignData.type].insights);
        }

        // Mark as having saved campaign if we loaded data
        setHasSavedCampaign(true);

        console.log("Loaded existing campaign data:", campaignData);
      }
    } catch (err) {
      console.error("Error loading saved campaign:", err);
    }
  }, []);

  // More aggressive clearing function
  const clearAllStorageAndState = () => {
    setIsResetting(true);
    console.log("STARTING COMPLETE RESET...");

    // 1. Clear all localStorage items that might be related
    try {
      localStorage.removeItem('marketing-content-lab-content-settings');
      localStorage.removeItem('currentCampaign');
      localStorage.removeItem('contentLibrary');
      localStorage.removeItem('marketingSeoKeywords');
      localStorage.removeItem('marketingMessages');
      localStorage.removeItem('marketingProgramState');

      // Clear any other potential items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('marketing') || key.includes('content'))) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log("localStorage items cleared:", keysToRemove);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }

    // 2. Reset context state
    if (setSelectedContentTypes) {
      setSelectedContentTypes([]);
      console.log("Context state reset");
    }

    // 3. Reset all component state
    setCampaignType(null);
    setCampaignName('');
    setCampaignGoal('');
    setTargetAudience('');
    setStartDate('');
    setEndDate('');
    setCampaignChannels([]);
    setKeyMessages(['']);
    setContentPieces([]);
    setRecommendedContentTypes([]);
    setCampaignTypeInsights([]);
    setGoalInsights([]);
    setHasSavedCampaign(false);

    console.log("Local state reset");

    // 4. Reset the step back to 1
    setStep(1);

    // 5. Hide reset button after successful reset
    setShowResetButton(false);
    setIsResetting(false);

    console.log("RESET COMPLETED");
  };

  // Add a useEffect to focus on newly added input field
  useEffect(() => {
    // Check if the ref is assigned and if it's the last element in the keyMessages array
    if (newMessageInputRef.current && keyMessages.length > 1) {
      // Focus on the newly added input field
      newMessageInputRef.current.focus();
    }
  }, [keyMessages.length]); // This effect runs when the length of keyMessages changes

  console.log("Current state:", {
    step: step,
    campaignType: campaignType,
    typeName: campaignType ? CAMPAIGN_TYPES.find(t => t.id === campaignType)?.name : 'none',
    selectedContentTypes: selectedContentTypes,
    hasSavedCampaign: hasSavedCampaign
  });

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

  // Find campaign type name for display
  const getCampaignTypeName = () => {
    if (!campaignType) return "Not Selected";
    const found = CAMPAIGN_TYPES.find(t => t.id === campaignType);
    return found ? found.name : "Unknown Type";
  };

  // Save campaign data with writing style info
  const saveCampaignData = () => {
    const campaignData = {
      type: campaignType,
      name: campaignName,
      goal: campaignGoal,
      targetAudience,
      keyMessages,
      channels: campaignChannels,
      contentTypes: selectedContentTypes,
      writingStyle: writingStyle // Include writing style data
    };

    localStorage.setItem('currentCampaign', JSON.stringify(campaignData));
    setHasSavedCampaign(true);
    console.log("Saved campaign data:", campaignData);
  };

  // Step 1: Campaign Type and Content Type Selection
  const renderTypeAndContentSelection = () => (
    <div className="space-y-6">
      {/* Reset Button */}
      {showResetButton && (
        <button
          onClick={clearAllStorageAndState}
          disabled={isResetting}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center mb-4"
        >
          {isResetting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Resetting...
            </>
          ) : (
            <>Reset Campaign Builder</>
          )}
        </button>
      )}

      {/* Campaign Type Section */}
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold">1</span>
          <h2 className="text-lg font-bold text-blue-700">Campaign Type</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">First, select your campaign type to determine the best content strategy for your goals.</p>
        </div>
      </div>

      {/* Campaign type selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {CAMPAIGN_TYPES.map(type => (
          <div
            key={type.id}
            className={`p-6 cursor-pointer transition-all rounded-lg ${campaignType === type.id
              ? 'border-2 border-blue-500 shadow-md bg-white'
              : 'border border-gray-200 hover:border-blue-300 bg-white'
              }`}
            onClick={() => handleSelectCampaignType(type.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="campaignType"
                  checked={campaignType === type.id}
                  onChange={() => handleSelectCampaignType(type.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className={campaignType === type.id ? 'text-blue-500' : ''}>
                {type.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className={`text-sm ${campaignType === type.id ? 'text-blue-900' : 'text-slate-600'}`}>
                  {type.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Types Section */}
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold">2</span>
          <h2 className="text-lg font-bold text-blue-700">Content Types</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">Next, select the content types you want to create for this campaign.</p>
        </div>
      </div>

      {/* Content type selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CONTENT_TYPES).map(([type, details]) => (
          <Card
            key={type}
            className={`p-6 cursor-pointer transition-all ${selectedContentTypes.includes(type)
              ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
              : 'border border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => toggleContentType(type)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold mb-2">{type}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedContentTypes.includes(type)
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

  // Step 2: Campaign Details and Messages (Combined)
  const renderCampaignDetailsAndMessages = () => (
    <div className="space-y-6">
      {/* Campaign Details Section */}
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
            <div className="flex items-start">
              <span className="font-medium text-blue-700 w-32">Campaign Type:</span>
              <span className="text-blue-700">{getCampaignTypeName()}</span>
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

      {/* Campaign Details Card */}
      <Card className="p-6 mb-6">
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

      {/* Key Messages Section */}
      <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-blue-900 h-2"></div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-700">Key Messages</h2>
        </div>
      </div>

      {/* Key Messages Card */}
      <Card className="p-6 mb-6">
        <div className="space-y-6">
          <div>
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
                    // Add ref to the last input element
                    ref={index === keyMessages.length - 1 ? newMessageInputRef : null}
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

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => {
            saveCampaignData();
            setStep(3);
          }}
          disabled={!campaignName || keyMessages[0].trim() === ''}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Continue to Content Generation <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Render the current step
  const renderCurrentStep = () => {
    console.log("Rendering step:", step);

    switch (step) {
      case 1:
        return renderTypeAndContentSelection();
      case 2:
        return renderCampaignDetailsAndMessages();
      case 3:
        // Ensure we have saved campaign data before rendering ContentPreview
        if (!hasSavedCampaign) {
          console.log("No saved campaign data, going back to step 2");
          setStep(2);
          return renderCampaignDetailsAndMessages();
        }
        console.log("Rendering ContentPreview component");
        return <ContentPreview />;
      default:
        console.log("Default case, rendering step 1");
        return renderTypeAndContentSelection();
    }
  };

  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MessagingProvider>
      {/* Place the StyleGuideNotificationBanner before ScreenTemplate */}
      <StyleGuideNotificationBanner />

      <ScreenTemplate
        title="Campaign Builder"
        subtitle="Create coordinated marketing campaigns across multiple channels"
        hideNavigation={true}
      >
        {renderCurrentStep()}
      </ScreenTemplate>
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default CampaignBuilder;