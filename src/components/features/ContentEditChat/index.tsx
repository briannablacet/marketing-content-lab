// src/components/features/ContentEditChat/index.tsx
// SIMPLIFIED: Clean improvement flow that shows actual changes

import React, { useState } from "react";
import {
  Loader2,
  Wand2,
  CheckCircle,
  X,
  Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  const [lastChange, setLastChange] = useState<{
    request: string,
    beforeSnippet: string,
    afterSnippet: string
  } | null>(null);

  // Get suggestions based on content type
  const getPromptSuggestions = () =>
    PROMPT_SUGGESTIONS[contentType as keyof typeof PROMPT_SUGGESTIONS] || PROMPT_SUGGESTIONS.default;

  // Find the actual differences between original and suggested content
  const findKeyChanges = (original: string, suggested: string) => {
    const changes = [];

    // Find new statistics/percentages that were added
    const originalNumbers = original.match(/\d+%|\d+\.\d+%|\d+ percent|[\d,]+ increase|[\d,]+ decrease|[\d,]+ times more|[\d,]+ times less/gi) || [];
    const suggestedNumbers = suggested.match(/\d+%|\d+\.\d+%|\d+ percent|[\d,]+ increase|[\d,]+ decrease|[\d,]+ times more|[\d,]+ times less/gi) || [];

    // Find new statistics by comparing what's in suggested but not in original
    const newStats = suggestedNumbers.filter(stat => !originalNumbers.includes(stat));

    if (newStats.length > 0) {
      // Show the first few new statistics
      const statsToShow = newStats.slice(0, 3).join(', ');
      changes.push({
        original: "General claims without specific data",
        suggested: `Added specific statistics: ${statsToShow}`,
        type: 'added'
      });
    }

    // Find new research citations/studies
    const originalCitations = original.match(/according to [^.!?]+|study published in [^.!?]+|research from [^.!?]+|\d{4} study [^.!?]+/gi) || [];
    const suggestedCitations = suggested.match(/according to [^.!?]+|study published in [^.!?]+|research from [^.!?]+|\d{4} study [^.!?]+/gi) || [];

    const newCitations = suggestedCitations.filter(citation =>
      !originalCitations.some(orig => orig.toLowerCase().includes(citation.toLowerCase().substring(0, 20)))
    );

    if (newCitations.length > 0) {
      // Show the first new citation
      const citationToShow = newCitations[0].length > 80 ?
        newCitations[0].substring(0, 80) + "..." :
        newCitations[0];
      changes.push({
        original: "Claims without cited sources",
        suggested: `Added research citation: "${citationToShow}"`,
        type: 'added'
      });
    }

    // Show if significant content was added
    const lengthDiff = suggested.length - original.length;
    if (lengthDiff > 200) {
      changes.push({
        original: `${original.length} characters of content`,
        suggested: `${suggested.length} characters (+${lengthDiff} characters of new content)`,
        type: 'expanded'
      });
    }

    return changes.slice(0, 3); // Max 3 changes
  };

  // Handle improvement request
  const handleImproveContent = async () => {
    if (!improvementRequest.trim()) {
      setError("Please enter what you'd like to improve");
      return;
    }

    setIsImproving(true);
    setError(null);

    try {
      console.log('🔧 Improving content with request:', improvementRequest);

      // Use the EXACT same approach as ProsePerfector, but make the improvement request MANDATORY
      const requestData = {
        mode: 'prose',
        data: {
          text: originalContent,
          options: {
            improveClarity: false, // Turn these off so it focuses on YOUR request
            enhanceEngagement: false,
            adjustFormality: false,
            formalityLevel: "neutral",
            styleGuide: "Chicago Manual of Style",
            additionalInstructions: `CRITICAL REQUIREMENT: ${improvementRequest}

This is NOT optional. You MUST fulfill this specific request. The user is asking for: "${improvementRequest}"

IMPORTANT RESTRICTIONS:
- ONLY make changes related to: "${improvementRequest}"
- DO NOT fix grammar, spelling, or punctuation unless specifically asked
- DO NOT rewrite sentences unless specifically asked  
- DO NOT reorganize content unless specifically asked
- DO NOT make style improvements unless specifically asked

If they asked for statistics, ONLY add numbers/data - don't change anything else
If they asked for engagement, ONLY make it more engaging - don't add statistics
If they asked for call-to-action, ONLY add a CTA - don't change other content

FOCUS EXCLUSIVELY ON: ${improvementRequest}

Leave everything else exactly as it is.`
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

  // Accept the suggestion
  const handleAcceptSuggestion = () => {
    console.log('🎯 ACCEPTING SUGGESTION - this should show green card');

    // Instead of showing snippets, show what actually changed
    const changes = findKeyChanges(originalContent, suggestedContent);
    const changesSummary = changes.length > 0 ?
      changes.map(c => c.suggested).join('; ') :
      'Content improved as requested';

    // Store what change was applied with actual improvements shown
    setLastChange({
      request: improvementRequest,
      beforeSnippet: 'Your original content',
      afterSnippet: changesSummary
    });

    console.log('🎯 Set lastChange with improvements:', { request: improvementRequest, improvements: changesSummary });

    // Clear ALL suggestion state BEFORE updating content
    setShowSuggestion(false);
    setSuggestedContent('');
    setImprovementRequest('');

    // THEN update the content
    onContentUpdate(suggestedContent, originalTitle);
  };

  // Reject the suggestion
  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setImprovementRequest('');
  };

  // Handle quick suggestion click
  const handleQuickSuggestion = (suggestion: string) => {
    setImprovementRequest(suggestion);
  };

  return (
    <div className="space-y-4">
      {/* Show last applied change */}
      {lastChange && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50 pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Last Change Applied
              </span>
              <button
                onClick={() => setLastChange(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-3">
                  Applied: "{lastChange.request}"
                </p>
                <button
                  onClick={() => setLastChange(null)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Clear
                </button>
              </div>

              {/* Show what was changed */}
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xs font-bold text-green-700 mb-2">WHAT WAS CHANGED:</div>
                  <div className="text-sm text-green-800 leading-relaxed">
                    {lastChange.afterSnippet}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50 pb-6">
          <CardTitle className="flex items-center">
            <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
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
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 'make the conclusion stronger', 'add more examples', 'make it less formal'"
                disabled={isImproving}
              />
            </div>

            {/* Improve button */}
            <div className="flex justify-end">
              <button
                onClick={handleImproveContent}
                disabled={isImproving || !improvementRequest.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

      {/* Show suggestion with Accept/Reject */}
      {showSuggestion && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50 pb-6">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                Suggested Improvement
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Show what's changing FIRST */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">
                  Request: "{improvementRequest}"
                </h4>

                {/* Show specific changes that were made */}
                <div className="space-y-3">
                  {(() => {
                    const changes = findKeyChanges(originalContent, suggestedContent);

                    if (changes.length === 0) {
                      return (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-sm text-yellow-800">
                            Changes may be subtle or throughout the content. See full preview below.
                          </div>
                        </div>
                      );
                    }

                    return changes.map((change, idx) => (
                      <div key={idx} className="border rounded-lg p-3 bg-white">
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Change #{idx + 1} • {change.type}
                        </div>

                        {change.type === 'changed' && (
                          <>
                            <div className="p-2 bg-red-50 rounded mb-2">
                              <div className="text-xs font-bold text-red-700">CURRENT:</div>
                              <div className="text-sm text-red-800">{change.original}</div>
                            </div>
                            <div className="p-2 bg-green-50 rounded">
                              <div className="text-xs font-bold text-green-700">SUGGESTED CHANGE:</div>
                              <div className="text-sm text-green-800">{change.suggested}</div>
                            </div>
                          </>
                        )}

                        {change.type === 'added' && (
                          <div className="p-2 bg-green-50 rounded">
                            <div className="text-xs font-bold text-green-700">ADDED:</div>
                            <div className="text-sm text-green-800">{change.suggested}</div>
                          </div>
                        )}

                        {change.type === 'expanded' && (
                          <div className="p-2 bg-blue-50 rounded">
                            <div className="text-xs font-bold text-blue-700">EXPANDED:</div>
                            <div className="text-sm text-blue-800">{change.suggested}</div>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Full preview (collapsible) */}
              <details className="bg-gray-50 rounded-lg border">
                <summary className="p-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-100">
                  Click to see full improved content
                </summary>
                <div className="p-4 border-t bg-white">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto" style={{
                    fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                    lineHeight: '1.6'
                  }}>
                    {suggestedContent.split('\n').map((paragraph, idx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return <br key={idx} />;

                      // Check if it's a heading (starts with # or is short and likely a title)
                      if (trimmed.startsWith('#') || (trimmed.length < 80 && idx < 3)) {
                        return (
                          <div key={idx} className="font-bold text-lg my-3 text-gray-900">
                            {trimmed.replace(/^#+\s*/, '')}
                          </div>
                        );
                      }

                      return (
                        <p key={idx} className="mb-3">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </details>

              <div className="flex gap-3">
                <button
                  onClick={handleAcceptSuggestion}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept This Version
                </button>
                <button
                  onClick={handleRejectSuggestion}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                  Keep Original
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentEditChat;