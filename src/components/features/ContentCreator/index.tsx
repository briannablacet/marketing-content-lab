// src/components/features/ContentCreator/index.tsx
// FIXED: Card-based selection interface that routes to [type].tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import StrategicDataService from '../../../services/StrategicDataService';
import { Sparkles, ArrowLeft, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Content types with full details - FIXED PRESS RELEASE ID
const CONTENT_TYPES = [
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog content to establish your expertise and attract organic traffic.',
    icon: '📝',
    insights: [
      'Blog posts generate 67% more leads than businesses that don\'t blog',
      'Companies that blog get 97% more links to their website',
      'Consistent blogging increases organic traffic by 2.3x'
    ]
  },
  {
    id: 'social-posts',
    title: 'Social Media Posts',
    description: 'Create engaging social media content that drives engagement and builds your audience.',
    icon: '📱',
    insights: [
      'Visual content gets 94% more views than text-only posts',
      'Posts with questions get 23% more engagement',
      'Consistent posting increases follower growth by 45%'
    ]
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Create individual email content that drives opens, clicks, and conversions.',
    icon: '📧',
    insights: [
      'Personalized emails deliver 6x higher transaction rates',
      'Email marketing has an average ROI of $42 for every $1 spent',
      'A/B testing subject lines can improve open rates by 49%'
    ]
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create high-converting landing pages that turn visitors into leads and customers.',
    icon: '🎯',
    insights: [
      'Companies with 30+ landing pages generate 7x more leads',
      'Video on landing pages can increase conversion by 80%',
      'A/B testing can improve conversion rates by 20-25%'
    ]
  },
  {
    id: 'case-study',
    title: 'Case Study',
    description: 'Create compelling case studies that showcase your success stories and build credibility.',
    icon: '📊',
    insights: [
      'Case studies are considered the most effective content by 73% of B2B marketers',
      'Including customer quotes increases credibility by 89%',
      'Case studies generate 87% more qualified leads than other content'
    ]
  },
  {
    id: 'press-release',
    title: 'Press Release',
    description: 'Create newsworthy press releases that generate media coverage and build brand credibility.',
    icon: '📰',
    insights: [
      'Press releases can increase website traffic by 30%',
      'Companies that send regular press releases get 50% more media mentions',
      'SEO-optimized press releases improve search rankings by 23%'
    ]
  }
];

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle className={className || "h-5 w-5"} />
);

const ContentCreator: React.FC = () => {
  const router = useRouter();
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // State for strategic data
  const [strategicData, setStrategicData] = useState<any>(null);
  const [hasStrategicData, setHasStrategicData] = useState(false);
  const [isLoadingStrategicData, setIsLoadingStrategicData] = useState(true);

  // Load strategic data
  useEffect(() => {
    const loadStrategicData = async () => {
      setIsLoadingStrategicData(true);
      try {
        const data = await StrategicDataService.getAllStrategicData();
        setStrategicData(data);

        const hasData = Boolean(
          data &&
          (data.isComplete ||
            (data.product?.name) ||
            (data.audiences && data.audiences.length > 0) ||
            (data.messaging?.valueProposition) ||
            (data.writingStyle?.styleGuide?.primary))
        );
        setHasStrategicData(hasData);
      } catch (error) {
        console.error("Error loading strategic data:", error);
      } finally {
        setIsLoadingStrategicData(false);
      }
    };

    loadStrategicData();
  }, []);

  const handleSelectContentType = (contentTypeId: string) => {
    router.push(`/content-creator/${contentTypeId}`);
  };

  return (
    <div className="space-y-8">
      {/* Writing Style Status Banner */}
      {isStyleConfigured && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50 pb-6">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span>Using Your Style Guide Selections</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-sm text-green-700">
              Style Guide: {writingStyle?.styleGuide?.primary} •
              Headings: {writingStyle?.formatting?.headingCase === 'upper' ? 'ALL CAPS' :
                writingStyle?.formatting?.headingCase === 'lower' ? 'lowercase' :
                  writingStyle?.formatting?.headingCase === 'sentence' ? 'Sentence case' : 'Title Case'}
              {writingStyle?.punctuation?.oxfordComma !== undefined &&
                ` • Oxford Comma: ${writingStyle.punctuation.oxfordComma ? 'Used' : 'Omitted'}`}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Data Banner */}
      {hasStrategicData && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50 pb-6">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <span>Using Your Marketing Program</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Content will be created using:
                </h3>
                <ul className="space-y-2">
                  {strategicData?.product?.name && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        <strong>Your product:</strong> {strategicData.product.name}
                      </span>
                    </li>
                  )}
                  {strategicData?.audiences?.length > 0 && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        <strong>Your audience:</strong> {strategicData.audiences[0].role}
                      </span>
                    </li>
                  )}
                  {strategicData?.messaging?.valueProposition && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        <strong>Your messaging framework</strong>
                      </span>
                    </li>
                  )}
                  {(strategicData?.brandVoice?.brandVoice?.archetype || strategicData?.brandVoice?.brandVoice?.tone) && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        <strong>Your brand voice:</strong>{" "}
                        {strategicData.brandVoice.brandVoice.archetype && strategicData.brandVoice.brandVoice.tone
                          ? `${strategicData.brandVoice.brandVoice.archetype} - ${strategicData.brandVoice.brandVoice.tone}`
                          : strategicData.brandVoice.brandVoice.archetype || strategicData.brandVoice.brandVoice.tone
                        }
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            Choose Content Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Select the type of content you want to create
          </p>
        </CardContent>
      </Card>

      {/* Content Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONTENT_TYPES.map((contentType) => (
          <Card
            key={contentType.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-300 border-2 border-gray-200"
            onClick={() => handleSelectContentType(contentType.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{contentType.icon}</span>
                  <CardTitle className="text-lg">{contentType.title}</CardTitle>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                {contentType.description}
              </p>

              {contentType.insights && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    AI Insights
                  </h4>
                  <ul className="space-y-1">
                    {contentType.insights.slice(0, 2).map((insight, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2 text-sm">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Link href="/creation-hub">
          <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Creation Hub
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ContentCreator;