// src/components/features/ContentEngine/screens/ContentPreview.tsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Loader,
  RefreshCw,
  Download,
  CheckCircle,
  Edit,
  X,
  Save,
  Eye,
  PlusCircle,
} from "lucide-react";
import { useNotification } from "../../../../context/NotificationContext";
import { useRouter } from "next/router";
import { useWritingStyle } from "../../../../context/WritingStyleContext";

const ContentPreview: React.FC = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { writingStyle, isStyleConfigured } = useWritingStyle();

  // State for storing generated content
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState({ all: false });
  const [isExporting, setIsExporting] = useState(false);

  // Edit states
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editContent, setEditContent] = useState<Record<string, any>>({});

  // Content preview states
  const [previewMode, setPreviewMode] = useState({
    type: "",
    index: -1,
  });

  // Function to get campaign data from localStorage
  const getCampaignData = () => {
    try {
      const campaignData = localStorage.getItem("currentCampaign");
      if (campaignData) {
        const parsedData = JSON.parse(campaignData);
        console.log("Campaign data loaded:", parsedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error("Error getting campaign data:", error);
      return null;
    }
  };

  // Function to generate all content
  const generateAllContent = async () => {
    const campaignData = getCampaignData();
    if (!campaignData) {
      showNotification(
        "No campaign data found. Please go back and complete the campaign setup.",
        "error"
      );
      return;
    }

    console.log(
      "Starting content generation with campaign data:",
      campaignData
    );

    setLoading({ all: true });
    try {
      // Create prompt for campaign content generation
      const campaignPrompt = `Create a comprehensive content package for a ${
        campaignData.type
      } campaign:

Campaign Name: ${campaignData.name}
Target Audience: ${campaignData.targetAudience}
Content Types: ${campaignData.contentTypes?.join(", ")}
Key Messages: ${campaignData.keyMessages?.join(", ")}

Please create content for each of the selected content types.`;

      const requestBody = {
        prompt: campaignPrompt,
        data: {
          contentType: campaignData?.contentType?.id || "blog-post",
          campaignData: campaignData,
          prompt: campaignPrompt,
        },
        writingStyle: writingStyle || {
          styleGuide: { primary: "Professional" },
          formatting: {},
          punctuation: {},
        },
      };

      console.log(
        "Request body being sent:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(
          `Failed to generate content: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("Generated content received:", responseData);

      // Transform the API response to match our expected format
      const transformedContent: Record<string, any> = {};
      
      if (responseData.data?.document) {
        const doc = responseData.data.document;
        campaignData.contentTypes?.forEach((type: string) => {
          if (type === "Blog Posts") {
            transformedContent[type] = {
              title: `${campaignData.name} Blog Post`,
              content: doc.processedContent,
            };
          }
          // Add other content type transformations here as needed
        });
      }

      setContent(transformedContent);

      // Initialize edit states for each content type
      const newEditMode: Record<string, boolean> = {};
      const newEditContent: Record<string, any> = {};
      Object.keys(transformedContent).forEach((type) => {
        newEditMode[type] = false;
        newEditContent[type] = transformedContent[type];
      });
      setEditMode(newEditMode);
      setEditContent(newEditContent);

      showNotification("Content generated successfully!", "success");
    } catch (error) {
      console.error("Error generating content:", error);
      showNotification(
        error instanceof Error
          ? error.message
          : "Failed to generate content. Please try again.",
        "error"
      );
    } finally {
      setLoading({ all: false });
    }
  };

  // Rest of the component remains exactly the same...
  // [Keep all the existing render methods and other functions unchanged]
  // Only the generateAllContent function was modified to handle the API response

  // Preview Modal
  const renderPreviewModal = () => {
    if (previewMode.index === -1 || !previewMode.type) return null;

    const contentType = content[previewMode.type];
    if (!contentType) return null;

    const previewTitle = contentType.title || previewMode.type;
    const previewContent =
      contentType.content || JSON.stringify(contentType, null, 2);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">{previewTitle}</h3>
            <button
              onClick={() => setPreviewMode({ type: "", index: -1 })}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{previewContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render content sections with better formatting
  const renderContentSections = () => {
    return Object.entries(content).map(([type, data]) => (
      <Card key={type} className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{type}</span>
            <div className="flex gap-2">
              {editMode[type] ? (
                <>
                  <button
                    onClick={() => {
                      setContent((prev) => ({
                        ...prev,
                        [type]: editContent[type],
                      }));
                      setEditMode((prev) => ({ ...prev, [type]: false }));
                      showNotification(
                        "Content updated successfully!",
                        "success"
                      );
                    }}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save changes"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode((prev) => ({ ...prev, [type]: false }));
                      setEditContent((prev) => ({
                        ...prev,
                        [type]: content[type],
                      }));
                    }}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Cancel editing"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, [type]: true }))
                    }
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Edit content"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => setPreviewMode({ type, index: 0 })}
                    className="text-gray-600 hover:text-gray-700 p-1"
                    title="Preview content"
                  >
                    <Eye size={20} />
                  </button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editMode[type] ? (
            <textarea
              value={
                typeof editContent[type] === "object"
                  ? JSON.stringify(editContent[type], null, 2)
                  : editContent[type]
              }
              onChange={(e) =>
                setEditContent((prev) => ({
                  ...prev,
                  [type]:
                    typeof editContent[type] === "object"
                      ? JSON.parse(e.target.value)
                      : e.target.value,
                }))
              }
              className="w-full h-96 p-3 border rounded-lg font-mono text-sm"
              placeholder="Edit content here..."
            />
          ) : (
            <div className="prose max-w-none">
              {typeof data === "object" ? (
                <div>
                  {data.title && (
                    <h3 className="text-xl font-semibold mb-4">{data.title}</h3>
                  )}
                  {data.content && (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {data.content}
                    </div>
                  )}
                  {data.subject && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700">Subject:</h4>
                      <p className="text-gray-900">{data.subject}</p>
                    </div>
                  )}
                  {data.body && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700">Body:</h4>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {data.body}
                      </div>
                    </div>
                  )}
                  {data.posts && (
                    <div className="space-y-4">
                      {data.posts.map((post: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-700">
                            Post {index + 1}:
                          </h4>
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {post.content}
                          </div>
                          {post.hashtags && (
                            <div className="mt-2 text-blue-600">
                              {post.hashtags.join(" ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {typeof data === "string" && (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {data}
                    </div>
                  )}
                  {data.metadata && Object.keys(data.metadata).length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Metadata:
                      </h4>
                      <pre className="text-sm text-gray-600">
                        {JSON.stringify(data.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {data}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  // Generate content when component mounts
  useEffect(() => {
    generateAllContent();
  }, []);

  // Main render function
  if (loading.all && Object.keys(content).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600">Generating your campaign content...</p>
        <p className="text-slate-500 text-sm mt-2">
          This may take a few moments
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Preview</h1>
          <p className="text-gray-600 mt-1">
            Review and edit your generated campaign content
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateAllContent}
            disabled={loading.all}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.all ? (
              <>
                <Loader className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Regenerate Content
              </>
            )}
          </button>
          <button
            onClick={() => {
              // Export as markdown instead of JSON
              const campaignData = getCampaignData();

              // Create a nicely formatted markdown document
              let markdownContent = `# ${
                campaignData?.name || "Campaign"
              } Content\n\n`;
              markdownContent += `**Campaign Type:** ${
                campaignData?.type || "Not specified"
              }\n`;
              markdownContent += `**Target Audience:** ${
                campaignData?.targetAudience || "Not specified"
              }\n`;
              markdownContent += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;

              if (
                campaignData?.keyMessages &&
                campaignData.keyMessages.length > 0
              ) {
                markdownContent += `## Key Messages\n\n`;
                campaignData.keyMessages.forEach(
                  (message: string, index: number) => {
                    markdownContent += `${index + 1}. ${message}\n`;
                  }
                );
                markdownContent += `\n`;
              }

              markdownContent += `---\n\n`;

              // Add each content type
              Object.entries(content).forEach(([type, data]) => {
                markdownContent += `## ${type}\n\n`;

                if (typeof data === "object") {
                  // Handle different content structures
                  if (data.title) {
                    markdownContent += `### ${data.title}\n\n`;
                  }
                  if (data.subject) {
                    markdownContent += `**Subject:** ${data.subject}\n\n`;
                  }
                  if (data.content) {
                    markdownContent += `${data.content}\n\n`;
                  }
                  if (data.body) {
                    markdownContent += `${data.body}\n\n`;
                  }
                  if (data.posts && Array.isArray(data.posts)) {
                    data.posts.forEach((post: any, index: number) => {
                      markdownContent += `### Post ${index + 1}\n\n`;
                      markdownContent += `${post.content}\n\n`;
                      if (post.hashtags) {
                        markdownContent += `**Hashtags:** ${post.hashtags.join(
                          " "
                        )}\n\n`;
                      }
                    });
                  }
                  if (data.headline) {
                    markdownContent += `**Headline:** ${data.headline}\n\n`;
                  }
                  if (data.cta) {
                    markdownContent += `**Call to Action:** ${data.cta}\n\n`;
                  }
                } else {
                  // Handle string content
                  markdownContent += `${data}\n\n`;
                }

                markdownContent += `---\n\n`;
              });

              markdownContent += `*Generated by Marketing Content Lab*\n`;

              // Create and download markdown file
              const blob = new Blob([markdownContent], {
                type: "text/markdown",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${(campaignData?.name || "campaign")
                .replace(/[^a-z0-9]/gi, "_")
                .toLowerCase()}_content.md`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              showNotification("Content exported as markdown file!", "success");
            }}
            disabled={!content || Object.keys(content).length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            Export as Markdown
          </button>
        </div>
      </div>

      {Object.keys(content).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No content generated yet.</p>
          <button
            onClick={generateAllContent}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Generate Content
          </button>
        </div>
      ) : (
        <div>
          {renderContentSections()}
          {renderPreviewModal()}
        </div>
      )}
    </div>
  );
};

export default ContentPreview;