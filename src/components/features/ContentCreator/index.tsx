// src/components/features/ContentCreator/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useContent } from '../../../context/ContentContext';
import { Sparkles, FileText, Pencil, CheckCircle, Settings, ArrowRight, Newspaper, Mail, MessageSquare, Video, BookOpen, Library } from 'lucide-react';
import Link from 'next/link';

const ContentCreator = () => {
  const router = useRouter();
  
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: any}>({});
  const [hasFetchedContentTypes, setHasFetchedContentTypes] = useState(false);

  // Try to get content types from context, but use defaults if not available
  useEffect(() => {
    try {
      const { selectedContentTypes = [] } = useContent();
      if (selectedContentTypes.length > 0) {
        setSelectedContentTypes(selectedContentTypes);
      } else {
        setSelectedContentTypes(Object.keys(contentTypeDetails));
      }
      setHasFetchedContentTypes(true);
    } catch (error) {
      console.error("Error accessing content context:", error);
      setSelectedContentTypes(Object.keys(contentTypeDetails));
      setHasFetchedContentTypes(true);
    }
  }, []);

  // Content types with descriptions and icons
  const contentTypeDetails = {
    'Blog Posts': {
      description: 'Engaging articles for your website or social platforms',
      wordCount: '800-1500 words',
      icon: <Newspaper className="w-5 h-5 text-indigo-600" />
    },
    'Case Studies': {
      description: 'Success stories showcasing your solution in action',
      wordCount: '1000-2000 words',
      icon: <FileText className="w-5 h-5 text-blue-600" />
    },
    'eBooks': {
      description: 'Comprehensive guides to establish thought leadership',
      wordCount: '2500-5000 words',
      icon: <BookOpen className="w-5 h-5 text-green-600" />
    },
    'White Papers': {
      description: 'In-depth reports explaining complex topics and solutions',
      wordCount: '2000-4000 words',
      icon: <FileText className="w-5 h-5 text-gray-600" />
    },
    'Social Posts': {
      description: 'Engaging posts optimized for social media platforms',
      wordCount: '50-100 words per post',
      icon: <MessageSquare className="w-5 h-5 text-pink-600" />
    },
    'Email Sequences': {
      description: 'Nurture campaigns to guide prospects through the funnel',
      wordCount: '150-300 words per email',
      icon: <Mail className="w-5 h-5 text-yellow-600" />
    },
    'Landing Pages': {
      description: 'Conversion-focused web pages for specific campaigns',
      wordCount: '300-800 words',
      icon: <Pencil className="w-5 h-5 text-purple-600" />
    },
    'Video Scripts': {
      description: 'Structured scripts for video content production',
      wordCount: '150-250 words per minute',
      icon: <Video className="w-5 h-5 text-red-600" />
    },
    'Infographics': {
      description: 'Visual representations of information and data',
      wordCount: '150-300 words of copy',
      icon: <Library className="w-5 h-5 text-teal-600" />
    }
  };

  const generateContent = async (contentType: string) => {
    setIsGenerating(true);
    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedContent(prev => ({
        ...prev,
        [contentType]: {
          title: `${contentType} Content`,
          body: `This is a preview of your ${contentType.toLowerCase()} content. In a full implementation, this would be generated based on your marketing strategy, target audience, and content guidelines.`,
          status: 'generated',
          createdAt: new Date().toISOString()
        }
      }));
      
      setActiveContent(contentType);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasFetchedContentTypes) {
    return <div className="p-8 text-center">Loading content types...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Creator</h1>
          <p className="text-gray-600 mt-2">Generate high-quality content aligned with your marketing strategy</p>
        </div>
        <div className="flex gap-4">
          <Link href="/content-strategy">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-5 h-5" />
              <span>Content Strategy</span>
            </button>
          </Link>
          <Link href="/writing-style">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-5 h-5" />
              <span>Writing Style</span>
            </button>
          </Link>
        </div>
      </div>

      {!activeContent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(contentTypeDetails).map(([type, details]) => (
            <Card key={type} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {details.icon}
                  <h3 className="text-xl font-semibold">{type}</h3>
                </div>
                <p className="text-gray-600 mb-3">{details.description}</p>
                <p className="text-sm text-gray-500 mb-4">Target length: {details.wordCount}</p>
                
                {generatedContent[type] ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Generated</span>
                    </div>
                    <button
                      onClick={() => setActiveContent(type)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => generateContent(type)}
                    disabled={isGenerating}
                    className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                      bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Content
                      </>
                    )}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{activeContent}</h2>
            <button
              onClick={() => setActiveContent(null)}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Content Types
            </button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{generatedContent[activeContent]?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{generatedContent[activeContent]?.body}</p>
                {/* In a real implementation, this would display the actual generated content */}
                <div className="bg-gray-50 p-4 border rounded-lg mt-6">
                  <p className="text-gray-600 italic">
                    This is a placeholder for the full content that would be generated based on your 
                    marketing strategy, including key messages, target audience, and writing style 
                    preferences.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit Content
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Export Content
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentCreator;