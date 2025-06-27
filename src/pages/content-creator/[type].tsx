// src/pages/content-creator/[type].tsx
// FIXED: Now uses actual writing style data from context, displays formatted content properly

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useNotification } from "../../context/NotificationContext";
import { useWritingStyle } from "../../context/WritingStyleContext"; // FIXED: Import writing style context
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FileHandler from "@/components/shared/FileHandler";
import KeywordSuggestions from "../../components/shared/KeywordSuggestions";
import ContentEditChat from "../../components/features/ContentEditChat";
import StrategicDataService from "../../services/StrategicDataService";
import { exportToText, exportToMarkdown, exportToHTML, exportToPDF, exportToDocx } from '../../utils/exportUtils';
import ReactMarkdown from 'react-markdown';
import { parseMarkdownWithStyle, applyHeadingCase } from '../../utils/StyleGuides';

import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  Save,
  MessageSquare,
  Upload,
  Info,
  Settings,
  Search,
  FileText,
  Edit,
  FileCheck,
  AlertCircle,
  X,
  Check,
} from "lucide-react";

// Add interfaces at the top of the file after imports
interface ContentType {
  id: string;
  title: string;
  description: string;
}

interface Audience {
  role: string;
  industry?: string;
  name?: string;
}

interface BrandVoice {
  tone?: string;
  archetype?: string;
}

interface SEOKeywords {
  primaryKeywords?: (string | { term: string })[];
}

interface StrategicData {
  isComplete?: boolean;
  product?: {
    name?: string;
  };
  audiences?: Audience[];
  messaging?: {
    valueProposition?: string;
  };
  writingStyle?: {
    styleGuide?: {
      primary?: string;
    };
  };
  brandVoice?: {
    brandVoice?: BrandVoice;
  };
  seoKeywords?: SEOKeywords;
}

interface GeneratedMetadata {
  title: string;
  description: string;
  keywords?: string[];
}

// Update NotificationType and add NotificationMessage type
type NotificationType = 'success' | 'error' | 'warning' | 'info';
type NotificationMessage = string;

// Update the useNotification hook type
interface NotificationContextType {
  showNotification: (type: NotificationType, message: NotificationMessage) => void;
}

// A more reliable function to reset style and walkthrough
function resetStyleAndWalkthrough() {
  // Force set the writing style as completed
  localStorage.setItem(
    "marketing-content-lab-writing-style",
    JSON.stringify({
      completed: true,
      styleGuide: {
        primary: "Chicago Manual of Style",
        completed: true,
      },
    })
  );

  // Force set walkthrough as completed
  localStorage.setItem("content-creator-walkthrough-completed", "true");
  localStorage.setItem("walkthrough-completed", "true");
  localStorage.setItem("writing-style-completed", "true");

  // Also clear any potential old flags that might interfere
  const keysToCheck = [
    "walkthrough-step-",
    "marketing-content-lab-writing",
    "writing-style-",
  ];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      for (const prefix of keysToCheck) {
        if (
          key.includes(prefix) &&
          !key.includes("completed") &&
          !key.includes("marketing-content-lab-writing-style")
        ) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  console.log("Reset applied successfully");
}

// Define content types directly in this file to ensure proper format
const CONTENT_TYPES = [
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog content to establish your expertise and attract organic traffic.'
  },
  {
    id: 'social',
    title: 'Social Media Posts',
    description: 'Create engaging social media content that drives engagement and builds your audience.'
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Create individual email content that drives opens, clicks, and conversions for your business.'
  },
  {
    id: 'internal-email',
    title: 'Internal or Exec Email Comms',
    description: 'Create effective internal communications or executive communications to keep your team informed and aligned.'
  },
  {
    id: 'email-campaign',
    title: 'Email Campaign',
    description: 'Create multi-email sequences designed to nurture leads and drive conversions.'
  },
  {
    id: 'case-study',
    title: 'Case Study',
    description: 'Create compelling case studies that showcase your success stories and build credibility.'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create high-converting landing pages that turn visitors into leads and customers.'
  },
  {
    id: 'video-script',
    title: 'Video Script',
    description: 'Create compelling video scripts that engage viewers and deliver your message effectively.'
  },
  {
    id: 'whitepaper',
    title: 'Whitepaper',
    description: 'Create authoritative whitepapers that position your brand as an industry leader.'
  }
];

// Define tabs for the content creation process
const CONTENT_TABS = [
  {
    id: "create",
    name: "Create Content",
    icon: <FileText className="w-4 h-4 mr-2" />,
  },
  {
    id: "keywords",
    name: "Keywords & SEO",
    icon: <Search className="w-4 h-4 mr-2" />,
  },
  {
    id: "options",
    name: "Advanced Options",
    icon: <Settings className="w-4 h-4 mr-2" />,
  },
  {
    id: "edit",
    name: "Edit & Refine",
    icon: <Edit className="w-4 h-4 mr-2" />,
  },
];

// Helper component for check icons
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Check className={className || "h-5 w-5"} />
);

const ContentCreatorPage = () => {
  const router = useRouter();
  const { type } = router.query;
  const { showNotification } = useNotification();

  // FIXED: Get writing style from context instead of using defaults
  const { writingStyle, isStyleConfigured } = useWritingStyle();
  console.log('🔥 CONTENT CREATOR writingStyle:', writingStyle);
  console.log('🔥 CONTENT CREATOR primary:', writingStyle?.styleGuide?.primary);
  console.log('🔥 CONTENT CREATOR headingCase:', writingStyle?.formatting?.headingCase);
  // State for content information
  const [contentType, setContentType] = useState<ContentType | null>(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState("create");

  // State for user inputs
  const [promptText, setPromptText] = useState("");
  const [uploadedContent, setUploadedContent] = useState<string>("");

  // State for advanced options
  const [advancedOptions, setAdvancedOptions] = useState({
    audience: "",
    tone: "professional",
    keywords: "",
    additionalNotes: "",
  });

  // State for generated content
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedMetadata, setGeneratedMetadata] = useState<GeneratedMetadata | null>(null);

  // State for strategic data
  const [strategicData, setStrategicData] = useState<StrategicData | null>(null);
  const [isLoadingStrategicData, setIsLoadingStrategicData] = useState(true);
  const [hasStrategicData, setHasStrategicData] = useState(false);

  // State for UI guidance
  const [showGuidanceCard, setShowGuidanceCard] = useState(false);

  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update edited content when generated content changes
  useEffect(() => {
    if (generatedContent) {
      setEditedContent(generatedContent);
    }
  }, [generatedContent]);

  // Skip walkthrough and writing style prompts on component mount
  useEffect(() => {
    // Mark walkthrough as completed in localStorage
  }, []);

  // FIXED: Debug writing style context loading
  useEffect(() => {
    console.log('🎯 Content Creator: Current writing style from context:', writingStyle);
    console.log('🎯 Content Creator: Is style configured?', isStyleConfigured);
  }, [writingStyle, isStyleConfigured]);

  // Load content type from URL parameter
  useEffect(() => {
    if (type && router.isReady) {
      // Find content type info based on URL parameter
      const typeFromUrl = Array.isArray(type) ? type[0] : type;
      const foundType = CONTENT_TYPES.find((t) => t.id === typeFromUrl);

      if (foundType) {
        setContentType(foundType);

        // Reset state for new content type
        setAdvancedOptions({
          audience: "",
          tone: "professional",
          keywords: "",
          additionalNotes: "",
        });

        setPromptText("");
        setUploadedContent("");
        setGeneratedContent("");
        setGeneratedTitle("");
        setGeneratedMetadata(null);
        setActiveTab("create");
      } else {
        // If content type isn't found, redirect to content creator page
        router.push("/content-creator");
      }
    }
  }, [type, router]);

  // Load Strategic Data
  useEffect(() => {
    const loadStrategicData = async () => {
      setIsLoadingStrategicData(true);
      try {
        const data = await StrategicDataService.getAllStrategicData() as StrategicData;
        console.log("Loaded strategic data:", data);
        setStrategicData(data);

        // Check if we have any meaningful strategic data
        const hasData = Boolean(
          data &&
          (data.isComplete ||
            (data.product?.name) ||
            (data.audiences && data.audiences.length > 0) ||
            (data.messaging?.valueProposition) ||
            (data.writingStyle?.styleGuide?.primary))
        );
        setHasStrategicData(hasData);

        // Pre-fill advanced options if we have strategic data
        if (data) {
          if (data.audiences && data.audiences.length > 0) {
            const audience = data.audiences[0];
            setAdvancedOptions(prev => ({
              ...prev,
              audience: audience.name || `${audience.role}${audience.industry ? ` in ${audience.industry}` : ""}`
            }));
          }

          const brandVoiceTone = data.brandVoice?.brandVoice?.tone;
          if (brandVoiceTone) {
            setAdvancedOptions(prev => ({
              ...prev,
              tone: brandVoiceTone
            }));
          }

          if (data.seoKeywords?.primaryKeywords) {
            const keywords = data.seoKeywords.primaryKeywords
              .map(k => typeof k === "string" ? k : k.term)
              .filter(Boolean)
              .join(", ");

            if (keywords) {
              setAdvancedOptions(prev => ({
                ...prev,
                keywords
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error loading strategic data:", error);
        showNotification(
          "Could not load your strategic data. Some personalization features may be limited.",
          "error"
        );
      } finally {
        setIsLoadingStrategicData(false);
      }
    };

    loadStrategicData();
  }, []);

  // Automatically switch to edit tab when content is generated
  useEffect(() => {
    if (generatedContent) {
      setActiveTab("edit");
    }
  }, [generatedContent]);

  // Update handleContentUpdate
  const handleContentUpdate = (newContent: string, newTitle: string) => {
    setGeneratedContent(newContent);
    if (newTitle && newTitle !== generatedTitle) {
      setGeneratedTitle(newTitle);
    }

    if (newContent !== generatedContent) {
      setGeneratedMetadata({
        title: newTitle || "",
        description: newContent.substring(0, 160).replace(/[#*_]/g, ""),
        keywords: advancedOptions.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
      });
    }

    showNotification("Content updated successfully", "success");
  };

  // Update handleFileContent
  const handleFileContent = (content: string | object) => {
    if (typeof content === "string") {
      setUploadedContent(content);
    } else {
      setUploadedContent(JSON.stringify(content, null, 2));
      showNotification("Structured content loaded successfully", "success");
    }
  };

  // Handle changes in advanced options
  const handleAdvancedOptionChange = (option: string, value: string) => {
    setAdvancedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  // Handle content editing
  const handleContentEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  // Save content edits
  const saveContentEdits = () => {
    setGeneratedContent(editedContent);
    setIsEditMode(false);
    showNotification("Content updated successfully", "success");

    // Update metadata description if needed
    if (generatedMetadata) {
      setGeneratedMetadata((prev) => ({
        ...prev,
        description: editedContent.substring(0, 160).replace(/[#*_]/g, ""),
      }));
    }
  };

  const handleGenerateContent = async () => {
    if (!promptText && !uploadedContent) {
      showNotification("Please enter a prompt or upload content", "error");
      return;
    }

    setIsGenerating(true);

    try {


      const payload = {
        campaignData: {
          name: promptText || "Generated Content",
          type: contentType?.id || "blog-post",
          goal: "Create engaging content",
          targetAudience: advancedOptions.audience || "general audience",
          keyMessages: advancedOptions.keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        },
        contentTypes: [contentType?.id || "blog-post"],
        // FIXED: Pass actual writing style from context, not defaults
        writingStyle: {
          styleGuide: {
            primary: writingStyle?.styleGuide?.primary,
            customRules: writingStyle?.styleGuide?.customRules || [],
            completed: true
          },
          formatting: {
            headingCase: writingStyle?.formatting?.headingCase,
            numberFormat: writingStyle?.formatting?.numberFormat,
            dateFormat: writingStyle?.formatting?.dateFormat,
            listStyle: writingStyle?.formatting?.listStyle
          },
          punctuation: {
            oxfordComma: writingStyle?.punctuation?.oxfordComma,
            hyphenation: writingStyle?.punctuation?.hyphenation
          },
          completed: true
        },
      };

      console.log("🚀 API Payload:", JSON.stringify(payload, null, 2));
      console.log('🔍 WritingStyle from context in content creator:', writingStyle);
      console.log('🔍 Heading case specifically:', writingStyle?.formatting?.headingCase);

      const response = await fetch('/api/api_endpoints', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          mode: 'enhance',
          data: payload
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response not OK:", response.status, errorText);
        throw new Error(`API responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ API Response received:", result);

      // The api_endpoints returns content in a different format
      const contentKey = contentType?.id || "blog-post";
      const content = result[contentKey];

      if (content) {
        const contentText = content.content || content;
        setGeneratedContent(contentText);

        // FIXED: Use the actual title from the content, not the prompt
        const actualTitle = content.title || extractTitleFromContent(contentText) || "Generated Content";
        setGeneratedTitle(actualTitle);

        setGeneratedMetadata({
          title: actualTitle || "",
          description: contentText.substring(0, 160),
          keywords: advancedOptions.keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        });

        showNotification("Content generated successfully!", "success");
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error: unknown) {
      console.error("Error generating content:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showNotification(`Failed to generate content: ${errorMessage}`, "error");
      showNotification("Please try again or check your internet connection", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // FIXED: Helper function to extract title from content
  const extractTitleFromContent = (content: string): string | null => {
    // Look for the first heading in the content
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 0 && !trimmed.startsWith('*') && !trimmed.startsWith('-')) {
        // Remove any markdown formatting and return first substantial line
        return trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
      }
    }
    return null;
  };

  // Update handleExportContent
  const handleExportContent = (format = "markdown") => {
    if (!generatedContent) {
      showNotification("No content to export", "error");
      return;
    }

    // Create a file name based on the title
    const sanitizedTitle = generatedTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const fileName = `${sanitizedTitle}-${new Date()
      .toISOString()
      .slice(0, 10)}`;

    // Create content based on format
    let fileContent = generatedContent;
    let mimeType = "text/plain";
    let extension = "txt";

    switch (format) {
      case "markdown":
        mimeType = "text/markdown";
        extension = "md";
        exportToMarkdown(fileContent, `${fileName}.md`);
        break;
      case "html":
        mimeType = "text/html";
        extension = "html";
        fileContent = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${generatedTitle}</title>\n  <meta name=\"description\" content=\"${generatedMetadata?.description || ""}\">\n  <meta name=\"keywords\" content=\"${generatedMetadata?.keywords?.join(", ") || ""}\">\n</head>\n<body>\n  <article>\n    ${generatedContent
          .replace(/# (.*)\n/g, "<h1>$1</h1>\n")
          .replace(/## (.*)\n/g, "<h2>$1</h2>\n")
          .replace(/### (.*)\n/g, "<h3>$1</h3>\n")
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n/g, "<br>")}
  </article>\n</body>\n</html>`;
        exportToHTML(fileContent, `${fileName}.html`);
        break;
      case "text":
        mimeType = "text/plain";
        extension = "txt";
        exportToText(fileContent, `${fileName}.txt`);
        break;
      case "docx":
        exportToDocx(fileContent, `${fileName}.docx`);
        break;
      case "pdf":
        exportToPDF(fileContent, `${fileName}.pdf`);
        break;
      default:
        // Use defaults
        exportToText(fileContent, `${fileName}.txt`);
        break;
    }

    showNotification(`Content exported as ${format.toUpperCase()}`, "success");
  };

  // Update handleSaveToLibrary
  const handleSaveToLibrary = () => {
    if (!generatedContent) {
      showNotification("No content to save", "error");
      return;
    }

    // In a real implementation, you would save to a database
    // For now, we'll just save to localStorage

    const savedContent = {
      id: Date.now(),
      title: generatedTitle,
      content: generatedContent,
      metadata: generatedMetadata,
      contentType: contentType?.title,
      createdAt: new Date().toISOString(),
      // Add strategic data references
      strategicDataUsed: hasStrategicData
        ? {
          productName: strategicData?.product?.name,
          audienceName:
            strategicData?.audiences?.length > 0
              ? strategicData.audiences[0].role
              : null,
          messagingSource: strategicData?.messaging?.valueProposition
            ? "Marketing Program"
            : "Manual Entry",
          styleGuide:
            strategicData?.writingStyle?.styleGuide?.primary || null,
        }
        : null,
    };

    try {
      // Get existing content library or initialize a new one
      const existingLibrary = localStorage.getItem("contentLibrary");
      const library = existingLibrary ? JSON.parse(existingLibrary) : [];

      // Add new content
      library.push(savedContent);

      // Save back to localStorage
      localStorage.setItem("contentLibrary", JSON.stringify(library));

      showNotification("Content saved to library successfully", "success");
    } catch (error) {
      console.error("Error saving to library:", error);
      showNotification("Failed to save to library", "error");
    }
  };

  // Reset the content and go back to content creation
  const handleResetContent = () => {
    setGeneratedContent("");
    setGeneratedTitle("");
    setGeneratedMetadata(null);
    setActiveTab("create");
    setIsEditMode(false);

    // Reset advanced options but keep strategic data
    setAdvancedOptions((prev) => {
      const strategicDefaults = {
        audience: "",
        tone: "professional",
        keywords: "",
        additionalNotes: "",
      };

      // If we have strategic data, use it to set defaults
      if (hasStrategicData) {
        if (strategicData.audiences && strategicData.audiences.length > 0) {
          const primaryPersona = strategicData.audiences[0];
          strategicDefaults.audience = `${primaryPersona.role}${primaryPersona.industry ? ` in ${primaryPersona.industry}` : ""
            }`;
        }

        if (strategicData.brandVoice?.brandVoice?.tone) {
          strategicDefaults.tone = strategicData.brandVoice.brandVoice.tone;
        }

        if (strategicData.seoKeywords) {
          const primaryTerms = (strategicData.seoKeywords.primaryKeywords || [])
            .map((k) => (typeof k === "string" ? k : k.term))
            .filter(Boolean);

          if (primaryTerms.length > 0) {
            strategicDefaults.keywords = primaryTerms.join(", ");
          }
        }
      }

      return strategicDefaults;
    });
  };

  // FIXED: Parse the markdown content for display AND apply style guide formatting
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return { title: "", introduction: "", sections: [] };

    const lines = markdown.split("\n");
    let title = "";
    let introduction = "";
    const sections = [];
    let currentSection = { title: "", content: "" };
    let inIntro = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Main title
      if (line.startsWith("# ") && !title) {
        title = applyHeadingCase(line.substring(2).trim(), writingStyle?.formatting?.headingCase);
        continue;
      }

      // Section or sub-section heading (## or ###)
      if (line.startsWith("## ") || line.startsWith("### ")) {
        if (currentSection.title) {
          sections.push({ ...currentSection });
        }
        // Remove either ## or ###
        const headingText = line.replace(/^##+\s*/, "");
        currentSection = {
          title: applyHeadingCase(headingText.trim(), writingStyle?.formatting?.headingCase),
          content: "",
        };
        inIntro = false;
        continue;
      }

      // Add to intro or section
      if (inIntro) {
        introduction += line + "\n";
      } else {
        currentSection.content += line + "\n";
      }
    }

    // Add last section if exists
    if (currentSection.title) {
      sections.push(currentSection);
    }

    return { title, introduction: introduction.trim(), sections };
  };

  // If content type is not loaded yet, show loading
  if (!contentType && router.isReady && type) {
    return <div className="p-8 text-center">Loading content type...</div>;
  }

  // When calling parseMarkdownWithStyle, ensure writingStyle is always defined
  const parsedContent = parseMarkdownWithStyle(generatedContent, writingStyle || {});

  // Render tab contents based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <div className="space-y-6">
            {/* Writing Style Status Banner - Show current writing style settings */}
            {isStyleConfigured && (
              <Card className="mb-6 border-2 border-green-200 overflow-hidden">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="flex items-center">
                    <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                    <span>Using Your Writing Style Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Content will follow these style rules:
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Style Guide:</strong> {writingStyle?.styleGuide?.primary}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            <strong>Heading Format:</strong> {
                              writingStyle?.formatting?.headingCase === 'upper' ? 'ALL CAPS' :
                                writingStyle?.formatting?.headingCase === 'lower' ? 'lowercase' :
                                  writingStyle?.formatting?.headingCase === 'sentence' ? 'Sentence case' :
                                    'Title Case'
                            }
                          </span>
                        </li>
                        {writingStyle?.formatting?.numberFormat && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Numbers:</strong> {
                                writingStyle.formatting.numberFormat === 'words' ? 'Spelled out' :
                                  writingStyle.formatting.numberFormat === 'numerals' ? 'As numerals' :
                                    'Mixed format'
                              }
                            </span>
                          </li>
                        )}
                        {writingStyle?.punctuation?.oxfordComma !== undefined && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Oxford Comma:</strong> {writingStyle.punctuation.oxfordComma ? 'Used' : 'Omitted'}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Strategic Data Banner - Show if we have meaningful strategic data */}
            {hasStrategicData && (
              <Card className="mb-6 border-2 border-blue-200 overflow-hidden">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="flex items-center">
                    <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
                    <span>Using Your Marketing Program</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Content will be created using:
                      </h3>
                      <ul className="space-y-2">
                        {strategicData?.product?.name && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your product:</strong>{" "}
                              {strategicData.product.name}
                            </span>
                          </li>
                        )}

                        {strategicData?.audiences?.length > 0 && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your audience:</strong>{" "}
                              {strategicData.audiences[0].role}
                            </span>
                          </li>
                        )}

                        {strategicData?.messaging?.valueProposition && (
                          <li className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-700">
                              <strong>Your messaging framework</strong>
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Strategic Data Warning */}
            {!isLoadingStrategicData && !hasStrategicData && !isStyleConfigured && (
              <Card className="mb-6 border-2 border-yellow-200 overflow-hidden">
                <CardHeader className="bg-yellow-50 border-b">
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span>No Brand Strategy Detected</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-yellow-800 mb-4">
                    You're creating content without a strategic foundation. Want stronger, more aligned results? Complete the Branding Wizard first.
                  </p>
                  <div className="flex justify-end">
                    <Link href="/walkthrough/1">
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                        Launch Branding Wizard
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center">
                  <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Create Your {contentType?.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Natural Language Prompt */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tell me what you'd like to create:
                    </label>
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      className="w-full p-3 border rounded-lg h-32"
                      placeholder={`Write a ${contentType?.title?.toLowerCase() || "content piece"
                        } about...`}
                    />
                  </div>

                  {/* File Upload Option */}
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-700 mb-4">
                      Or upload a file to use as a starting point:
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

                  {/* Next button to go to Keywords tab */}
                  <div className="flex justify-between mt-4">
                    <div></div> {/* Empty div for spacing */}
                    <button
                      onClick={() => setActiveTab("keywords")}
                      disabled={!promptText && !uploadedContent}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Continue to Keywords
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "keywords":
        return (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center">
                  <Search className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Keywords & SEO</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Strategic Keywords Notice */}
                  {strategicData?.seoKeywords?.primaryKeywords?.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2" />
                        Keywords from Your Marketing Program
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        We've pre-selected keywords from your SEO strategy. You
                        can add or remove keywords as needed.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {strategicData.seoKeywords.primaryKeywords.map(
                          (kw, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center"
                            >
                              <CheckIcon className="h-4 w-4 mr-1" />
                              {typeof kw === "string" ? kw : kw.term}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Why Keywords Matter
                    </h3>
                    <p className="text-sm text-blue-700">
                      Adding relevant keywords helps your content rank higher in
                      search results and reach the right audience. Click on
                      suggested keywords below to add them to your content.
                    </p>
                  </div>

                  {/* Keyword Suggestions */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">Recommended Keywords</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      <strong>Click on a keyword to add it</strong> to your
                      content. Selected keywords will be highlighted.
                    </p>

                    <KeywordSuggestions
                      contentTopic={promptText}
                      contentType={contentType?.id || "blog-post"}
                      initialKeywords={advancedOptions.keywords}
                      onKeywordsChange={(keywordsString) =>
                        handleAdvancedOptionChange("keywords", keywordsString)
                      }
                      showSelectionInstructions={true}
                    />
                  </div>

                  {/* Current selected keywords */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Selected Keywords:
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg min-h-[50px]">
                      {advancedOptions.keywords ? (
                        <div className="flex flex-wrap gap-2">
                          {advancedOptions.keywords.split(",").map(
                            (keyword, idx) =>
                              keyword.trim() && (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {keyword.trim()}
                                </span>
                              )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No keywords selected yet. Click on suggestions above.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigation buttons and generate content button */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setActiveTab("create")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setActiveTab("options")}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Continue to Options
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "options":
        return (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center">
                  <Settings className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Advanced Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Strategic Brand Voice Notice */}
                  {strategicData?.brandVoice?.brandVoice?.tone && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2" />
                        Using Your Brand Voice
                      </h3>
                      <p className="text-sm text-green-700">
                        We're using your brand voice settings from your
                        marketing program:
                      </p>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-green-700">
                          Tone:{" "}
                        </span>
                        <span className="text-sm text-green-800">
                          {strategicData.brandVoice.brandVoice.tone}
                        </span>
                      </div>
                      {strategicData.brandVoice.brandVoice.archetype && (
                        <div>
                          <span className="text-sm font-medium text-green-700">
                            Archetype:{" "}
                          </span>
                          <span className="text-sm text-green-800">
                            {strategicData.brandVoice.brandVoice.archetype}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={advancedOptions.audience}
                        onChange={(e) =>
                          handleAdvancedOptionChange("audience", e.target.value)
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="Who is this content for? (e.g., Small business owners)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Being specific about your audience helps create more
                        targeted content.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content Tone
                      </label>
                      <select
                        value={advancedOptions.tone}
                        onChange={(e) =>
                          handleAdvancedOptionChange("tone", e.target.value)
                        }
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="professional">Professional</option>
                        <option value="conversational">Conversational</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="friendly">Friendly</option>
                        <option value="empathetic">Empathetic</option>
                        <option value="compassionate">Compassionate</option>
                        <option value="humorous">Jovial and funny</option>
                        <option value="technical">Technical</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        The tone will affect how your content resonates with
                        readers.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Instructions (optional)
                    </label>
                    <textarea
                      value={advancedOptions.additionalNotes}
                      onChange={(e) =>
                        handleAdvancedOptionChange(
                          "additionalNotes",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border rounded-lg h-32"
                      placeholder="Any specific requirements for your content? (e.g., Include statistics, focus on specific aspects, etc.)"
                    />
                  </div>

                  {/* Navigation and generation buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveTab("keywords")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGenerateContent}
                      disabled={
                        isGenerating || (!promptText && !uploadedContent)
                      }
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Content
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "edit":
        return (
          <>
            {generatedContent ? (
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="border-b flex justify-between items-center">
                    <CardTitle>Your Generated {contentType?.title}</CardTitle>
                    <div className="flex space-x-2">
                      {/* Toggle Edit Mode Button */}
                      <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`px-3 py-1 text-sm border rounded-md flex items-center ${isEditMode
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {isEditMode ? "View Mode" : "Edit Mode"}
                      </button>

                      {/* Show Save button when in edit mode */}
                      {isEditMode && (
                        <button
                          onClick={saveContentEdits}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save Edits
                        </button>
                      )}

                      {/* Download Button with Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                            <button
                              onClick={() => {
                                handleExportContent("markdown");
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Markdown (.md)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent("html");
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              HTML (.html)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent("text");
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Plain Text (.txt)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent("docx");
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Word (.docx)
                            </button>
                            <button
                              onClick={() => {
                                handleExportContent("pdf");
                                setIsDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              PDF (.pdf)
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleSaveToLibrary}
                        className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save to Library
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-6">
                      {isEditMode ? (
                        /* Edit Mode - Show textarea */
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-blue-800">
                            Editing Content
                          </h3>
                          <p className="text-sm text-gray-600">
                            Make direct edits to your content below. Use
                            markdown formatting for headings, lists, and
                            styling.
                          </p>
                          <textarea
                            value={editedContent}
                            onChange={handleContentEdit}
                            className="w-full p-4 border border-gray-300 rounded-lg min-h-[500px] font-mono"
                            placeholder="Edit your content here..."
                          />
                        </div>
                      ) : (
                        /* FIXED: View Mode - Show properly formatted content with style guide rules applied */
                        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm" style={{
                          fontFamily: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                          lineHeight: '1.6',
                          fontSize: '11pt',
                          color: '#333'
                        }}>
                          {/* Document Title - Word style with proper formatting */}
                          <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-2" style={{
                              color: '#2B579A',
                              fontFamily: 'Calibri, sans-serif',
                              fontSize: '18pt',
                              fontWeight: 'bold'
                            }}>
                              {applyHeadingCase(parsedContent.title || generatedTitle, writingStyle?.formatting?.headingCase)}
                            </h1>
                          </div>

                          {/* Introduction */}
                          {parsedContent.introduction && (
                            <div className="mb-6" style={{ textAlign: 'justify' }}>
                              {parsedContent.introduction
                                .split("\n")
                                .map((para, idx) => (
                                  <p
                                    key={idx}
                                    className={idx > 0 ? "mt-4" : ""}
                                    style={{
                                      margin: idx > 0 ? '12pt 0' : '0',
                                      textIndent: '0pt',
                                      lineHeight: '1.6'
                                    }}
                                  >
                                    {para}
                                  </p>
                                ))}
                            </div>
                          )}

                          {/* Content Sections with PROPERLY APPLIED style guide formatting */}
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
                                {section.content
                                  .split("\n")
                                  .filter((p) => p.trim())
                                  .map((para, pIdx) => (
                                    <p
                                      key={pIdx}
                                      style={{
                                        margin: pIdx > 0 ? '12pt 0' : '0 0 12pt 0',
                                        textIndent: '0pt',
                                        lineHeight: '1.6'
                                      }}
                                    >
                                      {para}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          ))}

                          {/* Word count display */}
                          <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                            <span>Word count: {generatedContent.split(/\s+/).length}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Writing Style Applied Notice */}
                {isStyleConfigured && (
                  <Card className="mt-4 p-4 bg-green-50 border border-green-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileCheck className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Content created using {writingStyle?.styleGuide?.primary} style guide
                        {writingStyle?.formatting?.headingCase === 'upper' && ' with ALL CAPS headings'}
                        {writingStyle?.formatting?.numberFormat === 'numerals' && ' and numerical format'}
                        {strategicData?.product?.name && ` for ${strategicData.product.name}`}.
                      </span>
                    </div>
                  </Card>
                )}

                {/* Strategic Data Attribution */}
                {hasStrategicData && strategicData && strategicData.product && (
                  <Card className="mt-4 p-4 bg-gray-50 border border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileCheck className="w-4 h-4 mr-2 text-blue-600" />
                      <span>
                        Created using your marketing program for {strategicData.product.name || "your product"}.
                        {strategicData.audiences && Array.isArray(strategicData.audiences) && strategicData.audiences.length > 0
                          ? ` Targeted for ${strategicData.audiences[0]?.role || ''}.`
                          : ""}
                      </span>
                    </div>
                  </Card>
                )}

                {/* Chat for content improvements */}
                <Card className="mt-6">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Ask for Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ContentEditChat
                      originalContent={generatedContent}
                      originalTitle={generatedTitle}
                      contentType={contentType?.id || "content"}
                      onContentUpdate={handleContentUpdate}
                      // Pass strategic context for better improvements
                      strategicContext={
                        hasStrategicData
                          ? {
                            productName: strategicData?.product?.name,
                            valueProposition:
                              strategicData?.product?.valueProposition,
                            audience: strategicData?.audiences?.[0]?.role,
                            industry: strategicData?.audiences?.[0]?.industry,
                            tone:
                              strategicData?.brandVoice?.brandVoice?.tone ||
                              advancedOptions.tone,
                          }
                          : null
                      }
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleResetContent}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12">
                <p className="text-lg text-gray-500">
                  No content generated yet. Go back to create content.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Content Creation
                </button>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // Render the tabs and active tab content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/content-creator">
          <button className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Content Types
          </button>
        </Link>
        <h1 className="text-3xl font-bold">
          {contentType?.title || "Content Creator"}
        </h1>
        <p className="text-gray-600 mt-2">{contentType?.description}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          {CONTENT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 flex items-center ${activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
                }`}
              disabled={tab.id === "edit" && !generatedContent}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content for active tab */}
      {renderTabContent()}
    </div>
  );
};

export default ContentCreatorPage;