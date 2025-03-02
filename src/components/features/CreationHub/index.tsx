// src/components/features/CreationHub/index.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Content types a user might want to create or repurpose
const CONTENT_FORMATS = [
  { 
    id: 'blog', 
    name: 'Blog Posts', 
    icon: '📝',
    description: 'Engage your audience with SEO-friendly articles'
  },
  { 
    id: 'email', 
    name: 'Email Sequences', 
    icon: '📧',
    description: 'Nurture leads with automated email campaigns'
  },
  { 
    id: 'social', 
    name: 'Social Media', 
    icon: '📱',
    description: 'Create engaging posts for multiple platforms'
  },
  { 
    id: 'whitepaper', 
    name: 'Whitepapers', 
    icon: '📄',
    description: 'Establish thought leadership with in-depth research'
  },
  { 
    id: 'video', 
    name: 'Video Scripts', 
    icon: '🎬',
    description: 'Draft compelling scripts for video content'
  }
];

const CreationHub = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'repurpose'
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [sourceFormat, setSourceFormat] = useState(null);
  const [targetFormat, setTargetFormat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);

  const handleCreateContent = async () => {
    if (!selectedFormat) return;
    
    setIsLoading(true);
    // In a real implementation, this would call your API
    setTimeout(() => {
      setResult({
        title: `Sample ${selectedFormat.name}`,
        content: `This is a sample ${selectedFormat.name.toLowerCase()} generated for demonstration purposes. In the real implementation, this would be AI-generated content based on your marketing strategy and messaging.`
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleRepurposeContent = async () => {
    if (!sourceFormat || !targetFormat || !content) return;
    
    setIsLoading(true);
    // In a real implementation, this would call your API
    setTimeout(() => {
      setResult({
        title: `Repurposed from ${sourceFormat.name} to ${targetFormat.name}`,
        content: `This is the repurposed content from ${sourceFormat.name.toLowerCase()} to ${targetFormat.name.toLowerCase()}. The original content: "${content.substring(0, 50)}..." has been transformed.`
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Creation Hub</h1>
        <p className="text-gray-600">Create or repurpose content with AI assistance</p>
      </div>

      {/* Tab navigation */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'create' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('create')}
        >
          Create New Content
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'repurpose' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('repurpose')}
        >
          Repurpose Existing Content
        </button>
      </div>

      {/* Create Content Tab */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CONTENT_FORMATS.map(format => (
                  <div
                    key={format.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedFormat?.id === format.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedFormat(format)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{format.icon}</span>
                      <h3 className="font-medium">{format.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedFormat && (
            <Card>
              <CardHeader>
                <CardTitle>Configure {selectedFormat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Here you would add specific configuration options based on the content type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Topic</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder={`Enter topic for your ${selectedFormat.name.toLowerCase()}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <select className="w-full p-2 border rounded">
                      <option value="">Select audience</option>
                      <option>Technical Decision Makers</option>
                      <option>Business Executives</option>
                      <option>End Users</option>
                    </select>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleCreateContent}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Generating...' : `Generate ${selectedFormat.name}`}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Repurpose Content Tab */}
      {activeTab === 'repurpose' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Convert Content Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Source Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONTENT_FORMATS.map(format => (
                      <div
                        key={format.id}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          sourceFormat?.id === format.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-blue-300'
                        }`}
                        onClick={() => setSourceFormat(format)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{format.icon}</span>
                          <span>{format.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Target Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONTENT_FORMATS.map(format => (
                      <div
                        key={format.id}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          format.id === sourceFormat?.id ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          targetFormat?.id === format.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-blue-300'
                        }`}
                        onClick={() => {
                          if (format.id !== sourceFormat?.id) {
                            setTargetFormat(format);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{format.icon}</span>
                          <span>{format.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {sourceFormat && targetFormat && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Content to Repurpose</label>
                  <textarea
                    className="w-full p-3 border rounded h-40"
                    placeholder={`Paste your existing ${sourceFormat.name} content here`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                  
                  <div className="mt-4">
                    <button
                      onClick={handleRepurposeContent}
                      disabled={isLoading || !content}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Converting...' : `Convert to ${targetFormat?.name}`}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded border whitespace-pre-wrap">
              {result.content}
            </div>
            <div className="mt-4 flex gap-4">
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Copy to Clipboard
              </button>
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Download
              </button>
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Edit Further
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreationHub;