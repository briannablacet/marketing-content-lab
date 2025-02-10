// src/data/contentTypesData.js
export const CONTENT_TYPES = {
  'Thought Leadership': {
    description: 'Build authority through valuable content',
    activities: ['Industry Insights', 'How-to Guides', 'Thought Leadership'],
    aiSupport: ['Topic Research', 'Outline Generation', 'SEO Optimization'],
    specifications: {
      wordCount: '1000-2000 words',
      structure: [
        'Executive Summary',
        'Industry Context',
        'Key Insights',
        'Supporting Data',
        'Actionable Takeaways',
        'Future Implications'
      ],
      bestPractices: [
        'Include original insights',
        'Support claims with data',
        'Offer actionable recommendations',
        'Incorporate industry trends'
      ],
      seoConsiderations: [
        'Target 1-2 primary keywords',
        'Include industry-specific terms',
        'Optimize headers and meta description'
      ]
    }
  },
  'Case Studies': {
    description: 'Showcase customer success stories',
    activities: ['Customer Wins', 'Implementation Stories', 'ROI Analysis'],
    aiSupport: ['Structure Templates', 'ROI Calculation', 'Story Arc'],
    specifications: {
      wordCount: '800-1500 words',
      structure: [
        'Challenge Overview',
        'Solution Implementation',
        'Results and ROI',
        'Customer Testimonial',
        'Next Steps'
      ],
      bestPractices: [
        'Use specific metrics',
        'Include customer quotes',
        'Detail the implementation process',
        'Highlight tangible outcomes'
      ]
    }
  },
  'Influencer Content': {
    description: 'Leverage industry thought leaders',
    activities: ['Collaborations', 'Guest Posts', 'Joint Webinars'],
    aiSupport: ['Influencer Matching', 'Campaign Ideas', 'ROI Tracking'],
    specifications: {
      wordCount: 'Varies by format',
      structure: [
        'Expert Bio',
        'Topic Introduction',
        'Expert Insights',
        'Practical Applications',
        'Collaborative Conclusion'
      ],
      bestPractices: [
        'Align with influencer expertise',
        'Maintain authentic voice',
        'Include collaborative elements',
        'Cross-promote effectively'
      ]
    }
  },
  'Social Media': {
    description: 'Engage audience across platforms',
    activities: ['LinkedIn Posts', 'Twitter Content', 'Community Management'],
    aiSupport: ['Post Ideas', 'Hashtag Research', 'Engagement Analysis'],
    specifications: {
      wordCount: 'Platform dependent',
      structure: [
        'Hook/Attention Grabber',
        'Core Message',
        'Call to Action'
      ],
      bestPractices: [
        'Platform-specific formatting',
        'Engaging visuals',
        'Consistent brand voice',
        'Strategic hashtag use'
      ],
      mediaGuidelines: [
        'Image dimensions by platform',
        'Video length recommendations',
        'Accessibility considerations'
      ]
    }
  },
  'Lead Magnets': {
    description: 'Generate qualified leads',
    activities: ['Ebooks', 'Templates', 'Toolkits'],
    aiSupport: ['Topic Selection', 'Content Structure', 'CTA Optimization'],
    specifications: {
      wordCount: '2000-5000 words (ebooks)',
      structure: [
        'Value Proposition',
        'Core Content',
        'Actionable Resources',
        'Next Steps'
      ],
      bestPractices: [
        'Focus on practical value',
        'Include downloadable resources',
        'Clear value proposition',
        'Strong call-to-action'
      ]
    }
  },
  'Email Campaigns': {
    description: 'Nurture and convert prospects',
    activities: ['Newsletters', 'Drip Campaigns', 'Announcements'],
    aiSupport: ['Subject Lines', 'Email Flow', 'Segmentation'],
    specifications: {
      wordCount: '200-500 words per email',
      structure: [
        'Compelling Subject Line',
        'Personal Greeting',
        'Value-Driven Content',
        'Clear CTA'
      ],
      bestPractices: [
        'Personalization elements',
        'Mobile-friendly format',
        'A/B test subjects',
        'Segment audience effectively'
      ]
    }
  }
};