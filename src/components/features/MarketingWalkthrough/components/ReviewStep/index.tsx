// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, ThumbsUp, X, Eye, EyeOff, Check, DownloadCloud, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useNotification } from '../../../../../context/NotificationContext';

interface ReviewStepProps {
  onNext?: () => void;
  onBack?: () => void;
  isWalkthrough?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showDetails, setShowDetails] = useState({
    product: false,
    audience: false,
    messages: false,
    competitors: false
  });

  // State to store all the user data
  const [userData, setUserData] = useState({
    product: null,
    audience: null,
    messages: null,
    competitors: []
  });

  // State for the marketing summary
  const [marketingSummary, setMarketingSummary] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      // Load product info
      const productData = localStorage.getItem('marketingProduct');
      if (productData) {
        setUserData(prev => ({
          ...prev,
          product: JSON.parse(productData)
        }));
      }

      // Load target audience
      const audienceData = localStorage.getItem('marketingTargetAudience');
      if (audienceData) {
        setUserData(prev => ({
          ...prev,
          audience: JSON.parse(audienceData)
        }));
      }

      // Load key messages
      const messagesData = localStorage.getItem('marketingMessages');
      if (messagesData) {
        setUserData(prev => ({
          ...prev,
          messages: JSON.parse(messagesData)
        }));
      }

      // Load competitors
      const competitorsData = localStorage.getItem('marketingCompetitors');
      if (competitorsData) {
        setUserData(prev => ({
          ...prev,
          competitors: JSON.parse(competitorsData)
        }));
      }
    } catch (error) {
      console.error('Error loading marketing data:', error);
    }
  }, []);

  // Handler for toggling detail sections
  const toggleDetails = (section) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate marketing summary directly using the API endpoint
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      // Extract key information
      const productName = userData.product?.name || 'Your product';
      const productType = userData.product?.type || 'service';
      const valueProposition = userData.product?.valueProposition || '';
      const targetRole = userData.audience?.role || 'professionals';
      const targetIndustry = userData.audience?.industry || 'various industries';
      const keyMessages = userData.messages?.messages || [];
      const competitorNames = userData.competitors?.map(comp => comp.name).join(', ') || 'competitors';

      // Call the API to generate content
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'generate-content',
          data: {
            contentType: 'marketing_summary',
            prompt: 'Marketing Program Summary',
            sourceContent: JSON.stringify({
              productName,
              productType,
              valueProposition,
              targetRole,
              targetIndustry,
              keyMessages,
              competitorNames
            }),
            parameters: {
              tone: 'professional',
              audience: 'marketing team'
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setMarketingSummary(data.content || generateFallbackSummary({
        productName,
        valueProposition,
        targetRole,
        targetIndustry
      }));
    } catch (error) {
      console.error('Error generating summary:', error);
      // Fallback to locally generated summary if API fails
      setMarketingSummary(generateFallbackSummary({
        productName: userData.product?.name || 'Your product',
        valueProposition: userData.product?.valueProposition || '',
        targetRole: userData.audience?.role || 'professionals',
        targetIndustry: userData.audience?.industry || 'various industries'
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Local fallback summary generator
  const generateFallbackSummary = ({ productName, valueProposition, targetRole, targetIndustry }) => {
    return `${productName} is positioned to serve ${targetRole} in ${targetIndustry} with a unique value proposition: ${valueProposition || 'to provide exceptional service and value'}.\n\n` +
      `The marketing program focuses on addressing key challenges faced by your target audience through consistent messaging and competitive differentiation. Moving forward, creating content that reinforces your core value proposition while addressing competitor gaps will help establish your brand presence.\n\n` +
      `Your next steps should include developing content pieces that align with your key messages, building campaigns that speak directly to your audience's needs, and measuring engagement to refine your approach over time.`;
  };

  // Function to handle completing the walkthrough
  const handleFinishWalkthrough = () => {
    // Save walkthrough completion status to localStorage
    localStorage.setItem('marketingWalkthroughCompleted', 'true');
    localStorage.setItem('marketingWalkthroughCompletedDate', new Date().toISOString());

    // Prepare summary data
    const summaryData = {
      product: userData.product,
      audience: userData.audience,
      messages: userData.messages,
      competitors: userData.competitors,
      completedDate: new Date().toISOString(),
      summary: marketingSummary
    };

    // Save the summary
    localStorage.setItem('marketingProgramSummary', JSON.stringify(summaryData));

    showNotification('success', 'Marketing program setup completed!');

    // Navigate to dashboard
    router.push('/');
  };

  // Determine if all key sections have data
  const hasRequiredData = userData.product && userData.audience && userData.messages;

  return (
    <div className="space-y-6">
      {/* Finish Confirmation Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Complete Your Marketing Program Setup</h3>
            <p className="text-gray-600 mb-6">
              You're about to finish the walkthrough and set up your marketing program. You can always edit your information later.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishWalkthrough}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Complete Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center text-center">
          <ThumbsUp className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Great Work! Let's Review Your Marketing Program</h3>
          <p className="text-gray-600 mb-4">
            You've completed all the steps to set up your marketing program. Here's a review of all the information you've provided.
          </p>
        </div>
      </Card>

      {/* Product Information */}
      <Card className="mb-4">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="font-medium">Product Information</div>
          <button
            onClick={() => toggleDetails('product')}
            className="text-blue-600 hover:text-blue-800"
          >
            {showDetails.product ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4">
          {userData.product ? (
            <div>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500">Business Name</div>
                  <div className="text-lg">{userData.product.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div>{userData.product.type || 'N/A'}</div>
                </div>
              </div>

              {showDetails.product && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Value Proposition</div>
                  <div className="bg-gray-50 p-3 rounded text-gray-700">
                    {userData.product.valueProposition || 'No value proposition provided'}
                  </div>

                  {userData.product.keyBenefits && userData.product.keyBenefits.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-500 mb-1">Key Benefits</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {userData.product.keyBenefits.map((benefit, index) => (
                          <li key={index} className="text-gray-700">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic">No product information provided</div>
          )}
        </div>
      </Card>

      {/* Target Audience */}
      <Card className="mb-4">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="font-medium">Target Audience</div>
          <button
            onClick={() => toggleDetails('audience')}
            className="text-blue-600 hover:text-blue-800"
          >
            {showDetails.audience ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4">
          {userData.audience ? (
            <div>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500">Primary Role</div>
                  <div className="text-lg">{userData.audience.role || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Industry</div>
                  <div>{userData.audience.industry || 'N/A'}</div>
                </div>
              </div>

              {showDetails.audience && userData.audience.challenges && userData.audience.challenges.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Key Challenges</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {userData.audience.challenges.map((challenge, index) => (
                      <li key={index} className="text-gray-700">{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic">No target audience information provided</div>
          )}
        </div>
      </Card>

      {/* Key Messages */}
      <Card className="mb-4">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="font-medium">Key Messages</div>
          <button
            onClick={() => toggleDetails('messages')}
            className="text-blue-600 hover:text-blue-800"
          >
            {showDetails.messages ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4">
          {userData.messages && userData.messages.messages && userData.messages.messages.length > 0 ? (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Core Messages</div>
              <div className="space-y-2">
                {userData.messages.messages.map((message, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-gray-700">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No key messages provided</div>
          )}
        </div>
      </Card>

      {/* Competitors Analysis */}
      <Card className="mb-4">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="font-medium">Competitors Analysis</div>
          <button
            onClick={() => toggleDetails('competitors')}
            className="text-blue-600 hover:text-blue-800"
          >
            {showDetails.competitors ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4">
          {userData.competitors && userData.competitors.length > 0 ? (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Analyzed Competitors</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.competitors.map((competitor, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 font-medium">
                      {competitor.name}
                    </div>
                    {showDetails.competitors && (
                      <div className="p-3 space-y-3">
                        {competitor.strengths && competitor.strengths.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Strengths</div>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {competitor.strengths.slice(0, 2).map((strength, i) => (
                                <li key={i} className="text-gray-700">{strength}</li>
                              ))}
                              {competitor.strengths.length > 2 && (
                                <li className="text-gray-500 italic">
                                  +{competitor.strengths.length - 2} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Gaps</div>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                                <li key={i} className="text-gray-700">{weakness}</li>
                              ))}
                              {competitor.weaknesses.length > 2 && (
                                <li className="text-gray-500 italic">
                                  +{competitor.weaknesses.length - 2} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No competitor analysis provided</div>
          )}
        </div>
      </Card>

      {/* Marketing Summary */}
      <Card className="mb-6">
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <div className="font-medium flex items-center">
            <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
            Marketing Program Summary
          </div>
        </div>
        <div className="p-6">
          {marketingSummary ? (
            <div className="prose max-w-none">
              {marketingSummary.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index === 0 ? "font-medium" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating || !hasRequiredData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Summary
                  </>
                )}
              </button>
              {!hasRequiredData && (
                <p className="mt-2 text-sm text-gray-500">
                  Complete all required steps to generate a summary
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Next Steps</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-blue-800">Setup your marketing program foundations</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-blue-500 text-xs">2</span>
              </div>
              <span className="text-blue-800">Create content aligned with your key messages</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-blue-500 text-xs">3</span>
              </div>
              <span className="text-blue-800">Build campaigns that target your audience's challenges</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <button
              onClick={() => router.push('/content-hub')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
            >
              Go to Content Creator
            </button>
            <button
              onClick={() => router.push('/campaign-builder')}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
            >
              Build a Campaign
            </button>
            <button
              onClick={() => setShowConfirmFinish(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              Finalize Marketing Program
            </button>
          </div>
        </div>
      </Card>

      {/* Navigation buttons */}
      {isWalkthrough && (
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => setShowConfirmFinish(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete Setup
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;