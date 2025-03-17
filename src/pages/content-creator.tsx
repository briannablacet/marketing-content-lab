// src/pages/content-creator.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ContentProvider } from '../context/ContentContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { MarketingProvider } from '../context/MarketingContext';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CONTENT_TYPES } from '../data/contentTypeData';

const ContentCreatorPage = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredType, setHoveredType] = useState(null);
  
  // Navigate to the specific content creator page
  const handleSelectContentType = (contentTypeId) => {
    const contentType = CONTENT_TYPES.find(type => type.id === contentTypeId);
    
    if (contentType && !contentType.implemented) {
      // For content types that don't have pages yet
      alert(`The ${contentType.title} creator is coming soon!`);
      return;
    }
    
    router.push(`/content-creator/${contentTypeId}`);
  };

  // Find the content type object based on selected ID
  const selectedContentType = CONTENT_TYPES.find(type => type.id === selectedType);
  
  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <WritingStyleProvider>
            <WalkthroughProvider>
              <ScreenTemplate
                title="Content Creator"
                subtitle="Create a single piece of high-quality content"
                hideNavigation={true}
              >
                <div className="py-6 max-w-3xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Content Type</h2>
                    <p className="text-gray-600">
                      Choose the type of content you want to create. Our AI assistant will guide you through creating one high-quality piece optimized for your marketing goals.
                    </p>
                  </div>
                  
                  {/* Clean dropdown interface */}
                  <Card className="p-6 mb-8">
                    <h3 className="text-base font-medium mb-3">What would you like to create?</h3>
                    
                    <div className="relative mb-6">
                      <div 
                        className="border rounded-md p-3 flex justify-between items-center cursor-pointer hover:border-blue-500"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <div className="flex items-center">
                          {selectedContentType ? (
                            <>
                              <span className="mr-3">{selectedContentType.icon}</span>
                              <span>{selectedContentType.title}</span>
                              {!selectedContentType.implemented && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Coming Soon</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500">Select content type</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                      </div>
                      
                      {/* Dropdown */}
                      {dropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-80 overflow-y-auto">
                          {CONTENT_TYPES.map(contentType => (
                            <div
                              key={contentType.id}
                              className={`p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex items-center justify-between ${!contentType.implemented ? 'opacity-70' : ''}`}
                              onClick={() => {
                                setSelectedType(contentType.id);
                                setDropdownOpen(false);
                              }}
                              onMouseEnter={() => setHoveredType(contentType.id)}
                              onMouseLeave={() => setHoveredType(null)}
                            >
                              <div className="flex items-center">
                                <span className="mr-3">{contentType.icon}</span>
                                <span>{contentType.title}</span>
                              </div>
                              {!contentType.implemented && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Coming Soon</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Content details */}
                    {selectedContentType && (
                      <div className="mb-6">
                        <div className="mb-4">
                          <h4 className="text-lg font-medium mb-2 flex items-center">
                            {selectedContentType.icon}
                            <span className="ml-2">{selectedContentType.title}</span>
                            {!selectedContentType.implemented && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Coming Soon</span>
                            )}
                          </h4>
                          <p className="text-gray-600">{selectedContentType.description}</p>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                          <h5 className="text-sm font-medium text-blue-700 mb-2">Tips & Best Practices</h5>
                          <ul className="space-y-1">
                            {selectedContentType.insights.map((insight, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSelectContentType(selectedType)}
                        disabled={!selectedType}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </Card>
                  
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </ScreenTemplate>
            </WalkthroughProvider>
          </WritingStyleProvider>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default ContentCreatorPage;