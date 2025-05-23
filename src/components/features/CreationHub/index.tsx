// src/components/features/CreationHub/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ScreenTemplate from "@/components/shared/UIComponents"
import {
  PenTool,
  Sparkles,
  RefreshCcw,
  ArrowRight,
  Layout, // New icon for Content Creator module
} from 'lucide-react';

const CreationHub: React.FC = () => {
  const router = useRouter();

  // Define the main modules
  const modules = [
    {
      title: "Content Creator",
      description: "Create standalone content pieces, multi-channel campaigns, and A/B test variations",
      icon: <Layout className="w-16 h-16 text-blue-600" />, // Changed icon to Layout
      path: '/content-creator-tools',
      tools: ["Standalone Content Creator", "Campaign Builder", "A/B Test Creator"]
    },
    {
      title: "Content Enhancer",
      description: "Improve your content with AI-powered tools for style, readability, and brand voice consistency",
      icon: <Sparkles className="w-16 h-16 text-purple-600" />,
      path: '/content-enhancer-tools',
      tools: ["Prose Perfector", "Style Compliance Check", "Content Humanizer", "Brand Voice"]
    },
    {
      title: "Content Repurposer",
      description: "Transform your existing content for different formats and channels while preserving key messages",
      icon: <RefreshCcw className="w-16 h-16 text-green-600" />,
      path: '/content-repurposer',
      tools: ["Format Transformer", "Channel Adapter"]
    }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <ScreenTemplate
      title="Content Creation Hub"
      subtitle="Choose a content creation module to get started"
      hideNavigation={true}
    >
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer"
              onClick={() => handleNavigate(module.path)}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gray-50 rounded-full">
                    {module.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-3 text-center">{module.title}</h3>

                <p className="text-gray-600 mb-6 text-center">
                  {module.description}
                </p>

                <div className="mb-6 flex-grow">
                  <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Includes</h4>
                  <ul className="space-y-1">
                    {module.tools.map((tool, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center justify-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(module.path);
                  }}
                  className="w-full mt-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Open {module.title}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
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