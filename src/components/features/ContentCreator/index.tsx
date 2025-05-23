// src/components/features/ContentCreator/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useContent } from '../../../context/ContentContext';
import { Sparkles, ChevronRight, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { CONTENT_TYPES } from '../../../data/contentTypesData';
import Link from 'next/link';

interface ContentCreatorProps {
  contentType?: string;
  description?: string;
  steps?: string[];
  insights?: string[];
}

const ContentCreator: React.FC<ContentCreatorProps> = ({
  contentType,
  description,
  steps,
  insights
}) => {
  const router = useRouter();
  const { selectedContentTypes, setSelectedContentTypes } = useContent();
  const [step, setStep] = useState(1);
  const [contentParams, setContentParams] = useState<{ [key: string]: any }>({});
  const [generatedContent, setGeneratedContent] = useState<{ [key: string]: any }>({});
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});

  // Initialize content parameters for each content type
  useEffect(() => {
    if (selectedContentTypes.length > 0) {
      const initialParams: { [key: string]: any } = {};
      selectedContentTypes.forEach(type => {
        initialParams[type] = {
          topic: '',
          keywords: '',
          tone: 'professional',
          audience: ''
        };
      });
      setContentParams(initialParams);
    }
  }, [selectedContentTypes]);

  const handleSelectContentTypes = () => {
    if (selectedContentTypes.length === 0) {
      alert('Please select at least one content type');
      return;
    }
    setStep(2);
  };

  const handleUpdateParams = (type: string, field: string, value: string) => {
    setContentParams(prev => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [field]: value
      }
    }));
  };

  const handleGenerateContent = async (type: string) => {
    setIsGenerating(prev => ({ ...prev, [type]: true }));

    try {
      // In a real implementation, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Simulate generated content
      const content = `This is generated ${type} content about "${contentParams[type]?.topic || 'your topic'}".\n\n`;
      const paragraphs = [
        `Introduction: Setting the stage for this fascinating topic.`,
        `Main Point 1: Exploring the key aspects and implications.`,
        `Main Point 2: Analyzing important factors to consider.`,
        `Main Point 3: Providing valuable insights for your audience.`,
        `Conclusion: Summarizing the important takeaways and next steps.`
      ];

      setGeneratedContent(prev => ({
        ...prev,
        [type]: content + paragraphs.join('\n\n')
      }));
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
    } finally {
      setIsGenerating(prev => ({ ...prev, [type]: false }));
    }
  };

  const renderContentSelection = () => (
    <div className="space-y-6">
      {/* Content Types Card Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Choose Content Types</h2>
          <p className="text-gray-600">
            Select the types of content you want to create for your marketing strategy
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CONTENT_TYPES).map(([type, details]) => (
          <Card
            key={type}
            className={`p-6 cursor-pointer transition-all ${selectedContentTypes.includes(type)
                ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                : 'border border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => {
              const newTypes = selectedContentTypes.includes(type)
                ? selectedContentTypes.filter(t => t !== type)
                : [...selectedContentTypes, type];
              setSelectedContentTypes(newTypes);
            }}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold mb-2">{type}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedContentTypes.includes(type)
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
                }`}>
                {selectedContentTypes.includes(type) && (
                  <span className="text-white">✓</span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">{details.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2 mb-4">
              {details.activities.slice(0, 3).map((activity: string) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 mr-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSelectContentTypes}
          disabled={selectedContentTypes.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderContentParameters = () => (
    <div>
      {/* Content Details Card Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Content Details</h2>
          <p className="text-gray-600">Specify the details for each content type you want to create</p>
        </div>
      </Card>

      {selectedContentTypes.map(type => (
        <Card key={type} className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">{type}</span>
              {generatedContent[type] && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <input
                  type="text"
                  value={contentParams[type]?.topic || ''}
                  onChange={(e) => handleUpdateParams(type, 'topic', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder={`What is this ${type.toLowerCase()} about?`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Keywords</label>
                <input
                  type="text"
                  value={contentParams[type]?.keywords || ''}
                  onChange={(e) => handleUpdateParams(type, 'keywords', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter keywords separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tone</label>
                <select
                  value={contentParams[type]?.tone || 'professional'}
                  onChange={(e) => handleUpdateParams(type, 'tone', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Audience</label>
                <input
                  type="text"
                  value={contentParams[type]?.audience || ''}
                  onChange={(e) => handleUpdateParams(type, 'audience', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Who is this content for?"
                />
              </div>

              {generatedContent[type] ? (
                <div>
                  <h4 className="text-lg font-medium mb-2">Generated Content</h4>
                  <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap">
                    {generatedContent[type]}
                  </div>
                  <button
                    onClick={() => handleGenerateContent(type)}
                    className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Regenerate
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleGenerateContent(type)}
                  disabled={isGenerating[type] || !contentParams[type]?.topic}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating[type] ? (
                    'Generating...'
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate {type}
                    </>
                  )}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Selection
        </button>
        <button
          onClick={() => router.push('/creation-hub')}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
        >
          Save & Exit
        </button>
      </div>
    </div>
  );

  // If a specific contentType was passed in (like from a subpage)
  if (contentType) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contentType}</h1>
            <p className="text-gray-600 mt-2">{description || `Create ${contentType.toLowerCase()} with AI assistance`}</p>
          </div>
          <Link href="/creation-hub">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Hub</span>
            </button>
          </Link>
        </div>

        {/* AI Insights Section */}
        {insights && insights.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
            <div className="flex items-center mb-3">
              <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
              <h2 className="text-lg font-semibold text-blue-900">AI Insights</h2>
            </div>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-blue-800">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content steps if provided */}
        {steps && steps.length > 0 ? (
          <div className="space-y-6">
            {steps.map((stepLabel, index) => (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle>Step {index + 1}: {stepLabel}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Customized form fields could go here for each step */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {index === 0 ? 'Topic' : index === 1 ? 'Target Audience' : 'Content Details'}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        placeholder={`Enter details for ${stepLabel.toLowerCase()}`}
                      />
                    </div>
                    {index === steps.length - 1 && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create Your {contentType}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Topic</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder={`What is this ${contentType.toLowerCase()} about?`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Keywords</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Creator</h1>
          <p className="text-gray-600 mt-2">Generate high-quality content aligned with your marketing strategy</p>
        </div>
        <div className="flex gap-4">
          <Link href="/content-strategy">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FileText className="w-5 h-5" />
              <span>Content Strategy</span>
            </button>
          </Link>
        </div>
      </div>

      {step === 1 ? renderContentSelection() : renderContentParameters()}
    </div>
  );
};

export default ContentCreator;