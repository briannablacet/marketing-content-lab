// src/pages/content-creator-tools.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import Link from 'next/link';
import { 
  PenTool, 
  FileSpreadsheet, 
  SplitSquareVertical, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Lightbulb, ExternalLink } from 'lucide-react';

const ContentCreatorToolsPage: React.FC = () => {
  const router = useRouter();

  // Define the tools in this category
  const tools = [
    {
      title: 'Standalone Content Creator',
      description: 'Create a single piece of high-quality content optimized for your goals and audience',
      icon: <PenTool className="w-12 h-12 text-blue-600" />,
      path: '/content-creator',
      buttonText: 'Create',
      insights: [
        "Content with a clear goal converts 83% better",
        "AI assistance can reduce content creation time by 67%",
        "Goal-oriented content performs 2.4x better than generic content"
      ]
    },
    {
      title: 'Campaign Builder',
      description: 'Create coordinated content campaigns across multiple channels with consistent messaging',
      icon: <FileSpreadsheet className="w-12 h-12 text-green-600" />,
      path: '/campaign-builder',
      buttonText: 'Build',
      insights: [
        "Multi-channel campaigns generate 3x more leads",
        "Consistent messaging improves brand recall by 49%",
        "Coordinated campaigns have 67% higher conversion rates"
      ]
    },
    {
      title: 'A/B Test Creator',
      description: 'Create and test variations of your content to optimize performance and engagement',
      icon: <SplitSquareVertical className="w-12 h-12 text-amber-600" />,
      path: '/ab-testing',
      buttonText: 'Test',
      insights: [
        "A/B testing can improve conversion rates by up to 49%",
        "Testing headlines can increase click-through rates by 30%",
        "Optimized content versions typically perform 20-40% better"
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

         
        

  return (
    <NotificationProvider>
      <WritingStyleProvider>
         {/* AI Insights Box */}
         <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Pro Tip</h3>
              <p className="text-blue-700">
                Use a template from our template gallery to help you get started. 
                <Link 
                  href="/templates" 
                  className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse templates
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>
         
        <ScreenTemplate
          title="Content Creator Tools"
          subtitle="Create standalone content, multi-channel campaigns, and A/B test variations"
        >
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tools.map((tool, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {tool.icon}
                      </div>
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

export default ContentCreatorToolsPage;