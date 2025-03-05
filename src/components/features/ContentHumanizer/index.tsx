// src/components/features/ContentHumanizer/index.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotification } from '../../../context/NotificationContext';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useMessaging } from '../../../context/MessagingContext';
import { AlertCircle, ArrowRight, Copy, RefreshCw } from 'lucide-react';

const ContentHumanizer: React.FC = () => {
  const { showNotification } = useNotification();
  const { writingStyle } = useWritingStyle();
  const { messaging } = useMessaging();

  const [content, setContent] = useState('');
  const [humanizedContent, setHumanizedContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleWarning, setStyleWarning] = useState<string | null>(null);
  const [options, setOptions] = useState({
    tone: 'conversational',
    formality: 'neutral',
    simplify: false,
    preserveKeyPoints: true
  });

  // Check if writing style and messaging are configured
  useEffect(() => {
    const hasWritingStyle = !!(writingStyle && (
      (writingStyle.styleGuide && writingStyle.styleGuide.primary) || 
      (writingStyle.formatting && Object.keys(writingStyle.formatting).length > 0)
    ));
    
    const hasMessaging = !!(messaging && (
      messaging.valueProposition || 
      (messaging.keyMessages && messaging.keyMessages.length > 0)
    ));
    
    if (!hasWritingStyle && !hasMessaging) {
      setStyleWarning('No Writing Style or Messaging configured. Content will use generic styling.');
    } else if (!hasWritingStyle) {
      setStyleWarning('No Writing Style configured. Content will use generic styling.');
    } else if (!hasMessaging) {
      setStyleWarning('No Messaging configured. Content may not align with your key messages.');
    } else {
      setStyleWarning(null);
    }

    // If writing style is configured, use its tone
    if (writingStyle?.brandVoice?.tone) {
      setOptions(prev => ({
        ...prev,
        tone: writingStyle.brandVoice.tone.toLowerCase()
      }));
    }
  }, [writingStyle, messaging]);

  // Enhanced humanization process
  const humanizeContent = async () => {
    if (!content.trim()) {
      showNotification('Please enter content to humanize', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare writing style and messaging parameters
      const styleParameters = {
        styleGuide: writingStyle?.styleGuide?.primary || 'Default',
        tone: writingStyle?.brandVoice?.tone || options.tone,
        formatting: writingStyle?.formatting || {},
        punctuation: writingStyle?.punctuation || {}
      };
      
      const messagingParameters = {
        valueProposition: messaging?.valueProposition || '',
        keyMessages: messaging?.keyMessages || [],
        keyBenefits: messaging?.keyBenefits || [],
        targetAudience: messaging?.targetAudience || ''
      };

      const response = await fetch('/api/content-humanizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
        },
        body: JSON.stringify({
          content: content,
          parameters: {
            ...options,
            styleGuideParameters: styleParameters,
            messagingParameters: messagingParameters
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setHumanizedContent(responseData.content);
      showNotification('Content humanized successfully', 'success');
    } catch (error) {
      console.error('Error in humanizeContent:', error);
      showNotification('Failed to humanize content', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Humanizer</h1>
        <p className="text-gray-600">Make AI-generated content sound more natural and human-written</p>
        
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
              "Humanizing AI content improves engagement by up to 40%",
              "The AI will maintain your key messages while making the text flow naturally",
              writingStyle?.styleGuide?.primary 
                ? `Using your "${writingStyle.styleGuide.primary}" style guide for consistent brand voice` 
                : "Tone will be adjusted to sound authentic and conversational"
            ].map((insight, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Options Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Humanization Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select 
                className="w-full p-2 border rounded"
                value={options.tone}
                onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value }))}
                disabled={!!writingStyle?.brandVoice?.tone}
              >
                <option value="conversational">Conversational</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="casual">Casual</option>
              </select>
              {writingStyle?.brandVoice?.tone && (
                <p className="text-xs text-slate-500 mt-1">Using tone from your brand voice settings</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Formality</label>
              <select 
                className="w-full p-2 border rounded"
                value={options.formality}
                onChange={(e) => setOptions(prev => ({ ...prev, formality: e.target.value as any }))}
              >
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="simplify"
                checked={options.simplify}
                onChange={(e) => setOptions(prev => ({ ...prev, simplify: e.target.checked }))}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="simplify" className="ml-2 block text-sm text-gray-900">
                Simplify language
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserveKeyPoints"
                checked={options.preserveKeyPoints}
                onChange={(e) => setOptions(prev => ({ ...prev, preserveKeyPoints: e.target.checked }))}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="preserveKeyPoints" className="ml-2 block text-sm text-gray-900">
                Preserve key points
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Original Content</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your AI-generated content here..."
            className="w-full h-64 p-4 border rounded-md"
            disabled={isProcessing}
          />
          
          <button
            onClick={humanizeContent}
            disabled={isProcessing || !content.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Humanizing Content...
              </>
            ) : (
              <>
                <span>Humanize Content</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Humanized Result */}
      {humanizedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Humanized Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
              {humanizedContent}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(humanizedContent);
                showNotification('Copied to clipboard', 'success');
              }}
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
            >
              <Copy className="mr-2 w-4 h-4" />
              Copy to Clipboard
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentHumanizer;