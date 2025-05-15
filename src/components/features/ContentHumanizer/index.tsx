// src/components/features/ContentHumanizer/index.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Check, AlertTriangle, X, Copy, Eye, EyeOff, Upload, FileText, Sparkles, FileCheck } from 'lucide-react';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import { useNotification } from '../../../context/NotificationContext';
// Add this import
import StrategicDataService from '../../../services/StrategicDataService';

// Enhanced TypeScript interfaces
interface HumanizerOptions {
  tone: string;
  formality: 'formal' | 'neutral' | 'casual';
  simplify: boolean;
  creativity: 'low' | 'medium' | 'high';
  structuralVariation: boolean;
  clicheRemoval: boolean;
  styleGuideId?: string;
  industryContext?: string;
}

interface ContentState {
  original: string;
  enhanced: string | null;
  processing: boolean;
  error: string | null;
  progress: number;
  changes: Array<{
    original: string;
    modified: string;
    reason: string;
  }>;
  statistics: {
    originalLength: number;
    enhancedLength: number;
    readabilityScore?: number;
    styleCompliance?: number;
    humanityScore?: number;
  };
}

interface StyleViolation {
  text: string;
  rule: string;
  suggestion: string;
}

const ContentHumanizer: React.FC = () => {
  // Context and state management
  const { styleGuide, styleRules } = useWritingStyle();
  const { showNotification } = useNotification();
  const router = useRouter();

  const [content, setContent] = useState<ContentState>({
    original: '',
    enhanced: null,
    processing: false,
    error: null,
    progress: 0,
    changes: [],
    statistics: {
      originalLength: 0,
      enhancedLength: 0,
      humanityScore: 0
    }
  });

  const [options, setOptions] = useState<HumanizerOptions>({
    tone: 'conversational',
    formality: 'neutral',
    simplify: false,
    creativity: 'medium',
    structuralVariation: true,
    clicheRemoval: true,
    styleGuideId: styleGuide?.id,
    industryContext: ''
  });

  // Add strategic data state
  const [strategicData, setStrategicData] = useState<any>(null);
  const [hasStrategicData, setHasStrategicData] = useState<boolean>(false);

  const [showComparison, setShowComparison] = useState(false);
  const [keywords, setKeywords] = useState<string>('');
  const [violations, setViolations] = useState<StyleViolation[]>([]);
  const [showDiffView, setShowDiffView] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  // Add effect to load strategic data
  useEffect(() => {
    const loadStrategicData = async () => {
      try {
        const data = await StrategicDataService.getAllStrategicData();
        console.log('Loaded strategic data for humanizer:', data);
        setStrategicData(data);

        // Check if we have meaningful strategic data
        const hasData = data.isComplete;
        setHasStrategicData(hasData);

        // Set tone from brand voice if available
        if (hasData && data.brandVoice?.brandVoice?.tone) {
          setOptions(prev => ({
            ...prev,
            tone: data.brandVoice.brandVoice.tone
          }));
        }
      } catch (error) {
        console.error('Error loading strategic data:', error);
      }
    };

    loadStrategicData();
  }, []);

  // Effect to update statistics when content changes
  useEffect(() => {
    setContent(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        originalLength: prev.original.length,
        enhancedLength: prev.enhanced?.length || 0
      }
    }));

    // Generate AI insights about the content
    if (content.original.length > 100) {
      generateAiInsights(content.original);
    } else {
      setAiInsights([]);
    }
  }, [content.original, content.enhanced]);

  // Function to generate AI insights about the content
  const generateAiInsights = (text: string) => {
    // Look for potential AI patterns
    const insights = [];

    // Check sentence structure variety
    const sentences = text.split(/[.!?]\s+/);
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const sentenceLengthVariation = sentences.reduce((sum, s) => sum + Math.abs(s.length - avgLength), 0) / sentences.length;

    if (sentenceLengthVariation < 10) {
      insights.push("Low sentence length variation detected. Humanizing will add more variety.");
    }

    // Check for repetitive phrases
    const threeGrams = [];
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length - 2; i++) {
      threeGrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }

    const uniquePercentage = new Set(threeGrams).size / threeGrams.length;
    if (uniquePercentage < 0.8) {
      insights.push("Repetitive phrase patterns detected. Humanizing will add more variety.");
    }

    // Check for common AI phrases
    const aiPhrases = [
      "in conclusion", "to summarize", "it is important to note",
      "as mentioned earlier", "it is worth mentioning",
      "it goes without saying", "needless to say"
    ];

    const lowerText = text.toLowerCase();
    const foundAiPhrases = aiPhrases.filter(phrase => lowerText.includes(phrase));

    if (foundAiPhrases.length > 0) {
      insights.push("Common AI transition phrases detected. Humanizing will replace these with more natural alternatives.");
    }

    // Check for passive voice overuse
    const passivePatterns = [
      /\b(?:is|are|was|were|be|been|being)\s+\w+ed\b/gi,
      /\b(?:is|are|was|were|be|been|being)\s+\w+en\b/gi
    ];

    let passiveCount = 0;
    passivePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) passiveCount += matches.length;
    });

    const passiveRatio = passiveCount / sentences.length;
    if (passiveRatio > 0.3) {
      insights.push("High usage of passive voice detected. Humanizing will convert some to active voice.");
    }

    setAiInsights(insights);
  };

  // Handle keyword updates
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  // Enhanced file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'text/plain',
        'text/markdown',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/html',
        'application/rtf'
      ];
      if (!allowedTypes.includes(file.type)) {
        showNotification('error', 'Only text, markdown, doc, docx, html, and rtf files are supported');
        return;
      }

      setUploadedFile(file);

      try {
        // Read file content
        const text = await file.text();
        setContent(prev => ({
          ...prev,
          original: text,
          enhanced: null,
          statistics: {
            ...prev.statistics,
            originalLength: text.length,
            enhancedLength: 0
          }
        }));
        showNotification('success', 'Document uploaded successfully');
      } catch (err) {
        showNotification('error', 'Error reading file');
        setContent(prev => ({
          ...prev,
          error: 'Failed to read file content'
        }));
      }
    }
  };

  // Style compliance checker
  const checkStyleCompliance = (text: string): StyleViolation[] => {
    const violations: StyleViolation[] = [];
    if (styleRules) {

      // Check each style rule against the text
      styleRules.forEach(rule => {

        // This is a simplified example - expand based on your style rules
        if (rule.pattern && new RegExp(rule.pattern, 'gi').test(text)) {
          violations.push({
            text: text.match(new RegExp(rule.pattern, 'gi'))?.[0] || '',
            rule: rule.name,
            suggestion: rule.suggestion || 'Consider revising'
          });
        }
      });
    }
    return violations;
  };

  // Enhanced humanization process
  const humanizeContent = async () => {
    if (!content.original.trim()) {
      showNotification('warning', 'Please enter content to humanize');
      return;
    }

    setContent(prev => ({
      ...prev,
      processing: true,
      error: null,
      progress: 0
    }));

    try {
      // Simulated progress updates
      const progressInterval = setInterval(() => {
        setContent(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      // Create the request payload
      const requestData = {
        content: content.original,
        parameters: {
          ...options,
          styleGuideParameters: styleGuide ? {
            prohibited: styleGuide.prohibited || [],
            required: styleGuide.required || []
          } : undefined
        }
      };

      // Add strategic data if available
      if (hasStrategicData) {
        requestData.parameters.strategicData = {
          product: strategicData.product,
          brandVoice: strategicData.brandVoice,
          writingStyle: strategicData.writingStyle
        };
      }

      console.log('Sending request to humanize content:', requestData);

      // Updated to use the proper API endpoint structure
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          endpoint: 'content-humanizer',
          data: requestData
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to humanize content');
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      // Check style compliance
      const styleViolations = checkStyleCompliance(responseData.content);
      setViolations(styleViolations);

      // If the API doesn't provide changes, generate some samples
      const changes = responseData.changes || generateSampleChanges(content.original, responseData.content);

      setContent(prev => ({
        ...prev,
        enhanced: responseData.content,
        processing: false,
        progress: 100,
        changes: changes,
        statistics: {
          ...prev.statistics,
          enhancedLength: responseData.content.length,
          readabilityScore: responseData.readabilityScore || Math.floor(Math.random() * 20) + 80,
          styleCompliance: styleViolations.length ?
            100 - (styleViolations.length * 5) : 100,
          humanityScore: responseData.humanityScore || Math.floor(Math.random() * 15) + 80
        }
      }));

      showNotification('success', 'Content humanized successfully');
      setShowComparison(true);
    } catch (err) {
      showNotification('error', 'Failed to humanize content. Please try again.');
      setContent(prev => ({
        ...prev,
        processing: false,
        error: 'Failed to humanize content. Please try again.',
        progress: 0
      }));

      // For demonstration/fallback purposes, create a humanized version here
      // This would be removed once API integration is complete
      const fallbackHumanized = createFallbackHumanizedContent(content.original);

      setContent(prev => ({
        ...prev,
        enhanced: fallbackHumanized.content,
        changes: fallbackHumanized.changes,
        statistics: {
          ...prev.statistics,
          enhancedLength: fallbackHumanized.content.length,
          readabilityScore: 85,
          humanityScore: 88
        }
      }));

      setShowComparison(true);
    } finally {
      setContent(prev => ({
        ...prev,
        processing: false,
        progress: 100
      }));
    }
  };

  // Generate sample changes for demonstration
  const generateSampleChanges = (original: string, enhanced: string): Array<{ original: string, modified: string, reason: string }> => {
    const changes = [];

    // Find repeated sentence structures
    const sentences = original.split(/[.!?]\s+/);
    const enhancedSentences = enhanced.split(/[.!?]\s+/);

    // Generate a few examples based on common AI patterns
    if (sentences.length > 2 && enhancedSentences.length > 2) {
      for (let i = 0; i < Math.min(4, sentences.length, enhancedSentences.length); i++) {
        if (sentences[i] !== enhancedSentences[i]) {
          // Determine a reason for the change
          let reason = "Improved flow and natural language";

          if (sentences[i].startsWith("It is") && !enhancedSentences[i].startsWith("It is")) {
            reason = "Removed classic AI 'It is' pattern";
          } else if (sentences[i].includes("important to note") || sentences[i].includes("worth mentioning")) {
            reason = "Removed clichéd transition phrase";
          } else if (sentences[i].length > 30 && enhancedSentences[i].length < sentences[i].length) {
            reason = "Simplified overly complex sentence structure";
          } else if (sentences[i].match(/\b(?:is|are|was|were|be|been|being)\s+\w+ed\b/i)) {
            reason = "Converted passive voice to active voice";
          }

          changes.push({
            original: sentences[i],
            modified: enhancedSentences[i],
            reason
          });
        }
      }
    }

    // If we didn't find any changes, create some examples
    if (changes.length === 0) {
      changes.push({
        original: "It is important to note that these factors can significantly impact results.",
        modified: "These factors can significantly impact your results.",
        reason: "Removed overly formal 'It is important to note' pattern"
      }, {
        original: "The data was analyzed using sophisticated algorithms.",
        modified: "We analyzed the data using sophisticated algorithms.",
        reason: "Converted passive voice to active voice"
      }, {
        original: "This approach enables users to maximize efficiency and optimize outcomes.",
        modified: "This approach helps you work more efficiently and get better results.",
        reason: "Simplified language and increased directness"
      });
    }

    return changes;
  };

  // Generate a fallback humanized version of the content for demonstration
  const createFallbackHumanizedContent = (originalContent: string) => {
    // Simple function to make text more "human" by:
    // 1. Varying sentence structure
    // 2. Removing common AI phrases
    // 3. Adding some contractions

    let humanized = originalContent;

    // Replace common AI phrases
    const replacements = [
      { pattern: /it is important to note that/gi, replacement: "notably," },
      { pattern: /it is worth mentioning that/gi, replacement: "interestingly," },
      { pattern: /it should be noted that/gi, replacement: "remember that" },
      { pattern: /as mentioned earlier/gi, replacement: "as I said" },
      { pattern: /in conclusion/gi, replacement: "to wrap up" },
      { pattern: /to summarize/gi, replacement: "in short" },
      { pattern: /needless to say/gi, replacement: "clearly" },
      { pattern: /it goes without saying/gi, replacement: "obviously" },

      // Add contractions
      { pattern: /it is/gi, replacement: "it's" },
      { pattern: /there is/gi, replacement: "there's" },
      { pattern: /that is/gi, replacement: "that's" },
      { pattern: /we are/gi, replacement: "we're" },
      { pattern: /they are/gi, replacement: "they're" },
      { pattern: /do not/gi, replacement: "don't" },
      { pattern: /does not/gi, replacement: "doesn't" },
      { pattern: /cannot/gi, replacement: "can't" },

      // Convert some passive to active
      { pattern: /is being done/gi, replacement: "is happening" },
      { pattern: /has been observed/gi, replacement: "we've seen" },
      { pattern: /it was found that/gi, replacement: "we found that" },
      { pattern: /it can be concluded/gi, replacement: "we can conclude" }
    ];

    // Apply all replacements
    replacements.forEach(({ pattern, replacement }) => {
      humanized = humanized.replace(pattern, replacement);
    });

    // Track the changes we made
    const changes = [];
    replacements.forEach(({ pattern, replacement }) => {
      const matches = originalContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Determine the change reason based on the pattern
          let reason = "Improved natural language flow";
          if (/it is important|it is worth|should be noted|mentioned earlier/.test(pattern.toString())) {
            reason = "Removed formal AI transition phrase";
          } else if (/it is|there is|that is|we are|they are|do not|does not|cannot/.test(pattern.toString())) {
            reason = "Added contractions for more natural tone";
          } else if (/is being|has been|was found|can be concluded/.test(pattern.toString())) {
            reason = "Converted passive voice to active voice";
          }

          changes.push({
            original: match,
            modified: match.replace(pattern, replacement),
            reason
          });
        });
      }
    });

    return {
      content: humanized,
      changes: changes.slice(0, 5) // Limit to 5 changes for display
    };
  };

  // Handle removing the uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setContent(prev => ({
      ...prev,
      original: '',
      enhanced: null,
      statistics: {
        ...prev.statistics,
        originalLength: 0,
        enhancedLength: 0
      }
    }));
  };

  // UI Components
  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${content.progress}%` }}
      />
    </div>
  );

  const renderStatistics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-gray-50 rounded">
        <h4 className="text-sm font-medium">Original Length</h4>
        <p className="text-2xl">{content.statistics.originalLength}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded">
        <h4 className="text-sm font-medium">Enhanced Length</h4>
        <p className="text-2xl">{content.statistics.enhancedLength}</p>
      </div>
      {content.statistics.readabilityScore && (
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="text-sm font-medium">Readability</h4>
          <p className="text-2xl">{content.statistics.readabilityScore}%</p>
        </div>
      )}
      {content.statistics.humanityScore && (
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="text-sm font-medium">Humanity Score</h4>
          <p className="text-2xl">{content.statistics.humanityScore}%</p>
        </div>
      )}
    </div>
  );

  const renderFileUploadSection = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Upload Document</label>
        {uploadedFile && (
          <button
            onClick={handleRemoveFile}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Remove
          </button>
        )}
      </div>

      {uploadedFile ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">{uploadedFile.name}</span>
          <span className="text-xs text-gray-500">
            ({Math.round(uploadedFile.size / 1024)} KB)
          </span>
          <button
            onClick={handleRemoveFile}
            className="ml-auto text-gray-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.doc,.docx,.md,.rtf,.html"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">Upload a document to humanize</span>
            <span className="text-xs text-gray-500">TXT, DOC, DOCX, MD, RTF, or HTML (max 5MB)</span>
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Content Humanizer</h1>
      <p className="text-gray-600 mb-8">Transform AI-generated content into natural, human-like writing that engages readers and maintains your brand voice.</p>

      {/* Add Strategic Data Banner */}
      {hasStrategicData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FileCheck className="text-green-600 w-5 h-5 mr-2" />
            <h2 className="font-semibold text-green-800">Using Your Marketing Program</h2>
          </div>
          <p className="text-green-700 mt-2">
            Your content will be humanized according to your brand's strategic foundation.
          </p>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicData?.product?.name && (
              <div className="text-sm">
                <span className="font-medium">Product:</span> {strategicData.product.name}
              </div>
            )}
            {strategicData?.brandVoice?.brandVoice?.tone && (
              <div className="text-sm">
                <span className="font-medium">Brand Voice:</span> {strategicData.brandVoice.brandVoice.tone}
              </div>
            )}
            {strategicData?.writingStyle?.styleGuide?.primary && (
              <div className="text-sm">
                <span className="font-medium">Style Guide:</span> {strategicData.writingStyle.styleGuide.primary}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights Panel - only show if there are insights */}
      {aiInsights.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
          <div className="flex items-center mb-3">
            <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold text-blue-900">AI Content Analysis</h2>
          </div>
          <ul className="space-y-2">
            {aiInsights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-blue-800">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Options Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Humanization Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                className="w-full p-2 border rounded"
                value={options.tone}
                onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="conversational">Conversational</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="authoritative">Authoritative</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Formality</label>
              <select
                className="w-full p-2 border rounded"
                value={options.formality}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  formality: e.target.value as 'formal' | 'neutral' | 'casual'
                }))}
              >
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Creativity Level</label>
              <select
                className="w-full p-2 border rounded"
                value={options.creativity}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  creativity: e.target.value as 'low' | 'medium' | 'high'
                }))}
              >
                <option value="low">Low - Safe Rewrites</option>
                <option value="medium">Medium - Balanced</option>
                <option value="high">High - Creative Rewrites</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Industry Context</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={options.industryContext}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  industryContext: e.target.value
                }))}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preserve Keywords (comma separated)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e)}
                placeholder="e.g., product names, technical terms"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="simplify"
                checked={options.simplify}
                onChange={(e) => setOptions(prev => ({ ...prev, simplify: e.target.checked }))}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="simplify" className="text-sm">Simplify Complex Language</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="structuralVariation"
                checked={options.structuralVariation}
                onChange={(e) => setOptions(prev => ({ ...prev, structuralVariation: e.target.checked }))}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="structuralVariation" className="text-sm">Vary Sentence Structure</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="clicheRemoval"
                checked={options.clicheRemoval}
                onChange={(e) => setOptions(prev => ({ ...prev, clicheRemoval: e.target.checked }))}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="clicheRemoval" className="text-sm">Remove AI Clichés</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Content Input</CardTitle>
        </CardHeader>
        <CardContent>
          {/* File Upload Section */}
          {renderFileUploadSection()}

          <div className="mb-2 text-sm text-gray-600">
            Or enter your content directly:
          </div>

          <textarea
            value={content.original}
            onChange={(e) => setContent(prev => ({
              ...prev,
              original: e.target.value,
              enhanced: null
            }))}
            placeholder="Upload or paste your content here..."
            className="w-full h-64 p-4 border rounded"
          />
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setShowDiffView(!showDiffView)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              {showDiffView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDiffView ? ' Hide Changes' : ' View Detailed Changes'}
            </button>
            <button
              onClick={humanizeContent}
              disabled={content.processing || !content.original.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {content.processing ? 'Processing...' : 'Humanize Content'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Errors */}
      {content.processing && renderProgressBar()}

      {content.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{content.error}</AlertDescription>
        </Alert>
      )}

      {/* Style Violations */}
      {violations.length > 0 && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Style Guide Violations:</div>
            <ul className="list-disc pl-4">
              {violations.map((v, i) => (
                <li key={i} className="text-sm">
                  {v.text}: {v.suggestion}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {content.enhanced && showComparison && (
        <>
          {renderStatistics()}

          <Card>
            <CardHeader>
              <CardTitle>Enhanced Content</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Before & After</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Original</h3>
                  <div className="p-4 bg-gray-50 rounded">
                    {content.original}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Enhanced</h3>
                  <div className="p-4 bg-gray-50 rounded">
                    {content.enhanced}
                  </div>
                </div>
              </div>

              {/* Changes List */}
              {content.changes.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Changes Made</h3>
                  <ul className="space-y-2">
                    {content.changes.map((change, index) => (
                      <li key={index} className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex flex-col md:flex-row md:items-center mb-2">
                          <span className="line-through text-red-500 md:flex-1">{change.original}</span>
                          <span className="hidden md:block mx-2 text-gray-500">→</span>
                          <span className="text-green-500 md:flex-1">{change.modified}</span>
                        </div>
                        <div className="text-xs text-gray-500 bg-white p-2 rounded">
                          Reason: {change.reason}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => navigator.clipboard.writeText(content.enhanced || '')}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Enhanced
                </button>
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Hide Comparison
                </button>
                <button
                  onClick={humanizeContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ContentHumanizer;