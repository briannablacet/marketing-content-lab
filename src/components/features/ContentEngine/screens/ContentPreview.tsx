// src/components/features/ContentEngine/screens/ContentPreview.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader, RefreshCw, Download, CheckCircle, Edit, X, Save, Eye, PlusCircle } from 'lucide-react';
import { useNotification } from '../../../../context/NotificationContext';
import { useRouter } from 'next/router';

const ContentPreview: React.FC = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  // State for storing generated content
  const [content, setContent] = useState(null);
  
  // Loading states for different content types
  const [loading, setLoading] = useState({
    ebook: false,
    social: false,
    email: false,
    sdr: false,
    all: false
  });
  
  // Is export processing
  const [isExporting, setIsExporting] = useState(false);
  
  // Edit states
  const [editMode, setEditMode] = useState({
    ebook: false,
    socialPosts: Array(10).fill(false), // Array to track edit state for each social post
    emailFlow: Array(10).fill(false), // Array to track edit state for each email
    sdrEmails: Array(10).fill(false) // Array to track edit state for each SDR email
  });

  // Edit content states
  const [editContent, setEditContent] = useState({
    ebook: { title: "", preview: "", chapters: [] },
    socialPosts: [],
    emailFlow: [],
    sdrEmails: []
  });

  // Content preview states
  const [previewMode, setPreviewMode] = useState({
    ebook: false,
    socialPost: -1, // Index of post being previewed, -1 means none
    email: -1, // Index of email being previewed, -1 means none
    sdrEmail: -1 // Index of SDR email being previewed, -1 means none
  });

  // Function to get campaign data from localStorage or context
  const getCampaignData = () => {
    try {
      // Try to get campaign data from localStorage
      const campaignData = localStorage.getItem('currentCampaign');
      if (campaignData) {
        return JSON.parse(campaignData);
      }
      
      // Fallback data if nothing is stored
      return {
        name: "Building the Ultimate Defense",
        type: "content",
        goal: "lead_generation",
        targetAudience: "Security professionals in enterprise companies",
        keyMessages: [
          "Comprehensive threat intelligence is crucial for modern security",
          "Multiple intelligence sources provide better coverage",
          "Our solution integrates diverse intelligence for complete protection"
        ],
        channels: ["Email", "Social Media", "Blog", "Website"]
      };
    } catch (error) {
      console.error('Error getting campaign data:', error);
      return {};
    }
  };

  // Function to generate all content at once
  const generateAllContent = async () => {
    setLoading({ ...loading, all: true });
    
    try {
      const campaignData = getCampaignData();
      
      // Call the API for content generation
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'content-repurposer',
          data: {
            content: JSON.stringify(campaignData),
            sourceFormat: "campaign",
            targetFormat: "multiple",
            tone: "professional"
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // If API call successful but has no content, fall back to sample data
      if (!data?.repurposedContent && !data?.ebook) {
        const sampleContent = getSampleContent();
        setContent(sampleContent);
        setEditContent({
          ebook: sampleContent.ebook,
          socialPosts: sampleContent.socialPosts,
          emailFlow: sampleContent.emailFlow,
          sdrEmails: sampleContent.sdrEmails
        });
      } else if (data.repurposedContent) {
        // Handle if API returns in standard repurposedContent format
        try {
          // Try to parse if it's JSON string
          const parsedContent = typeof data.repurposedContent === 'string' ? 
            JSON.parse(data.repurposedContent) : 
            data.repurposedContent;
          
          setContent(parsedContent);
          setEditContent({
            ebook: parsedContent.ebook || {},
            socialPosts: parsedContent.socialPosts || [],
            emailFlow: parsedContent.emailFlow || [],
            sdrEmails: parsedContent.sdrEmails || []
          });
        } catch (err) {
          // If can't parse, use as-is
          const formattedContent = {
            ebook: {
              title: campaignData.name || "Campaign Guide",
              chapters: ["Introduction", "Key Concepts", "Implementation", "Results"],
              preview: data.repurposedContent.substring(0, 250) + "..."
            },
            socialPosts: [
              {
                platform: "LinkedIn",
                posts: [data.repurposedContent.substring(0, 200) + "..."]
              }
            ],
            emailFlow: [
              {
                type: "Welcome",
                subject: campaignData.name || "Welcome",
                preview: data.repurposedContent.substring(0, 150) + "..."
              }
            ],
            sdrEmails: [
              {
                day: 1,
                subject: "Follow up on " + (campaignData.name || "our campaign"),
                body: data.repurposedContent.substring(0, 150) + "..."
              }
            ]
          };
          setContent(formattedContent);
          setEditContent({
            ebook: formattedContent.ebook,
            socialPosts: formattedContent.socialPosts,
            emailFlow: formattedContent.emailFlow,
            sdrEmails: formattedContent.sdrEmails
          });
        }
      } else {
        // Directly use the data if it's already in the expected format
        setContent(data);
        setEditContent({
          ebook: data.ebook || {},
          socialPosts: data.socialPosts || [],
          emailFlow: data.emailFlow || [],
          sdrEmails: data.sdrEmails || []
        });
      }
      
      showNotification('success', 'Campaign content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      showNotification('error', 'Failed to generate content. Using sample content instead.');
      
      // Fall back to sample content on error
      const sampleContent = getSampleContent();
      setContent(sampleContent);
      setEditContent({
        ebook: sampleContent.ebook,
        socialPosts: sampleContent.socialPosts,
        emailFlow: sampleContent.emailFlow,
        sdrEmails: sampleContent.sdrEmails
      });
    } finally {
      setLoading({ ...loading, all: false });
    }
  };

  // Function to regenerate a specific content type
  const regenerateContent = async (type) => {
    setLoading({ ...loading, [type]: true });
    
    try {
      const campaignData = getCampaignData();
      
      // Call the API for the specific content type
      const response = await fetch('/api/api_endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'content-repurposer',
          data: {
            content: JSON.stringify(campaignData),
            sourceFormat: "campaign",
            targetFormat: type,
            tone: "professional"
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update only the specific content type
      if (data.repurposedContent) {
        // If it returns in standard repurposedContent format
        const updatedContent = {...content};
        
        if (type === 'ebook') {
          updatedContent.ebook = {
            title: campaignData.name || "Campaign Guide",
            chapters: ["Introduction", "Key Concepts", "Implementation", "Results"],
            preview: data.repurposedContent.substring(0, 250) + "..."
          };
          setEditContent(prev => ({
            ...prev,
            ebook: updatedContent.ebook
          }));
        }
        
        if (type === 'socialPosts') {
          updatedContent.socialPosts = [
            {
              platform: "LinkedIn",
              posts: [data.repurposedContent.substring(0, 200) + "..."]
            }
          ];
          setEditContent(prev => ({
            ...prev,
            socialPosts: updatedContent.socialPosts
          }));
        }
        
        if (type === 'emailFlow') {
          updatedContent.emailFlow = [
            {
              type: "Welcome",
              subject: "Updated: " + (campaignData.name || "Welcome"),
              preview: data.repurposedContent.substring(0, 150) + "..."
            }
          ];
          setEditContent(prev => ({
            ...prev,
            emailFlow: updatedContent.emailFlow
          }));
        }
        
        if (type === 'sdrEmails') {
          updatedContent.sdrEmails = [
            {
              day: 1,
              subject: "Updated follow up on " + (campaignData.name || "our campaign"),
              body: data.repurposedContent.substring(0, 150) + "..."
            }
          ];
          setEditContent(prev => ({
            ...prev,
            sdrEmails: updatedContent.sdrEmails
          }));
        }
        
        setContent(updatedContent);
      } else if (data[type]) {
        // If API returns the specific content type directly
        setContent(prev => ({
          ...prev,
          [type]: data[type]
        }));
        setEditContent(prev => ({
          ...prev,
          [type]: data[type]
        }));
      }
      
      showNotification('success', `${type.charAt(0).toUpperCase() + type.slice(1)} content regenerated!`);
    } catch (error) {
      console.error(`Error regenerating ${type} content:`, error);
      showNotification('error', `Failed to regenerate ${type} content.`);
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  // Function to handle exporting all content
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const campaignData = getCampaignData();
      const campaignName = campaignData.name || 'campaign';
      
      // Create all-in-one content file
      let allContent = `# ${campaignName} - Complete Campaign Content\n\n`;
      
      // Add eBook content
      if (content?.ebook) {
        allContent += `# EBOOK: ${content.ebook.title}\n\n`;
        allContent += `${content.ebook.preview}\n\n`;
        content.ebook.chapters.forEach((chapter, i) => {
          allContent += `## Chapter ${i+1}: ${chapter}\n\n`;
          allContent += `Content for chapter ${i+1} goes here.\n\n`;
        });
        allContent += `\n\n${'='.repeat(50)}\n\n`;
      }
      
      // Add social posts
      if (content?.socialPosts && content.socialPosts.length > 0) {
        allContent += `# SOCIAL MEDIA POSTS\n\n`;
        content.socialPosts.forEach(platform => {
          allContent += `## ${platform.platform} Posts\n\n`;
          platform.posts.forEach((post, i) => {
            allContent += `### Post ${i+1}\n${post}\n\n---\n\n`;
          });
        });
        allContent += `\n\n${'='.repeat(50)}\n\n`;
      }
      
      // Add email sequence
      if (content?.emailFlow && content.emailFlow.length > 0) {
        allContent += `# EMAIL NURTURE SEQUENCE\n\n`;
        content.emailFlow.forEach((email, i) => {
          allContent += `## ${email.type} (Day ${i+1})\n`;
          allContent += `Subject: ${email.subject}\n\n`;
          allContent += `${email.preview}\n\n`;
          allContent += `---\n\n`;
        });
        allContent += `\n\n${'='.repeat(50)}\n\n`;
      }
      
      // Add SDR emails
      if (content?.sdrEmails && content.sdrEmails.length > 0) {
        allContent += `# SDR FOLLOW-UP EMAILS\n\n`;
        content.sdrEmails.forEach(email => {
          allContent += `## Day ${email.day}\n`;
          allContent += `Subject: ${email.subject}\n\n`;
          allContent += `${email.body}\n\n`;
          allContent += `---\n\n`;
        });
      }
      
      // Export the combined file
      const allContentBlob = new Blob([allContent], { type: 'text/markdown' });
      const allContentUrl = URL.createObjectURL(allContentBlob);
      const allContentLink = document.createElement('a');
      allContentLink.href = allContentUrl;
      allContentLink.download = `${campaignName}-complete-campaign.md`;
      document.body.appendChild(allContentLink);
      allContentLink.click();
      document.body.removeChild(allContentLink);
      
      showNotification('success', 'All content exported successfully!');
      
    } catch (error) {
      console.error('Error exporting content:', error);
      showNotification('error', 'Failed to export content.');
    } finally {
      setIsExporting(false);
    }
  };

  // Function to handle downloading a specific content type
  const handleDownload = (type, index = null) => {
    try {
      let filename;
      let content;
      let fileType;
      
      if (type === 'ebook') {
        filename = `${editContent.ebook.title || 'ebook'}.md`;
        content = `# ${editContent.ebook.title}\n\n${editContent.ebook.preview}\n\n`;
        // Add chapters
        editContent.ebook.chapters.forEach((chapter, i) => {
          content += `## Chapter ${i + 1}: ${chapter}\n\nContent for chapter ${i + 1} goes here.\n\n`;
        });
        fileType = 'text/markdown';
      } else if (type === 'socialPost' && index !== null) {
        const platform = editContent.socialPosts[index]?.platform || 'social';
        filename = `${platform}_posts.txt`;
        content = editContent.socialPosts[index]?.posts.join('\n\n---\n\n') || '';
        fileType = 'text/plain';
      } else if (type === 'email' && index !== null) {
        const emailInfo = editContent.emailFlow[index];
        filename = `${emailInfo?.type || 'email'}_${index + 1}.txt`;
        content = `Subject: ${emailInfo?.subject || ''}\n\n${emailInfo?.preview || ''}`;
        fileType = 'text/plain';
      } else if (type === 'sdrEmail' && index !== null) {
        const emailInfo = editContent.sdrEmails[index];
        filename = `sdr_email_day${emailInfo?.day || index + 1}.txt`;
        content = `Subject: ${emailInfo?.subject || ''}\n\n${emailInfo?.body || ''}`;
        fileType = 'text/plain';
      } else if (type === 'allSocial') {
        filename = 'all_social_posts.txt';
        content = editContent.socialPosts.map((platform, i) => 
          `# ${platform.platform} Posts\n\n${platform.posts.join('\n\n---\n\n')}`
        ).join('\n\n==========\n\n');
        fileType = 'text/plain';
      } else if (type === 'allEmails') {
        filename = 'email_sequence.txt';
        content = editContent.emailFlow.map((email, i) => 
          `# ${email.type} (Day ${i + 1})\nSubject: ${email.subject}\n\n${email.preview}`
        ).join('\n\n==========\n\n');
        fileType = 'text/plain';
      } else if (type === 'allSDR') {
        filename = 'sdr_email_sequence.txt';
        content = editContent.sdrEmails.map((email, i) => 
          `# Day ${email.day}\nSubject: ${email.subject}\n\n${email.body}`
        ).join('\n\n==========\n\n');
        fileType = 'text/plain';
      }
      
      // Create a blob and download
      if (filename && content) {
        const blob = new Blob([content], { type: fileType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('success', `Downloaded ${filename}`);
      }
    } catch (error) {
      console.error('Error downloading content:', error);
      showNotification('error', 'Failed to download content.');
    }
  };

  // Function to handle saving edited content
  const handleSaveEdit = (type, index = null) => {
    try {
      // Update the content state with edited content
      const updatedContent = {...content};
      
      if (type === 'ebook') {
        updatedContent.ebook = editContent.ebook;
        setEditMode({...editMode, ebook: false});
      } else if (type === 'socialPost' && index !== null) {
        updatedContent.socialPosts[index] = editContent.socialPosts[index];
        const newSocialPostsEditMode = [...editMode.socialPosts];
        newSocialPostsEditMode[index] = false;
        setEditMode({...editMode, socialPosts: newSocialPostsEditMode});
      } else if (type === 'email' && index !== null) {
        updatedContent.emailFlow[index] = editContent.emailFlow[index];
        const newEmailFlowEditMode = [...editMode.emailFlow];
        newEmailFlowEditMode[index] = false;
        setEditMode({...editMode, emailFlow: newEmailFlowEditMode});
      } else if (type === 'sdrEmail' && index !== null) {
        updatedContent.sdrEmails[index] = editContent.sdrEmails[index];
        const newSdrEmailsEditMode = [...editMode.sdrEmails];
        newSdrEmailsEditMode[index] = false;
        setEditMode({...editMode, sdrEmails: newSdrEmailsEditMode});
      }
      
      setContent(updatedContent);
      showNotification('success', 'Content updated successfully!');
    } catch (error) {
      console.error('Error saving edited content:', error);
      showNotification('error', 'Failed to save content changes.');
    }
  };

  // Handle editing eBook
  const handleEditEbook = (field, value) => {
    setEditContent({
      ...editContent,
      ebook: {
        ...editContent.ebook,
        [field]: value
      }
    });
  };

  // Handle editing chapter
  const handleEditChapter = (index, value) => {
    const newChapters = [...editContent.ebook.chapters];
    newChapters[index] = value;
    
    setEditContent({
      ...editContent,
      ebook: {
        ...editContent.ebook,
        chapters: newChapters
      }
    });
  };

  // Handle adding a new chapter
  const handleAddChapter = () => {
    setEditContent({
      ...editContent,
      ebook: {
        ...editContent.ebook,
        chapters: [...editContent.ebook.chapters, `Chapter ${editContent.ebook.chapters.length + 1}`]
      }
    });
  };

  // Handle editing social post
  const handleEditSocialPost = (platformIndex, postIndex, value) => {
    const newSocialPosts = [...editContent.socialPosts];
    if (newSocialPosts[platformIndex]) {
      const newPosts = [...newSocialPosts[platformIndex].posts];
      newPosts[postIndex] = value;
      newSocialPosts[platformIndex] = {
        ...newSocialPosts[platformIndex],
        posts: newPosts
      };
    }
    
    setEditContent({
      ...editContent,
      socialPosts: newSocialPosts
    });
  };

  // Handle adding a new social post
  const handleAddSocialPost = (platformIndex) => {
    const newSocialPosts = [...editContent.socialPosts];
    if (newSocialPosts[platformIndex]) {
      newSocialPosts[platformIndex] = {
        ...newSocialPosts[platformIndex],
        posts: [...newSocialPosts[platformIndex].posts, "New post content..."]
      };
    }
    
    setEditContent({
      ...editContent,
      socialPosts: newSocialPosts
    });
  };

  // Handle editing email
  const handleEditEmail = (index, field, value) => {
    const newEmails = [...editContent.emailFlow];
    if (newEmails[index]) {
      newEmails[index] = {
        ...newEmails[index],
        [field]: value
      };
    }
    
    setEditContent({
      ...editContent,
      emailFlow: newEmails
    });
  };

  // Handle editing SDR email
  const handleEditSDREmail = (index, field, value) => {
    const newEmails = [...editContent.sdrEmails];
    if (newEmails[index]) {
      newEmails[index] = {
        ...newEmails[index],
        [field]: value
      };
    }
    
    setEditContent({
      ...editContent,
      sdrEmails: newEmails
    });
  };

  // Get sample content as fallback
  const getSampleContent = () => {
    return {
      ebook: {
        title: "Building the Ultimate Defense: A Guide to Balanced Threat Intelligence",
        chapters: [
          "Understanding Intelligence Sources",
          "OSINT: The Foundation",
          "Premium Feeds: Targeted Insights",
          "ISAC Integration: Industry-Specific Intel",
          "Building Your Intelligence Strategy"
        ],
        preview: "A comprehensive guide to strengthening your security posture through diverse intelligence sources. Learn how top organizations combine multiple intelligence streams for complete coverage."
      },
      socialPosts: [
        {
          platform: "LinkedIn",
          posts: [
            "🛡️ Just like athletes need a balanced diet, SOCs need diverse intelligence sources. Learn how to build your ultimate defense in our new guide! #CyberSecurity #ThreatIntel",
            "📚 New eBook: Discover why combining OSINT, premium feeds, and ISAC intel creates the strongest security posture. Download now! #InfoSec",
            "🎯 The secret to comprehensive threat intelligence? It's all about balance. Get our latest guide to learn more. #CyberDefense"
          ]
        },
        {
          platform: "Twitter",
          posts: [
            "New Guide: Building the Ultimate Defense Through Balanced Threat Intel 🛡️ Get it here: [LINK] #SecurityOps",
            "Want stronger security? Learn why diversity in threat intelligence matters 📚 Download our guide: [LINK]",
            "Stop gaps in your security coverage! Our new guide shows you how 🎯 [LINK] #CyberSecurity"
          ]
        }
      ],
      emailFlow: [
        {
          type: "Welcome",
          subject: "Your Guide to Building the Ultimate Defense is Here",
          preview: "Thank you for downloading our comprehensive guide to balanced threat intelligence. Inside you'll find actionable insights on combining multiple intelligence sources for stronger security..."
        },
        {
          type: "Follow-up 1",
          subject: "Key Takeaways: Building Your Defense Strategy",
          preview: "Now that you've had a chance to review our guide, I wanted to highlight some key strategies for implementing a multi-source intelligence approach..."
        },
        {
          type: "Follow-up 2",
          subject: "Expert Tips for Implementing Your Intelligence Strategy",
          preview: "Based on feedback from security leaders like you, here are some practical tips for getting the most value from different intelligence sources..."
        }
      ],
      sdrEmails: [
        {
          day: 1,
          subject: "Re: Building a Stronger Defense",
          body: "I noticed you downloaded our guide on building comprehensive threat intelligence. Many organizations struggle with gaps in their intelligence coverage - would you be interested in discussing how we help solve this?"
        },
        {
          day: 3,
          subject: "Quick follow-up on threat intelligence strategy",
          body: "I wanted to check if you had any questions about implementing a multi-source intelligence approach. I've helped several companies in [Industry] optimize their intelligence coverage..."
        },
        {
          day: 5,
          subject: "Let's discuss your intelligence needs",
          body: "Many of our customers found our guide helpful in identifying gaps in their current approach. I'd love to learn about your intelligence strategy and share how other [Industry] companies are solving similar challenges..."
        }
      ]
    };
  };

  // Generate content when component mounts
  useEffect(() => {
    generateAllContent();
  }, []);

  // If content is still loading initially, show loading state
  if (loading.all && !content) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600">Generating your campaign content across all channels...</p>
      </div>
    );
  }

  // Preview Modal
  const renderPreviewModal = () => {
    let previewContent = null;
    let previewTitle = "";
    
    if (previewMode.ebook) {
      previewContent = (
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">{content?.ebook?.title}</h1>
          <p className="text-slate-600 mb-6">{content?.ebook?.preview}</p>
          {content?.ebook?.chapters.map((chapter, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Chapter {index + 1}: {chapter}</h2>
              <p className="text-slate-600">
                {/* Placeholder chapter content */}
                This chapter will cover key concepts related to {chapter.toLowerCase()}, 
                with practical examples and implementation strategies.
              </p>
            </div>
          ))}
        </div>
      );
      previewTitle = "eBook Preview";
    } else if (previewMode.socialPost >= 0) {
      const platformIndex = previewMode.socialPost;
      const platform = content?.socialPosts[platformIndex];
      previewContent = (
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <h2 className="text-xl font-semibold mb-4">{platform?.platform} Posts</h2>
          {platform?.posts.map((post, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-slate-50">
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <h3 className="font-semibold">Your Company</h3>
                  <p className="text-sm text-slate-500">Just now</p>
                </div>
              </div>
              <p>{post}</p>
            </div>
          ))}
        </div>
      );
      previewTitle = `${platform?.platform} Posts Preview`;
    } else if (previewMode.email >= 0) {
      const emailIndex = previewMode.email;
      const email = content?.emailFlow[emailIndex];
      previewContent = (
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 bg-slate-50 border-b">
            <h2 className="text-xl font-semibold mb-1">Subject: {email?.subject}</h2>
            <p className="text-sm text-slate-500 mb-4">From: Your Company &lt;marketing@yourcompany.com&gt;</p>
          </div>
          <div className="p-6">
            <div className="p-4 border-b border-slate-200">
              <p className="text-sm">Dear [Prospect],</p>
            </div>
            <div className="p-4">
              <p className="whitespace-pre-line">{email?.preview}</p>
              
              <p className="mt-4">Best regards,</p>
              <p>Your Name</p>
              <p className="text-sm text-slate-500">Marketing Manager</p>
              <p className="text-sm text-slate-500">Your Company</p>
            </div>
          </div>
        </div>
      );
      previewTitle = `Email Preview: ${email?.type}`;
    } else if (previewMode.sdrEmail >= 0) {
      const emailIndex = previewMode.sdrEmail;
      const email = content?.sdrEmails[emailIndex];
      previewContent = (
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 bg-slate-50 border-b">
            <h2 className="text-xl font-semibold mb-1">Subject: {email?.subject}</h2>
            <p className="text-sm text-slate-500 mb-4">From: Your SDR &lt;sales@yourcompany.com&gt;</p>
          </div>
          <div className="p-6">
            <div className="p-4 border-b border-slate-200">
              <p className="text-sm">Dear [Prospect],</p>
            </div>
            <div className="p-4">
              <p className="whitespace-pre-line">{email?.body}</p>
              
              <p className="mt-4">Best regards,</p>
              <p>Your SDR Name</p>
              <p className="text-sm text-slate-500">Sales Development Representative</p>
              <p className="text-sm text-slate-500">Your Company</p>
            </div>
          </div>
        </div>
      );
      previewTitle = `SDR Email Preview: Day ${email?.day}`;
    }
    
    if (!previewContent) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl shadow-xl">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-xl font-bold">{previewTitle}</h2>
            <button 
              onClick={() => setPreviewMode({ebook: false, socialPost: -1, email: -1, sdrEmail: -1})}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {previewContent}
          <div className="border-t p-4 flex justify-end">
            <button 
              onClick={() => setPreviewMode({ebook: false, socialPost: -1, email: -1, sdrEmail: -1})}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Campaign Content</h2>
        <button 
          onClick={generateAllContent} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          disabled={loading.all}
        >
          {loading.all ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Regenerating All
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate All
            </>
          )}
        </button>
      </div>

      {/* eBook Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>eBook Preview</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPreviewMode({...previewMode, ebook: true})}
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setEditMode({...editMode, ebook: true})}
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
              disabled={editMode.ebook}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => regenerateContent('ebook')} 
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
              disabled={loading.ebook}
            >
              {loading.ebook ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={() => handleDownload('ebook')}
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {editMode.ebook ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">eBook Title</label>
                <input
                  type="text"
                  value={editContent.ebook.title || ''}
                  onChange={(e) => handleEditEbook('title', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">eBook Preview/Description</label>
                <textarea
                  value={editContent.ebook.preview || ''}
                  onChange={(e) => handleEditEbook('preview', e.target.value)}
                  className="w-full p-2 border rounded-lg h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Chapters</label>
                <div className="space-y-2">
                  {editContent.ebook.chapters && editContent.ebook.chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-8 text-center">{index + 1}.</span>
                      <input
                        type="text"
                        value={chapter || ''}
                        onChange={(e) => handleEditChapter(index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddChapter}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Chapter
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEditMode({...editMode, ebook: false})}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEdit('ebook')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-1 inline" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">{content?.ebook?.title || "Loading..."}</h3>
              <p className="text-slate-600 mb-4">{content?.ebook?.preview || ""}</p>
              <div className="space-y-2">
                {content?.ebook?.chapters?.map((chapter, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    <span className="text-slate-800">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Media Content</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={() => regenerateContent('socialPosts')} 
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
              disabled={loading.social}
            >
              {loading.social ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={() => handleDownload('allSocial')}
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {content?.socialPosts?.map((platform, platformIndex) => (
              <div key={platformIndex}>
                <h4 className="font-semibold mb-3">{platform.platform} Posts</h4>
                <div className="space-y-3">
                  {platform.posts.map((post, postIndex) => (
                    <div key={postIndex} className="relative">
                      {editMode.socialPosts[platformIndex] ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent.socialPosts[platformIndex]?.posts[postIndex] || ''}
                            onChange={(e) => handleEditSocialPost(platformIndex, postIndex, e.target.value)}
                            className="w-full p-2 border rounded-lg min-h-24"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                const newSocialPostsEditMode = [...editMode.socialPosts];
                                newSocialPostsEditMode[platformIndex] = false;
                                setEditMode({...editMode, socialPosts: newSocialPostsEditMode});
                              }}
                              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit('socialPost', platformIndex)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Save className="w-4 h-4 mr-1 inline" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                  <div className="p-4 bg-slate-50 rounded-lg border group relative">
                    <div className="absolute top-2 right-2 flex space-x-1 bg-white bg-opacity-75 rounded-lg p-1 shadow-sm">
                      <button 
                        onClick={() => setPreviewMode({...previewMode, socialPost: platformIndex})}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          const newSocialPostsEditMode = [...editMode.socialPosts];
                          newSocialPostsEditMode[platformIndex] = true;
                          setEditMode({...editMode, socialPosts: newSocialPostsEditMode});
                          
                          // Make sure editContent has the current data
                          setEditContent({
                            ...editContent,
                            socialPosts: content.socialPosts
                          });
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDownload('socialPost', platformIndex)}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="pr-16">
                      {post}
                    </div>
                  </div>
                      )}
                    </div>
                  ))}
                  {editMode.socialPosts[platformIndex] && (
                    <button
                      onClick={() => handleAddSocialPost(platformIndex)}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add Post
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Flow */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nurture Email Sequence</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={() => regenerateContent('emailFlow')} 
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
              disabled={loading.email}
            >
              {loading.email ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={() => handleDownload('allEmails')}
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content?.emailFlow?.map((email, index) => (
              <div key={index} className="relative group">
                {editMode.emailFlow[index] ? (
                  <div className="p-4 border rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Type</label>
                      <input
                        type="text"
                        value={editContent.emailFlow[index]?.type || ''}
                        onChange={(e) => handleEditEmail(index, 'type', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject Line</label>
                      <input
                        type="text"
                        value={editContent.emailFlow[index]?.subject || ''}
                        onChange={(e) => handleEditEmail(index, 'subject', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Content</label>
                      <textarea
                        value={editContent.emailFlow[index]?.preview || ''}
                        onChange={(e) => handleEditEmail(index, 'preview', e.target.value)}
                        className="w-full p-2 border rounded-lg min-h-32"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          const newEmailFlowEditMode = [...editMode.emailFlow];
                          newEmailFlowEditMode[index] = false;
                          setEditMode({...editMode, emailFlow: newEmailFlowEditMode});
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit('email', index)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-1 inline" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg relative">
                    <div className="absolute top-2 right-2 flex space-x-1 bg-white bg-opacity-75 rounded-lg p-1 shadow-sm">
                      <button 
                        onClick={() => setPreviewMode({...previewMode, email: index})}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          const newEmailFlowEditMode = [...editMode.emailFlow];
                          newEmailFlowEditMode[index] = true;
                          setEditMode({...editMode, emailFlow: newEmailFlowEditMode});
                          
                          // Make sure editContent has the current data
                          setEditContent({
                            ...editContent,
                            emailFlow: content.emailFlow
                          });
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDownload('email', index)}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="pr-16">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">{email.type}</span>
                        <span className="text-sm text-slate-500">Day {index + 1}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{email.subject}</h4>
                      <p className="text-slate-600 text-sm">{email.preview}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SDR Emails */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>SDR Follow-up Sequence</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={() => regenerateContent('sdrEmails')} 
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
              disabled={loading.sdr}
            >
              {loading.sdr ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button 
              onClick={() => handleDownload('allSDR')}
              className="p-2 text-slate-600 hover:text-blue-600 rounded"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content?.sdrEmails?.map((email, index) => (
              <div key={index} className="relative group">
                {editMode.sdrEmails[index] ? (
                  <div className="p-4 border rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Day</label>
                      <input
                        type="number"
                        value={editContent.sdrEmails[index]?.day || index + 1}
                        onChange={(e) => handleEditSDREmail(index, 'day', parseInt(e.target.value))}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject Line</label>
                      <input
                        type="text"
                        value={editContent.sdrEmails[index]?.subject || ''}
                        onChange={(e) => handleEditSDREmail(index, 'subject', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Content</label>
                      <textarea
                        value={editContent.sdrEmails[index]?.body || ''}
                        onChange={(e) => handleEditSDREmail(index, 'body', e.target.value)}
                        className="w-full p-2 border rounded-lg min-h-32"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          const newSdrEmailsEditMode = [...editMode.sdrEmails];
                          newSdrEmailsEditMode[index] = false;
                          setEditMode({...editMode, sdrEmails: newSdrEmailsEditMode});
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit('sdrEmail', index)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-1 inline" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg relative">
                    <div className="absolute top-9 right-2 flex space-x-1 bg-white bg-opacity-75 rounded-lg p-1 shadow-sm">
                      <button 
                        onClick={() => setPreviewMode({...previewMode, sdrEmail: index})}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          const newSdrEmailsEditMode = [...editMode.sdrEmails];
                          newSdrEmailsEditMode[index] = true;
                          setEditMode({...editMode, sdrEmails: newSdrEmailsEditMode});
                          
                          // Make sure editContent has the current data
                          setEditContent({
                            ...editContent,
                            sdrEmails: content.sdrEmails
                          });
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDownload('sdrEmail', index)}
                        className="p-1 text-slate-500 hover:text-blue-600 bg-white rounded-full shadow-sm"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="pr-16">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500 mr-20">Day {email.day}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {index === 0 ? 'Initial' : `Follow-up ${index}`}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">{email.subject}</h4>
                      <p className="text-slate-600 text-sm">{email.body}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export buttons at the bottom */}
      <div className="flex justify-between mt-6">
        <button 
          className="px-6 py-3 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          onClick={() => router.push('/creation-hub')}
        >
          Save and Return to Creation Hub
        </button>
        <button 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Export All Content
            </>
          )}
        </button>
      </div>

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
};

export default ContentPreview;