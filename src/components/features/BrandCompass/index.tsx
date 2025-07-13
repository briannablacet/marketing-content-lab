// src/components/features/BrandCompass/index.tsx
// VERCEL COMPATIBLE: Uses browser print instead of html2pdf.js

import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import {
  Compass, Download, Printer, RefreshCw, Sparkles,
  Target, Users, MessageSquare, Eye, Star, FileText,
  ArrowRight, CheckCircle, ArrowLeft, Home
} from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';
import { useRouter } from 'next/router';

interface BrandData {
  // Core Identity
  businessName?: string;
  mission?: string;
  vision?: string;
  tagline?: string;

  // Value & Messaging
  valueProposition?: string;
  messagePillars?: string[];
  keyBenefits?: string[];

  // Audience & Voice
  targetAudiences?: any[];
  brandVoice?: any;
  brandArchetype?: string;

  // Communication Tools
  boilerplates?: { text: string; wordCount: number }[];

  // Strategic Context
  differentiators?: string[];
  competitiveAnalysis?: any[];
}

const BrandCompass: React.FC = () => {
  const router = useRouter();
  const [brandData, setBrandData] = useState<BrandData>({} as BrandData);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'professional' | 'modern' | 'elegant'>('professional');
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Load all brand data from StrategicDataService
  useEffect(() => {
    try {
      const allData: any = StrategicDataService.getAllStrategicData();

      // Also check localStorage for any additional data
      const productInfo: any = JSON.parse(localStorage.getItem('marketingProduct') || '{}');
      const messageFramework: any = JSON.parse(localStorage.getItem('messageFramework') || '{}');

      // Check all possible locations for tagline
      const tagline = localStorage.getItem('brandTagline') ||
        allData.tagline ||
        productInfo.tagline ||
        StrategicDataService.getTagline() ||
        '';

      // Check all possible locations for mission
      const mission = localStorage.getItem('brandMission') ||
        allData.mission ||
        StrategicDataService.getMission() ||
        '';

      // Check all possible locations for vision
      const vision = localStorage.getItem('brandVision') ||
        allData.vision ||
        StrategicDataService.getVision() ||
        '';

      // Load boilerplates and format them with word counts
      const rawBoilerplates = JSON.parse(localStorage.getItem('brandBoilerplates') || '[]');
      const boilerplates = rawBoilerplates.slice(0, 3).map((text: string, index: number) => {
        // Map to target lengths: first is 20, second is 50, third is 100
        const targetLengths = [20, 50, 100];
        return {
          text,
          wordCount: targetLengths[index]
        };
      });

      // Get target audiences from all possible locations
      const idealCustomer = StrategicDataService.getAllStrategicDataFromStorage().idealCustomer;
      const targetAudiences = idealCustomer ?
        (Array.isArray(idealCustomer) ? idealCustomer : [idealCustomer]) :
        (allData.audiences || []);

      // Format target audiences for display
      const formattedAudiences = targetAudiences.map((audience: any) => {
        if (typeof audience === 'string') {
          return { role: audience, industry: '' };
        }
        return {
          role: audience.role || '',
          industry: audience.industry || '',
          challenges: audience.challenges || []
        };
      });

      // Combine all sources
      const combinedData: BrandData = {
        businessName: productInfo?.name || allData.product?.name || 'Your Brand',
        mission: mission,
        vision: vision,
        tagline: tagline,
        valueProposition: messageFramework?.valueProposition || allData.messaging?.valueProposition || productInfo?.valueProposition,
        messagePillars: [
          messageFramework?.pillar1,
          messageFramework?.pillar2,
          messageFramework?.pillar3
        ].filter(Boolean) || [],
        keyBenefits: messageFramework?.keyBenefits || allData.messaging?.keyBenefits || [],
        targetAudiences: formattedAudiences,
        brandVoice: allData.brandVoice?.brandVoice || allData.brandVoice,
        brandArchetype: allData.brandVoice?.brandVoice?.archetype || allData.brandArchetype,
        boilerplates: boilerplates,
        differentiators: allData.differentiators || [],
        competitiveAnalysis: allData.competitiveAnalysis || []
      };

      setBrandData(combinedData);
    } catch (error) {
      console.error('Error loading brand data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // VERCEL COMPATIBLE: Print-to-PDF function that works everywhere
  const exportToPDF = () => {
    setIsExporting(true);

    // Add custom print styles
    const printStyles = `
      <style media="print">
        @page {
          margin: 0.75in;
          size: 8.5in 11in;
        }
        
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          line-height: 1.5;
          color: #1f2937 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .print-hide { display: none !important; }
        
        .brand-compass-content {
          background: linear-gradient(to bottom right, #eff6ff, #e0e7ff) !important;
          padding: 2rem !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        
        .avoid-break-inside {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
        
        .message-house-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Ensure colors print properly */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Card backgrounds */
        .card-bg {
          background-color: rgba(255, 255, 255, 0.9) !important;
        }
        
        /* SVG colors */
        svg polygon {
          fill: #2563eb !important;
          stroke: #1d4ed8 !important;
        }
        
        svg text {
          fill: white !important;
        }
        
        /* Theme colors */
        .text-blue-900 { color: #1e3a8a !important; }
        .text-blue-600 { color: #2563eb !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-green-500 { color: #10b981 !important; }
        
        /* Backgrounds */
        .bg-blue-50 { background-color: #eff6ff !important; }
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-white { background-color: white !important; }
        
        /* Borders */
        .border-blue-200 { border-color: #bfdbfe !important; }
        .border-blue-600 { border-color: #2563eb !important; }
        .border-blue-400 { border-color: #60a5fa !important; }
        .border-green-500 { border-color: #10b981 !important; }
      </style>
    `;

    // Add print styles to document head
    const printStyleElement = document.createElement('div');
    printStyleElement.innerHTML = printStyles;
    document.head.appendChild(printStyleElement);

    // Hide export buttons
    const exportButtons = document.querySelector('.print-hide-parent');
    if (exportButtons) {
      exportButtons.classList.add('print-hide');
    }

    // Set page title for PDF
    const originalTitle = document.title;
    document.title = `${brandData.businessName || 'Brand'}_Compass`;

    // Trigger print dialog
    setTimeout(() => {
      window.print();

      // Cleanup after print
      setTimeout(() => {
        document.head.removeChild(printStyleElement);
        if (exportButtons) {
          exportButtons.classList.remove('print-hide');
        }
        document.title = originalTitle;
        setIsExporting(false);
      }, 1000);
    }, 500);
  };

  // Text export for backup
  const exportToText = () => {
    const content = `
# ${(brandData.businessName || '').toUpperCase()} BRAND COMPASS
${'='.repeat(60)}

MISSION
${brandData.mission || 'Not defined'}

VISION
${brandData.vision || 'Not defined'}

TAGLINE
"${brandData.tagline || 'Not defined'}"

STRATEGIC MESSAGE FRAMEWORK
${'='.repeat(40)}

CORE MESSAGE (THE ROOF)
${brandData.valueProposition || 'Not defined'}

MESSAGE PILLARS
${brandData.messagePillars?.filter(Boolean).map((pillar, i) => `${i + 1}. ${pillar}`).join('\n') || 'Not defined'}

FOUNDATION (PROOF POINTS)
${brandData.keyBenefits?.map(benefit => `- ${benefit}`).join('\n') || 'Not defined'}

TARGET AUDIENCES
${brandData.targetAudiences?.map(audience => `- ${audience.role} in ${audience.industry}`).join('\n') || 'Not defined'}

BRAND VOICE
Archetype: ${brandData.brandArchetype || 'Not defined'}
Tone: ${brandData.brandVoice?.tone || 'Not defined'}

BRAND BOILERPLATES
${brandData.boilerplates?.map((boilerplate, index) => `${index + 1}. ${boilerplate.text} (${boilerplate.wordCount} words)`).join('\n\n') || 'Not defined'}

${'='.repeat(60)}
Generated by Marketing Content Lab - Brand Compass`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandData.businessName || 'Brand'}_Compass.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const themeStyles = {
    professional: {
      primary: 'text-blue-900',
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-indigo-50'
    },
    modern: {
      primary: 'text-purple-900',
      accent: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      gradient: 'from-purple-50 to-pink-50'
    },
    elegant: {
      primary: 'text-gray-900',
      accent: 'text-emerald-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      gradient: 'from-gray-50 to-emerald-50'
    }
  };

  const theme = themeStyles[selectedTheme];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your brand compass...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Export Controls - Will be hidden during print */}
      <div className="print-hide-parent flex items-center justify-end mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isExporting}
            >
              <Download className="w-5 h-5" />
              {isExporting ? 'Preparing PDF...' : 'Export'}
            </button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => { exportToPDF(); setShowExportDropdown(false); }}
                  disabled={isExporting}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  📄 PDF (Print to Save) - RECOMMENDED
                </button>
                <button
                  onClick={() => { exportToText(); setShowExportDropdown(false); }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  📝 Text (.txt)
                </button>
                <div className="px-4 py-2 text-xs text-gray-500 border-t">
                  PDF opens print dialog - choose "Save as PDF"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Compass Content */}
      <div className={`brand-compass-content bg-gradient-to-br ${theme.gradient} rounded-2xl p-8 shadow-lg`}>

        {/* Header - Keep together */}
        <div className="text-center mb-12 pb-8 border-b-2 border-blue-200 avoid-break-inside">
          <div className="mb-6">
            <h1 className={`text-4xl font-bold ${theme.primary} mb-2`}>
              {brandData.businessName || 'Your Brand'}
            </h1>
            <div className="text-2xl text-blue-600 font-light italic">
              Brand Compass
            </div>
          </div>

          {brandData.tagline && (
            <div className="text-xl text-gray-700 font-medium px-8 py-4 bg-white bg-opacity-60 rounded-xl shadow-sm">
              "{brandData.tagline}"
            </div>
          )}
        </div>

        {/* Core Identity Grid - Keep together */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 avoid-break-inside">

          {/* Mission */}
          <Card className="p-6 bg-white bg-opacity-80 shadow-sm card-bg">
            <div className={`flex items-center gap-3 mb-4 ${theme.accent}`}>
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-bold">Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {brandData.mission || 'Define your purpose and what you do for your customers.'}
            </p>
          </Card>

          {/* Vision */}
          <Card className="p-6 bg-white bg-opacity-80 shadow-sm card-bg">
            <div className={`flex items-center gap-3 mb-4 ${theme.accent}`}>
              <Eye className="w-6 h-6" />
              <h3 className="text-xl font-bold">Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {brandData.vision || 'Describe the future you\'re working toward.'}
            </p>
          </Card>
        </div>

        {/* MESSAGE HOUSE SECTION - Force page break before if needed and keep together */}
        <div className="mb-12 message-house-section page-break-before">
          <div className={`flex items-center gap-3 mb-8 ${theme.accent}`}>
            <Home className="w-7 h-7" />
            <h3 className="text-2xl font-bold">Strategic Message Framework</h3>
          </div>

          {/* ROOF - Core Message with Triangular Top - Keep together */}
          <div className="relative mb-6 avoid-break-inside">
            {/* Triangular Roof using SVG */}
            <div className="flex justify-center mb-0">
              <svg width="500" height="100" viewBox="0 0 500 100" className="block">
                <polygon
                  points="250,15 75,85 425,85"
                  fill="#2563eb"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
                <text
                  x="250"
                  y="60"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  className="uppercase tracking-wide"
                >
                  THE ROOF
                </text>
              </svg>
            </div>

            {/* Core Message Card */}
            <Card className="p-8 bg-white bg-opacity-90 shadow-lg border-4 border-blue-600 border-t-0 relative -mt-1 card-bg">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" />
                  Core Message
                </div>
                <div className="text-2xl font-bold text-gray-800 leading-relaxed">
                  {brandData.valueProposition || 'Define your core value proposition that sits at the foundation of your messaging.'}
                </div>
              </div>
            </Card>
          </div>

          {/* PILLARS - Supporting Messages - Keep together */}
          <div className="grid md:grid-cols-3 gap-6 mb-6 avoid-break-inside">
            {brandData.messagePillars && brandData.messagePillars.length > 0 ? (
              brandData.messagePillars.filter(Boolean).map((pillar, index) => (
                <Card key={index} className="p-6 bg-white bg-opacity-80 shadow-sm border-l-4 border-blue-400 card-bg">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Pillar {index + 1}
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {pillar}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No message pillars defined yet. <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push('/key-messages')}>Add them in your Message Framework</span>.</p>
              </div>
            )}
          </div>

          {/* FOUNDATION - Proof Points - Keep together */}
          <Card className="p-8 bg-white bg-opacity-80 shadow-sm border-b-4 border-green-500 avoid-break-inside card-bg">
            <div className="text-center mb-6">
              <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Foundation (Proof Points)
              </div>
            </div>
            {brandData.keyBenefits && brandData.keyBenefits.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {brandData.keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No key benefits defined yet. <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push('/key-messages')}>Add them in your Message Framework</span>.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Target Audiences - Keep together, new page if needed */}
        {brandData.targetAudiences && brandData.targetAudiences.length > 0 && (
          <Card className="p-6 mb-8 bg-white bg-opacity-80 shadow-sm avoid-break-inside card-bg">
            <div className={`flex items-center gap-3 mb-6 ${theme.accent}`}>
              <Users className="w-6 h-6" />
              <h3 className="text-xl font-bold">Target Audiences</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {brandData.targetAudiences.map((audience, index) => (
                <div key={index} className={`p-4 ${theme.bg} rounded-lg ${theme.border} border`}>
                  <div className="font-semibold text-gray-800">{audience.role}</div>
                  <div className="text-gray-600 text-sm">{audience.industry}</div>
                  {audience.challenges && audience.challenges.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Key Challenge: {audience.challenges[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Brand Boilerplates - Keep together, new page if needed */}
        {brandData.boilerplates && brandData.boilerplates.length > 0 && (
          <Card className="p-6 mb-8 bg-white bg-opacity-80 shadow-sm avoid-break-inside card-bg">
            <div className={`flex items-center gap-3 mb-6 ${theme.accent}`}>
              <FileText className="w-6 h-6" />
              <h3 className="text-xl font-bold">Brand Boilerplates</h3>
            </div>
            <div className="space-y-4">
              {brandData.boilerplates.slice(0, 3).map((boilerplate, index) => (
                <div key={index} className={`p-4 ${theme.bg} rounded-lg ${theme.border} border`}>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {boilerplate.wordCount} Words
                  </div>
                  <p className="text-gray-700 leading-relaxed">{boilerplate.text}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Brand Voice & Personality - Keep together, new page if needed */}
        {(brandData.brandArchetype || brandData.brandVoice?.tone || brandData.brandVoice?.personalityDescription) && (
          <Card className="p-6 mb-8 bg-white bg-opacity-80 shadow-sm avoid-break-inside card-bg">
            <div className={`flex items-center gap-3 mb-6 ${theme.accent}`}>
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-bold">Brand Voice & Personality</h3>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {brandData.brandArchetype && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Archetype</div>
                    <div className={`px-4 py-2 ${theme.bg} rounded-lg text-gray-800 font-medium`}>
                      {brandData.brandArchetype}
                    </div>
                  </div>
                )}
                {brandData.brandVoice?.tone && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Tone</div>
                    <div className={`px-4 py-2 ${theme.bg} rounded-lg text-gray-800 font-medium`}>
                      {brandData.brandVoice.tone}
                    </div>
                  </div>
                )}
              </div>
              {brandData.brandVoice?.personalityDescription && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Brand Personality</div>
                  <div className={`p-4 ${theme.bg} rounded-lg text-gray-700 leading-relaxed`}>
                    {brandData.brandVoice.personalityDescription}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Footer - Keep together */}
        <div className="text-center pt-8 border-t border-blue-200 avoid-break-inside">
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
            <Compass className="w-5 h-5" />
            <span className="font-medium">Your Brand North Star</span>
          </div>
          <p className="text-gray-600 text-sm">
            Use this compass to guide all brand communications and ensure consistency across all touchpoints.
          </p>
          <div className="text-xs text-gray-500 mt-4">
            Generated by Marketing Content Lab • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCompass;