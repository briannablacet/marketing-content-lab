// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Edit2, ChevronRight, AlertCircle, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useBrandVoice } from '@/context/BrandVoiceContext';
import StrategicDataService from '../../../../services/StrategicDataService';

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
  const { brandVoice } = useBrandVoice();
  const [productData, setProductData] = useState(null);
  const [audienceData, setAudienceData] = useState([]);
  const [messagingData, setMessagingData] = useState(null);
  const [competitorsData, setCompetitorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState({});
  const [productInfo, setProductInfo] = useState<any>(null);
  const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<any>(null);
  const [styleGuide, setStyleGuide] = useState<any>(null);

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

      // Fetch additional data
      const fetchData = async () => {
        const [product, messaging, audiences, competitive, style] = await Promise.all([
          StrategicDataService.getProductInfo(),
          StrategicDataService.getMessagingFramework(),
          StrategicDataService.getTargetAudiences(),
          StrategicDataService.getCompetitiveAnalysis(),
          StrategicDataService.getStyleGuide()
        ]);

        setProductInfo(product);
        setMessagingData(messaging);
        setTargetAudiences(audiences);
        setCompetitiveAnalysis(competitive);
        setStyleGuide(style);
      };

      fetchData();

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

  const handleComplete = () => {
    router.push('/walkthrough/complete');
  };

  const handleEdit = (section: string) => {
    const stepMap: { [key: string]: string } = {
      'product': '/walkthrough/2',
      'persona': '/walkthrough/3',
      'value-prop': '/walkthrough/4',
      'messaging': '/walkthrough/5',
      'competitive': '/walkthrough/6',
      'style': '/walkthrough/7',
      'brand-voice': '/walkthrough/8'
    };
    router.push(stepMap[section]);
  };

  const downloadAll = () => {
    const content = {
      productInfo,
      messagingFramework: messagingData,
      targetAudiences,
      competitiveAnalysis,
      styleGuide,
      brandVoice: brandVoice.brandVoice
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'branding-walkthrough-content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Complete Walkthrough
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;