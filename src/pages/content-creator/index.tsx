// src/pages/content-creator/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ContentProvider } from '../../context/ContentContext';
import { WritingStyleProvider } from '../../context/WritingStyleContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WalkthroughProvider } from '../../context/WalkthroughContext';
import { MarketingProvider } from '../../context/MarketingContext';
import { ScreenTemplate } from '../../components/shared/UIComponents';
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  FileCheck, 
  Layout, 
  Video, 
  PenTool, 
  BookOpen 
} from 'lucide-react';
import StyleGuideNotificationBanner from '../../components/features/StyleGuideNotificationBanner';

// Define content types with their details
const CONTENT_TYPES = [
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog content to establish your expertise and attract organic traffic.',
    icon: <FileText className="w-10 h-10 text-blue-600" />,
    insights: [
      "Blog posts of 1,500+ words get 68% more traffic",
      "Content with images gets 94% more views",
      "How-to and list posts are the most shared formats"
    ]
  },
  {
    id: 'social',
    title: 'Social Media Posts',
    description: 'Create engaging social media content that drives engagement and builds your audience.',
    icon: <MessageSquare className="w-10 h-10 text-purple-600" />,
    insights: [
      "LinkedIn posts with 1-2 hashtags get 50% more engagement",
      "Posts with questions receive twice as many comments",
      "Share industry insights to establish thought leadership"
    ]
  },
  {
    id: 'email',
    title: 'Email Campaign',
    description: 'Create email content that drives opens, clicks, and conversions for your business.',
    icon: <Mail className="w-10 h-10 text-green-600" />,
    insights: [
      "Personalized subject lines increase open rates by 26%",
      "Emails with a single clear CTA have higher conversion rates",
      "Keep emails under 200 words for optimal engagement"
    ]
  },
  {
    id: 'case-study',
    title: 'Case Study',
    description: 'Create compelling case studies that showcase your success stories and build credibility.',
    icon: <FileCheck className="w-10 h-10 text-orange-600" />,
    insights: [
      "Case studies with specific metrics have 68% higher engagement",
      "Include direct customer quotes to enhance credibility",
      "Focus on the transformation and concrete results"
    ]
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create high-converting landing pages that turn visitors into leads and customers.',
    icon: <Layout className="w-10 h-10 text-red-600" />,
    insights: [
      "Landing pages with social proof convert 40% better",
      "Benefit-focused headlines outperform feature-focused ones",
      "Clear, contrasting CTAs increase click-through rates by 32%"
    ]
  },
  {
    id: 'video-script',
    title: 'Video Script',
    description: 'Create compelling video scripts that engage viewers and deliver your message effectively.',
    icon: <Video className="w-10 h-10 text-yellow-600" />,
    insights: [
      "Videos with storytelling elements get 22% more engagement",
      "Keep explainer videos under 2 minutes for optimal retention",
      "Start with a hook in the first 8 seconds to reduce drop-off"
    ]
  },
  {
    id: 'whitepaper',
    title: 'Whitepaper',
    description: 'Create authoritative whitepapers that position your brand as an industry leader.',
    icon: <PenTool className="w-10 h-10 text-teal-600" />,
    insights: [
      "Whitepapers with original research generate 4x more leads",
      "Whitepapers of 6-8 pages have the highest completion rates",
      "Including executive summaries increases shareability by 23%"
    ]
  },
  {
    id: 'ebook',
    title: 'eBook',
    description: 'Create valuable eBooks that generate leads and showcase your expertise.',
    icon: <BookOpen className="w-10 h-10 text-indigo-600" />,
    insights: [
      "eBooks with actionable worksheets get 56% more engagement",
      "Visual-heavy eBooks are shared 3x more frequently",
      "Scannable, chapter-based formats have higher completion rates"
    ]
  }
];

const ContentCreatorPage = () => {
  const router = useRouter();
  
  // Navigate to the specific content creator page
  const handleSelectContentType = (contentTypeId) => {
    router.push(`/content-creator/${contentTypeId}`);
  };
  
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              {/* Banner placed outside ScreenTemplate to ensure visibility */}
              <StyleGuideNotificationBanner />
              
              <ScreenTemplate
                title="Content Creator"
                subtitle="Create a single piece of high-quality content"
                hideNavigation={true}
              >
                <div className="py-6">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Content Type</h2>
                    <p className="text-gray-600">
                      Choose the type of content you want to create. Our AI assistant will guide you through creating one high-quality piece optimized for your marketing goals.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {CONTENT_TYPES.map(contentType => (
                      <div
                        key={contentType.id}
                        onClick={() => handleSelectContentType(contentType.id)}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex flex-col items-center text-center h-full">
                          <div className="mb-4">
                            {contentType.icon}
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{contentType.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{contentType.description}</p>
                          <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Create {contentType.title}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between">
                    <button
                      onClick={() => router.push('/')}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </ScreenTemplate>
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default ContentCreatorPage;