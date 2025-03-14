// src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Upload, FileText, X, Sparkles, Plus, Lightbulb, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';

type Option = 'manual' | 'upload' | 'ai';
type AIStep = 'review' | 'focus' | 'generate' | 'results';

interface AIGenerationData {
  productDescription: string;
  targetAudience: string;
  uniqueValue: string;
  competitors: string;
  focusAreas: string[];
  tone: string;
}

interface MessageData {
  valueProposition: string;
  differentiators: string[];
  keyBenefits: string[];
}

const FOCUS_AREAS = [
  { id: 'technical', label: 'Technical Excellence', description: 'Emphasize technical capabilities and innovation' },
  { id: 'business', label: 'Business Value', description: 'Focus on ROI and business outcomes' },
  { id: 'user', label: 'User Benefits', description: 'Highlight end-user advantages and experience' },
  { id: 'market', label: 'Market Position', description: 'Emphasize market leadership and differentiation' }
];

const TONE_OPTIONS = [
  { id: 'professional', label: 'Professional & Authoritative' },
  { id: 'friendly', label: 'Friendly & Approachable' },
  { id: 'innovative', label: 'Innovative & Forward-thinking' },
  { id: 'trusted', label: 'Trusted & Established' }
];

interface MessagingStepProps {
  onNext?: () => void;
  onBack?: () => void;
  isWalkthrough?: boolean;
}

const MessagingStep: React.FC<MessagingStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const { showNotification } = useNotification();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [aiStep, setAiStep] = useState<AIStep>('review');
  
  const [messages, setMessages] = useState<MessageData>({
    valueProposition: '',
    differentiators: ['', '', ''],
    keyBenefits: ['', '', '']
  });
  
  const [uploadedFramework, setUploadedFramework] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  // New state for AI generation with default values
  const [aiData, setAiData] = useState<AIGenerationData>({
    productDescription: 'Marketing Content Lab is a Content Marketing Platform that helps businesses create effective content marketing strategies. Key benefits include: AI-powered content creation, streamlined planning, and consistent brand messaging.',
    targetAudience: 'Marketing Director in the Technology industry who faces challenges including: scaling content creation with limited resources, maintaining brand consistency across channels, measuring ROI of content efforts',
    uniqueValue: 'AI-powered marketing content creation and strategy that saves time while maintaining brand consistency',
    competitors: 'ContentCal, HubSpot, CoSchedule',
    focusAreas: [],
    tone: 'professional'
  });

  // Pre-populate the form with data from local storage (for non-AI path)
  useEffect(() => {
    const savedMessages = localStorage.getItem('marketingMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
    
    // Try to load product info from localStorage as well
    const productInfo = localStorage.getItem('marketingProduct');
    const targetAudience = localStorage.getItem('marketingTargetAudience');
    
    if (productInfo || targetAudience) {
      try {
        const product = productInfo ? JSON.parse(productInfo) : null;
        const audience = targetAudience ? JSON.parse(targetAudience) : null;
        
        if (product) {
          const productDescription = `${product.name || 'Our product'} is a ${product.type || 'solution'} that ${product.valueProposition || 'helps businesses'}. Key benefits include: ${(product.keyBenefits || []).join(', ') || 'various features'}`;
          setAiData(prev => ({
            ...prev,
            productDescription,
            uniqueValue: product.valueProposition || prev.uniqueValue
          }));
        }
        
        if (audience) {
          const audienceDescription = `${audience.role || 'Professionals'} in the ${audience.industry || 'various industries'} who face challenges including: ${(audience.challenges || []).join(', ') || 'multiple business challenges'}`;
          setAiData(prev => ({
            ...prev,
            targetAudience: audienceDescription
          }));
        }
      } catch (error) {
        console.error('Error parsing product or audience data:', error);
      }
    }
  }, []);

  const updateAiInsights = () => {
    const insights = [];
    
    if (messages.valueProposition) {
      if (messages.valueProposition.length < 50) {
        insights.push("Consider expanding your value proposition to better communicate your unique value.");
      }
      if (!messages.valueProposition.toLowerCase().includes('you') && 
          !messages.valueProposition.toLowerCase().includes('your')) {
        insights.push("Try making your value proposition more customer-centric by addressing them directly.");
      }
    }

    const filledDiffs = messages.differentiators.filter(d => d.trim());
    if (filledDiffs.length > 0) {
      const hasCompetitiveDiff = filledDiffs.some(d => 
        d.toLowerCase().includes('only') || 
        d.toLowerCase().includes('unique') || 
        d.toLowerCase().includes('first')
      );
      if (!hasCompetitiveDiff) {
        insights.push("Consider highlighting what makes you uniquely different from competitors.");
      }
    }

    const filledBenefits = messages.keyBenefits.filter(b => b.trim());
    if (filledBenefits.length > 0) {
      const hasMetrics = filledBenefits.some(b => 
        b.includes('%') || 
        /\d+/.test(b)
      );
      if (!hasMetrics) {
        insights.push("Try quantifying your benefits with specific metrics or statistics.");
      }
    }

    setAiInsights(insights);
  };

  useEffect(() => {
    updateAiInsights();
  }, [messages]);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    if (option === 'ai') {
      setAiStep('review');
    }
  };

  const handleFrameworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFramework(file);
      setSelectedOption('upload');
      showNotification('success', 'Messaging framework uploaded successfully');
      showNotification('info', 'Analyzing your messaging framework...');
    }
  };

  const handleGenerateMessages = async () => {
    setIsGenerating(true);
    try {
      // Prepare the API request
      const requestBody = {
        endpoint: 'value-proposition-generator',
        data: {
          productInfo: {
            name: 'Marketing Content Lab',
            description: aiData.productDescription,
            benefits: ['AI-powered content creation', 'Streamlined planning', 'Consistent brand messaging'],
            targetAudience: [aiData.targetAudience]
          },
          competitors: aiData.competitors.split(',').map(c => c.trim()),
          industry: 'Technology',
          focusAreas: aiData.focusAreas,
          tone: aiData.tone
        }
      };
      
      // Call the API
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API response to our message format
      setMessages({
        valueProposition: data.valueProposition || '',
        differentiators: data.keyDifferentiators || ['', '', ''],
        keyBenefits: Object.values(data.targetedMessages || {}).flat() || ['', '', '']
      });
      
      setAiStep('results');
      showNotification('success', 'Generated messaging framework based on your inputs');
    } catch (error) {
      console.error('Error generating messages:', error);
      showNotification('error', 'Failed to generate messages. Using fallback suggestions.');
      
      // Fallback messaging if API fails
      setMessages({
        valueProposition: `Our content marketing platform helps ${aiData.targetAudience.split(' in the ')[0] || 'marketing teams'} create effective content strategies faster and with more consistency.`,
        differentiators: [
          `Only platform combining ${aiData.focusAreas.includes('technical') ? 'advanced AI technology' : 'intuitive design'} with ease of use`,
          `Specialized for ${aiData.targetAudience.split(' in the ')[1]?.split(' who')[0] || 'marketing teams'} with tailored features`,
          `Proven to deliver faster results than alternatives`
        ],
        keyBenefits: [
          `Reduce content creation time by up to 50%`,
          `Gain deeper insights into your ${aiData.focusAreas.includes('business') ? 'content performance' : 'audience engagement'}`,
          `Improve team collaboration and content consistency across channels`
        ]
      });
      
      setAiStep('results');
    } finally {
      setIsGenerating(false);
    }
  };

  const addField = (field: 'differentiators' | 'keyBenefits') => {
    setMessages(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleMessageChange = (field: keyof MessageData, value: string | string[]) => {
    setMessages(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Save to localStorage for persistence
    const updatedMessages = {
      ...messages,
      [field]: value
    };
    
    localStorage.setItem('marketingMessages', JSON.stringify(updatedMessages));
  };

  const handleSingleMessageChange = (field: 'differentiators' | 'keyBenefits', index: number, value: string) => {
    const newArray = [...messages[field]];
    newArray[index] = value;
    handleMessageChange(field, newArray);
  };

  const removeField = (field: 'differentiators' | 'keyBenefits', index: number) => {
    const newArray = messages[field].filter((_, i) => i !== index);
    handleMessageChange(field, newArray);
  };

  const saveAndContinue = () => {
    // Basic validation
    if (!messages.valueProposition.trim()) {
      showNotification('error', 'Please provide a value proposition');
      return;
    }
    
    if (!messages.differentiators.some(d => d.trim()) || !messages.keyBenefits.some(b => b.trim())) {
      showNotification('error', 'Please provide at least one differentiator and one key benefit');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('marketingMessages', JSON.stringify(messages));
    showNotification('success', 'Messaging framework saved');
    
    if (onNext) onNext();
  };

  // Main form content - shown when Create From Scratch is selected or after AI generation
  const renderMessageForm = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Step 1: Value Proposition</h3>
        <textarea
          value={messages.valueProposition}
          onChange={(e) => handleMessageChange('valueProposition', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="What makes your solution extraordinary? How do you uniquely solve your customers' problems?"
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Step 2: Key Differentiators</h3>
        <div className="space-y-4">
          {messages.differentiators.map((diff, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={diff}
                onChange={(e) => handleSingleMessageChange('differentiators', index, e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={`What makes you uniquely different from competitors? (#${index + 1})`}
              />
              {messages.differentiators.length > 1 && (
                <button 
                  onClick={() => removeField('differentiators', index)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addField('differentiators')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Differentiator
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Step 3: Key Benefits</h3>
        <div className="space-y-4">
          {messages.keyBenefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={benefit}
                onChange={(e) => handleSingleMessageChange('keyBenefits', index, e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={`What specific value do customers gain? (#${index + 1})`}
              />
              {messages.keyBenefits.length > 1 && (
                <button 
                  onClick={() => removeField('keyBenefits', index)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addField('keyBenefits')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Benefit
          </button>
        </div>
      </Card>

      {aiInsights.length > 0 && (
        <Card className="p-6 bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">AI Insights</h3>
          </div>
          <ul className="space-y-2">
            {aiInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-800">
                <span className="text-blue-600">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Save & Continue button for messaging form */}
      {isWalkthrough && (
        <div className="flex justify-end pt-4">
          <button
            onClick={saveAndContinue}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );

  // Shown when Upload Framework is selected
  const renderUploadView = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Framework Analysis</h3>
        </div>
        {uploadedFramework ? (
          <>
            <p className="text-gray-600 mb-4">
              We're analyzing your messaging framework to provide insights and suggestions...
            </p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md w-fit">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{uploadedFramework.name}</span>
              <button 
                onClick={() => setUploadedFramework(null)}
                className="ml-2 text-gray-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setSelectedOption('manual')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continue to Framework Editor
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Upload your existing messaging framework</p>
            <label className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
              <Upload className="w-5 h-5 mr-2" />
              <span>Choose File</span>
              <input
                type="file"
                onChange={handleFrameworkUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
            </label>
          </div>
        )}
      </Card>
    </div>
  );

  // Different views for AI generation flow
  const renderAIGeneration = () => {
    const renderReviewStep = () => (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">We've gathered information from your previous steps</h4>
          <p className="text-sm text-gray-600">Review and enhance this information to generate more targeted messaging.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product/Service Description</label>
            <textarea
              value={aiData.productDescription}
              onChange={(e) => setAiData(prev => ({ ...prev, productDescription: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="Describe your solution and what problems it solves..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <textarea
              value={aiData.targetAudience}
              onChange={(e) => setAiData(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="Describe your ideal customers..."
              rows={3}
            />
          </div>
          <div>
  <label className="block text-sm font-medium mb-2">Unique Value</label>
  <textarea
    value={aiData.uniqueValue}
    onChange={(e) => setAiData(prev => ({ ...prev, uniqueValue: e.target.value }))}
    className="w-full p-3 border rounded-lg"
    placeholder="What makes your solution special?"
    rows={3}
  />
</div>
This should fix the syntax error and your component should work correctly.RetryClaude can make mistakes. Please double-check responses.

          <div>
            <label className="block text-sm font-medium mb-2">Key Competitors</label>
            <textarea
              value={aiData.competitors}
              onChange={(e) => setAiData(prev => ({ ...prev, competitors: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="Who are your main competitors?"
              rows={2}
            />
          </div>
        </div>

        <button
          onClick={() => setAiStep('focus')}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          Set the tone <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );

    const renderFocusStep = () => (
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Choose Your Messaging Focus</h4>
          <p className="text-sm text-gray-600 mb-4">Select the areas you want to emphasize in your messaging (choose up to 2)</p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {FOCUS_AREAS.map(focus => (
              <button
                key={focus.id}
                onClick={() => {
                  if (aiData.focusAreas.includes(focus.id)) {
                    setAiData(prev => ({
                      ...prev,
                      focusAreas: prev.focusAreas.filter(f => f !== focus.id)
                    }));
                  } else if (aiData.focusAreas.length < 2) {
                    setAiData(prev => ({
                      ...prev,
                      focusAreas: [...prev.focusAreas, focus.id]
                    }));
                  }
                }}
                className={`p-4 rounded-lg border-2 text-left relative
                  ${aiData.focusAreas.includes(focus.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'}`}
              >
                <h5 className="font-medium mb-1">{focus.label}</h5>
                <p className="text-sm text-gray-600">{focus.description}</p>
                {aiData.focusAreas.includes(focus.id) && (
                  <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Select Messaging Tone</h4>
          <div className="grid grid-cols-2 gap-4">
            {TONE_OPTIONS.map(tone => (
              <button
                key={tone.id}
                onClick={() => setAiData(prev => ({ ...prev, tone: tone.id }))}
                className={`p-3 rounded-lg border-2 text-center
                  ${aiData.tone === tone.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'}`}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setAiStep('review')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleGenerateMessages}
            disabled={aiData.focusAreas.length === 0 || isGenerating}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Framework'
            )}
          </button>
        </div>
      </div>
    );

    const renderResults = () => (
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Generated Based On:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your product description and target audience</li>
              <li>• Focus on: {aiData.focusAreas.map(f => 
                FOCUS_AREAS.find(area => area.id === f)?.label
              ).join(', ')}</li>
              <li>• {TONE_OPTIONS.find(t => t.id === aiData.tone)?.label} tone</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Value Proposition</h4>
          <p className="text-gray-700 bg-gray-50 p-3 rounded">{messages.valueProposition}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Key Differentiators</h4>
          <ul className="space-y-2">
            {messages.differentiators.map((diff, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded text-gray-700">{diff}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Key Benefits</h4>
          <ul className="space-y-2">
            {messages.keyBenefits.map((benefit, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded text-gray-700">{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setAiStep('focus')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Adjust & Regenerate
          </button>
          <button
            onClick={() => setSelectedOption('manual')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Manually
          </button>
        </div>

        {/* Continue button after generating results */}
        {isWalkthrough && (
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={saveAndContinue}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );

    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI-Generated Framework</h3>
        </div>
        
        {isGenerating && aiStep !== 'focus' ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your messaging framework...</p>
          </div>
        ) : (
          <>
            {aiStep === 'review' && renderReviewStep()}
            {aiStep === 'focus' && renderFocusStep()}
            {aiStep === 'results' && renderResults()}
          </>
        )}
      </Card>
    );
  };

  // Initial option selection screen
  const renderOptionSelection = () => (
    <Card className="p-6">
      <h3 className="text-xl font-medium mb-6">How would you like to create your messaging framework?</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <button
          className={`p-4 rounded-lg border-2 text-left transition-all
            ${selectedOption === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
          onClick={() => handleOptionSelect('manual')}
        >
          <h4 className="font-semibold mb-2">Create From Scratch</h4>
          <p className="text-sm text-gray-600">
            We'll guide you through building your framework step by step
          </p>
        </button>

        <button
          className={`p-4 rounded-lg border-2 text-left transition-all
            ${selectedOption === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
          onClick={() => handleOptionSelect('upload')}
        >
          <h4 className="font-semibold mb-2">Upload Framework</h4>
          <p className="text-sm text-gray-600">
            Already have a messaging framework? Upload it here
          </p>
        </button>

        <button
          className={`p-4 rounded-lg border-2 text-left transition-all
            ${selectedOption === 'ai' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
          onClick={() => handleOptionSelect('ai')}
        >
          <h4 className="font-semibold mb-2">Get AI Suggestions</h4>
          <p className="text-sm text-gray-600">
            Let AI help you create a messaging framework
          </p>
        </button>
      </div>
    </Card>
  );

  // Content to display based on option selection
  const renderContent = () => {
    if (!selectedOption) {
      return renderOptionSelection();
    }

    switch (selectedOption) {
      case 'manual':
        return renderMessageForm();
      case 'upload':
        return renderUploadView();
      case 'ai':
        return renderAIGeneration();
      default:
        return renderOptionSelection();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
      
      {/* Navigation Buttons - Only show if we're not in a walkthrough */}
      {!isWalkthrough && (
        <div className="flex justify-between mt-8">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back
          </button>
          <button 
            onClick={saveAndContinue}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save and Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagingStep;