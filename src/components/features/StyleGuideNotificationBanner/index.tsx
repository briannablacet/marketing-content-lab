// src/components/features/StyleGuideNotificationBanner/index.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Settings, X, Sparkles } from 'lucide-react';

const StyleGuideNotificationBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isStyleConfigured, setIsStyleConfigured] = useState(false);

  // Check if writing style is configured on component mount
  useEffect(() => {
    const checkWritingStyle = () => {
      try {
        // Check the WritingStyleContext storage key
        const writingStyleData = localStorage.getItem('marketing-content-lab-writing-style');

        // Also check the brand voice storage (from walkthrough)
        const brandVoiceData = localStorage.getItem('marketing-content-lab-brand-voice');

        if (writingStyleData) {
          const parsedStyle = JSON.parse(writingStyleData);
          // Check if it has a configured style guide (not just the default)
          if (parsedStyle.styleGuide?.primary &&
            parsedStyle.styleGuide.primary !== '' &&
            parsedStyle.styleGuide.primary !== 'Chicago Manual of Style') {
            setIsStyleConfigured(true);
            return;
          }
        }

        if (brandVoiceData) {
          const parsedBrandVoice = JSON.parse(brandVoiceData);
          // Check if brand voice has writing style info
          if (parsedBrandVoice.brandVoice?.tone ||
            parsedBrandVoice.brandVoice?.style ||
            parsedBrandVoice.writingStyle) {
            setIsStyleConfigured(true);
            return;
          }
        }

        // If neither has configured data, show the banner
        setIsStyleConfigured(false);
      } catch (error) {
        console.error('Error checking writing style configuration:', error);
        setIsStyleConfigured(false);
      }
    };

    checkWritingStyle();
  }, []);

  // Don't show banner if style is configured or manually dismissed
  if (isStyleConfigured || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">Enhance Your Content</p>
              <p className="text-amber-700 text-sm mt-1">
                We recommend using the Branding Wizard or using the standalone tools to set your brand personality and writing style before generating content.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            <Link
              href="/walkthrough/1"
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded flex items-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Start Branding Wizard
            </Link>

            <button
              onClick={handleDismiss}
              className="text-amber-500 hover:text-amber-700"
              aria-label="Dismiss notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleGuideNotificationBanner;