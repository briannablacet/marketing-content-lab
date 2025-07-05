// src/components/features/ContentEditChat/index.tsx
// SIMPLIFIED: Clean improvement flow with elegant change display - FIXED

import React, { useState } from "react";
import {
  Loader2,
  Wand2,
  CheckCircle,
  X,
  Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChangeDisplay from "../../shared/ChangeDisplay";

interface ContentEditChatProps {
  originalContent: string;
  originalTitle: string;
  contentType: string;
  onContentUpdate: (newContent: string, newTitle: string) => void;
  strategicContext?: any;
}

const PROMPT_SUGGESTIONS = {
  "blog-post": [
    "Make it more engaging",
    "Add more statistics and facts",
    "Add a compelling call-to-action",
    "Make it more conversational",
    "Improve the introduction",
    "Make it shorter and punchier"
  ],
  social: [
    "Make it more concise",
    "Add hashtags",
    "Make it more engaging",
    "Add a call-to-action",
    "Make it more shareable",
    "Add urgency"
  ],
  email: [
    "Make it more personal",
    "Simplify the language",
    "Add a stronger call-to-action",
    "Make it more compelling",
    "Make it shorter",
    "Add urgency"
  ],
  "landing-page": [
    "Make it more persuasive",
    "Add social proof",
    "Improve the call-to-action",
    "Make it more urgent",
    "Simplify the message",
    "Add benefits"
  ],
  default: [
    "Make it more engaging",
    "Simplify the language",
    "Make it more persuasive",
    "Improve the flow",
    "Make it more professional",
    "Add specific examples"
  ]
};

const ContentEditChat: React.FC<ContentEditChatProps> = ({
  originalContent,
  originalTitle,
  contentType,
  onContentUpdate,
  strategicContext
}) => {
  console.log("🚀 NEW SIMPLIFIED ContentEditChat is loading!");

  const [improvementRequest, setImprovementRequest] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [suggestedContent, setSuggestedContent] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get suggestions based on content type
  const getPromptSuggestions = () =>
    PROMPT_SUGGESTIONS[contentType as keyof typeof PROMPT_SUGGESTIONS] || PROMPT_SUGGESTIONS.default;

  // Find the actual differences between original and suggested content
  const findKeyChanges = (original: string, suggested: string) => {
    const changes = [];

    // Split into sentences for comparison
    const originalSentences = original.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const suggestedSentences = suggested.split(/[.!?]+/).filter(s => s.trim().length > 20);

    // Find sentences that actually changed
    for (let i = 0; i < Math.max(originalSentences.length, suggestedSentences.length); i++) {
      const origSent = originalSentences[i]?.trim() || '';
      const suggSent = suggestedSentences[i]?.trim() || '';

      // Only show if there's a meaningful difference
      if (origSent && suggSent && origSent !== suggSent) {
        // Skip tiny changes (just punctuation/capitalization)
        const origNormalized = origSent.toLowerCase().replace(/[^\w\s]/g, '');
        const suggNormalized = suggSent.toLowerCase().replace(/[^\w\s]/g, '');

        if (origNormalized !== suggNormalized) {
          changes.push({
            original: origSent.length > 120 ? origSent.substring(0, 120) + "..." : origSent,
            suggestion: suggSent.length > 120 ? suggSent.substring(0, 120) + "..." : suggSent,
            reason: `Applied: ${improvementRequest}`,
            type: 'improvement'
          });

          // Limit to 2-3 key changes to keep it manageable
          if (changes.length >= 2) break;
        }
      }

      // Check for new sentences (additions)
      if (!origSent && suggSent) {
        changes.push({
          original: "No previous content",
          suggestion: suggSent.length > 120 ? suggSent.substring(0, 120) + "..." : suggSent,
          reason: `Added content: ${improvementRequest}`,
          type: 'addition'
        });

        if (changes.length >= 2) break;
      }
    }

    // If no sentence-level changes found, check for new statistics
    if (changes.length === 0) {
      const originalNumbers = original.match(/\d+%|\d+\.\d+%|\d+ percent/gi) || [];
      const suggestedNumbers = suggested.match(/\d+%|\d+\.\d+%|\d+ percent/gi) || [];
      const newStats = suggestedNumbers.filter(stat => !originalNumbers.includes(stat));

      if (newStats.length > 0) {
        changes.push({
          original: "General content without specific statistics",
          suggestion: `Added statistics: ${newStats.slice(0, 3).join(', ')}`,
          reason: `Fulfilled request: ${improvementRequest}`,
          type: 'statistical'
        });
      }
    }

    return changes;
  };

  const handleImproveContent = async () => {
    if (!improvementRequest.trim()) {
      setError("Please enter what you'd like to improve");
      return;
    }

    // ✅ CLEAR old suggestions when starting new improvement
    setShowSuggestion(false);
    setSuggestedContent('');

    setIsImproving(true);
    setError(null);

    try {
      console.log('🔧 Improving content with request:', improvementRequest);

      // Use aggressive prompt to force actual changes
      const requestData = {
        mode: 'prose',
        data: {
          text: originalContent,
          options: {
            improveClarity: false,
            enhanceEngagement: false,
            adjustFormality: false,
            formalityLevel: "neutral",
            styleGuide: "Chicago Manual of Style",
            additionalInstructions: `URGENT: THE USER SPECIFICALLY WANTS: "${improvementRequest}"

YOU ABSOLUTELY MUST FULFILL THIS REQUEST. Examples:
- If they ask for statistics: ADD actual percentages, numbers, or data points
- If they ask for engagement: REWRITE sections to be more compelling  
- If they ask for call-to-action: ADD a clear CTA section

DO NOT make subtle changes. Make OBVIOUS improvements that fulfill: "${improvementRequest}"
DO NOT just fix grammar unless that's what they asked for.

CRITICAL: If you cannot fulfill this request, respond with "CANNOT_FULFILL_REQUEST" so we know.

USER REQUEST: ${improvementRequest}
MAKE SUBSTANTIAL CHANGES THAT CLEARLY ADDRESS THIS REQUEST.`
          },
          writingStyle: null,
          strategicData: null
        },
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to improve content");
      }

      const data = await response.json();
      console.log('✅ Improvement result:', data);

      const improvedContent = data.enhancedText || originalContent;

      // Check if the content actually changed
      if (improvedContent.trim() === originalContent.trim()) {
        setError('The AI returned the same content. Try rephrasing your request or being more specific.');
        return;
      }

      setSuggestedContent(improvedContent);
      setShowSuggestion(true);

    } catch (error) {
      console.error('❌ Error improving content:', error);
      setError('Failed to improve content. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  // Accept the suggestion - CLEAN EVERYTHING
  const handleAcceptSuggestion = () => {
    console.log('🎯 ACCEPTING SUGGESTION and clearing everything');

    // Update content
    onContentUpdate(suggestedContent, originalTitle);

    // FORCE clear EVERYTHING immediately - multiple times for Vercel
    setShowSuggestion(false);
    setSuggestedContent('');
    setImprovementRequest('');
    setError(null);

    // Force React to flush state updates in production
    setTimeout(() => {
      setShowSuggestion(false);
      setSuggestedContent('');
      setImprovementRequest('');
      setError(null);
    }, 0);

    // Double-check after a short delay
    setTimeout(() => {
      setShowSuggestion(false);
      setSuggestedContent('');
    }, 100);
  };

  // Reject the suggestion - CLEAN EVERYTHING  
  const handleRejectSuggestion = () => {
    console.log('🎯 REJECTING SUGGESTION and clearing everything');

    // Clear EVERYTHING for clean state
    setShowSuggestion(false);
    setSuggestedContent('');
    setImprovementRequest('');
    setError(null);
  };

  // Handle quick suggestion click
  const handleQuickSuggestion = (suggestion: string) => {
    setImprovementRequest(suggestion);
  };

  return (
    <div className="space-y-4">
      {/* Main improvement interface */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50 pb-6">
          <CardTitle className="flex items-center">
            <Wand2 className="w-5 h-5 text-gray-600 mr-2" />
            <span>Ask for Improvements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Quick suggestions */}
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Quick suggestions for your {contentType.replace('-', ' ')}:
              </p>
              <div className="flex flex-wrap gap-2">
                {getPromptSuggestions().slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    disabled={isImproving}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom improvement request */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or describe what you'd like to improve:
              </label>
              <textarea
                value={improvementRequest}
                onChange={(e) => setImprovementRequest(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 'make the conclusion stronger', 'add more examples', 'make it less formal'"
                disabled={isImproving}
              />
            </div>

            {/* Improve button */}
            <div className="flex justify-end">
              <button
                onClick={handleImproveContent}
                disabled={isImproving || !improvementRequest.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isImproving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Improve Content
                  </>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show suggestion with elegant change display */}
      {showSuggestion && (
        <div className="space-y-4">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50 pb-6">
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                Suggested Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Request: "{improvementRequest}"
                </h4>
                <p className="text-sm text-blue-700">
                  Review the changes below, then decide whether to accept them.
                </p>
              </div>

              {/* Accept/Reject buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleRejectSuggestion}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                  Keep Original
                </button>
                <button
                  onClick={handleAcceptSuggestion}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept Changes
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Use the elegant ChangeDisplay component */}
          <ChangeDisplay
            changes={findKeyChanges(originalContent, suggestedContent)}
            title="🎯 What Will Change"
            showByDefault={true}
            className="mb-4"
          />
        </div>
      )}
    </div>
  );
};

export default ContentEditChat;