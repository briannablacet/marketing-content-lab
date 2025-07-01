// src/components/features/ProsePerfector/index.tsx
// FIXED: Better content display, editing interface, changes summary, and ContentEditChat integration

import React, { useState, useRef } from "react";
import { useNotification } from "../../../context/NotificationContext";
import { useWritingStyle } from "../../../context/WritingStyleContext";
import StrategicDataService from "../../../services/StrategicDataService";
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../../utils/exportUtils';
import { parseMarkdownWithStyle, applyHeadingCase } from '../../../utils/StyleGuides';
import ContentEditChat from "../ContentEditChat";
import {
  X,
  Loader,
  Sparkles,
  Copy,
  Download,
  FileText,
  CheckCircle,
  Edit,
  Save,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import FileHandler from "@/components/shared/FileHandler";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // Local state
  const [enhancedText, setEnhancedText] = useState("");
  const [originalText, setOriginalText] = useState(""); // Track original for comparison
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<ImprovementSuggestion[]>([]); // Track applied changes
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [content, setContent] = useState("");
  const [uploadedContent, setUploadedContent] = useState<string>("");
  
  // Edit mode and dropdown states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Initialize options with writing style from context
  const [options, setOptions] = useState(() => {
    console.log('🎨 Initializing ProsePerfector with writing style:', writingStyle);
    
    let defaultStyleGuide = "chicago";
    if (writingStyle?.styleGuide?.primary) {
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
    };
  });

  // Update options when writing style changes
  React.useEffect(() => {
    if (isStyleConfigured && writingStyle?.styleGuide?.primary) {
      console.log('✅ Updating style guide from writing style context:', writingStyle.styleGuide.primary);
      
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

  // Update edited content when enhanced text changes
  React.useEffect(() => {
    if (enhancedText) {
      setEditedContent(enhancedText);
    }
  }, [enhancedText]);

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

  // Process text for improvement
  const processText = async () => {
    if (!content.trim()) {
      showNotification("Please enter or upload text to enhance", "error");
      return;
    }

    setIsProcessing(true);
    setOriginalText(content); // Store original for comparison

    try {
      console.log('🚀 Processing text with writing style:', writingStyle);
      
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

      console.log('📤 Sending request with writing style:', requestData);

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

      setEnhancedText(data.enhancedText);

      const mappedSuggestions = (data.suggestions || []).map((suggestion: any) => ({
        original: suggestion.original,
        suggestion: suggestion.suggestion,
        reason: suggestion.reason,
        type: suggestion.type || "clarity",
      }));

      setSuggestions(mappedSuggestions);
      setAppliedSuggestions([]); // Reset applied suggestions
      showNotification("Text enhanced successfully", "success");
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
    setEnhancedText("");
    setOriginalText("");
    setSuggestions([]);
    setAppliedSuggestions([]);
    setEditedContent("");
    setIsEditMode(false);
  };

  // Apply individual suggestion with tracking
  const applySuggestion = (index: number) => {
    const suggestion = suggestions[index];

    // Apply to the current edited content
    const updatedText = (isEditMode ? editedContent : enhancedText).replace(
      suggestion.original,
      suggestion.suggestion
    );
    
    if (isEditMode) {
      setEditedContent(updatedText);
    } else {
      setEnhancedText(updatedText);
    }

    // Move suggestion to applied list
    setAppliedSuggestions(prev => [...prev, suggestion]);

    // Remove from pending suggestions
    const updatedSuggestions = [...suggestions];
    updatedSuggestions.splice(index, 1);
    setSuggestions(updatedSuggestions);
    
    showNotification("Suggestion applied successfully", "success");
  };

  // Apply all suggestions at once
  const applyAllSuggestions = () => {
    if (suggestions.length === 0) return;

    let text = isEditMode ? editedContent : enhancedText;
    const newlyApplied = [...suggestions];
    
    for (const suggestion of suggestions) {
      text = text.replace(suggestion.original, suggestion.suggestion);
    }

    if (isEditMode) {
      setEditedContent(text);
    } else {
      setEnhancedText(text);
    }
    
    setAppliedSuggestions(prev => [...prev, ...newlyApplied]);
    setSuggestions([]);
    showNotification("All suggestions applied", "success");
  };

  // Save content edits
  const saveContentEdits = () => {
    setEnhancedText(editedContent);
    setIsEditMode(false);
    showNotification("Content updated successfully", "success");
  };

  // FIXED: Handle content updates from ContentEditChat
  const handleContentUpdate = (newContent: string, newTitle?: string) => {
    if (isEditMode) {
      setEditedContent(newContent);
    } else {
      setEnhancedText(newContent);
    }
    showNotification("Content updated successfully", "success");
  };

  // Copy enhanced text to clipboard
  const copyToClipboard = () => {
    const textToCopy = isEditMode ? editedContent : enhancedText;
    navigator.clipboard.writeText(textToCopy);
    showNotification("Enhanced text copied to clipboard", "success");
  };

  // Export functionality
  const handleExport = (format: 'txt' | 'markdown' | 'html' | 'pdf' | 'docx') => {
    const textToExport = isEditMode ? editedContent : enhancedText;
    
    if (!textToExport) {
      showNotification("No enhanced text to export", "error");
      return;
    }

    const fileName = `enhanced-text-${new Date().toISOString().slice(0, 10)}`;
    
    try {
      switch (format) {
        case 'txt':
          exportToText(textToExport, `${fileName}.txt`);
          break;
        case 'markdown':
          exportToMarkdown(textToExport, `${fileName}.md`);
          break;
        case 'html':
          exportToHTML(textToExport, `${fileName}.html`);
          break;
        case 'pdf':
          exportToPDF(textToExport, `${fileName}.pdf`);
          break;
        case 'docx':
          exportToDocx(textToExport, `${fileName}.docx`);
          break;
        default:
          exportToText(textToExport, `${fileName}.txt`);
      }
      
      showNotification(`Text exported as ${format.toUpperCase()}`, "success");
      setShowExportDropdown(false);
    } catch (error) {
      console.error('Export error:', error);
      showNotification("Export failed. Please try again.", "error");
    }
  };

  // Parse content for display
  const parsedContent = parseMarkdownWithStyle(enhancedText, writingStyle || {});

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
          <p className="text-sm text-gray-600">
            Upload a document or paste your text to improve clarity, engagement, and style.
          </p>

          <div>
            <label className="block text-sm font-medium mb-2">
              Style guide: Use the pre-filled style guide below or choose another using the dropdown.
              {isStyleConfigured && (
                <span className="text-green-600 text-xs ml-2">&nbsp;</span>
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
        </CardContent>
      </Card>

      {/* FIXED: Changes Summary - Show what was improved */}
      {(appliedSuggestions.length > 0 || originalText) && enhancedText && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span>Enhancement Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {originalText ? originalText.split(/\s+/).length : 0}
                </div>
                <div className="text-sm text-gray-600">Original Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {enhancedText.split(/\s+/).length}
                </div>
                <div className="text-sm text-gray-600">Enhanced Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {appliedSuggestions.length}
                </div>
                <div className="text-sm text-gray-600">Improvements Applied</div>
              </div>
            </div>
            
            {appliedSuggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recent Improvements:</h4>
                <div className="space-y-2">
                  {appliedSuggestions.slice(-3).map((suggestion, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                        {suggestion.type}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">{suggestion.reason}</span>
                    </div>
                  ))}
                  {appliedSuggestions.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{appliedSuggestions.length - 3} more improvements applied
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Text Display */}
      {enhancedText && (
        <Card>
          <CardHeader className="border-b flex justify-between items-center">
            <CardTitle>Enhanced Text</CardTitle>
            <div className="flex space-x-2">
              {/* Toggle Edit Mode Button */}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-3 py-1 text-sm border rounded-md flex items-center ${
                  isEditMode
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Edit className="w-4 h-4 mr-1" />
                {isEditMode ? "View Mode" : "Edit Mode"}
              </button>

              {/* Save button when in edit mode */}
              {isEditMode && (
                <button
                  onClick={saveContentEdits}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Edits
                </button>
              )}

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
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              {isEditMode ? (
                /* Edit Mode - Show textarea */
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-800">Editing Content</h3>
                  <p className="text-sm text-gray-600">
                    Make direct edits to your enhanced text below. Use markdown formatting for structure.
                  </p>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg min-h-[400px] font-mono"
                    placeholder="Edit your enhanced content here..."
                  />
                </div>
              ) : (
                /* View Mode - Show formatted content */
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm" style={{
                  fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  lineHeight: '1.6',
                  fontSize: '11pt',
                  color: '#333'
                }}>
                  {/* Document Title */}
                  {parsedContent.title && (
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold mb-2" style={{
                        color: '#2B579A',
                        fontFamily: 'Calibri, sans-serif',
                        fontSize: '18pt',
                        fontWeight: 'bold'
                      }}>
                        {applyHeadingCase(parsedContent.title, writingStyle?.formatting?.headingCase)}
                      </h1>
                    </div>
                  )}

                  {/* Introduction */}
                  {parsedContent.introduction && (
                    <div className="mb-6" style={{ textAlign: 'justify' }}>
                      {parsedContent.introduction.split("\n").map((para, idx) => (
                        <p key={idx} className={idx > 0 ? "mt-4" : ""} style={{
                          margin: idx > 0 ? '12pt 0' : '0',
                          textIndent: '0pt',
                          lineHeight: '1.6'
                        }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Content Sections */}
                  {parsedContent.sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h2 className="font-semibold mb-3" style={{
                        color: '#2B579A',
                        fontSize: '14pt',
                        fontWeight: 'bold',
                        marginTop: idx > 0 ? '18pt' : '12pt',
                        marginBottom: '6pt',
                        borderBottom: '1px solid #E5E7EB',
                        paddingBottom: '3pt'
                      }}>
                        {applyHeadingCase(section.title, writingStyle?.formatting?.headingCase)}
                      </h2>
                      <div style={{ textAlign: 'justify' }}>
                        {section.content.split("\n").filter(p => p.trim()).map((para, pIdx) => (
                          <p key={pIdx} style={{
                            margin: pIdx > 0 ? '12pt 0' : '0 0 12pt 0',
                            textIndent: '0pt',
                            lineHeight: '1.6'
                          }}>
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* If no sections, show the raw content formatted */}
                  {parsedContent.sections.length === 0 && !parsedContent.introduction && (
                    <div style={{ textAlign: 'justify' }}>
                      {enhancedText.split("\n").filter(p => p.trim()).map((para, idx) => (
                        <p key={idx} style={{
                          margin: idx > 0 ? '12pt 0' : '0 0 12pt 0',
                          textIndent: '0pt',
                          lineHeight: '1.6'
                        }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Word count display */}
                  <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    <span>Word count: {enhancedText.split(/\s+/).length}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions - Better visibility and interaction */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 text-blue-600 mr-2" />
                Improvement Suggestions ({suggestions.length})
              </CardTitle>
              <button
                onClick={applyAllSuggestions}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply All Suggestions
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Click "Apply" to make individual changes, or "Apply All" to implement all suggestions at once.
            </p>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                        {suggestion.type}
                      </span>
                      <span className="text-sm text-gray-600">{suggestion.reason}</span>
                    </div>
                    <button
                      onClick={() => applySuggestion(index)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                     <p className="text-xs font-medium text-red-700 mb-1">Original</p>
                     <p className="text-sm text-red-800">{suggestion.original}</p>
                   </div>
                   <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                     <p className="text-xs font-medium text-green-700 mb-1">Suggested</p>
                     <p className="text-sm text-green-800">{suggestion.suggestion}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
     )}

     {/* FIXED: ContentEditChat Integration - Like Content Creator */}
     {enhancedText && (
       <Card>
         <CardHeader className="border-b">
           <CardTitle className="flex items-center">
             <MessageSquare className="w-5 h-5 mr-2" />
             Ask for Additional Improvements
           </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
           <ContentEditChat
             originalContent={enhancedText}
             originalTitle="Enhanced Text"
             contentType="enhanced-text"
             onContentUpdate={handleContentUpdate}
             // Pass strategic context if available
             strategicContext={{
               productName: "Enhanced Content",
               valueProposition: "Improved clarity and engagement",
               audience: "general audience",
               tone: options.formalityLevel
             }}
           />
         </CardContent>
       </Card>
     )}

     {/* Writing Style Applied Notice */}
     {isStyleConfigured && enhancedText && (
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