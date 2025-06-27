// src/components/features/ContentEditChat/index.tsx
// REDESIGNED: Elegant interface with before/after approval system and focused change detection

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Eye,
  EyeOff,
  Copy,
  Check,
  Wand2,
  ArrowRight,
  X,
  FileText,
  GitCompare,
  History
} from "lucide-react";
import StrategicDataService from "../../../services/StrategicDataService";

const PROMPT_SUGGESTIONS = {
  "blog-post": [
    "Make it more engaging",
    "Add more statistics and facts",
    "Optimize for SEO",
    "Add a compelling call-to-action",
    "Improve the introduction",
    "Make it more conversational"
  ],
  social: [
    "Make it more concise",
    "Add hashtags",
    "Make it more engaging",
    "Add an emoji",
    "Make it more shareable",
    "Add a call-to-action"
  ],
  email: [
    "Improve the subject line",
    "Make it more personal",
    "Simplify the language",
    "Add a stronger call-to-action",
    "Make it more compelling",
    "Reduce the length"
  ],
  "landing-page": [
    "Enhance the value proposition",
    "Make it more persuasive",
    "Add customer testimonials",
    "Improve the call-to-action",
    "Make it more urgent",
    "Simplify the message"
  ],
  tagline: [
    "Make it catchier",
    "Shorter and punchier",
    "More emotional",
    "Add urgency",
    "Make it more memorable",
    "More professional"
  ],
  default: [
    "Make it more engaging",
    "Simplify the language",
    "Add more specific examples",
    "Make it more persuasive",
    "Improve the flow",
    "Make it more professional"
  ],
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isContentUpdate?: boolean;
}

interface ContentEditChatProps {
  originalContent: string;
  originalTitle: string;
  contentType: string;
  onContentUpdate: (newContent: string, newTitle: string) => void;
  strategicContext?: any;
}

const ContentEditChat: React.FC<ContentEditChatProps> = ({
  originalContent,
  originalTitle,
  contentType,
  onContentUpdate,
  strategicContext = null,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: string, text: string } | null>(null);
  const [loadedStrategicData, setLoadedStrategicData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentContent, setCurrentContent] = useState(originalContent);
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHistory, setContentHistory] = useState<{ before: string, after: string, request: string }[]>([]);
  const [showChanges, setShowChanges] = useState(true);
  const [pendingChange, setPendingChange] = useState<{ before: string, after: string, request: string, changes: any[] } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper functions
  const getPromptSuggestions = () =>
    PROMPT_SUGGESTIONS[contentType as keyof typeof PROMPT_SUGGESTIONS] || PROMPT_SUGGESTIONS["default"];

  // Helper function to find the actual differences between texts
  const findActualChanges = (before: string, after: string) => {
    const beforeSentences = before.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const afterSentences = after.split(/[.!?]+/).filter(s => s.trim().length > 0);

    const changes = [];
    const maxLength = Math.max(beforeSentences.length, afterSentences.length);

    for (let i = 0; i < maxLength; i++) {
      const beforeSent = beforeSentences[i]?.trim() || '';
      const afterSent = afterSentences[i]?.trim() || '';

      if (beforeSent !== afterSent) {
        changes.push({
          index: i,
          before: beforeSent,
          after: afterSent,
          type: beforeSent && afterSent ? 'modified' : beforeSent ? 'removed' : 'added'
        });
      }
    }

    return changes.slice(0, 5); // Show max 5 changes to keep it manageable
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log("🎯 SUGGESTION CLICKED:", suggestion);
    setInputValue(suggestion);
    // Use setTimeout to ensure state updates before calling handleSubmit
    setTimeout(() => {
      handleSubmit(undefined, suggestion);
    }, 100);
  };

  const handleAcceptChange = () => {
    if (!pendingChange) return;

    // Apply the change
    setCurrentContent(pendingChange.after);

    // Add to history
    setContentHistory(prev => [...prev, {
      before: pendingChange.before,
      after: pendingChange.after,
      request: pendingChange.request
    }]);

    // Call the update callback
    if (onContentUpdate) {
      onContentUpdate(pendingChange.after, originalTitle);
    }

    // Clear pending change
    setPendingChange(null);

    setStatusMessage({
      type: "success",
      text: "Changes accepted and applied! ✨",
    });
  };

  const handleRejectChange = () => {
    if (!pendingChange) return;

    setPendingChange(null);

    setStatusMessage({
      type: "info",
      text: "Changes rejected. Content remains unchanged.",
    });
  };

  // Load strategic data on mount
  useEffect(() => {
    const loadStrategicData = async () => {
      try {
        const data = await StrategicDataService.getAllStrategicData();
        setLoadedStrategicData(data);
        console.log("📊 Loaded strategic data for content chat:", data);
      } catch (error) {
        console.error("❌ Error loading strategic data:", error);
      }
    };
    loadStrategicData();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && inputValue) setError(null);
  }, [inputValue, error]);

  // Auto-clear status messages
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    console.log("🚀 SUBMIT STARTED");

    if (e) e.preventDefault();
    const userMessage = customPrompt || inputValue.trim();
    if (!userMessage) {
      console.log("❌ NO USER MESSAGE");
      return;
    }

    console.log("📝 User message:", userMessage);

    // Add user message
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    };

    setMessages((prev) => {
      console.log("📨 Adding user message, prev length:", prev.length);
      return [...prev, newUserMessage];
    });

    setInputValue("");
    setIsLoading(true);
    setStatusMessage({ type: "info", text: "AI is analyzing and updating your content..." });
    setError(null);

    console.log("🔄 Starting API call...");
    console.log("📄 Current content length:", currentContent.length);

    try {
      const baseRequest = {
        originalContent: currentContent,
        originalTitle,
        userRequest: userMessage,
        previousMessages: messages.slice(-6),
        contentType: contentType || "content",
      };

      if (strategicContext || loadedStrategicData) {
        const stratContext = strategicContext || {
          productName: loadedStrategicData?.product?.name,
          valueProposition: loadedStrategicData?.product?.valueProposition,
          audience: loadedStrategicData?.audiences?.[0]?.role,
          industry: loadedStrategicData?.audiences?.[0]?.industry,
          tone: loadedStrategicData?.brandVoice?.brandVoice?.tone,
          styleGuide: loadedStrategicData?.writingStyle?.styleGuide?.primary,
        };
        baseRequest.strategicContext = stratContext;
      }

      const requestBody = {
        mode: 'humanize',
        data: {
          content: currentContent,
          instructions: `USER REQUEST: ${userMessage}\n\nPlease apply this request to improve the content while PRESERVING ALL FORMATTING, HEADINGS, STRUCTURE, and MARKDOWN. Do not remove any headings, subheadings, bullet points, or other formatting elements. Only improve the content as requested while maintaining the exact same structure.`,
          strategicContext: baseRequest.strategicContext
        }
      };

      console.log("📦 Request body:", requestBody);

      const response = await fetch('/api/api_endpoints', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("🌐 Response status:", response.status);
      console.log("🌐 Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❗ Response not OK:", response.status, errorText);
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("📥 Full API response:", responseData);

      // The humanize endpoint returns content directly, not nested
      let updatedContent;
      if (responseData.content) {
        updatedContent = responseData.content;
      } else if (typeof responseData === 'string') {
        updatedContent = responseData;
      } else {
        console.error("❌ Unexpected response format!");
        console.error("📋 Response keys:", Object.keys(responseData));
        console.error("📋 Response type:", typeof responseData);
        throw new Error("Unexpected response format from API.");
      }

      console.log("✅ Got content, length:", updatedContent.length);
      console.log("📝 Content preview:", updatedContent.substring(0, 100) + "...");

      // Find the actual changes
      const actualChanges = findActualChanges(currentContent, updatedContent);
      console.log("🔍 Found changes:", actualChanges);

      // Store the pending change for approval
      const changeData = {
        before: currentContent,
        after: updatedContent,
        request: userMessage,
        changes: actualChanges
      };

      setPendingChange(changeData);

      // Calculate what actually changed
      const beforeWords = currentContent.split(/\s+/).length;
      const afterWords = updatedContent.split(/\s+/).length;
      const wordDifference = afterWords - beforeWords;

      console.log("📊 Word analysis:");
      console.log("   - before words:", beforeWords);
      console.log("   - after words:", afterWords);
      console.log("   - difference:", wordDifference);

      // Simple change detection
      const hasSignificantChange = Math.abs(wordDifference) > 5 ||
        updatedContent.toLowerCase() !== currentContent.toLowerCase();

      let changeDescription = "Content updated";
      if (wordDifference > 5) {
        changeDescription = `Added ~${wordDifference} words`;
      } else if (wordDifference < -5) {
        changeDescription = `Removed ~${Math.abs(wordDifference)} words`;
      } else if (hasSignificantChange) {
        changeDescription = "Content refined and improved";
      }

      console.log("📝 Change description:", changeDescription);

      // Add assistant message asking for approval
      const assistantMessage: Message = {
        role: "assistant",
        content: `✨ **${changeDescription}**\n\nI've prepared changes for: "${userMessage}"\n\n📊 **Summary:**\n- Before: ${beforeWords} words\n- After: ${afterWords} words\n- Changes found: ${actualChanges.length}\n\n👀 **Review the changes below and decide whether to accept them.**`,
        timestamp: new Date(),
        isContentUpdate: true
      };

      setMessages((prev) => {
        console.log("💬 Adding assistant message, prev length:", prev.length);
        return [...prev, assistantMessage];
      });

      // Don't update content automatically - wait for approval
      setStatusMessage({
        type: "info",
        text: "Changes ready for review! ✨",
      });

      console.log("✅ SUBMIT COMPLETED SUCCESSFULLY");

    } catch (error: any) {
      console.error("💥 Error in handleSubmit:", error);
      console.error("💥 Error stack:", error.stack);

      const errorMessage: Message = {
        role: "assistant",
        content: `❌ **Update Failed**\n\nSorry, I couldn't apply that change. ${error.message}\n\nPlease try rephrasing your request or try again.`,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStatusMessage({ type: "error", text: "Failed to update content." });
      setError(`Error: ${error.message}`);
    } finally {
      console.log("🏁 Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (messageIndex: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedStates(prev => ({ ...prev, [messageIndex]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [messageIndex]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 max-w-7xl max-h-[90vh] mx-auto' : ''
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wand2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Content Editor</h3>
            <p className="text-sm text-gray-600">Ask for specific improvements to make your content better</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChanges(!showChanges)}
            className={`p-2 rounded-md hover:bg-gray-100 ${showChanges ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
            title={showChanges ? "Hide changes" : "Show changes"}
          >
            <GitCompare className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-md hover:bg-gray-100 ${showPreview ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <X className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {statusMessage && (
        <div className={`px-4 py-3 border-b border-gray-200 ${statusMessage.type === "error"
            ? "bg-red-50 text-red-800"
            : statusMessage.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-blue-50 text-blue-800"
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4" />
              ) : statusMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4 animate-spin" />
              )}
              <span className="text-sm font-medium">{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Strategic Context Notice */}
      {(strategicContext || loadedStrategicData) && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span>Using your marketing program's strategic data for personalized improvements</span>
          </div>
        </div>
      )}

      <div className={`flex ${isExpanded ? 'h-full' : ''}`}>
        {/* Chat Section */}
        <div className={`flex flex-col ${contentHistory.length > 0 ? 'w-1/2 border-r border-gray-200' : 'w-full'
          }`}>
          {/* Pending Changes Approval - Show when there's a pending change */}
          {pendingChange && (
            <div className="w-full bg-blue-50 border-2 border-blue-300 rounded-lg m-4">
              <div className="p-4 border-b border-blue-200 bg-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-900">Review Changes</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAcceptChange}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept Changes
                    </button>
                    <button
                      onClick={handleRejectChange}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  Request: "{pendingChange.request}" • {pendingChange.changes.length} change{pendingChange.changes.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {pendingChange.changes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No specific changes detected - content may be very similar.</p>
                  </div>
                ) : (
                  pendingChange.changes.map((change, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="text-sm font-medium text-gray-600 mb-3">
                        Change #{index + 1} • {change.type}
                      </div>

                      {change.type === 'modified' && (
                        <>
                          <div className="mb-3">
                            <div className="text-xs font-bold text-red-700 mb-1">BEFORE:</div>
                            <div className="p-3 bg-red-50 border-l-4 border-red-300 rounded text-sm">
                              {change.before}
                            </div>
                          </div>
                          <div className="flex justify-center mb-3">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-green-700 mb-1">AFTER:</div>
                            <div className="p-3 bg-green-50 border-l-4 border-green-300 rounded text-sm">
                              {change.after}
                            </div>
                          </div>
                        </>
                      )}

                      {change.type === 'added' && (
                        <div>
                          <div className="text-xs font-bold text-green-700 mb-1">ADDED:</div>
                          <div className="p-3 bg-green-50 border-l-4 border-green-300 rounded text-sm">
                            {change.after}
                          </div>
                        </div>
                      )}

                      {change.type === 'removed' && (
                        <div>
                          <div className="text-xs font-bold text-red-700 mb-1">REMOVED:</div>
                          <div className="p-3 bg-red-50 border-l-4 border-red-300 rounded text-sm">
                            {change.before}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isExpanded ? 'max-h-96' : 'h-80'}`}>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                  <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Ready to improve your content!</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ask for specific changes like "make it more engaging" or "add statistics"
                  </p>
                  <p className="text-xs text-gray-500">
                    Click any suggestion below or type your own request
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 ${message.role === "user"
                          ? "bg-blue-600 text-white"
                          : message.isContentUpdate
                            ? "bg-green-50 border border-green-200 text-green-900"
                            : "bg-gray-100 text-gray-900"
                        }`}
                    >
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                      />
                      {message.timestamp && (
                        <div className="flex items-center justify-between mt-2">
                          <div className={`text-xs ${message.role === "user" ? "text-blue-100" : "text-gray-500"
                            }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <button
                            onClick={() => handleCopyMessage(index, message.content)}
                            className={`p-1 rounded ${message.role === "user"
                                ? "hover:bg-blue-500 text-blue-100"
                                : "hover:bg-gray-200 text-gray-500"
                              }`}
                            title="Copy message"
                          >
                            {copiedStates[index] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Quick improvements:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getPromptSuggestions().slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={(e) => {
            console.log("🎯 FORM SUBMIT TRIGGERED");
            handleSubmit(e);
          }} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your improvement request..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                onClick={(e) => {
                  console.log("🎯 BUTTON CLICK TRIGGERED");
                  console.log("🎯 Input value:", inputValue);
                  console.log("🎯 Is loading:", isLoading);
                  if (!inputValue.trim()) {
                    console.log("❌ No input value, preventing submit");
                    e.preventDefault();
                    return;
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? "Updating..." : "Update"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Changes Section - Show history of accepted changes */}
        {contentHistory.length > 0 && (
          <div className="w-1/2 flex flex-col bg-yellow-50">
            <div className="p-4 border-b border-yellow-200 bg-yellow-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-yellow-700" />
                <h4 className="font-medium text-gray-900">Applied Changes</h4>
                <span className="px-2 py-1 bg-yellow-300 text-yellow-800 text-xs rounded-full font-medium">
                  {contentHistory.length} edit{contentHistory.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-yellow-700">Your content modification history</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Show the most recent change prominently */}
              <div className="border-2 border-blue-300 rounded-lg p-4 bg-white shadow-sm mb-4">
                <div className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-200 text-blue-900 text-xs rounded-full font-bold">
                    🔥 LATEST APPLIED
                  </span>
                </div>

                <div className="text-sm font-medium text-gray-800 mb-3 p-2 bg-blue-50 rounded">
                  📝 Request: "{contentHistory[contentHistory.length - 1]?.request}"
                </div>

                <div className="text-xs text-blue-700 pt-2 border-t border-blue-200 font-medium">
                  📊 Word difference: {contentHistory[contentHistory.length - 1]?.after.split(/\s+/).length - contentHistory[contentHistory.length - 1]?.before.split(/\s+/).length >= 0 ? '+' : ''}{contentHistory[contentHistory.length - 1]?.after.split(/\s+/).length - contentHistory[contentHistory.length - 1]?.before.split(/\s+/).length}
                </div>
              </div>

              {/* Show previous changes if any */}
              {contentHistory.length > 1 && (
                <>
                  <div className="text-xs font-medium text-gray-500 border-t pt-3 mb-3">
                    Previous Applied Changes:
                  </div>
                  {contentHistory.slice(-4, -1).reverse().map((change, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50 mb-2">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        🎯 "{change.request}"
                      </div>
                      <div className="text-xs text-gray-600">
                        {change.before.split(/\s+/).length} → {change.after.split(/\s+/).length} words
                        ({change.after.split(/\s+/).length - change.before.split(/\s+/).length >= 0 ? '+' : ''}{change.after.split(/\s+/).length - change.before.split(/\s+/).length})
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditChat;