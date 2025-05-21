// src/pages/content-enhancer-tools.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import StyleGuideNotificationBanner from '../components/features/StyleGuideNotificationBanner';
import { 
  FileText, 
  Check, 
  User, 
  MessageSquare, 
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const ContentEnhancerToolsPage: React.FC = () => {
  const router = useRouter();

  // Define the tools in this category
  const tools = [
    {
      title: 'Prose Perfector',
      description: 'Enhance your writing with AI-powered suggestions for clarity, conciseness, and engagement',
      icon: <FileText className="w-12 h-12 text-teal-600" />,
      path: '/prose-perfector',
      buttonText: 'Perfect',
      insights: [
        "Clear, concise content improves engagement by 58%",
        "Enhanced content gets 27% more social shares",
        "Professional editing can increase conversion rates by 30%"
      ]
    },
    {
      title: 'Style Compliance Check',
      description: 'Check your content against brand style guidelines to ensure consistency across all materials',
      icon: <Check className="w-12 h-12 text-indigo-600" />,
      path: '/style-checker',
      buttonText: 'Check',
      insights: [
        "Consistent style increases brand recognition by 33%",
        "Content that adheres to style guidelines performs better",
        "Brand consistency builds trust with 71% of consumers"
      ]
    },
    {
      title: 'Content Humanizer',
      description: 'Make AI-generated content sound more human and natural while preserving key messages',
      icon: <User className="w-12 h-12 text-purple-600" />,
      path: '/content-humanizer',
      buttonText: 'Humanize',
      isNew: true,
      insights: [
        "Human-like content increases trust by 42%",
        "Natural language patterns improve readability scores",
        "Humanized content receives 38% more engagement"
      ]
    },
    {
      title: 'Brand Voice',
      description: 'Define and apply your brand\'s voice, tone, and messaging guidelines for consistent communication',
      icon: <MessageSquare className="w-12 h-12 text-pink-600" />,
      path: '/brand-voice',
      buttonText: 'Brand',
      insights: [
        "Consistent brand voice increases recognition by 49%",
        "Clearly defined voice ensures content alignment",
        "Strong brand voice builds 23% more customer loyalty"
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <StyleGuideNotificationBanner />
        <ScreenTemplate
          title="Content Enhancer Tools"
          subtitle="Improve and refine your content with AI-powered enhancement tools"
        >
          <div className="py-6">
            {/* First row of two tools */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.slice(0, 2).map((tool, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {tool.icon}
                        </div>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                      
                      <p className="text-gray-600 mb-4">
                        {tool.description}
                      </p>
                      
                      {tool.insights && (
                        <div className="mb-6">
                          <h4 className="text-xs font-medium text-gray-500 mb-2">AI INSIGHTS</h4>
                          <ul className="space-y-1">
                            {tool.insights.map((insight, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleNavigate(tool.path)}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        {tool.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Second row of two tools */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.slice(2, 4).map((tool, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {tool.icon}
                        </div>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                      
                      <p className="text-gray-600 mb-4">
                        {tool.description}
                      </p>
                      
                      {tool.insights && (
                        <div className="mb-6">
                          <h4 className="text-xs font-medium text-gray-500 mb-2">AI INSIGHTS</h4>
                          <ul className="space-y-1">
                            {tool.insights.map((insight, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleNavigate(tool.path)}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        {tool.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-800">Enhancement Tips</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    For best results, start by defining your writing style and brand voice. Next, enhance your copy with Prose Perfector, and finish with Content Humanizer for 
                    natural-sounding output.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => router.push('/creation-hub')}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Creation Hub
              </button>
            </div>
          </div>
        </ScreenTemplate>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ContentEnhancerToolsPage;