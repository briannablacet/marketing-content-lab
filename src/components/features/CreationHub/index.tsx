// src/components/features/CreationHub/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ScreenTemplate } from '../../shared/UIComponents';
import { 
  FileText, 
  Copy, 
  BarChart2, 
  PenTool,
  FileSpreadsheet,
  RefreshCcw,
  SplitSquareVertical,
  ArrowRight,
  MessageSquare,
  Mail,
  FileCheck
} from 'lucide-react';

const CreationHub: React.FC = () => {
  const router = useRouter();

  // Card data structure
  const contentCards = [
    {
      title: 'Content Creator',
      description: 'Create a single piece of high-quality content optimized for your goals',
      icon: <PenTool className="w-12 h-12 text-blue-600" />,
      path: '/content-creator',
      insights: [
        "Content with a clear goal converts 83% better",
        "AI assistance can reduce content creation time by 67%"
      ]
    },
    {
      title: 'Content Repurposer',
      description: 'Transform existing content into different formats while preserving key messages',
      icon: <RefreshCcw className="w-12 h-12 text-purple-600" />,
      path: '/content-repurposer',
      insights: [
        "Repurposing content can increase reach by up to 60%",
        "Same content can be optimized for different platforms"
      ]
    },
    {
      title: 'Campaign Builder',
      description: 'Create coordinated content campaigns across multiple channels',
      icon: <FileSpreadsheet className="w-12 h-12 text-green-600" />,
      path: '/campaign-builder',
      insights: [
        "Multi-channel campaigns generate 3x more leads",
        "Consistent messaging improves brand recall by 49%"
      ]
    },
    {
      title: 'A/B Test Generator',
      description: 'Create variations of your content to test which performs better',
      icon: <SplitSquareVertical className="w-12 h-12 text-amber-600" />,
      path: '/ab-testing',
      isNew: true,
      insights: [
        "A/B testing can improve conversion rates by up to 49%",
        "Testing headlines can increase click-through rates by 30%"
      ]
    },
    {
      title: 'Style Guardian',
      description: 'Check content against your brand style guidelines',
      icon: <FileCheck className="w-12 h-12 text-indigo-600" />,
      path: '/style-checker',
      insights: [
        "Consistent style increases brand recognition by 33%",
        "Content that adheres to style guidelines performs better"
      ]
    },
    {
      title: 'Prose Perfector',
      description: 'Enhance your writing with AI-powered suggestions',
      icon: <FileText className="w-12 h-12 text-teal-600" />,
      path: '/prose-perfector',
      insights: [
        "Clear, concise content improves engagement by 58%",
        "Enhanced content gets 27% more social shares"
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <ScreenTemplate
      title="Content Creation Hub"
      subtitle="Choose a tool to create or enhance your marketing content"
      hideNavigation={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {contentCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {card.icon}
                </div>
                {card.isNew && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    NEW
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              
              <p className="text-gray-600 mb-4">
                {card.description}
              </p>
              
              {card.insights && (
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">AI INSIGHTS</h4>
                  <ul className="space-y-1">
                    {card.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button
                onClick={() => handleNavigate(card.path)}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Open {card.title}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
      </div>
    </ScreenTemplate>
  );
};

export default CreationHub;