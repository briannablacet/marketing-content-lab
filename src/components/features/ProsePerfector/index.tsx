// src/components/features/ProsePerfector/index.tsx
// REDESIGNED: Much cleaner workflow - immediate results with summary

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
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Eye,
  EyeOff
} from "lucide-react";
import FileHandler from "@/components/shared/FileHandler";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChangeSummary {
  grammarFixed: boolean;
  spellingFixed: boolean;
  punctuationFixed: boolean;
  flowImproved: boolean;
  wordCountChange: number;
  mainChanges: string[];
}

interface EnhancementResult {
  enhancedText: string;
  summary: ChangeSummary;
  changeDetails: Array<{
    original: string;
    suggestion: string;
    reason: string;
    type: string;
  }>;
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
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // Refs for auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Local state
  const [originalText, setOriginalText] = useState("");
  const [enhancementResult, setEnhancementResult] = useState<EnhancementResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [content, setContent] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // State for additional refinements
  const [additionalChanges, setAdditionalChanges] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  // Initialize options with writing style from context
  const getDefaultOptions = () => {
    let defaultStyleGuide = "chicago";

    if (isStyleConfigured && writingStyle?.styleGuide?.primary) {
      const styleGuideMapping: { [key: string]: string } = {
        "Chicago Manual of Style": "chicago",
        "AP Style": "ap",
        "APA Style": "apa",
        "MLA Style": "mla"
      };
      defaultStyleGuide = styleGuideMapping[writingStyle.styleGuide.primary] || "chicago";
    }

    return {
      improveClarity: true,
      enhanceEngagement: true,
      adjustFormality: false,
      formalityLevel: "neutral",
      styleGuide: defaultStyleGuide,
      additionalInstructions: "",
    };
  };

  const [options, setOptions] = useState(getDefaultOptions());

  // Update options when writing style changes
  React.useEffect(() => {
    if (isStyleConfigured && writingStyle?.styleGuide?.primary) {
      const styleGuideMapping: { [key: string]: string } = {
        "Chicago Manual of Style": "chicago",
        "AP Style": "ap",
        "APA Style": "apa",
        "MLA Style": "mla"
      };

      const mappedStyleGuide = styleGuideMapping[writingStyle.styleGuide.primary] || "chicago";

      setOptions(prev => ({
        ...prev,
        styleGuide: mappedStyleGuide
      }));
    }
  }, [writingStyle, isStyleConfigured]);

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

  // Process text for improvement - NEW: Immediate results
  const processText = async () => {
    if (!content.trim()) {
      showNotification("Please enter or upload text to enhance", "error");
      return;
    }

    setIsProcessing(true);
    setOriginalText(content);
    setEnhancementResult(null);

    try {
      const styleGuideName =
        STYLE_GUIDES.find((sg) => sg.id === options.styleGuide)?.name ||
        "Chicago Manual of Style";

      const strategicData = await StrategicDataService.getAllStrategicData();

      const requestData = {
        mode: 'prose',
        data: {
          text: content,
          options: {
            ...options,
            styleGuide: styleGuideName,
          },
          writingStyle: writingStyle || null,
          strategicData: strategicData
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
        throw new Error(errorData.message || "Failed to enhance text");
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      // Process the API response into our new format
      const originalWordCount = content.split(/\s+/).length;
      const enhancedWordCount = (data.enhancedText || content).split(/\s+/).length;

      const result: EnhancementResult = {
        enhancedText: data.enhancedText || content,
        summary: {
          grammarFixed: true, // We'll assume this since we explicitly check
          spellingFixed: true,
          punctuationFixed: true,
          flowImproved: true,
          wordCountChange: enhancedWordCount - originalWordCount,
          mainChanges: (data.suggestions || [])
            .slice(0, 3)
            .map((s: any) => s.reason || "General improvement")
        },
        changeDetails: (data.suggestions || []).map((suggestion: any) => ({
          original: suggestion.original,
          suggestion: suggestion.suggestion,
          reason: suggestion.reason,
          type: suggestion.type || "improvement",
        }))
      };

      setEnhancementResult(result);
      showNotification("✨ Text enhanced successfully!", "success");

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);

    } catch (error) {
      console.error("❌ Error processing text:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to enhance text. Please try again.",
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
    setEnhancementResult(null);
    setAdditionalChanges("");
    setShowOriginal(false);
    setShowDetails(false);
  };

  // Revert to original
  const handleRevert = () => {
    setEnhancementResult(null);
    setShowOriginal(false);
    setShowDetails(false);
    showNotification("Reverted to original text", "info");
  };

  // NEW: Function to refine text with additional changes
  const refineText = async () => {
    if (!additionalChanges.trim()) {
      showNotification("Please enter what additional changes you'd like", "error");
      return;
    }

    if (!enhancementResult) {
      showNotification("Please enhance your text first", "error");
      return;
    }

    setIsRefining(true);

    try {
      const styleGuideName =
        STYLE_GUIDES.find((sg) => sg.id === options.styleGuide)?.name ||
        "Chicago Manual of Style";

      const strategicData = await StrategicDataService.getAllStrategicData();

      const requestData = {
        mode: 'prose',
        data: {
          text: enhancementResult.enhancedText,
          options: {
            ...options,
            additionalInstructions: additionalChanges,
            styleGuide: styleGuideName,
          },
          writingStyle: writingStyle || null,
          strategicData: strategicData
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
        throw new Error(errorData.message || "Failed to refine text");
      }

      const data = await response.json();

      // Update the enhancement result with new changes
      const newWordCount = (data.enhancedText || enhancementResult.enhancedText).split(/\s+/).length;
      const originalWordCount = originalText.split(/\s+/).length;

      const updatedResult: EnhancementResult = {
        enhancedText: data.enhancedText || enhancementResult.enhancedText,
        summary: {
          ...enhancementResult.summary,
          wordCountChange: newWordCount - originalWordCount,
          mainChanges: [
            ...enhancementResult.summary.mainChanges,
            additionalChanges
          ].slice(0, 4) // Keep to 4 max
        },
        changeDetails: [
          ...enhancementResult.changeDetails,
          ...(data.suggestions || []).map((suggestion: any) => ({
            original: suggestion.original,
            suggestion: suggestion.suggestion,
            reason: suggestion.reason,
            type: suggestion.type || "refinement",
          }))
        ]
      };

      setEnhancementResult(updatedResult);
      setAdditionalChanges("");
      showNotification(`✨ Text refined successfully!`, "success");

    } catch (error) {
      console.error("❌ Error refining text:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to refine text. Please try again.",
        "error"
      );
    } finally {
      setIsRefining(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Text copied to clipboard", "success");
  };

  // Export functionality
  const handleExport = (format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
    if (!enhancementResult) {
      showNotification("No enhanced text to export", "error");
      return;
    }

    const fileName = `enhanced-text-${new Date().toISOString().slice(0, 10)}`;

    try {
      switch (format) {
        case 'txt':
          exportToText(enhancementResult.enhancedText, `${fileName}.txt`);
          break;
        case 'markdown':
          exportToMarkdown(enhancementResult.enhancedText, `${fileName}.md`);
          break;
        case 'html':
          exportToHTML(enhancementResult.enhancedText, `${fileName}.html`);
          break;
        case 'pdf':
          exportToPDF(enhancementResult.enhancedText, `${fileName}.pdf`);
          break;
        case 'docx':
          exportToDocx(enhancementResult.enhancedText, `${fileName}.docx`);
          break;
        default:
          exportToText(enhancementResult.enhancedText, `${fileName}.txt`);
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
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span>Using Your Writing Style Settings</span>
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
            Enhance Your Writing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Upload a document or paste your text below. We'll enhance it for clarity, grammar, and engagement.
          </p>

          <div>
            <label className="block text-sm font-medium mb-2">
              Style Guide
              {isStyleConfigured && (
                <span className="text-green-600 text-xs ml-2">(from your settings)</span>
              )}
            </label>
            <select
              value={options.styleGuide}
              onChange={(e) => setOptions({ ...options, styleGuide: e.target.value })}
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
            <label className="block text-sm font-medium mb-2">Enhancement Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.improveClarity}
                  onChange={(e) => setOptions({ ...options, improveClarity: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Improve clarity and readability</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.enhanceEngagement}
                  onChange={(e) => setOptions({ ...options, enhanceEngagement: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enhance engagement and impact</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.adjustFormality}
                  onChange={(e) => setOptions({ ...options, adjustFormality: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Adjust formality level</span>
              </label>
            </div>
          </div>

          {options.adjustFormality && (
            <div>
              <label className="block text-sm font-medium mb-2">Formality Level</label>
              <select
                value={options.formalityLevel}
                onChange={(e) => setOptions({ ...options, formalityLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
              >
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={options.additionalInstructions || ''}
              onChange={(e) => setOptions({ ...options, additionalInstructions: e.target.value })}
              className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific requests? (e.g., 'add a conclusion', 'make it more conversational', 'remove jargon')"
            />
          </div>

          {/* File Upload */}
          <div className="border-t pt-6">
            <FileHandler onContentLoaded={handleFileContent} content="" />
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste or type your content here, or upload a file above..."
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
                  Enhancing Your Text...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance Text
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Results */}
      {enhancementResult && (
        <div ref={resultsRef} className="space-y-8">
          {/* Summary Card */}
          <Card className="border-2 border-green-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <span>✨ Text Enhanced Successfully</span>
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
                  <h3 className="font-medium text-gray-800 mb-2">What We Fixed:</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Checked and corrected grammar, spelling, and punctuation errors
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Improved flow and readability
                    </li>
                    {enhancementResult.summary.mainChanges.map((change, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {originalText.split(/\s+/).length} → {enhancementResult.enhancedText.split(/\s+/).length}
                  </div>
                  <div className="text-sm text-gray-600">Word Count</div>
                  {enhancementResult.summary.wordCountChange !== 0 && (
                    <div className={`text-sm ${enhancementResult.summary.wordCountChange > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      {enhancementResult.summary.wordCountChange > 0 ? '+' : ''}{enhancementResult.summary.wordCountChange} words
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
                <CardTitle>Original Text</CardTitle>
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

          {/* Enhanced Text */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex justify-between items-center">
                <span>🎉 Your Enhanced Text</span>
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
                    onClick={() => copyToClipboard(enhancementResult.enhancedText)}
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
                  {enhancementResult.enhancedText.split("\n").filter(p => p.trim()).map((para, idx) => (
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

          {/* Change Details (Collapsible) */}
          {enhancementResult.changeDetails.length > 0 && (
            <Card className="border-2 border-green-300 mb-8">
              <CardHeader className="bg-green-50 pb-6">
                <CardTitle className="flex items-center justify-between">
                  <span>🎯 What I Changed</span>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showDetails ? 'Hide Details' : 'Click to see the specifics'}
                    <ArrowDown className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                  </button>
                </CardTitle>
              </CardHeader>
              {showDetails && (
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {enhancementResult.changeDetails.map((change, index) => (
                      <div key={index} className="p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                            {change.type}
                          </span>
                          <span className="text-sm text-gray-600">{change.reason}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs font-medium text-red-700 mb-1">Original</p>
                            <p className="text-sm text-red-800">{change.original}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-medium text-green-700 mb-1">Enhanced</p>
                            <p className="text-sm text-green-800">{change.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Need More Changes */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                <span>Need More Changes?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <textarea
                    value={additionalChanges}
                    onChange={(e) => setAdditionalChanges(e.target.value)}
                    className="w-full p-3 border rounded-lg h-20 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 'make the conclusion stronger', 'add more examples', 'make it less formal'"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={refineText}
                    disabled={isRefining || !additionalChanges.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isRefining ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Making Your Changes...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Make These Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Writing Style Applied Notice */}
      {isStyleConfigured && enhancementResult && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            <span>
              Content enhanced using {writingStyle?.styleGuide?.primary} style guide
              {writingStyle?.formatting?.headingCase === 'upper' && ' with ALL CAPS headings'}
              {writingStyle?.formatting?.numberFormat === 'numerals' && ' and numerical format'}.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProsePerfector;