// src/pages/content-creator/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../components/shared/UIComponents';
import { NotificationProvider } from '../../context/NotificationContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { MessagingProvider } from '../../context/MessagingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StyleGuideNotificationBanner from '../../components/features/StyleGuideNotificationBanner';
import Link from 'next/link';
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  FileCheck, 
  Layout, 
  Video, 
  PenTool, 
  BookOpen,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ArrowLeft,
  Edit,
  X,
  ExternalLink
} from 'lucide-react';

const ContentCreatorPage: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showTypeModal, setShowTypeModal] = useState<boolean>(false);
  
  // Basic fields state - would expand based on selected content type
  const [title, setTitle] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string>('');
  const [tone, setTone] = useState<string>('professional');
  
  // Initial AI insights - shown when page loads
  const initialInsights = [
    "Content with clear audience targeting performs 2-3x better",
    "Matching content type to business objectives increases conversion by 49%",
    "AI-assisted content creation can reduce production time by up to 70%",
    "The right tone of voice can improve audience engagement by 40%"
  ];
  
  // Define content types with their details
  const CONTENT_TYPES = [
    {
      id: 'blog-post',
      title: 'Blog Post',
      description: 'Create engaging blog content to establish your expertise and attract organic traffic.',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      tips: [
        "Aim for 1,200-1,800 words for optimal SEO performance",
        "Include 3-5 headings to improve readability",
        "Add a clear call-to-action at the end"
      ]
    },
    {
      id: 'social',
      title: 'Social Media Posts',
      description: 'Create engaging social media content that drives engagement and builds your audience.',
      icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
      tips: [
        "Keep posts under 280 characters for Twitter",
        "Include 1-2 relevant hashtags for better reach",
        "Ask a question to encourage engagement"
      ]
    },
    {
      id: 'email',
      title: 'Email Campaign',
      description: 'Create email content that drives opens, clicks, and conversions for your business.',
      icon: <Mail className="w-8 h-8 text-green-600" />,
      tips: [
        "Craft subject lines of 40-60 characters",
        "Keep email body between 100-200 words",
        "Include a single, prominent call-to-action"
      ]
    },
    {
      id: 'case-study',
      title: 'Case Study',
      description: 'Create compelling case studies that showcase your success stories and build credibility.',
      icon: <FileCheck className="w-8 h-8 text-orange-600" />,
      tips: [
        "Focus on specific, measurable results",
        "Include direct customer quotes for authenticity",
        "Structure as problem → solution → outcome"
      ]
    },
    {
      id: 'landing-page',
      title: 'Landing Page',
      description: 'Create high-converting landing pages that turn visitors into leads and customers.',
      icon: <Layout className="w-8 h-8 text-red-600" />,
      tips: [
        "Lead with a benefit-focused headline",
        "Include social proof elements (testimonials, logos)",
        "Limit form fields to increase conversion rates"
      ]
    },
    {
      id: 'video-script',
      title: 'Video Script',
      description: 'Create compelling video scripts that engage viewers and deliver your message effectively.',
      icon: <Video className="w-8 h-8 text-yellow-600" />,
      tips: [
        "Hook viewers in the first 8 seconds",
        "Keep explainer videos under 2 minutes",
        "Use conversational language for better engagement"
      ]
    },
    {
      id: 'whitepaper',
      title: 'Whitepaper',
      description: 'Create authoritative whitepapers that position your brand as an industry leader.',
      icon: <PenTool className="w-8 h-8 text-teal-600" />,
      tips: [
        "Include original research or data",
        "Aim for 6-8 pages of in-depth content",
        "Add an executive summary for busy readers"
      ]
    },
    {
      id: 'ebook',
      title: 'eBook',
      description: 'Create valuable eBooks that generate leads and showcase your expertise.',
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      tips: [
        "Break content into scannable chapters",
        "Include visual elements every 1-2 pages",
        "Add interactive worksheets or checklists"
      ]
    }
  ];
  
  // Get the selected content type details
  const selectedTypeDetails = CONTENT_TYPES.find(type => type.id === selectedType);
  
  // Reset form when content type changes
  useEffect(() => {
    setTitle('');
    setAudience('');
    setObjective('');
    setKeyPoints('');
    setTone('professional');
  }, [selectedType]);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showTypeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showTypeModal]);
  
  const handleContentGeneration = () => {
    if (!selectedType || !title || !audience || !objective) {
      // Show validation error in a real app
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, you would handle the generated content here
      // and perhaps navigate to a results page
    }, 2000);
  };
  
  // Helper to determine if form is valid
  const isFormValid = () => {
    return selectedType && title && audience && objective;
  };
  
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <MessagingProvider>
          <StyleGuideNotificationBanner />
          <ScreenTemplate
            title="Standalone Content Creator"
            subtitle="Create a single piece of high-quality content optimized for your goals"
          >
            <div className="max-w-7xl mx-auto mb-16">
              {/* Initial AI Insights Box */}
              {!selectedType && (
                <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <Edit className="w-10 h-10 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Pro Tip!</h3>
                        <p className="text-blue-700 mb-4">
                          Select a template from our template gallery to help you get started!  
                          <Link 
                  href="/templates" 
                  className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse templates
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
                        </p>
                        
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2" />
                          AI Content Insights
                        </h4>
                        <ul className="space-y-2">
                          {initialInsights.map((insight, index) => (
                            <li key={index} className="text-blue-700 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Content Type Selector */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Select Content Type</h2>
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-lg bg-white"
                  onClick={() => setShowTypeModal(true)}
                >
                  <div className="flex items-center">
                    {selectedTypeDetails ? (
                      <>
                        <div className="mr-3">
                          {selectedTypeDetails.icon}
                        </div>
                        <span>{selectedTypeDetails.title}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Choose a content type...</span>
                    )}
                  </div>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content Type Modal */}
              {showTypeModal && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Select Content Type</h3>
                      <button 
                        onClick={() => setShowTypeModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-auto flex-grow">
                      <ul className="py-2">
                        {CONTENT_TYPES.map((type) => (
                          <li 
                            key={type.id}
                            className={`px-6 py-4 flex items-start hover:bg-gray-50 cursor-pointer ${
                              selectedType === type.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              setSelectedType(type.id);
                              setShowTypeModal(false);
                              router.push(`/content-creator/${type.id}`);
                            }}
                          >
                            <div className="mr-4 pt-1 flex-shrink-0">
                              {type.icon}
                            </div>
                            <div>
                              <div className="font-medium text-lg">{type.title}</div>
                              <div className="text-gray-600 mt-1">{type.description}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTypeDetails && (
                <>
                  {/* Selected Content Type Info */}
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="p-3 bg-gray-50 rounded-lg mr-4 flex-shrink-0">
                          {selectedTypeDetails.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{selectedTypeDetails.title}</h3>
                          <p className="text-gray-600">{selectedTypeDetails.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-800 mb-1">AI Content Tips</h4>
                            <ul className="space-y-1">
                              {selectedTypeDetails.tips.map((tip, index) => (
                                <li key={index} className="text-sm text-blue-700 flex items-start">
                                  <span className="text-blue-600 mr-2">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Content Creation Form */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Content Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="title">
                            Title/Subject
                          </label>
                          <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder={`Enter a title for your ${selectedTypeDetails.title}`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="audience">
                            Target Audience
                          </label>
                          <input
                            id="audience"
                            type="text"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Who is this content for? (e.g., Marketing Directors, Small Business Owners)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="objective">
                            Primary Objective
                          </label>
                          <select
                            id="objective"
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">Select an objective...</option>
                            <option value="awareness">Raise Awareness</option>
                            <option value="education">Educate Audience</option>
                            <option value="lead_generation">Generate Leads</option>
                            <option value="conversion">Drive Conversions</option>
                            <option value="retention">Improve Retention</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="keyPoints">
                            Key Points
                          </label>
                          <textarea
                            id="keyPoints"
                            value={keyPoints}
                            onChange={(e) => setKeyPoints(e.target.value)}
                            rows={4}
                            className="w-full p-2 border rounded-md"
                            placeholder="List the main points you want to include (one per line)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Tone of Voice
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['professional', 'casual', 'authoritative', 'friendly'].map((toneOption) => (
                              <button
                                key={toneOption}
                                type="button"
                                onClick={() => setTone(toneOption)}
                                className={`py-2 px-3 border rounded-md text-sm capitalize ${
                                  tone === toneOption 
                                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                {toneOption}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => router.back()}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    
                    <button
                      onClick={handleContentGeneration}
                      disabled={!isFormValid() || isGenerating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Content
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </ScreenTemplate>
        </MessagingProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ContentCreatorPage;