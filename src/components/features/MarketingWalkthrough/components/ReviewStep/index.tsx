// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Edit2, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Define the complete step sequence based on your walkthrough
const STEPS = {
  WELCOME: 1,
  PRODUCT: 2,
  AUDIENCE: 3,
  MESSAGING: 4,
  COMPETITOR: 5,
  CONTENT_STRATEGY: 6,
  WRITING_STYLE: 7,
  BRAND_VOICE: 8,
  REVIEW: 9
};

const ReviewStep = ({ onNext, onBack }) => {
  const router = useRouter();
  const [productData, setProductData] = useState(null);
  const [audienceData, setAudienceData] = useState([]);
  const [messagingData, setMessagingData] = useState(null);
  const [competitorsData, setCompetitorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState({});

  // Load data from localStorage when component mounts
  useEffect(() => {
    try {
      setIsLoading(true);

      // Debug all localStorage keys
      console.log("All localStorage keys:", Object.keys(localStorage));

      // Load product data
      const savedProduct = localStorage.getItem('marketingProduct');
      if (savedProduct) {
        const parsed = JSON.parse(savedProduct);
        console.log("Loaded product data:", parsed);
        setProductData(parsed);
      } else {
        console.warn("No product data found in localStorage");
      }

      // Load audience data
      // Load audience data from all possible keys
      const savedAudience1 = localStorage.getItem('marketingAudiences');
      const savedAudience2 = localStorage.getItem('marketingTargetAudience');
      const savedAudience3 = localStorage.getItem('marketingTargetAudiences');

      let allAudiences = [];

      // Process marketingAudiences
      if (savedAudience1) {
        try {
          const parsed = JSON.parse(savedAudience1);
          console.log("Loaded audience data from marketingAudiences:", parsed);
          if (Array.isArray(parsed)) {
            allAudiences = [...allAudiences, ...parsed];
          } else {
            allAudiences.push(parsed);
          }
        } catch (error) {
          console.error("Error parsing marketingAudiences:", error);
        }
      }

      // Process marketingTargetAudience
      if (savedAudience2) {
        try {
          const parsed = JSON.parse(savedAudience2);
          console.log("Loaded audience data from marketingTargetAudience:", parsed);
          allAudiences.push(parsed);
        } catch (error) {
          console.error("Error parsing marketingTargetAudience:", error);
        }
      }

      // Process marketingTargetAudiences
      if (savedAudience3) {
        try {
          const parsed = JSON.parse(savedAudience3);
          console.log("Loaded audience data from marketingTargetAudiences:", parsed);
          if (Array.isArray(parsed)) {
            allAudiences = [...allAudiences, ...parsed];
          } else {
            allAudiences.push(parsed);
          }
        } catch (error) {
          console.error("Error parsing marketingTargetAudiences:", error);
        }
      }

      // Filter out duplicate audiences (based on role and industry combination)
      const uniqueAudiences = [];
      const seen = new Set();

      allAudiences.forEach(audience => {
        if (audience && audience.role) {
          const key = `${audience.role}-${audience.industry || ''}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueAudiences.push(audience);
          }
        }
      });

      setAudienceData(uniqueAudiences);
      // Load messaging data

      const savedMessaging1 = localStorage.getItem('marketingMessaging');
      const savedMessaging2 = localStorage.getItem('marketing-content-lab-messaging');

      let allMessagingData = null;

      // Process first messaging key
      if (savedMessaging1) {
        try {
          const parsed = JSON.parse(savedMessaging1);
          console.log("Loaded messaging data from marketingMessaging:", parsed);
          allMessagingData = parsed;
        } catch (error) {
          console.error("Error parsing marketingMessaging:", error);
        }
      }

      // If we don't have messaging data yet or it's incomplete, try the alternative key
      if ((!allMessagingData || !allMessagingData.valueProposition) && savedMessaging2) {
        try {
          const parsed = JSON.parse(savedMessaging2);
          console.log("Loaded messaging data from marketing-content-lab-messaging:", parsed);

          // If we have no messaging data yet, use this one
          if (!allMessagingData) {
            allMessagingData = parsed;
          } else {
            // Otherwise, merge the data
            allMessagingData = {
              ...allMessagingData,
              valueProposition: allMessagingData.valueProposition || parsed.valueProposition,
              keyDifferentiators: allMessagingData.keyDifferentiators || parsed.keyDifferentiators || parsed.differentiators,
              targetedMessages: allMessagingData.targetedMessages || parsed.targetedMessages || parsed.keyMessages
            };
          }
        } catch (error) {
          console.error("Error parsing marketing-content-lab-messaging:", error);
        }
      }

      setMessagingData(allMessagingData);

      // Load competitors data
      const savedCompetitors = localStorage.getItem('marketingCompetitors');
      if (savedCompetitors) {
        const parsed = JSON.parse(savedCompetitors);
        console.log("Loaded competitors data:", parsed);
        setCompetitorsData(Array.isArray(parsed) ? parsed : [parsed]);
      } else {
        console.warn("No competitors data found in localStorage");
      }

      // Save all localStorage keys to state for debugging
      const allItems = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          allItems[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          allItems[key] = localStorage.getItem(key);
        }
      }
      setStorageInfo(allItems);

    } catch (error) {
      console.error('Error loading marketing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to navigate to specific step
  const goToStep = (stepNumber) => {
    console.log(`Navigating to step ${stepNumber}`);

    if (onBack) {
      // If onBack accepts a step parameter
      onBack(stepNumber);
    } else {
      // Direct URL navigation as fallback
      router.push(`/walkthrough?step=${stepNumber}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If we don't have key data, show a debug panel
  const hasKeyData = productData &&
    (audienceData?.length > 0) &&
    messagingData &&
    (competitorsData?.length > 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Marketing Program Review</h2>
      <p className="text-gray-600">
        Here's a summary of your marketing program information. Click the edit button on any section to make changes.
      </p>

      {/* Debug Panel - Only shown when data is missing */}
      {!hasKeyData && (
        <Card className="p-4 border-yellow-300 bg-yellow-50 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800">Some data appears to be missing</h4>
              <p className="text-sm text-yellow-700 mt-1">
                We couldn't find all the expected data in your browser storage.
                You may need to go back and complete previous steps.
              </p>
              <div className="mt-2 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li className={productData ? "text-green-600" : "text-red-600"}>
                    {productData ? "✓ Product data found" : "✗ Product data missing"}
                  </li>
                  <li className={audienceData?.length > 0 ? "text-green-600" : "text-red-600"}>
                    {audienceData?.length > 0 ? `✓ ${audienceData.length} audience personas found` : "✗ Audience data missing"}
                  </li>
                  <li className={messagingData ? "text-green-600" : "text-red-600"}>
                    {messagingData ? "✓ Messaging framework found" : "✗ Messaging framework missing"}
                  </li>
                  <li className={competitorsData?.length > 0 ? "text-green-600" : "text-red-600"}>
                    {competitorsData?.length > 0 ? `✓ ${competitorsData.length} competitors found` : "✗ Competitor analysis missing"}
                  </li>
                </ul>
              </div>
              {/* Storage keys found - helpful for debugging */}
              <div className="mt-2 text-xs text-gray-600">
                <p>Storage keys found: {Object.keys(storageInfo).join(', ')}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => goToStep(STEPS.PRODUCT)}
                  className="text-yellow-800 text-sm underline hover:text-yellow-900"
                >
                  Go to Product Info
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Product Information */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            Product Information
          </h3>
          <Link
            href={`/walkthrough?step=${STEPS.PRODUCT}`}
            className="text-blue-600 flex items-center hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Product Name</p>
            <p className="font-medium">{productData?.name || "Not specified"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Product Type</p>
            <p className="font-medium">{productData?.type || "Not specified"}</p>
          </div>

          {productData?.valueProposition && (
            <div className="col-span-2 mt-2">
              <p className="text-gray-500 text-sm">Value Proposition</p>
              <p className="font-medium">{productData.valueProposition}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Target Audience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            Target Audience
          </h3>
          <Link
            href={`/walkthrough?step=${STEPS.AUDIENCE}`}
            className="text-blue-600 flex items-center hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Link>
        </div>

        {audienceData && audienceData.length > 0 ? (
          <div className="space-y-4">
            {audienceData.map((audience, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Role</p>
                    <p className="font-medium">{audience.role || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Industry</p>
                    <p className="font-medium">{audience.industry || "Not specified"}</p>
                  </div>
                </div>

                {audience.challenges && audience.challenges.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-500 text-sm mb-1">Challenges</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {audience.challenges.map((challenge, i) => (
                        <li key={i}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No target audience defined</p>
        )}
      </Card>

      {/* Messaging Framework */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            Messaging Framework
          </h3>
          <Link
            href={`/walkthrough?step=${STEPS.MESSAGING}`}
            className="text-blue-600 flex items-center hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Link>
        </div>

        {messagingData ? (
          <div className="space-y-4">
            {messagingData.valueProposition && (
              <div>
                <p className="text-gray-500 text-sm">Value Proposition</p>
                <p className="font-medium">{messagingData.valueProposition}</p>
              </div>
            )}

            {messagingData.keyDifferentiators && messagingData.keyDifferentiators.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm">Key Differentiators</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {messagingData.keyDifferentiators.map((differentiator, i) => (
                    <li key={i}>{differentiator}</li>
                  ))}
                </ul>
              </div>
            )}

            {messagingData.targetedMessages && messagingData.targetedMessages.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm">Targeted Messages</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {messagingData.targetedMessages.map((message, i) => (
                    <li key={i}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">No messaging framework defined</p>
        )}
      </Card>

      {/* Competitors Analysis */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            Competitors Analysis
          </h3>
          <Link
            href={`/walkthrough?step=${STEPS.COMPETITOR}`}
            className="text-blue-600 flex items-center hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Link>
        </div>

        <div>
          <p className="font-medium mb-2">Analyzed Competitors</p>
          {competitorsData && competitorsData.length > 0 ? (
            <div className="space-y-4">
              {competitorsData.map((competitor, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{competitor.name}</p>

                  {competitor.description && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Key Positioning</p>
                      <p>{competitor.description}</p>
                    </div>
                  )}

                  {competitor.strengths && competitor.strengths.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Strengths</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        {competitor.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Gaps</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        {competitor.weaknesses.slice(0, 3).map((weakness, i) => (
                          <li key={i}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No competitors analyzed</p>
          )}
        </div>
      </Card>

      {/* Marketing Program Summary - Simple version without "generate" */}
      <Card className="p-6 border-blue-200 bg-blue-50">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Marketing Program Summary</h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Based on your inputs, your marketing program is ready to move to the execution phase.
            Here's what you've accomplished:
          </p>

          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span> Defined your product: <strong>{productData?.name || "Not specified"}</strong>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span> Identified {audienceData?.length || 0} target audience personas with challenges
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span> Created a messaging framework with {messagingData?.keyDifferentiators?.length || 0} key differentiators
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span> Analyzed {competitorsData?.length || 0} competitors to identify opportunities
            </li>
          </ul>

          <p className="text-gray-700">
            You're now ready to start creating content and building campaigns that align with your strategy.
          </p>
        </div>
      </Card>

      {/* Next Steps */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Next Steps</h3>

        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="bg-green-100 text-green-700 rounded-full p-1 mr-3 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium">Setup your marketing program foundations</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-700 rounded-full p-1 mr-3 mt-0.5">
              <span className="block text-center text-xs font-bold w-4 h-4">2</span>
            </div>
            <div>
              <p className="font-medium">Create content aligned with your key messages</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-700 rounded-full p-1 mr-3 mt-0.5">
              <span className="block text-center text-xs font-bold w-4 h-4">3</span>
            </div>
            <div>
              <p className="font-medium">Build campaigns that target your audience's challenges</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/content-creator">
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Go to Content Creator
            </button>
          </Link>

          <Link href="/campaign-builder">
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Build a Campaign
            </button>
          </Link>

          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            Finalize Marketing Program
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;