// src/components/features/ContentEnhancer/index.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Sparkles, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ContentEnhancer = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  
  // Define our enhancement tools
  const ENHANCEMENT_TOOLS = {
    'Content Humanizer': {
      description: 'Ensure your AI-generated content maintains a natural, human touch',
      capabilities: [
        'Natural language transformation',
        'Brand voice preservation',
        'File upload for batch processing'
      ],
      path: '/content-humanizer',
      icon: '🤖'
    },
    'Style Guardian': {
      description: 'Verify content against your brand style guidelines',
      capabilities: [
        'Style guide compliance checking',
        'Formatting validation',
        'File upload for document checking'
      ],
      path: '/style-checker',
      icon: '✓'
    },
    'Prose Perfector': {
      description: 'Enhance your writing with AI-powered suggestions',
      capabilities: [
        'Clarity improvements',
        'Engagement enhancement',
        'File upload for document enhancement'
      ],
      path: '/prose-perfector',
      icon: '✨'
    },
    'Content Repurposer': {
      description: 'Transform existing content into new formats',
      capabilities: [
        'Cross-format conversion',
        'Audience-specific adaptations',
        'Multi-channel repurposing'
      ],
      path: '/content-repurposer',
      icon: '🔄'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Content Enhancement Tools
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Power up your content with AI-assisted enhancements while maintaining your authentic voice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {Object.entries(ENHANCEMENT_TOOLS).map(([name, tool]) => (
          <Link href={tool.path} key={name}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{tool.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{name}</h3>
                    <p className="text-slate-600">{tool.description}</p>
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium mb-2">Features:</p>
                  <ul className="space-y-1">
                    {tool.capabilities.map((capability, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-blue-500 flex-shrink-0">•</span>
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">File Upload Capability</h3>
            <p className="text-blue-800">
              All our enhancement tools now support direct file uploads, allowing you to process existing documents easily. 
              Simply upload your file (up to 5MB) in formats like .txt, .doc, .docx, .md, .rtf, or .html, and let our AI tools do the work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEnhancer;