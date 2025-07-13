// src/components/features/MessageFramework/index.tsx
// Message Framework with Message House export option

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
  Sparkles, AlertCircle, PlusCircle, X, RefreshCw,
  Lightbulb, Download, Upload, Trash2, Save, Edit, FileText, Home, Star, MessageSquare, CheckCircle
} from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import { useRouter } from 'next/router';
import { useWritingStyle } from '../../../../../context/WritingStyleContext';
import { applyWritingStyle, applyHeadingCase } from '../../../../../utils/StyleGuides';
import { exportToPDF, exportToDocx } from '../../../../../utils/exportUtils';

// Define notification types
type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Define the main data structure
interface MessageFramework {
  valueProposition: string;
  pillar1: string;
  pillar2: string;
  pillar3: string;
  keyBenefits: string[];
}

interface MessageFrameworkProps {
  onSave?: (data: MessageFramework) => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

const safeLocalStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }
};

// Type adapter to fix compatibility between context and StyleGuides WritingStyle
const adaptWritingStyle = (contextStyle: any) => {
  if (!contextStyle) return {};

  return {
    styleGuide: contextStyle.styleGuide,
    formatting: {
      headingCase: contextStyle.formatting?.headingCase as 'upper' | 'lower' | 'sentence' | 'title' | undefined,
      numberFormat: contextStyle.formatting?.numberFormat as 'numerals' | 'words' | 'mixed' | undefined,
      dateFormat: contextStyle.formatting?.dateFormat as 'american' | 'international' | 'iso' | undefined,
      listStyle: contextStyle.formatting?.listStyle as 'bullets' | 'numbers' | undefined,
    },
    punctuation: contextStyle.punctuation,
    terminology: contextStyle.terminology,
  };
};

const MessageFramework: React.FC<MessageFrameworkProps> = ({ onSave, formData, setFormData }) => {
  console.log("🔍 Checking localStorage:", safeLocalStorage.getItem('marketingValueProp'));

  const { showNotification } = useNotification();
  const router = useRouter();
  const { writingStyle } = useWritingStyle();

  const [framework, setFramework] = useState<MessageFramework>(() => {
    // Get value prop from localStorage on initial load
    const savedValueProp = safeLocalStorage.getItem('marketingValueProp') || '';

    return {
      valueProposition: formData?.valueProp || savedValueProp || '',
      pillar1: '',
      pillar2: '',
      pillar3: '',
      keyBenefits: ['']
    };
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<Partial<MessageFramework> | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingValueProp, setIsEditingValueProp] = useState(false);
  const [showMessageHouseExport, setShowMessageHouseExport] = useState(false);

  // State to store product data and target audience
  const [productData, setProductData] = useState<any>(null);
  const [targetAudience, setTargetAudience] = useState<any>(null);

  // References for focus management
  const newBenefitRef = useRef<HTMLInputElement>(null);

  // State for tracking which field to focus
  const [focusField, setFocusField] = useState<{
    type: 'benefit' | null;
    index: number | null;
  }>({ type: null, index: null });

  // Add a state to track missing product info
  const [missingProductInfo, setMissingProductInfo] = useState(false);

  // Update framework when formData changes OR load from localStorage
  useEffect(() => {
    let valueToUse = '';

    // First try formData
    if (formData?.valueProp) {
      valueToUse = formData.valueProp;
      console.log("Using value prop from formData:", formData.valueProp);
    } else {
      // Fallback to localStorage
      const savedValueProp = safeLocalStorage.getItem('marketingValueProp');
      if (savedValueProp) {
        valueToUse = savedValueProp;
        console.log("Using value prop from localStorage:", savedValueProp);
      }
    }

    if (valueToUse) {
      setFramework(prev => ({
        ...prev,
        valueProposition: valueToUse
      }));
      console.log("🔍 Framework after setting value prop:", framework);
    }
  }, [formData]);

  // Load saved message framework from localStorage
  useEffect(() => {
    try {
      const savedFramework = safeLocalStorage.getItem('messageFramework');
      if (savedFramework) {
        const parsedFramework = JSON.parse(savedFramework);
        setFramework(parsedFramework);
        console.log("Loaded saved message framework:", parsedFramework);
      }
    } catch (error) {
      console.error('Error loading saved message framework:', error);
    }
  }, []);

  // Load target audience data
  useEffect(() => {
    try {
      // First try multiple audiences
      const savedAudiences = safeLocalStorage.getItem('marketingTargetAudiences');
      if (savedAudiences) {
        const audiences = JSON.parse(savedAudiences);
        if (Array.isArray(audiences) && audiences.length > 0) {
          setTargetAudience(audiences);
          console.log("Loaded multiple target audiences:", audiences);
        }
      } else {
        // Try single audience format
        const savedAudience = safeLocalStorage.getItem('marketingTargetAudience');
        if (savedAudience) {
          const audience = JSON.parse(savedAudience);
          setTargetAudience([audience]);
          console.log("Loaded single target audience:", audience);
        }
      }
    } catch (error) {
      console.error('Error loading target audience data:', error);
    }
  }, []);

  // Handle focus on newly added fields
  useEffect(() => {
    if (focusField.type === 'benefit' && focusField.index !== null && newBenefitRef.current) {
      newBenefitRef.current.focus();
      setFocusField({ type: null, index: null });
    }
  }, [focusField]);

  // Add a new field (benefit)
  const addField = (field: 'keyBenefits') => {
    setFramework(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));

    // Set focus to the new field
    const newIndex = framework[field].length;
    setFocusField({
      type: 'benefit',
      index: newIndex
    });
  };

  // Remove a field (benefit)
  const removeField = (field: 'keyBenefits', index: number) => {
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
  const updateArrayField = (field: 'keyBenefits', index: number, value: string) => {
    const newArray = [...framework[field]];
    newArray[index] = value;
    updateField(field, newArray);
  };

  const hasContent = () => {
    const hasValueProp = (framework.valueProposition || '').trim() !== '';
    const hasPillar = (framework.pillar1 || '').trim() !== '' ||
      (framework.pillar2 || '').trim() !== '' ||
      (framework.pillar3 || '').trim() !== '';
    const hasBenefits = (framework.keyBenefits || []).some(b => (b || '').trim() !== '');

    // Only return true if we have at least a value proposition AND either a pillar or benefit
    return hasValueProp && (hasPillar || hasBenefits);
  };

  // Export Message House
  const exportMessageHouse = (format: 'txt' | 'pdf' | 'docx' = 'txt') => {
    if (!hasContent()) {
      showNotification('Please complete your message framework before exporting', 'error');
      return;
    }

    // Get business name for file naming
    const productInfo = JSON.parse(safeLocalStorage.getItem('marketingProduct') || '{}');
    const businessName = productInfo?.name || 'Your Brand';
    const fileName = `${businessName}_MessageHouse`;

    const content = `
# ${businessName.toUpperCase()} MESSAGE HOUSE
${Array(50).fill('=').join('')}

## CORE MESSAGE (THE ROOF)
${framework.valueProposition || 'Not defined'}

## SUPPORTING PILLARS
${[framework.pillar1, framework.pillar2, framework.pillar3].filter(Boolean).map((pillar, i) => `${i + 1}. ${pillar}`).join('\n') || 'Not defined'}

## FOUNDATION (PROOF POINTS)
${framework.keyBenefits?.filter(b => b.trim()).map(benefit => `- ${benefit}`).join('\n') || 'Not defined'}

## HOW TO USE YOUR MESSAGE HOUSE
- Use the Core Message as your primary value proposition
- Reference the Pillars for key talking points and campaign themes
- Use Foundation points as supporting evidence and credibility builders
- Ensure all communications ladder up to your Core Message

${Array(50).fill('=').join('')}
Generated by Marketing Content Lab - Message House`;

    if (format === 'pdf') {
      exportToPDF(content, `${fileName}.pdf`);
      showNotification('Message House exported as PDF', 'success');
      return;
    }
    if (format === 'docx') {
      exportToDocx(content, `${fileName}.docx`);
      showNotification('Message House exported as Word document', 'success');
      return;
    }

    // Default: txt
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Message House exported as text file', 'success');
    setShowMessageHouseExport(false);
  };

  // Generate AI-enhanced framework
  const generateAIFramework = async () => {
    setIsGenerating(true);
    setError('');
    setAiSuggestions(null);
    setMissingProductInfo(false);

    try {
      // Check for product data
      const savedProduct = safeLocalStorage.getItem('marketingProduct');
      if (!savedProduct) {
        setMissingProductInfo(true);
        throw new Error('Please enter your product information before generating AI enhancements');
      }

      let productInfo;
      try {
        const parsedProduct = JSON.parse(savedProduct);
        if (!parsedProduct.name) {
          throw new Error('Please enter your product information before generating AI enhancements');
        }
        productInfo = {
          name: parsedProduct.name,
          description: parsedProduct.type || parsedProduct.description,
          benefits: parsedProduct.keyBenefits || []
        };
      } catch (e) {
        throw new Error('Please enter your product information before generating AI enhancements');
      }

      // Extract audience information for the API call
      let audienceInfo = ["Marketing professionals"]; // Default

      // If we have target audience data, use it
      if (targetAudience && Array.isArray(targetAudience) && targetAudience.length > 0) {
        audienceInfo = targetAudience.map(a => a.role || "").filter(r => r);
        if (audienceInfo.length === 0) {
          audienceInfo = ["Marketing professionals"];
        }
      }

      // Gather benefits from either framework or product data
      const benefits = (framework.keyBenefits || []).filter(b => b.trim()).length > 0
        ? (framework.keyBenefits || []).filter(b => b.trim())
        : productInfo.benefits;

      // Get writing style data from localStorage
      const writingStyleData = safeLocalStorage.getItem('marketing-content-lab-writing-style');
      let writingStyle = null;
      if (writingStyleData) {
        try {
          writingStyle = JSON.parse(writingStyleData);
        } catch (e) {
          console.error('Error parsing writing style data:', e);
        }
      }

      // Prepare the request data with all required fields
      const requestBody = {
        type: "valueProposition",
        data: {
          productInfo: {
            name: productInfo.name,
            description: productInfo.description,
            benefits: benefits,
            targetAudience: audienceInfo
          },
          competitors: [], // Could be populated if we had competitor data
          industry: "Technology",
          focusAreas: ["user", "business"],
          tone: "professional",
          currentFramework: framework
        },
        // Pass strategic data for comprehensive style guide application
        strategicData: {
          writingStyle: writingStyle,
          brandVoice: null,
          messaging: null
        }
      };

      // Set up abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Make the API call
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${safeLocalStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mode: 'key-messages',
          data: requestBody.data,
          strategicData: requestBody.strategicData
        }),
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

      // Map API response to our new structure
      setAiSuggestions({
        valueProposition: data.valueProposition || '',
        pillar1: data.keyDifferentiators?.[0] || '',
        pillar2: data.keyDifferentiators?.[1] || '',
        pillar3: data.keyDifferentiators?.[2] || '',
        keyBenefits: data.targetedMessages || []
      });

      showNotification('AI enhancements generated successfully', 'success');
    } catch (error: unknown) {
      console.error('Error generating AI framework:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI enhancements. Please try again later.';
      setError(`API Error: ${errorMessage}`);
      showNotification('Failed to generate AI enhancements', 'error');
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
      pillar1: aiSuggestions.pillar1 || framework.pillar1,
      pillar2: aiSuggestions.pillar2 || framework.pillar2,
      pillar3: aiSuggestions.pillar3 || framework.pillar3,
      keyBenefits: aiSuggestions.keyBenefits || framework.keyBenefits
    };

    // Update the framework
    setFramework(updatedFramework);

    // Clear suggestions
    setAiSuggestions(null);

    // Show notification
    showNotification('AI suggestions applied to your framework', 'success');
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
        if (parsedData.valueProposition || parsedData.pillar1 || parsedData.keyBenefits) {
          setFramework({
            valueProposition: parsedData.valueProposition || '',
            pillar1: parsedData.pillar1 || parsedData.differentiators?.[0] || '',
            pillar2: parsedData.pillar2 || parsedData.differentiators?.[1] || '',
            pillar3: parsedData.pillar3 || parsedData.differentiators?.[2] || '',
            keyBenefits: parsedData.keyBenefits || ['']
          });
          showNotification('Framework loaded from file successfully', 'success');
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

        const potentialPillars = lines.filter(line =>
          line.includes('different') ||
          line.includes('unique') ||
          line.includes('pillar') ||
          (line.length > 20 && line.length < 100)
        );

        const potentialBenefits = lines.filter(line =>
          line.includes('benefit') ||
          line.includes('value') ||
          line.includes('gain') ||
          (line.length > 10 && line.length < 80 && !potentialPillars.includes(line))
        );

        setFramework({
          valueProposition: valueProposition,
          pillar1: potentialPillars[0] || '',
          pillar2: potentialPillars[1] || '',
          pillar3: potentialPillars[2] || '',
          keyBenefits: potentialBenefits.length ? potentialBenefits : ['']
        });

        showNotification('File imported as text - review content for accuracy', 'info');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      showNotification('Failed to read file. Please try again.', 'error');
    }
  };

  // Save framework
  const saveFramework = async () => {
    setIsSaving(true);

    try {
      // Validate data
      if (!framework.valueProposition.trim()) {
        showNotification('Please provide a value proposition', 'error');
        setIsSaving(false);
        return;
      }

      if (!framework.keyBenefits.some(b => b.trim())) {
        showNotification('Please provide at least one benefit', 'error');
        setIsSaving(false);
        return;
      }

      // Clean up empty entries
      const cleanedFramework = {
        ...framework,
        keyBenefits: framework.keyBenefits.filter(b => b.trim())
      };

      // Save to localStorage
      safeLocalStorage.setItem('messageFramework', JSON.stringify(cleanedFramework));

      // Also update product valueProposition for consistency
      try {
        const savedProduct = safeLocalStorage.getItem('marketingProduct');
        if (savedProduct) {
          const productData = JSON.parse(savedProduct);
          productData.valueProposition = framework.valueProposition;
          safeLocalStorage.setItem('marketingProduct', JSON.stringify(productData));
        }
      } catch (error) {
        console.error('Error updating product data:', error);
      }

      // If onSave callback is provided, call it
      if (onSave) {
        onSave(cleanedFramework);
      }

      showNotification('Message framework saved successfully', 'success');
    } catch (error) {
      console.error('Error saving framework:', error);
      showNotification('Failed to save framework. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Export framework as Markdown
  const exportFramework = () => {
    try {
      // Clean up empty entries
      const cleanedFramework = {
        ...framework,
        keyBenefits: framework.keyBenefits.filter(b => b.trim())
      };

      // Get business name if available
      const businessName = productData?.name || "Our Business";

      // Create a markdown string
      const markdown = `# Message Framework for ${businessName}

## Value Proposition
${cleanedFramework.valueProposition}

## Key Message Pillars

### Pillar 1
${cleanedFramework.pillar1 || "N/A"}

### Pillar 2
${cleanedFramework.pillar2 || "N/A"}

### Pillar 3
${cleanedFramework.pillar3 || "N/A"}

## Key Benefits

${cleanedFramework.keyBenefits.map((benefit, index) => `${index + 1}. ${benefit}`).join('\n')}

---
*Generated by Marketing Content Lab*
`;

      // Create blob and download link
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'message_framework.md';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('Framework exported as Markdown', 'success');
    } catch (error) {
      console.error('Error exporting framework:', error);
      showNotification('Failed to export framework. Please try again.', 'error');
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
      pillar1: '',
      pillar2: '',
      pillar3: '',
      keyBenefits: ['']
    });

    setAiSuggestions(null);
    setShowConfirmClear(false);
    showNotification('Framework cleared successfully', 'success');
  };

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

      {/* Message House Preview and Export Modal */}
      {showMessageHouseExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Home className="w-6 h-6 text-blue-600" />
                  Message House Preview & Export
                </h3>
                <button
                  onClick={() => setShowMessageHouseExport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Preview how your messaging will appear and export in your preferred format.
              </p>
            </div>

            {/* Message House Preview */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">

                {/* Header */}
                <div className="text-center mb-6 pb-4 border-b-2 border-blue-200">
                  <h1 className="text-2xl font-bold text-blue-900 mb-2">
                    {(() => {
                      try {
                        const productInfo = JSON.parse(safeLocalStorage.getItem('marketingProduct') || '{}');
                        return productInfo?.name || 'Your Brand';
                      } catch {
                        return 'Your Brand';
                      }
                    })()}
                  </h1>
                  <div className="text-lg text-blue-600 font-light italic flex items-center justify-center gap-2">
                    <Home className="w-4 h-4" />
                    Message House
                  </div>
                </div>

                {/* ROOF - Core Message with Triangular Top */}
                <div className="relative mb-4">
                  {/* Triangular Roof using SVG */}
                  <div className="flex justify-center mb-0">
                    <svg width="300" height="60" viewBox="0 0 300 60" className="block">
                      <polygon
                        points="150,8 50,52 250,52"
                        fill="#2563eb"
                        stroke="#1d4ed8"
                        strokeWidth="1"
                      />
                      <text
                        x="150"
                        y="35"
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="600"
                        className="uppercase tracking-wide"
                      >
                        THE ROOF
                      </text>
                    </svg>
                  </div>

                  {/* Core Message Card */}
                  <Card className="p-4 bg-white bg-opacity-90 shadow-sm border-4 border-blue-600 border-t-0 relative -mt-1">
                    <div className="text-center">
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center justify-center gap-1">
                        <Star className="w-3 h-3" />
                        Core Message
                      </div>
                      <div className="text-lg font-bold text-gray-800 leading-relaxed">
                        {framework.valueProposition || 'Your core value proposition will appear here'}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* PILLARS - Supporting Messages */}
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  {[framework.pillar1, framework.pillar2, framework.pillar3].map((pillar, index) => (
                    <Card key={index} className="p-3 bg-white bg-opacity-80 shadow-sm border-l-4 border-blue-400">
                      <div className="text-center">
                        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center justify-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Pillar {index + 1}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          {pillar || `Message pillar ${index + 1} will appear here`}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* FOUNDATION - Proof Points */}
                <Card className="p-4 bg-white bg-opacity-80 shadow-sm border-b-4 border-green-500">
                  <div className="text-center mb-3">
                    <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Foundation (Proof Points)
                    </div>
                  </div>
                  {framework.keyBenefits && framework.keyBenefits.some(b => b.trim()) ? (
                    <div className="grid md:grid-cols-2 gap-2">
                      {framework.keyBenefits.filter(b => b.trim()).map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-2 text-xs">
                      <p>Your key benefits will appear here as proof points</p>
                    </div>
                  )}
                </Card>

                {/* Usage Instructions Preview */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-xs">
                    <Sparkles className="w-3 h-3" />
                    How to Use Your Message House
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use the Core Message as your primary value proposition</li>
                    <li>• Reference the Pillars for key talking points and campaign themes</li>
                    <li>• Use Foundation points as supporting evidence and credibility builders</li>
                    <li>• Ensure all communications ladder up to your Core Message</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="p-6 border-t bg-gray-50">
              <h4 className="font-semibold mb-4">Export Your Message House</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => exportMessageHouse('txt')}
                  className="p-4 text-left border border-gray-300 rounded-md hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Text File</div>
                      <div className="text-sm text-gray-500">.txt format</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => exportMessageHouse('pdf')}
                  className="p-4 text-left border border-gray-300 rounded-md hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium">PDF Document</div>
                      <div className="text-sm text-gray-500">.pdf format</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => exportMessageHouse('docx')}
                  className="p-4 text-left border border-gray-300 rounded-md hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Word Document</div>
                      <div className="text-sm text-gray-500">.docx format</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Action Bar - More compact */}
      <div className="bg-white p-3 rounded-lg shadow-sm border flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Message Framework</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Message House Export Button - NEW */}
          {hasContent() && (
            <button
              onClick={() => setShowMessageHouseExport(true)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 flex items-center text-sm"
            >
              <Home className="w-4 h-4 mr-1" />
              Preview & Export Message House
            </button>
          )}

          {/* File Upload */}
          <label className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 border text-sm">
            <Upload className="w-4 h-4 mr-1" />
            <span>Import</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.json,.md,.docx"
            />
          </label>

          {/* Clear Button - Only visible if framework has content */}
          {hasContent() && (
            <button
              onClick={handleClearFramework}
              className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border flex items-center text-sm"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={saveFramework}
            disabled={isSaving}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center text-sm"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Upload Information */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-center">
        <Lightbulb className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800">
            Already have a message framework document? Upload it above to use it as a starting point.
          </p>
        </div>
      </div>

      {/* Main Message Framework Content */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Value Proposition</h3>

          <button
            onClick={generateAIFramework}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        {/* Value Proposition Section */}
        <div className="mb-8">
          {isEditingValueProp ? (
            <textarea
              value={framework.valueProposition || safeLocalStorage.getItem('marketingValueProp') || ''}
              onChange={(e) => updateField('valueProposition', e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              rows={4}
              placeholder="Enter your value proposition statement here..."
              autoFocus
            />
          ) : (
            <div className="relative">
              <div className="p-4 bg-gray-50 rounded-lg border mb-2 text-lg">
                {framework.valueProposition || safeLocalStorage.getItem('marketingValueProp') ?
                  applyWritingStyle(framework.valueProposition || safeLocalStorage.getItem('marketingValueProp') || '', adaptWritingStyle(writingStyle)) : (
                    <span className="text-gray-400 italic">No value proposition added yet</span>
                  )}
              </div>
              <button
                onClick={() => setIsEditingValueProp(true)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 rounded-full"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}

          {isEditingValueProp && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setIsEditingValueProp(false)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Message Pillars</h3>
        <p className="text-gray-600 text-sm mb-4">
          Define 3 key pillars that support your value proposition. These will be the foundation of all your messaging.
        </p>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Pillar 1</label>
            <input
              value={framework.pillar1}
              onChange={(e) => updateField('pillar1', e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="First key differentiator or messaging pillar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pillar 2</label>
            <input
              value={framework.pillar2}
              onChange={(e) => updateField('pillar2', e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Second key differentiator or messaging pillar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pillar 3</label>
            <input
              value={framework.pillar3}
              onChange={(e) => updateField('pillar3', e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Third key differentiator or messaging pillar"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Key Benefits</h3>
        <p className="text-gray-600 text-sm mb-4">What specific value do customers gain from your solution?</p>

        {/* Benefits Section - More compact */}
        <div className="space-y-2">
          {(framework.keyBenefits || []).map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                ref={index === framework.keyBenefits.length - 1 ? newBenefitRef : null}
                value={benefit}
                onChange={(e) => updateArrayField('keyBenefits', index, e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={`Benefit #${index + 1}`}
              />
              {framework.keyBenefits.length > 1 && (
                <button
                  onClick={() => removeField('keyBenefits', index)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addField('keyBenefits')}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Benefit
          </button>
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
                className="text-sm text-red-700 hover:text-red-800 underline mt-2"
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
                    {applyWritingStyle(aiSuggestions.valueProposition, adaptWritingStyle(writingStyle))}
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          updateField('valueProposition', aiSuggestions.valueProposition);
                          showNotification('Value proposition updated', 'success');
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Pillars */}
              <div>
                <h4 className="font-medium mb-2 text-blue-800">Enhanced Message Pillars</h4>
                <div className="space-y-2">
                  {aiSuggestions.pillar1 && (
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="font-medium text-sm text-blue-600">Pillar 1</div>
                      {applyWritingStyle(aiSuggestions.pillar1, adaptWritingStyle(writingStyle))}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            updateField('pillar1', aiSuggestions.pillar1);
                            showNotification('Pillar 1 updated', 'success');
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  )}
                  {aiSuggestions.pillar2 && (
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="font-medium text-sm text-blue-600">Pillar 2</div>
                      {applyWritingStyle(aiSuggestions.pillar2, adaptWritingStyle(writingStyle))}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            updateField('pillar2', aiSuggestions.pillar2);
                            showNotification('Pillar 2 updated', 'success');
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  )}
                  {aiSuggestions.pillar3 && (
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="font-medium text-sm text-blue-600">Pillar 3</div>
                      {applyWritingStyle(aiSuggestions.pillar3, adaptWritingStyle(writingStyle))}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            updateField('pillar3', aiSuggestions.pillar3);
                            showNotification('Pillar 3 updated', 'success');
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {aiSuggestions.keyBenefits && aiSuggestions.keyBenefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-blue-800">Enhanced Benefits</h4>
                  <ul className="space-y-2">
                    {aiSuggestions.keyBenefits.map((benefit, index) => (
                      <li key={index} className="p-3 bg-white rounded-lg border border-blue-100">
                        {applyWritingStyle(benefit, adaptWritingStyle(writingStyle))}
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              const newBenefits = [...(framework.keyBenefits || [])];
                              newBenefits[index] = benefit;
                              updateField('keyBenefits', newBenefits);
                              showNotification('Benefit updated', 'success');
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            Accept
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setAiSuggestions(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Uploaded File Info */}
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

      {/* Footer Actions - Export button only shows when there's meaningful content */}
      {hasContent() && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={exportFramework}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as Markdown
          </button>
        </div>
      )}

      {/* Missing Product Info Message */}
      {missingProductInfo && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="font-bold mb-2">Product Information Required</div>
          <div className="mb-2">You must enter your product name and description before generating AI key messages.</div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push('/product')}
          >
            Go to Product Info
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageFramework;