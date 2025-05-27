// src/components/features/CreationHub/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ScreenTemplate from "@/components/shared/UIComponents"
import {
  PenTool,
  Layout,
  RefreshCcw,
  Beaker,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const CreationHub: React.FC = () => {
  const router = useRouter();

  // Define the main modules
  const modules = [
    {
      title: "Standalone Content Creator",
      description: "Create standalone content pieces with AI assistance",
      icon: <PenTool className="w-16 h-16 text-blue-600" />,
      path: '/content-creator'
    },
    {
      title: "Campaign Builder",
      description: "Build multi-channel marketing campaigns",
      icon: <Layout className="w-16 h-16 text-purple-600" />,
      path: '/campaign-builder'
    },
    {
      title: "Content Repurposer",
      description: "Transform your content for different formats and channels",
      icon: <RefreshCcw className="w-16 h-16 text-green-600" />,
      path: '/content-repurposer'
    },
    {
      title: "A/B Test Generator",
      description: "Create and manage A/B tests for your content",
      icon: <Beaker className="w-16 h-16 text-orange-600" />,
      path: '/ab-test-generator'
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
      currentStep={1}
      totalSteps={1}
      onNext={() => { }}
      onBack={() => { }}
      onSkip={() => { }}
      onExit={() => { }}
    >
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </ScreenTemplate>
  );
};

export default CreationHub;