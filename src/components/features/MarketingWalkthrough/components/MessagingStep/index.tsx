// src/components/features/MessageFramework/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
  Sparkles, AlertCircle, PlusCircle, X, RefreshCw,
  Lightbulb, Download, Upload, Trash2, Save, ExternalLink, HelpCircle
} from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import { useRouter } from 'next/router';

// Define the main data structure
interface MessageFramework {
  valueProposition: string;
  differentiators: string[];
  keyBenefits: string[];
}

interface MessageFrameworkProps {
  onSave?: (data: MessageFramework) => void;
}

const MessageFramework: React.FC<MessageFrameworkProps> = ({ onSave }) => {
  const { showNotification } = useNotification();
  const router = useRouter();

  // Main state for the message framework
  const [framework, setFramework] = useState<MessageFramework>({
    valueProposition: '',
    differentiators: [''],
    keyBenefits: ['']
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<Partial<MessageFramework> | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // References for focus management
  const newDifferentiatorRef = useRef<HTMLInputElement>(null);
  const newBenefitRef = useRef<HTMLInputElement>(null);

  // State for tracking which field to focus
  const [focusField, setFocusField] = useState<{
    type: 'differentiator' | 'benefit' | null;
    index: number | null;
  }>({ type: null, index: null });

  // Load existing data from localStorage on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem('messageFramework');
    if (savedFramework) {
      try {
        const parsedFramework = JSON.parse(savedFramework);
        setFramework(parsedFramework);
      } catch (error) {
        console.error('Error loading saved message framework:', error);
      }
    }
  }, []);

  // Handle focus on newly added fields
  useEffect(() => {
    if (focusField.type === 'differentiator' && focusField.index !== null && newDifferentiatorRef.current) {
      newDifferentiatorRef.current.focus();
      setFocusField({ type: null, index: null });
    } else if (focusField.type === 'benefit' && focusField.index !== null && newBenefitRef.current) {
      newBenefitRef.current.focus();
      setFocusField({ type: null, index: null });
    }
  }, [focusField]);

  // Add a new field (differentiator or benefit)
  const addField = (field: 'differentiators' | 'keyBenefits') => {
    setFramework(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));

    // Set focus to the new field
    const newIndex = framework[field].length;
    setFocusField({
      type: field === 'differentiators' ? 'differentiator' : 'benefit',
      index: newIndex
    });
  };

  // Remove a field (differentiator or benefit)
  const removeField = (field: 'differentiators' | 'keyBenefits', index: number) => {
    setFramework(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Update a single field
  const updateField = (field: keyof MessageFramework, value: any) => {
    setFramework(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update a single item in an array field
  const updateArrayField = (field: 'differentiators' | 'keyBenefits', index: number, value: string) => {
    const newArray = [...framework[field]];
    newArray[index] = value;
    updateField(field, newArray);
  };

  // Navigate to writing style page
  const goToWritingStyle = () => {
    // First save the current framework
    try {
      // Clean up empty entries
      const cleanedFramework = {
        ...framework,
        differentiators: framework.differentiators.filter(d => d.trim()),
        keyBenefits: framework.keyBenefits.filter(b => b.trim())
      };

      // Save to localStorage
      localStorage.setItem('messageFramework', JSON.stringify(cleanedFramework));

      // Navigate to writing style page
      router.push('/writing-style');
    } catch (error) {
      console.error('Error saving before navigation:', error);
      showNotification('error', 'Failed to save framework before navigating');
    }
  };

  // Generate AI-enhanced framework
  const generateAIFramework = async () => {
    setIsGenerating(true);
    setError('');
    setAiSuggestions(null);

    try {
      // Prepare the request data with all required fields
      const requestBody = {
        endpoint: 'value-proposition-generator',
        data: {
          productInfo: {
            // Add specific product info as required by the API
            name: "Marketing Content Lab", // Default name if none provided
            description: framework.valueProposition || "Content marketing platform",
            benefits: framework.keyBenefits.filter(b => b.trim()).length > 0
              ? framework.keyBenefits.filter(b => b.trim())
              : ["Improved content creation"],
            targetAudience: ["Marketing professionals"]
          },
          competitors: ["ContentCal", "HubSpot", "CoSchedule"],
          industry: "Technology",
          focusAreas: ["user", "business"],
          tone: "professional",
          currentFramework: framework
        }
      };

      console.log("Sending API request:", JSON.stringify(requestBody));

      // Set up abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Extend timeout to 30 seconds

      // Make the API call
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Check if aborted
      if (controller.signal.aborted) {
        throw new Error('Request timed out after 30 seconds. Please try again.');
      }

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Validate data
      if (!data.valueProposition && !data.keyDifferentiators && !data.keyBenefits) {
        throw new Error('The API returned an invalid response. Please try again.');
      }

      // Show the AI suggestions
      setAiSuggestions({
        valueProposition: data.valueProposition || '',
        differentiators: data.keyDifferentiators || [],
        keyBenefits: data.keyBenefits || []
      });

      showNotification('success', 'AI enhancements generated successfully');
    } catch (error) {
      console.error('Error generating AI framework:', error);
      setError(`API Error: ${error.message || 'Failed to generate AI enhancements. Please try again later.'}`);
      showNotification('error', 'Failed to generate AI enhancements');
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply AI suggestions
  const applyAISuggestions = () => {
    if (!aiSuggestions) return;

    // Create updated framework with suggestions
    const updatedFramework = {
      ...framework,
      valueProposition: aiSuggestions.valueProposition || framework.valueProposition,
      differentiators: aiSuggestions.differentiators || framework.differentiators,
      keyBenefits: aiSuggestions.keyBenefits || framework.keyBenefits
    };

    // Update the framework
    setFramework(updatedFramework);

    // Clear suggestions
    setAiSuggestions(null);

    // Show notification
    showNotification('success', 'AI suggestions applied to your framework');
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploadedFile(file);

    try {
      // Read file content
      const text = await file.text();

      // Try to parse as JSON
      try {
        const parsedData = JSON.parse(text);
        if (parsedData.valueProposition || parsedData.differentiators || parsedData.keyBenefits) {
          setFramework({
            valueProposition: parsedData.valueProposition || '',
            differentiators: parsedData.differentiators || [''],
            keyBenefits: parsedData.keyBenefits || ['']
          });
          showNotification('success', 'Framework loaded from file successfully');
        } else {
          throw new Error('Invalid file format');
        }
      } catch (parseError) {
        // If not JSON, treat as text and extract content
        const lines = text.split('\n').filter(line => line.trim());

        // Attempt to identify sections
        const valueProposition = lines.find(line =>
          line.includes('value proposition') ||
          line.includes('mission statement') ||
          line.length > 80
        ) || '';

        const potentialDifferentiators = lines.filter(line =>
          line.includes('different') ||
          line.includes('unique') ||
          (line.length > 20 && line.length < 100)
        );

        const potentialBenefits = lines.filter(line =>
          line.includes('benefit') ||
          line.includes('value') ||
          line.includes('gain') ||
          (line.length > 10 && line.length < 80 && !potentialDifferentiators.includes(line))
        );

        setFramework({
          valueProposition: valueProposition,
          differentiators: potentialDifferentiators.length ? potentialDifferentiators : [''],
          keyBenefits: potentialBenefits.length ? potentialBenefits : ['']
        });

        showNotification('info', 'File imported as text - review content for accuracy');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      showNotification('error', 'Failed to read file. Please try again.');
    }
  };

  // Save framework
  const saveFramework = async () => {
    setIsSaving(true);

    try {
      // Validate data
      if (!framework.valueProposition.trim()) {
        showNotification('error', 'Please provide a value proposition');
        setIsSaving(false);
        return;
      }

      if (!framework.differentiators.some(d => d.trim()) ||
        !framework.keyBenefits.some(b => b.trim())) {
        showNotification('error', 'Please provide at least one differentiator and one benefit');
        setIsSaving(false);
        return;
      }

      // Clean up empty entries
      const cleanedFramework = {
        ...framework,
        differentiators: framework.differentiators.filter(d => d.trim()),
        keyBenefits: framework.keyBenefits.filter(b => b.trim())
      };

      // Save to localStorage
      localStorage.setItem('messageFramework', JSON.stringify(cleanedFramework));

      // If onSave callback is provided, call it
      if (onSave) {
        onSave(cleanedFramework);
      }

      showNotification('success', 'Message framework saved successfully');
    } catch (error) {
      console.error('Error saving framework:', error);
      showNotification('error', 'Failed to save framework. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export framework as JSON file
  const exportFramework = () => {
    try {
      // Clean up empty entries
      const cleanedFramework = {
        ...framework,
        differentiators: framework.differentiators.filter(d => d.trim()),
        keyBenefits: framework.keyBenefits.filter(b => b.trim())
      };

      // Convert to JSON string
      const jsonData = JSON.stringify(cleanedFramework, null, 2);

      // Create blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'message_framework.json';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('success', 'Framework exported successfully');
    } catch (error) {
      console.error('Error exporting framework:', error);
      showNotification('error', 'Failed to export framework. Please try again.');
    }
  };

  // Clear framework with confirmation
  const handleClearFramework = () => {
    setShowConfirmClear(true);
  };

  // Confirm clearing framework
  const confirmClearFramework = () => {
    setFramework({
      valueProposition: '',
      differentiators: [''],
      keyBenefits: ['']
    });

    setAiSuggestions(null);
    setShowConfirmClear(false);
    showNotification('success', 'Framework cleared successfully');
  };
  // Add this section to MessageFramework/index.tsx, above the main Card component

  {/* Company Messaging Document Upload Section */ }
  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">Upload Company Messaging Document</h3>
        <HelpCircle className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600">
        If you already have a company messaging document or brand guidelines, upload it here to pre-populate your message framework.
      </p>
    </div>

    {/* File Upload Section */}
    {uploadedFile ? (
      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
        <FileText className="w-5 h-5 text-gray-500" />
        <div className="flex-1">
          <span className="text-sm font-medium">{uploadedFile.name}</span>
          <p className="text-xs text-gray-500">
            {(uploadedFile.size / 1024).toFixed(0)} KB • Uploaded {new Date().toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={() => setUploadedFile(null)}
          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ) : (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".txt,.json,.md,.docx,.pdf"
          id="message-file-upload"
        />
        <label
          htmlFor="message-file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-600">Upload your company messaging document</span>
          <span className="text-xs text-gray-500">PDF, DOC, DOCX, JSON, TXT, or MD (max 5MB)</span>
        </label>
      </div>
    )}

    <div className="text-sm text-gray-600 space-y-1 mt-4">
      <p>ℹ️ This will attempt to extract:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Value proposition statements</li>
        <li>Key differentiators and unique selling points</li>
        <li>Customer benefits and value points</li>
      </ul>
    </div>
  </div>

  {/* Then, also modify the top action bar to remove the Import button */ }
  <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap justify-between items-center gap-3">
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-bold">Message Framework</h2>
    </div>

    <div className="flex flex-wrap gap-2">
      {/* Export Button */}
      <button
        onClick={exportFramework}
        className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </button>

      {/* Voice & Tone Link */}
      <button
        onClick={goToWritingStyle}
        className="px-3 py-2 rounded-lg border flex items-center bg-gray-50 text-gray-700 hover:bg-gray-100"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Voice & Tone Settings
      </button>

      {/* Clear Button */}
      <button
        onClick={handleClearFramework}
        className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border flex items-center"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </button>

      {/* Save Button */}
      <button
        onClick={saveFramework}
        disabled={isSaving}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
      >
        {isSaving ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save
          </>
        )}
      </button>
    </div>
  </div>
  // Main render method
  return (
    <div className="space-y-6">
      {/* Clear Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">Clear Message Framework?</h3>
            <p className="mb-6 text-gray-600">
              This will remove all content in your message framework. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearFramework}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear Framework
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Message Framework</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* File Upload */}
          <label className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 border">
            <Upload className="w-4 h-4 mr-2" />
            <span>Import</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.json,.md,.docx"
            />
          </label>

          {/* Export Button */}
          <button
            onClick={exportFramework}
            className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          {/* Voice & Tone Link */}
          <button
            onClick={goToWritingStyle}
            className="px-3 py-2 rounded-lg border flex items-center bg-gray-50 text-gray-700 hover:bg-gray-100"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Voice & Tone Settings
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClearFramework}
            className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </button>

          {/* Save Button */}
          <button
            onClick={saveFramework}
            disabled={isSaving}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Writing Style Callout */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-center">
        <Lightbulb className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800">
            Need to define your brand voice and tone? Use our Writing Style tool for a guided approach.
          </p>
        </div>
        <button
          onClick={goToWritingStyle}
          className="px-3 py-1 ml-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 flex items-center text-sm"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Go to Writing Style
        </button>
      </div>

      {/* Main Message Framework Content */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Value Proposition</h3>

          <button
            onClick={generateAIFramework}
            disabled={isGenerating}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Enhance with AI
              </>
            )}
          </button>
        </div>

        <textarea
          value={framework.valueProposition}
          onChange={(e) => updateField('valueProposition', e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          rows={4}
          placeholder="Enter your value proposition statement here..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Differentiators Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Differentiators</h3>
            <p className="text-gray-600 text-sm mb-4">What makes you uniquely different from competitors?</p>

            <div className="space-y-3">
              {framework.differentiators.map((differentiator, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    ref={index === framework.differentiators.length - 1 ? newDifferentiatorRef : null}
                    value={differentiator}
                    onChange={(e) => updateArrayField('differentiators', index, e.target.value)}
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Differentiator #${index + 1}`}
                  />
                  {framework.differentiators.length > 1 && (
                    <button
                      onClick={() => removeField('differentiators', index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => addField('differentiators')}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Differentiator
              </button>
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Benefits</h3>
            <p className="text-gray-600 text-sm mb-4">What specific value do customers gain from your solution?</p>

            <div className="space-y-3">
              {framework.keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    ref={index === framework.keyBenefits.length - 1 ? newBenefitRef : null}
                    value={benefit}
                    onChange={(e) => updateArrayField('keyBenefits', index, e.target.value)}
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Benefit #${index + 1}`}
                  />
                  {framework.keyBenefits.length > 1 && (
                    <button
                      onClick={() => removeField('keyBenefits', index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => addField('keyBenefits')}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Benefit
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-sm text-red-700 hover:text-red-900 font-medium underline mt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* AI Suggestions Panel */}
        {aiSuggestions && (
          <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                AI-Enhanced Framework Suggestions
              </h3>
              <button
                onClick={() => setAiSuggestions(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {aiSuggestions.valueProposition && (
                <div>
                  <h4 className="font-medium mb-2 text-blue-800">Enhanced Value Proposition</h4>
                  <div className="p-3 bg-white rounded-lg border border-blue-100">
                    {aiSuggestions.valueProposition}
                  </div>
                </div>
              )}

              {aiSuggestions.differentiators && aiSuggestions.differentiators.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-blue-800">Enhanced Differentiators</h4>
                  <ul className="space-y-2">
                    {aiSuggestions.differentiators.map((diff, index) => (
                      <li key={index} className="p-3 bg-white rounded-lg border border-blue-100">
                        {diff}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSuggestions.keyBenefits && aiSuggestions.keyBenefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-blue-800">Enhanced Benefits</h4>
                  <ul className="space-y-2">
                    {aiSuggestions.keyBenefits.map((benefit, index) => (
                      <li key={index} className="p-3 bg-white rounded-lg border border-blue-100">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <button
                  onClick={applyAISuggestions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply All Suggestions
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* File Upload Information */}
      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">File Imported</p>
            <p className="text-sm text-gray-600">{uploadedFile.name}</p>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageFramework;