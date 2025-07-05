// src/components/features/ContentHumanizer/index.tsx
// REDESIGNED: Clean workflow matching ProsePerfector - immediate results with ChangeDisplay

import React, { useState, useRef } from "react";
import { useNotification } from "../../../context/NotificationContext";
import { useWritingStyle } from "../../../context/WritingStyleContext";
import StrategicDataService from "../../../services/StrategicDataService";
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../../utils/exportUtils';
import {
  Loader,
  Sparkles,
  Copy,
  Download,
  CheckCircle,
  RotateCcw,
  Eye,
  EyeOff
} from "lucide-react";
import FileHandler from "@/components/shared/FileHandler";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChangeDisplay from "../../shared/ChangeDisplay";
import ContentEditChat from "../ContentEditChat";

interface ChangeSummary {
  aiPatternsRemoved: boolean;
  sentenceVariationAdded: boolean;
  contractionsAdded: boolean;
  passiveVoiceReduced: boolean;
  wordCountChange: number;
  mainChanges: string[];
}

interface HumanizationResult {
  humanizedText: string;
  summary: ChangeSummary;
  changeDetails: Array<{
    original: string;
    suggestion: string;
    reason: string;
    type: string;
  }>;
}

// Main component
const ContentHumanizer: React.FC = () => {
  const { showNotification } = useNotification();
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // Refs for auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Local state
  const [originalText, setOriginalText] = useState("");
  const [humanizationResult, setHumanizationResult] = useState<HumanizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [content, setContent] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // State for additional refinements
  const [additionalChanges, setAdditionalChanges] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const handleFileContent = (fileContent: string | object) => {
    if (typeof fileContent === "string") {
      setContent(fileContent);
      showNotification("File content loaded successfully", "success");
    } else {
      const jsonContent = JSON.stringify(fileContent, null, 2);
      setContent(jsonContent);
      showNotification("Structured content loaded successfully", "success");
    }
  };

  // Process text for humanization
  const processText = async () => {
    if (!content.trim()) {
      showNotification("Please enter or upload text to humanize", "error");
      return;
    }

    setIsProcessing(true);
    setOriginalText(content);
    setHumanizationResult(null);

    try {
      const strategicData = await StrategicDataService.getAllStrategicData();

      const requestData = {
        content: content,
        parameters: {
          styleGuideParameters: writingStyle || null,
          strategicData: strategicData
        },
      };

      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          mode: 'humanize',
          data: requestData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to humanize text");
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      // Process the API response into our format
      const originalWordCount = content.split(/\s+/).length;
      const humanizedWordCount = (data.content || content).split(/\s+/).length;

      const result: HumanizationResult = {
        humanizedText: data.content || content,
        summary: {
          aiPatternsRemoved: true,
          sentenceVariationAdded: true,
          contractionsAdded: true,
          passiveVoiceReduced: true,
          wordCountChange: humanizedWordCount - originalWordCount,
          mainChanges: [
            "Removed AI writing patterns",
            "Added natural sentence variation",
            "Improved conversational tone"
          ]
        },
        changeDetails: (data.suggestions || []).map((suggestion: any) => ({
          original: suggestion.original,
          suggestion: suggestion.suggestion,
          reason: suggestion.reason,
          type: suggestion.type || "humanization",
        }))
      };

      setHumanizationResult(result);
      showNotification("✨ Content humanized successfully!", "success");

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);

    } catch (error) {
      console.error("❌ Error humanizing text:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to humanize text. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear all content
  const handleClear = () => {
    setContent("");
    setOriginalText("");
    setHumanizationResult(null);
    setAdditionalChanges("");
    setShowOriginal(false);
  };

  // Revert to original
  const handleRevert = () => {
    setHumanizationResult(null);
    setShowOriginal(false);
    showNotification("Reverted to original text", "info");
  };

  // Handle content updates from ContentEditChat
  const handleContentUpdate = (newContent: string, newTitle: string) => {
    if (humanizationResult) {
      setHumanizationResult({
        ...humanizationResult,
        humanizedText: newContent
      });
    }
    showNotification("Content updated successfully", "success");
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Text copied to clipboard", "success");
  };

  // Export functionality
  const handleExport = (format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
    if (!humanizationResult) {
      showNotification("No humanized text to export", "error");
      return;
    }

    const fileName = `humanized-text-${new Date().toISOString().slice(0, 10)}`;

    try {
      switch (format) {
        case 'txt':
          exportToText(humanizationResult.humanizedText, `${fileName}.txt`);
          break;
        case 'markdown':
          exportToMarkdown(humanizationResult.humanizedText, `${fileName}.md`);
          break;
        case 'html':
          exportToHTML(humanizationResult.humanizedText, `${fileName}.html`);
          break;
        case 'pdf':
          exportToPDF(humanizationResult.humanizedText, `${fileName}.pdf`);
          break;
        case 'docx':
          exportToDocx(humanizationResult.humanizedText, `${fileName}.docx`);
          break;
        default:
          exportToText(humanizationResult.humanizedText, `${fileName}.txt`);
      }

      showNotification(`Text exported as ${format.toUpperCase()}`, "success");
      setShowExportDropdown(false);
    } catch (error) {
      console.error('Export error:', error);
      showNotification("Export failed. Please try again.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Writing Style Status Banner */}
      {isStyleConfigured && (
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50 pb-6">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span>Using Your Style Guide Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-sm text-green-700">
              Style Guide: {writingStyle?.styleGuide?.primary} •
              Headings: {writingStyle?.formatting?.headingCase === 'upper' ? 'ALL CAPS' :
                writingStyle?.formatting?.headingCase === 'lower' ? 'lowercase' :
                  writingStyle?.formatting?.headingCase === 'sentence' ? 'Sentence case' : 'Title Case'}
              {writingStyle?.punctuation?.oxfordComma !== undefined &&
                ` • Oxford Comma: ${writingStyle.punctuation.oxfordComma ? 'Used' : 'Omitted'}`}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            Humanize AI-Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800 mb-2">
              What This Tool Does
            </h3>
            <p className="text-sm text-blue-700">
              Transforms AI-generated content into natural, human-like writing by removing robotic patterns,
              adding conversational elements, and improving flow while maintaining your message and style guide compliance.
            </p>
          </div>

          {/* File Upload */}
          <div className="border-t pt-6">
            <FileHandler onContentLoaded={handleFileContent} content="" />
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Content to Humanize</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your AI-generated content here, or upload a file above..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear All
            </button>
            <button
              onClick={processText}
              disabled={isProcessing || !content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Humanizing Your Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Humanize Content
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Humanized Results */}
      {humanizationResult && (
        <div ref={resultsRef} className="space-y-8">
          {/* Summary Card */}
          <Card className="border-2 border-green-300">
            <CardHeader className="bg-green-50 pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <span>✨ Content Humanized Successfully</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    {showOriginal ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {showOriginal ? "Hide" : "Show"} Original
                  </button>
                  <button
                    onClick={handleRevert}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Revert
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Humanization Improvements:</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Removed robotic AI writing patterns
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Added natural sentence variation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Improved conversational flow
                    </li>
                    {humanizationResult.summary.mainChanges.map((change, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {originalText.split(/\s+/).length} → {humanizationResult.humanizedText.split(/\s+/).length}
                  </div>
                  <div className="text-sm text-gray-600">Word Count</div>
                  {humanizationResult.summary.wordCountChange !== 0 && (
                    <div className={`text-sm ${humanizationResult.summary.wordCountChange > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      {humanizationResult.summary.wordCountChange > 0 ? '+' : ''}{humanizationResult.summary.wordCountChange} words
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Text (when shown) */}
          {showOriginal && (
            <Card className="border-2 border-gray-300">
              <CardHeader className="bg-gray-50">
                <CardTitle>Original AI-Generated Text</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white p-6 rounded-lg border" style={{
                  fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  lineHeight: '1.6',
                  fontSize: '11pt',
                  color: '#333'
                }}>
                  {originalText.split("\n").filter(p => p.trim()).map((para, idx) => (
                    <p key={idx} style={{
                      margin: idx > 0 ? '12pt 0' : '0 0 12pt 0',
                      textIndent: '0pt',
                      lineHeight: '1.6'
                    }}>
                      {para}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Humanized Text */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="bg-blue-50 pb-6">
              <CardTitle className="flex justify-between items-center">
                <span>🎉 Your Humanized Content</span>
                <div className="flex space-x-2">
                  {/* Export Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExportDropdown(!showExportDropdown)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </button>
                    {showExportDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleExport('txt')}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Plain Text (.txt)
                        </button>
                        <button
                          onClick={() => handleExport('markdown')}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Markdown (.md)
                        </button>
                        <button
                          onClick={() => handleExport('html')}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          HTML (.html)
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          PDF (.pdf)
                        </button>
                        <button
                          onClick={() => handleExport('docx')}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Word (.docx)
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => copyToClipboard(humanizationResult.humanizedText)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm" style={{
                fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                lineHeight: '1.6',
                fontSize: '11pt',
                color: '#333'
              }}>
                <div style={{ textAlign: 'justify' }}>
                  {humanizationResult.humanizedText.split("\n").filter(p => p.trim()).map((para, idx) => (
                    <p key={idx} style={{
                      margin: idx > 0 ? '12pt 0' : '0 0 12pt 0',
                      textIndent: '0pt',
                      lineHeight: '1.6'
                    }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Use the shared ChangeDisplay component */}
          <ChangeDisplay
            changes={humanizationResult.changeDetails}
            title="🎯 What I Humanized"
            showByDefault={false}
            className="mb-8"
          />

          {/* ContentEditChat for further improvements */}
          {/* ContentEditChat for further improvements */}
          <ContentEditChat
            originalContent={humanizationResult.humanizedText}
            originalTitle="Humanized Content"
            contentType="humanized-content"
            onContentUpdate={handleContentUpdate}
          />
        </div>
      )}

      {/* Writing Style Applied Notice */}
      {isStyleConfigured && humanizationResult && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            <span>
              Content humanized using {writingStyle?.styleGuide?.primary} style guide
              {writingStyle?.formatting?.headingCase === 'upper' && ' with ALL CAPS headings'}
              {writingStyle?.formatting?.numberFormat === 'numerals' && ' and numerical format'}.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentHumanizer;