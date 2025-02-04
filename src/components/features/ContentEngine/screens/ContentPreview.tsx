// src/components/features/ContentEngine/screens/ContentPreview.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ContentPreview: React.FC = () => {
  // Sample content from your blog
  const previewContent = {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* eBook Preview */}
      <Card>
        <CardHeader>
          <CardTitle>eBook Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">{previewContent.ebook.title}</h3>
            <p className="text-slate-600 mb-4">{previewContent.ebook.preview}</p>
            <div className="space-y-2">
              {previewContent.ebook.chapters.map((chapter, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-slate-800">{chapter}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {previewContent.socialPosts.map((platform, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-3">{platform.platform} Posts</h4>
                <div className="space-y-3">
                  {platform.posts.map((post, postIndex) => (
                    <div key={postIndex} className="p-4 bg-slate-50 rounded-lg border">
                      {post}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Nurture Email Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previewContent.emailFlow.map((email, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">{email.type}</span>
                  <span className="text-sm text-slate-500">Day {index + 1}</span>
                </div>
                <h4 className="font-semibold mb-2">{email.subject}</h4>
                <p className="text-slate-600 text-sm">{email.preview}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SDR Emails */}
      <Card>
        <CardHeader>
          <CardTitle>SDR Follow-up Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previewContent.sdrEmails.map((email, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Day {email.day}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {index === 0 ? 'Initial' : `Follow-up ${index}`}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">{email.subject}</h4>
                <p className="text-slate-600 text-sm">{email.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPreview;