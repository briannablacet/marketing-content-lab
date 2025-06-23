// src/components/features/ProsePerfector/index.tsx
import React, { useState, useRef } from "react";
import { useNotification } from "../../../context/NotificationContext";
import {
  X,
  Loader,
  Sparkles,
  Copy,
} from "lucide-react";
import FileHandler from "@/components/shared/FileHandler";

interface ImprovementSuggestion {
  original: string;
  suggestion: string;
  reason: string;
  type: "clarity" | "conciseness" | "engagement" | "formality" | "active voice";
}

// Available style guides
const STYLE_GUIDES = [
  { id: "chicago", name: "Chicago Manual of Style" },
  { id: "ap", name: "AP Style" },
  { id: "apa", name: "APA Style" },
  { id: "mla", name: "MLA Style" },
  { id: "custom", name: "Custom Style Guide" },
];

// Main component
const ProsePerfector: React.FC = () => {
  const { showNotification } = useNotification();

  // Local state
  const [enhancedText, setEnhancedText] = useState("");
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [content, setContent] = useState("");
  const [uploadedContent, setUploadedContent] = useState<string>("");

  // Processing options
  const [options, setOptions] = useState({
    improveClarity: true,
    enhanceEngagement: true,
    adjustFormality: false,
    formalityLevel: "neutral", // 'formal', 'neutral', 'casual'
    styleGuide: "chicago", // Default to Chicago style
  });

  // Update handleFileContent
  const handleFileContent = (content: string | object) => {
    if (typeof content === "string") {
      setContent(content);
    } else {
      setUploadedContent(JSON.stringify(content, null, 2));
      showNotification("Structured content loaded successfully", "success");
    }
  };

  // Process text for improvement
  const processText = async () => {
    if (!content.trim()) {
      showNotification("error", "Please enter or upload text to enhance");
      return;
    }

    setIsProcessing(true);

    try {
      // Map the styleGuide ID to the full name
      const styleGuideName =
        STYLE_GUIDES.find((sg) => sg.id === options.styleGuide)?.name ||
        "Chicago Manual of Style";

      // Call the API endpoint to process the text
      const response = await fetch("/api/api_endpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          mode: "prosePerfector",
          data: {
            text: content,
            options: {
              ...options,
              styleGuide: styleGuideName,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to enhance text");
      }

      const data = await response.json();
      console.log("API Response:", data); // Helpful for debugging

      // Set the enhanced text from the API response
      setEnhancedText(data.enhancedText);

      // Map the suggestions from the API to match our expected format
      const mappedSuggestions = (data.suggestions || []).map((suggestion) => ({
        original: suggestion.original,
        suggestion: suggestion.suggestion,
        reason: suggestion.reason,
        type: suggestion.type || "clarity", // Default to clarity if type is not provided
      }));

      setSuggestions(mappedSuggestions);

      // Set impr
      showNotification("success", "Text enhanced successfully");
    } catch (error) {
      console.error("Error processing text:", error);
      showNotification(
        "error",
        error.message || "Failed to enhance text. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear all content
  const handleClear = () => {
    setContent("");
    setEnhancedText("");
    setSuggestions([]);
  };

  // Apply individual suggestion
  const applySuggestion = (index: number) => {
    const suggestion = suggestions[index];

    // Simple replacement (in a real app, you'd need more sophisticated text manipulation)
    const updatedText = enhancedText.replace(
      suggestion.original,
      suggestion.suggestion
    );
    setEnhancedText(updatedText);

    // Remove the applied suggestion
    const updatedSuggestions = [...suggestions];
    updatedSuggestions.splice(index, 1);
    setSuggestions(updatedSuggestions);
  };

  // Apply all suggestions at once
  const applyAllSuggestions = () => {
    if (suggestions.length === 0) return;

    let text = enhancedText;
    for (const suggestion of suggestions) {
      text = text.replace(suggestion.original, suggestion.suggestion);
    }

    setEnhancedText(text);
    setSuggestions([]);
    showNotification("success", "All suggestions applied");
  };

  // Copy enhanced text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedText);
    showNotification("success", "Enhanced text copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Enhance Your Writing
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload a document or paste your text to improve clarity, engagement,
          and style. Choose your preferred style guide and enhancement options
          below.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Style Guide
            </label>
            <select
              value={options.styleGuide}
              onChange={(e) =>
                setOptions({ ...options, styleGuide: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
            >
              {STYLE_GUIDES.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">
              Enhancement Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.improveClarity}
                  onChange={(e) =>
                    setOptions({ ...options, improveClarity: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Improve clarity and readability
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.enhanceEngagement}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      enhanceEngagement: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Enhance engagement and impact
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.adjustFormality}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      adjustFormality: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Adjust formality level
                </span>
              </label>
            </div>
          </div>

          {options.adjustFormality && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Formality Level
              </label>
              <select
                value={options.formalityLevel}
                onChange={(e) =>
                  setOptions({ ...options, formalityLevel: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
              >
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          )}
          {/* File Upload */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-700 mb-4">
              Upload Document to Enhance your prose:
            </p>
            <FileHandler
              onContentLoaded={handleFileContent}
              content={uploadedContent}
            />

            {uploadedContent && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">
                    Uploaded Content Preview
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPromptText(uploadedContent); // Set the promptText
                        setActiveTab("keywords"); // Proceed to next step
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Use This
                    </button>
                    <button
                      onClick={() => setUploadedContent("")}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                  {uploadedContent}
                </pre>
              </div>
            )}
          </div>
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}

              className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste or type your content here..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear
            </button>
            <button
              onClick={processText}
              disabled={isProcessing || !content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {enhancedText && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Enhanced Text
          </h2>
          <div className="space-y-4">
            <textarea
              value={enhancedText}
              readOnly
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm bg-gray-50"
              rows={6}
            />
            <div className="flex justify-end">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Improvement Suggestions
          </h2>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {suggestion.type}
                  </span>
                  <button
                    onClick={() => applySuggestion(index)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {suggestion.reason}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Original</p>
                    <p className="text-sm text-gray-700">
                      {suggestion.original}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Suggestion</p>
                    <p className="text-sm text-gray-700">
                      {suggestion.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={applyAllSuggestions}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Apply All Suggestions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsePerfector;
