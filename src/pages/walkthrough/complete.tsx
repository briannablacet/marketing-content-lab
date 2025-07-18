// src/pages/walkthrough/complete.tsx
// Enhanced completion page that shows comprehensive strategy summary

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card } from '../../components/ui/card';
import {
  Sparkles, FileText, PenTool, Users, Target, MessageSquare,
  TrendingUp, Eye, CheckCircle, Download, ArrowRight, Compass,
  Building, Flag, Quote, Hash
} from 'lucide-react';
import Link from 'next/link';
import { exportToPDF, exportToDocx } from '../../utils/exportUtils';

interface ProductInfo {
  name?: string;
  type?: string;
  valueProposition?: string;
  keyBenefits?: string[];
}

interface TargetAudience {
  role?: string;
  industry?: string;
  challenges?: string[];
}

interface MessageFramework {
  valueProposition?: string;
  pillar1?: string;
  pillar2?: string;
  pillar3?: string;
  keyBenefits?: string[];
}

interface Competitor {
  name?: string;
  description?: string;
  knownMessages?: string[];
  strengths?: string[];
  weaknesses?: string[];
}

interface BrandVoice {
  archetype?: string;
  tone?: string;
  personality?: string[];
  voiceCharacteristics?: string[];
}

const WalkthroughComplete = () => {
  const router = useRouter();

  // State for all the strategy data
  const [productInfo, setProductInfo] = useState<ProductInfo>({});
  const [targetAudiences, setTargetAudiences] = useState<TargetAudience[]>([]);
  const [messageFramework, setMessageFramework] = useState<MessageFramework>({});
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({});

  const [mission, setMission] = useState<string>('');
  const [vision, setVision] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [boilerplates, setBoilerplates] = useState<{ short: string, medium: string, long: string }>({
    short: '',
    medium: '',
    long: ''
  });
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Load all strategy data from localStorage
  useEffect(() => {
    try {
      // Product Info
      const savedProduct = localStorage.getItem('marketingProduct');
      if (savedProduct) {
        setProductInfo(JSON.parse(savedProduct));
      }

      // Target Audiences
      const savedAudiences = localStorage.getItem('marketingTargetAudiences');
      if (savedAudiences) {
        setTargetAudiences(JSON.parse(savedAudiences));
      }

      // Message Framework
      const savedFramework = localStorage.getItem('messageFramework');
      if (savedFramework) {
        setMessageFramework(JSON.parse(savedFramework));
      }

      // Competitors
      const savedCompetitors = localStorage.getItem('marketingCompetitors');
      if (savedCompetitors) {
        setCompetitors(JSON.parse(savedCompetitors));
      }

      // Brand Voice
      const savedBrandVoice = localStorage.getItem('marketing-content-lab-brand-voice');
      if (savedBrandVoice) {
        try {
          const parsedData = JSON.parse(savedBrandVoice);
          setBrandVoice({
            archetype: parsedData.brandVoice?.archetype || '',
            tone: parsedData.brandVoice?.tone || '',
            personality: parsedData.brandVoice?.personality || [],
            voiceCharacteristics: [
              parsedData.brandVoice?.tone,
              parsedData.brandVoice?.style,
              parsedData.brandVoice?.audience
            ].filter(Boolean)
          });
        } catch (error) {
          console.error('Error parsing brand voice data:', error);
        }
      }

      // Load Corporate Identity data
      const savedMission = localStorage.getItem('brandMission');
      if (savedMission) setMission(savedMission);

      const savedVision = localStorage.getItem('brandVision');
      if (savedVision) setVision(savedVision);

      const savedTagline = localStorage.getItem('brandTagline');
      if (savedTagline) setTagline(savedTagline);

      const savedBoilerplates = localStorage.getItem('brandBoilerplates');
      if (savedBoilerplates) {
        try {
          const parsed = JSON.parse(savedBoilerplates);
          setBoilerplates({
            short: parsed[0] || '',
            medium: parsed[1] || '',
            long: parsed[2] || ''
          });
        } catch (error) {
          console.error('Error loading boilerplates:', error);
        }
      }

      // Content Types
      const savedContentTypes = localStorage.getItem('selectedContentTypes');
      if (savedContentTypes) {
        setSelectedContentTypes(JSON.parse(savedContentTypes));
      }

    } catch (error) {
      console.error('Error loading strategy data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to get the latest value prop from all sources
  const getLatestValueProp = (messageFramework: any, productInfo: any) => {
    const sources = [
      { name: 'localStorage marketingValueProp', value: localStorage.getItem('marketingValueProp') },
      { name: 'messageFramework.valueProposition', value: messageFramework?.valueProposition },
      { name: 'productInfo.valueProposition', value: productInfo?.valueProposition }
    ];
    for (const source of sources) {
      if (source.value && typeof source.value === 'string' && source.value.trim()) {
        return source.value;
      }
    }
    return '';
  };

  // Export strategy as text
  const exportStrategy = (format: 'txt' | 'pdf' | 'docx' = 'txt') => {
    const strategy = `# Marketing Content Strategy\n\n## Business Information\n**Product/Service:** ${productInfo.name || 'Not specified'}\n**Description:** ${productInfo.type || 'Not specified'}\n\n## Value Proposition\n${getLatestValueProp(messageFramework, productInfo) || 'Not defined'}\n\n## Corporate Identity\n**Mission:** ${mission || 'Not defined'}\n**Vision:** ${vision || 'Not defined'}\n**Tagline:** ${tagline || 'Not defined'}\n\n## Target Audiences\n${targetAudiences.map((audience, i) => `\n**Audience ${i + 1}:**\n- Role: ${audience.role || 'Not specified'}\n- Industry: ${audience.industry || 'Not specified'}\n- Key Challenges: ${audience.challenges?.join(', ') || 'Not specified'}\n`).join('')}\n\n## Message Framework\n**Pillar 1:** ${messageFramework.pillar1 || 'Not defined'}\n**Pillar 2:** ${messageFramework.pillar2 || 'Not defined'}\n**Pillar 3:** ${messageFramework.pillar3 || 'Not defined'}\n\n**Key Benefits:**\n${messageFramework.keyBenefits?.map(benefit => `- ${benefit}`).join('\n') || 'Not defined'}\n\n## Brand Voice\n**Archetype:** ${brandVoice.archetype || 'Not defined'}\n**Tone:** ${brandVoice.tone || 'Not defined'}\n\n## Competitive Landscape\n${competitors.map((comp, i) => `\n**Competitor ${i + 1}:** ${comp.name}\n- Positioning: ${comp.description || 'Not analyzed'}\n- Key Messages: ${comp.knownMessages?.join(', ') || 'Not analyzed'}\n`).join('')}\n\n## Content Types\n${selectedContentTypes.join(', ') || 'Not specified'}\n\n---\nGenerated by Marketing Content Lab`;
    if (format === 'pdf') {
      exportToPDF(strategy, 'marketing_strategy.pdf');
      return;
    }
    if (format === 'docx') {
      exportToDocx(strategy, 'marketing_strategy.docx');
      return;
    }
    // Default: txt
    const blob = new Blob([strategy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'marketing_strategy.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading your strategy summary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
          ✨ Strategy Complete
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Marketing Strategy is Ready!</h1>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Congratulations! You've built a comprehensive marketing content strategy.
          Here's your complete strategic foundation:
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <button
          onClick={() => router.push('/creation-hub')}
          className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <PenTool className="w-5 h-5" />
            <span className="font-semibold">Start Creating</span>
            <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-blue-100 text-sm text-left">
            Use your strategy to create content with AI
          </p>
        </button>

        <button
          onClick={() => router.push('/review-program')}
          className="p-4 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Review Strategy</span>
            <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm text-left">
            Review and refine your strategy
          </p>
        </button>

        <button
          onClick={() => window.open('/brand-compass', '_blank')}
          className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-5 h-5" />
            <span className="font-semibold">Brand Compass</span>
            <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-purple-100 text-sm text-left">
            Visualize your strategy
          </p>
        </button>

        <button
          onClick={() => setShowExportDropdown(!showExportDropdown)}
          className="p-4 bg-white rounded-lg border hover:border-green-500 hover:shadow-md transition-all group relative"
        >
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-green-600" />
            <span className="font-semibold">Export Strategy</span>
          </div>
          <p className="text-gray-600 text-sm text-left">
            Download as...
          </p>
          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={() => { exportStrategy('txt'); setShowExportDropdown(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Text (.txt)
              </button>
              <button
                onClick={() => { exportStrategy('pdf'); setShowExportDropdown(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                PDF (.pdf)
              </button>
              <button
                onClick={() => { exportStrategy('docx'); setShowExportDropdown(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Word (.docx)
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Strategy Summary Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Business Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold">Business Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Product/Service</p>
              <p className="text-gray-600">{productInfo.name || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-gray-600 text-sm">{productInfo.type || 'Not specified'}</p>
            </div>
          </div>
        </Card>

        {/* Value Proposition */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold">Value Proposition</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {getLatestValueProp(messageFramework, productInfo) || 'Not yet defined'}
          </p>
        </Card>

        {/* Mission Statement Card */}
        {mission && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold">Mission Statement</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{mission}</p>
          </Card>
        )}

        {/* Vision Statement Card */}
        {vision && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Vision Statement</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{vision}</p>
          </Card>
        )}

        {/* Brand Tagline Card */}
        {tagline && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Quote className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-semibold">Brand Tagline</h3>
            </div>
            <p className="text-gray-700 leading-relaxed font-medium">"{tagline}"</p>
          </Card>
        )}

        {/* Brand Boilerplates Card */}
        {(boilerplates.short || boilerplates.medium || boilerplates.long) && (
          <Card className="p-6 md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Hash className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold">Brand Boilerplates</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {boilerplates.short && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">20-Word</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{boilerplates.short}</p>
                </div>
              )}
              {boilerplates.medium && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">50-Word</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{boilerplates.medium}</p>
                </div>
              )}
              {boilerplates.long && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">100-Word</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{boilerplates.long}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Target Audiences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold">Target Audiences</h3>
          </div>
          <div className="space-y-4">
            {targetAudiences.length > 0 ? (
              targetAudiences.map((audience, index) => (
                <div key={index} className="border-l-4 border-purple-200 pl-3">
                  <p className="font-medium text-sm">{audience.role}</p>
                  <p className="text-gray-600 text-sm">{audience.industry}</p>
                  {audience.challenges && audience.challenges.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {audience.challenges[0]}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No target audiences defined</p>
            )}
          </div>
        </Card>

        {/* Message Pillars */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold">Message Pillars</h3>
          </div>
          <div className="space-y-3">
            {messageFramework.pillar1 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Pillar 1</p>
                <p className="text-gray-600 text-sm">{messageFramework.pillar1}</p>
              </div>
            )}
            {messageFramework.pillar2 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Pillar 2</p>
                <p className="text-gray-600 text-sm">{messageFramework.pillar2}</p>
              </div>
            )}
            {messageFramework.pillar3 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Pillar 3</p>
                <p className="text-gray-600 text-sm">{messageFramework.pillar3}</p>
              </div>
            )}
            {!messageFramework.pillar1 && !messageFramework.pillar2 && !messageFramework.pillar3 && (
              <p className="text-gray-500 text-sm">No message pillars defined</p>
            )}
          </div>
        </Card>

        {/* Brand Voice */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Eye className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="font-semibold">Brand Voice</h3>
          </div>
          <div className="space-y-3">
            {brandVoice.archetype && (
              <div>
                <p className="text-sm font-medium text-gray-700">Archetype</p>
                <p className="text-gray-600">{brandVoice.archetype}</p>
              </div>
            )}
            {brandVoice.tone && (
              <div>
                <p className="text-sm font-medium text-gray-700">Tone</p>
                <p className="text-gray-600">{brandVoice.tone}</p>
              </div>
            )}
            {!brandVoice.archetype && !brandVoice.tone && (
              <p className="text-gray-500 text-sm">Brand voice not yet defined</p>
            )}
          </div>
        </Card>

        {/* Key Benefits */}
        {messageFramework.keyBenefits && messageFramework.keyBenefits.length > 0 && (
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Key Benefits</h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {messageFramework.keyBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Competitors */}
        {competitors.length > 0 && (
          <Card className="p-6 md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold">Competitive Analysis</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">{competitor.name}</h4>
                  {competitor.description && (
                    <p className="text-gray-600 text-sm mb-2">{competitor.description}</p>
                  )}
                  {competitor.knownMessages && competitor.knownMessages.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Key Messages:</p>
                      <p className="text-xs text-gray-600">{competitor.knownMessages[0]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Content Types */}
        {selectedContentTypes.length > 0 && (
          <Card className="p-6 md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Selected Content Types</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedContentTypes.map(type => (
                <span key={type} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* AI Assistant Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <p className="text-blue-800 font-medium">AI-Powered Content Creation Ready!</p>
          <p className="text-blue-700 text-sm mt-1">
            Your strategic foundation is complete. Now AI can help you create content that's perfectly aligned
            with your brand voice, target audience, and messaging pillars.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="text-center mt-8 space-y-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/creation-hub')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Creating Content
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughComplete;