// src/components/features/CreationHub/index.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Pencil, FileText, Sparkles, Settings, RefreshCw } from 'lucide-react';

const CreationHub = () => {
  const router = useRouter();

  const contentTools = [
    {
      id: 'content-creator',
      title: 'Content Creator',
      description: 'Create a single piece of high-quality content like blogs, emails, or social posts',
      icon: <Pencil className="w-10 h-10 text-blue-600" />,
      link: '/content-creator',
      isNew: false
    },
    {
      id: 'content-humanizer',
      title: 'Content Humanizer',
      description: 'Make AI-generated content sound more natural and authentic',
      icon: <FileText className="w-10 h-10 text-purple-600" />,
      link: '/content-humanizer',
      isNew: true
    },
    {
      id: 'content-enhancer',
      title: 'Content Enhancer',
      description: 'Improve, optimize, and repurpose your existing content',
      icon: <Sparkles className="w-10 h-10 text-green-600" />,
      link: '/content-enhancer',
      isNew: true
    },
    {
      id: 'campaign-builder',
      title: 'Campaign Builder',
      description: 'Create coordinated content campaigns across multiple channels',
      icon: <RefreshCw className="w-10 h-10 text-orange-600" />,
      link: '/campaign-builder',
      isNew: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Creation Hub</h1>
            <p className="text-gray-600 mt-2">
              Create, enhance, repurpose, and perfect your marketing content with AI assistance
            </p>
          </div>
          <Link href="/writing-style">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-5 h-5" />
              <span>Configure Writing Style</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentTools.map((tool) => (
          <Link key={tool.id} href={tool.link}>
            <Card className="h-full p-6 hover:shadow-md transition-all cursor-pointer relative">
              {tool.isNew && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 mb-6">{tool.description}</p>
                <div className="mt-auto">
                  <span className="text-blue-600 flex items-center">
                    Use {tool.title} →
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">AI Content Creation Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-blue-700">
            <span>•</span>
            <span>Define your brand voice first using the Writing Style configuration</span>
          </li>
          <li className="flex items-start gap-2 text-blue-700">
            <span>•</span>
            <span>Use Content Enhancer to improve and optimize your existing content</span>
          </li>
          <li className="flex items-start gap-2 text-blue-700">
            <span>•</span>
            <span>Create a complete campaign to maintain consistent messaging across channels</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreationHub;