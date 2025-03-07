// src/pages/campaign-builder.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { PlusCircle, CheckCircle, ChevronRight, Calendar, Target, MessageCircle } from 'lucide-react';

// Campaign types that users can create
const CAMPAIGN_TYPES = [
  {
    id: 'email',
    name: 'Email Campaign',
    description: 'Create a series of emails to nurture leads',
    icon: <MessageCircle className="w-8 h-8 text-blue-500" />
  },
  {
    id: 'content',
    name: 'Content Campaign',
    description: 'Create coordinated content across multiple channels',
    icon: <Target className="w-8 h-8 text-green-500" />
  },
  {
    id: 'event',
    name: 'Event Campaign',
    description: 'Create pre and post-event marketing materials',
    icon: <Calendar className="w-8 h-8 text-purple-500" />
  }
];

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

  // Available marketing channels
  const CHANNELS = [
    'Email', 'Social Media', 'Blog', 'Webinar', 'Website', 'Paid Ads'
  ];

  // Handle channel selection
  const toggleChannel = (channel: string) => {
    setCampaignChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
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
      setStep(4); // Move to review step
    }, 2000);
  };

  // Step 1: Campaign Type Selection
  const renderTypeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choose Campaign Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAMPAIGN_TYPES.map(type => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              campaignType === type.id ? 'border-2 border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setCampaignType(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {type.icon}
                <h3 className="mt-4 font-semibold">{type.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setStep(2)}
          disabled={!campaignType}
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
      <h2 className="text-xl font-semibold">Campaign Details</h2>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter campaign name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Goal</label>
            <select
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select a goal</option>
              <option value="awareness">Brand Awareness</option>
              <option value="lead_generation">Lead Generation</option>
              <option value="conversion">Conversion</option>
              <option value="retention">Customer Retention</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Describe your target audience"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
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
          disabled={!campaignName || !campaignGoal}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Continue <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
  
  // Step 3: Campaign Channels and Messages
  const renderChannelsAndMessages = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Campaign Channels & Messages</h2>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Marketing Channels</h3>
            <p className="text-sm text-gray-600 mb-4">Select all channels you want to include in this campaign:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CHANNELS.map(channel => (
                <div
                  key={channel}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    campaignChannels.includes(channel) 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'hover:border-blue-300'
                  }`}
                  onClick={() => toggleChannel(channel)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                      campaignChannels.includes(channel) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {campaignChannels.includes(channel) && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span>{channel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Key Messages</h3>
            <p className="text-sm text-gray-600 mb-4">Define the core messages for this campaign:</p>
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
      
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={generateCampaignContent}
          disabled={campaignChannels.length === 0 || keyMessages.some(msg => !msg.trim()) || isGenerating}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? 'Generating...' : 'Generate Campaign'}
        </button>
      </div>
    </div>
  );
  
  // Step 4: Review step
  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Campaign Name</h4>
                <p>{campaignName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Campaign Type</h4>
                <p>{CAMPAIGN_TYPES.find(t => t.id === campaignType)?.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Goal</h4>
                <p>{campaignGoal}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Target Audience</h4>
                <p>{targetAudience}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Timeline</h4>
                <p>{startDate} to {endDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Channels</h4>
                <p>{campaignChannels.join(', ')}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Key Messages</h4>
              <ul className="list-disc list-inside mt-2">
                {keyMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Campaign Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentPieces.map((content, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{content.type}</span>
                    <h4 className="font-medium mt-2">{content.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full h-fit">
                    {content.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => alert('Campaign created! Redirecting to Content Hub...')}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
  
  // Render the current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderTypeSelection();
      case 2:
        return renderCampaignDetails();
      case 3:
        return renderChannelsAndMessages();
      case 4:
        return renderReviewStep();
      default:
        return renderTypeSelection();
    }
  };

  return (
    <ScreenTemplate
      title="Campaign Builder"
      subtitle="Create coordinated marketing campaigns across multiple channels"
      aiInsights={[
        "Email campaigns with 5-7 touchpoints typically see the highest conversion rates",
        "Including social media as a supporting channel can increase engagement by 30%",
        "Campaigns with consistent messaging across all channels perform 40% better"
      ]}
      hideNavigation={true} // Add this to hide the walkthrough navigation
    >
      {renderCurrentStep()}
    </ScreenTemplate>
  );
};

export default CampaignBuilder;