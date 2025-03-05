// src/components/features/ContentRepurposer/index.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotification } from '../../../context/NotificationContext';
import { useWritingStyle } from '../../../context/WritingStyleContext'; // Add this
import { useMessaging } from '../../../context/MessagingContext'; // Add this
import { ArrowRight, FileText, Copy, AlertCircle } from 'lucide-react';

const ContentRepurposer: React.FC = () => {
  const { showNotification } = useNotification();
  const { writingStyle } = useWritingStyle(); // Get writing style
  const { messaging } = useMessaging(); // Get messaging
  
  const [content, setContent] = useState('');
  const [sourceFormat, setSourceFormat] = useState('Blog Post');
  const [targetFormat, setTargetFormat] = useState('Social Media');
  const [repurposedContent, setRepurposedContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleWarning, setStyleWarning] = useState<string | null>(null);

  const contentFormats = [
    'Blog Post',
    'Social Media',
    'Email Newsletter',
    'Landing Page',
    'Video Script',
    'Whitepaper',
    'Case Study',
    'Press Release'
  ];

  // Check if writing style and messaging are configured
  useEffect(() => {
    const hasWritingStyle = writingStyle?.styleGuide?.primary || 
                           (writingStyle?.formatting && Object.keys(writingStyle.formatting).length > 0);
    
    const hasMessaging = messaging?.valueProposition || 
                        (messaging?.keyMessages && messaging.keyMessages.length > 0);
    
    if (!hasWritingStyle && !hasMessaging) {
      setStyleWarning('No Writing Style or Messaging configured. Content will use generic styling.');
    } else if (!hasWritingStyle) {
      setStyleWarning('No Writing Style configured. Content will use generic styling.');
    } else if (!hasMessaging) {
      setStyleWarning('No Messaging configured. Content may not align with your key messages.');
    } else {
      setStyleWarning(null);
    }
  }, [writingStyle, messaging]);

  const handleRepurpose = async () => {
    if (!content.trim()) {
      showNotification('Please enter content to repurpose', 'warning');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare writing style and messaging parameters
      const styleParameters = {
        styleGuide: writingStyle?.styleGuide?.primary || 'Default',
        tone: writingStyle?.brandVoice?.tone || 'Professional',
        formatting: writingStyle?.formatting || {},
        punctuation: writingStyle?.punctuation || {}
      };
      
      const messagingParameters = {
        valueProposition: messaging?.valueProposition || '',
        keyMessages: messaging?.keyMessages || [],
        keyBenefits: messaging?.keyBenefits || [],
        targetAudience: messaging?.targetAudience || ''
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'content-repurposer',
          data: {
            content,
            sourceFormat,
            targetFormat,
            styleGuide: styleParameters,
            messaging: messagingParameters
          }
        }),
      });

      const data = await response.json();
      setRepurposedContent(data.repurposedContent);
      showNotification('Content repurposed successfully', 'success');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to repurpose content', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Repurposer</h1>
        <p className="text-gray-600">Transform your content from one format to another while preserving key messages</p>
        
        {/* Style Warning Alert */}
        {styleWarning && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-700">{styleWarning}</p>
              <p className="text-sm text-yellow-600 mt-1">
                Consider setting up your <a href="/writing-style" className="underline">Writing Style</a> and <a href="/messaging" className="underline">Messaging</a> first.
              </p>
            </div>
          </div>
        )}
        
        {/* AI Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium mb-2 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            AI Insights
          </h3>
          <ul className="space-y-2">
            {[
              "Repurposing existing content can save up to 60% of content creation time",
              "Each format has unique requirements the AI will automatically adapt to",
              writingStyle?.styleGuide?.primary 
                ? `Using your "${writingStyle.styleGuide.primary}" style guide for consistent brand voice` 
                : "Your brand voice will be preserved across all content versions"
            ].map((insight, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
};

export default ContentRepurposer;