// src/data/contentTypeData.js
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  FileCheck, 
  Layout, 
  Video, 
  PenTool, 
  BookOpen,
  Globe,
  FileSpreadsheet,
  Presentation 
} from 'lucide-react';
import React from 'react';

// Define content types with their details
export const CONTENT_TYPES = [
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog content to establish your expertise and attract organic traffic.',
    icon: <FileText className="w-6 h-6 text-blue-600" />,
    insights: [
      "Blog posts of 1,500+ words get 68% more traffic",
      "Content with images gets 94% more views",
      "How-to and list posts are the most shared formats"
    ],
    implemented: true
  },
  {
    id: 'case-study',
    title: 'Case Study',
    description: 'Create compelling case studies that showcase your success stories and build credibility.',
    icon: <FileCheck className="w-6 h-6 text-orange-600" />,
    insights: [
      "Case studies with specific metrics have 68% higher engagement",
      "Include direct customer quotes to enhance credibility",
      "Focus on the transformation and concrete results"
    ],
    implemented: true
  },
  {
    id: 'ebook',
    title: 'eBook & White Paper',
    description: 'Create valuable eBooks and white papers that generate leads and showcase your expertise.',
    icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
    insights: [
      "eBooks with actionable worksheets get 56% more engagement",
      "Visual-heavy eBooks are shared 3x more frequently",
      "Scannable, chapter-based formats have higher completion rates"
    ],
    implemented: true
  },
  {
    id: 'email',
    title: 'Email Campaign',
    description: 'Create email content that drives opens, clicks, and conversions for your business.',
    icon: <Mail className="w-6 h-6 text-green-600" />,
    insights: [
      "Personalized subject lines increase open rates by 26%",
      "Emails with a single clear CTA have higher conversion rates",
      "Keep emails under 200 words for optimal engagement"
    ],
    implemented: true
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create high-converting landing pages that turn visitors into leads and customers.',
    icon: <Layout className="w-6 h-6 text-red-600" />,
    insights: [
      "Landing pages with social proof convert 40% better",
      "Benefit-focused headlines outperform feature-focused ones",
      "Clear, contrasting CTAs increase click-through rates by 32%"
    ],
    implemented: true
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    description: 'Create engaging newsletters that keep your audience informed and build relationships.',
    icon: <Mail className="w-6 h-6 text-blue-500" />,
    insights: [
      "Newsletters with personalized content see 29% higher open rates",
      "Consistent sending schedule increases subscriber retention",
      "Value-based content outperforms promotional content"
    ],
    implemented: true
  },
  {
    id: 'presentation',
    title: 'Presentation',
    description: 'Create impactful presentations that engage your audience and deliver your message clearly.',
    icon: <Presentation className="w-6 h-6 text-orange-500" />,
    insights: [
      "Presentations with strong visuals are 43% more memorable",
      "Following the 10/20/30 rule improves audience retention",
      "Stories and case studies make presentations more engaging"
    ],
    implemented: true
  },
  {
    id: 'press-release',
    title: 'Press Release',
    description: 'Create professional press releases that generate media coverage for your brand.',
    icon: <Globe className="w-6 h-6 text-purple-500" />,
    insights: [
      "Press releases with newsworthy angles get 3x more pickups",
      "Including quotes from key stakeholders increases credibility",
      "Clear, concise writing style is preferred by journalists"
    ],
    implemented: true
  },
  {
    id: 'product-description',
    title: 'Product Description',
    description: 'Create compelling product descriptions that highlight benefits and drive conversions.',
    icon: <FileText className="w-6 h-6 text-green-500" />,
    insights: [
      "Benefit-focused descriptions convert 23% better than feature-focused ones",
      "Including social proof boosts conversion rates by 15%",
      "Clear, scannable formatting improves engagement"
    ],
    implemented: true
  },
  {
    id: 'social',
    title: 'Social Posts',
    description: 'Create engaging social media content that drives engagement and builds your audience.',
    icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
    insights: [
      "LinkedIn posts with 1-2 hashtags get 50% more engagement",
      "Posts with questions receive twice as many comments",
      "Share industry insights to establish thought leadership"
    ],
    implemented: true
  },
  {
    id: 'video-script',
    title: 'Video Script',
    description: 'Create compelling video scripts that engage viewers and deliver your message effectively.',
    icon: <Video className="w-6 h-6 text-yellow-600" />,
    insights: [
      "Videos with storytelling elements get 22% more engagement",
      "Keep explainer videos under 2 minutes for optimal retention",
      "Start with a hook in the first 8 seconds to reduce drop-off"
    ],
    implemented: true
  },
  {
    id: 'whitepaper',
    title: 'Whitepaper',
    description: 'Create authoritative whitepapers that position your brand as an industry leader.',
    icon: <PenTool className="w-6 h-6 text-teal-600" />,
    insights: [
      "Whitepapers with original research generate 4x more leads",
      "Whitepapers of 6-8 pages have the highest completion rates",
      "Including executive summaries increases shareability by 23%"
    ],
    implemented: true
  }
];