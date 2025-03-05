// src/components/features/ContentCreator/index.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, FileText, Sparkles, Send, ArrowLeft } from 'lucide-react';

// Content types that can be created
const CONTENT_TYPES = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Engaging articles to inform and attract your audience',
    template: {
      title: '',
      keywords: [],
      sections: [
        { title: 'Introduction', content: '' },
        { title: 'Key Points', content: '' },
        { title: 'Conclusion', content: '' }
      ],
      targetAudience: '',
      callToAction: ''
    }
  },
  {
    id: 'social-media-post',
    name: 'Social Media Post',
    description: 'Compelling posts for your social channels',
    template: {
      platform: 'LinkedIn', // Default platform
      messageType: 'Thought Leadership', // Default type
      content: '',
      hashtags: [],
      callToAction: ''
    }
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Professional emails for your campaigns',
    template: {
      subject: '',
      preheader: '',
      greeting: '',
      body: '',
      callToAction: '',
      signoff: ''
    }
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Conversion-focused landing page content',
    template: {
      headline: '',
      subheadline: '',
      valueProps: [],
      features: [],
      testimonials: [],
      callToAction: '',
      seo: { title: '', description: '', keywords: [] }
    }
  }
];

const ContentCreator = () => {
  const router = useRouter();
  const { type: contentTypeParam } = router.query;
  
  const [selectedType, setSelectedType] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [step, setStep] = useState('type-selection'); // 'type-selection', 'details', 'content-generation', 'review'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  
  // Set the content type from URL params if provided
  useEffect(() => {
    if (contentTypeParam) {
      const matchedType = CONTENT_TYPES.find(type => 
        type.name.toLowerCase() === contentTypeParam.toString().toLowerCase()
      );
      
      if (matchedType) {
        handleSelectType(matchedType);
      }
    }
  }, [contentTypeParam]);
  
  // Handle content type selection
  const handleSelectType = (contentType) => {
    setSelectedType(contentType);
    setContentData(contentType.template);
    setStep('details');
  };
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setContentData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle nested field changes (for sections, etc.)
  const handleNestedChange = (field, index, subfield, value) => {
    setContentData(prev => {
      const updated = [...prev[field]];
      updated[index] = {
        ...updated[index],
        [subfield]: value
      };
      return {
        ...prev,
        [field]: updated
      };
    });
  };
  
  // Handle array field changes (for keywords, hashtags, etc.)
  const handleArrayChange = (field, value) => {
    // Split by commas and trim
    const arrayValues = value.split(',').map(item => item.trim());
    setContentData(prev => ({
      ...prev,
      [field]: arrayValues
    }));
  };
  
  // Generate content with AI
  const generateContent = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, generate mock content based on type
      let demoContent;
      
      if (selectedType.id === 'blog-post') {
        demoContent = {
          title: `How to Maximize Your ${contentData.targetAudience} Strategy`,
          sections: [
            {
              title: 'Introduction',
              content: `In today's competitive landscape, every ${contentData.targetAudience} professional needs to stay ahead of the curve. This article explores essential strategies that will help you achieve your goals and overcome common challenges.`
            },
            {
              title: 'Key Points',
              content: `First, it's important to understand the current trends affecting ${contentData.targetAudience}. Research shows that companies investing in innovative approaches see 3x better results than those using traditional methods.\n\nSecond, building a coherent strategy that aligns with your business objectives is critical. This means identifying your core strengths and leveraging them effectively.\n\nThird, measuring the right metrics will keep you on track. Focus on outcomes rather than outputs to ensure meaningful progress.`
            },
            {
              title: 'Conclusion',
              content: `By implementing these strategies, you'll be well-positioned to excel in your ${contentData.targetAudience} initiatives. Remember that consistency and adaptation are key to long-term success.`
            }
          ],
          callToAction: `Ready to transform your ${contentData.targetAudience} approach? Contact us today for a free consultation.`
        };
      } else if (selectedType.id === 'social-media-post') {
        demoContent = {
          content: `Looking to elevate your ${contentData.platform} presence? Our latest research reveals that companies focusing on authentic engagement see 40% higher conversion rates. #${contentData.messageType.replace(/\s+/g, '')} #MarketingTips`,
          hashtags: ['Marketing', contentData.messageType.replace(/\s+/g, ''), 'Strategy'],
          callToAction: 'Click the link in bio to learn more!'
        };
      } else if (selectedType.id === 'email') {
        demoContent = {
          subject: `Transform Your Business with Our ${contentData.greeting} Solutions`,
          preheader: 'Discover how our tools can help you grow',
          greeting: `Hi ${contentData.greeting || 'there'},`,
          body: `I hope this email finds you well. I wanted to reach out to share some exciting new developments that could help your business.\n\nOur team has been working hard to develop solutions that address the key challenges you're facing. Based on feedback from clients like you, we've created a suite of tools that can help you achieve your goals more efficiently.\n\nWould you be interested in learning more about how these solutions could benefit your specific situation?`,
          callToAction: contentData.callToAction || 'Schedule a Call',
          signoff: 'Best regards,\nThe Market Multiplier Team'
        };
      } else if (selectedType.id === 'landing-page') {
        demoContent = {
          headline: `Revolutionary Solutions for ${contentData.headline || 'Your Business'}`,
          subheadline: 'Transform your approach with our innovative platform',
          valueProps: ['Increase efficiency by 40%', 'Reduce costs significantly', 'Improve customer satisfaction'],
          features: ['Intuitive dashboard', 'Advanced analytics', 'Seamless integration'],
          testimonials: ['Market Multiplier has completely transformed our workflow. - John Smith, CEO'],
          callToAction: contentData.callToAction || 'Get Started Today',
          seo: { 
            title: `${contentData.headline || 'Business'} Solutions | Market Multiplier`, 
            description: `Discover how our platform can transform your ${contentData.headline || 'business'} operations and drive growth.`, 
            keywords: ['solution', 'platform', 'business growth'] 
          }
        };
      }
      
      setGeneratedContent(demoContent);
      setStep('review');
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Render type selection screen
  const renderTypeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Select Content Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CONTENT_TYPES.map(type => (
          <Card 
            key={type.id}
            className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleSelectType(type)}
          >
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <Pencil className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-slate-600 text-sm">{type.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // Render form fields based on selected content type
  const renderDetailsForm = () => {
    if (!selectedType) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{selectedType.name} Details</h2>
          <button 
            onClick={() => setStep('type-selection')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Change Type
          </button>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            {selectedType.id === 'blog-post' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.targetAudience || ''}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Marketing Professionals, Small Business Owners"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.keywords ? contentData.keywords.join(', ') : ''}
                    onChange={(e) => handleArrayChange('keywords', e.target.value)}
                    placeholder="e.g., marketing strategy, ROI, digital marketing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Call to Action</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.callToAction || ''}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="e.g., Subscribe to our newsletter, Contact us today"
                  />
                </div>
              </>
            )}
            
            {selectedType.id === 'social-media-post' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={contentData.platform || 'LinkedIn'}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message Type</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={contentData.messageType || 'Thought Leadership'}
                    onChange={(e) => handleInputChange('messageType', e.target.value)}
                  >
                    <option value="Thought Leadership">Thought Leadership</option>
                    <option value="Product Announcement">Product Announcement</option>
                    <option value="Industry News">Industry News</option>
                    <option value="Tips and Tricks">Tips and Tricks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Call to Action</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.callToAction || ''}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="e.g., Click link in bio, Register now"
                  />
                </div>
              </>
            )}
            
            {selectedType.id === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Greeting (recipient name/title)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.greeting || ''}
                    onChange={(e) => handleInputChange('greeting', e.target.value)}
                    placeholder="e.g., Marketing Manager, valued customer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Call to Action</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.callToAction || ''}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="e.g., Schedule a Call, Read More"
                  />
                </div>
              </>
            )}
            
            {selectedType.id === 'landing-page' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Headline Focus</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.headline || ''}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    placeholder="e.g., Marketing Automation, Team Productivity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Call to Action</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={contentData.callToAction || ''}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="e.g., Get Started, Request a Demo"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* AI Insights Box */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✨</span>
              <h3 className="font-medium">AI Insights</h3>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-slate-700">
                <span className="text-blue-600 mr-2">•</span>
                Adding specific details helps create more targeted content
              </li>
              <li className="text-sm text-slate-700">
                <span className="text-blue-600 mr-2">•</span>
                Our AI will optimize content for your selected parameters
              </li>
              <li className="text-sm text-slate-700">
                <span className="text-blue-600 mr-2">•</span>
                You can edit any generated content before finalizing
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <button
            onClick={generateContent}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Content
          </button>
        </div>
      </div>
    );
  };
  
  // Render content generation screen (loading state)
  const renderGenerating = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">Generating Your Content</h3>
      <p className="text-gray-600">
        Our AI is creating high-quality content based on your specifications...
      </p>
    </div>
  );
  
  // Render content review screen
  const renderReview = () => {
    if (!generatedContent) return null;
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Review Your Generated Content</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedType.id === 'blog-post' && 'Blog Post'}
              {selectedType.id === 'social-media-post' && `${contentData.platform} Post`}
              {selectedType.id === 'email' && 'Email Content'}
              {selectedType.id === 'landing-page' && 'Landing Page Content'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {selectedType.id === 'blog-post' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold">{generatedContent.title}</h3>
                  
                  {generatedContent.sections.map((section, index) => (
                    <div key={index} className="mt-4">
                      <h4 className="font-medium mb-2">{section.title}</h4>
                      <div className="p-4 bg-gray-50 rounded whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Call to Action</h4>
                    <div className="p-4 bg-blue-50 rounded">
                      {generatedContent.callToAction}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {selectedType.id === 'social-media-post' && (
              <div className="p-4 bg-gray-50 rounded">
                <p className="mb-4">{generatedContent.content}</p>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag, index) => (
                    <span key={index} className="text-blue-600">#{tag}</span>
                  ))}
                </div>
                {generatedContent.callToAction && (
                  <div className="mt-4 text-sm font-medium">
                    {generatedContent.callToAction}
                  </div>
                )}
              </div>
            )}
            
            {selectedType.id === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <div className="p-3 bg-gray-50 rounded">{generatedContent.subject}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preheader</label>
                  <div className="p-3 bg-gray-50 rounded">{generatedContent.preheader}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Body</label>
                  <div className="p-3 bg-gray-50 rounded whitespace-pre-line">
                    {generatedContent.greeting}<br /><br />
                    {generatedContent.body}<br /><br />
                    <b>{generatedContent.callToAction}</b><br /><br />
                    {generatedContent.signoff}
                  </div>
                </div>
              </div>
            )}
            
            {selectedType.id === 'landing-page' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Headline</label>
                  <div className="p-3 bg-gray-50 rounded text-xl font-bold">
                    {generatedContent.headline}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subheadline</label>
                  <div className="p-3 bg-gray-50 rounded">
                    {generatedContent.subheadline}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value Propositions</label>
                  <div className="p-3 bg-gray-50 rounded">
                    <ul className="space-y-2">
                      {generatedContent.valueProps.map((prop, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          {prop}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Features</label>
                  <div className="p-3 bg-gray-50 rounded">
                    <ul className="space-y-2">
                      {generatedContent.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Call to Action</label>
                  <div className="p-3 bg-blue-100 rounded text-center font-bold">
                    {generatedContent.callToAction}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <button
            onClick={() => setStep('details')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </button>
          
          <div className="space-x-4">
            <button
              onClick={generateContent}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              Regenerate
            </button>
            <button
              onClick={() => {
                // In a real app, you'd save or export the content here
                // For now, just show a success message
                alert(`${selectedType.name} created successfully!`);
                router.push('/creation-hub');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Use This Content
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render method
  const renderStep = () => {
    if (isGenerating) {
      return renderGenerating();
    }
    
    switch (step) {
      case 'type-selection':
        return renderTypeSelection();
      case 'details':
        return renderDetailsForm();
      case 'review':
        return renderReview();
      default:
        return renderTypeSelection();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Content Creator</h1>
        <p className="text-gray-600">
          Create professional, AI-assisted content for your marketing needs
        </p>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default ContentCreator;