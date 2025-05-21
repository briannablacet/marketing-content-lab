// src/data/templates.ts
export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Content Creation' | 'Content Strategy' | 'Content Optimization' | 'SEO Optimization';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  creator: string;
  templateContent: {
    sections: Array<{
      title: string;
      description?: string;
      fields: Array<{
        type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
        label: string;
        placeholder?: string;
        required?: boolean;
        options?: string[];
      }>;
    }>;
  };
}

export const templates: Template[] = [
  {
    id: 'write-blog-post',
    title: 'Write SEO-Optimized Blog Post',
    description: 'Create engaging, keyword-rich blog posts that drive traffic',
    category: 'Content Creation',
    difficulty: 'Intermediate',
    creator: 'Marketing Content Lab',
    templateContent: {
      sections: [
        {
          title: 'Blog Post Basics',
          description: 'Define the core elements of your blog post',
          fields: [
            {
              type: 'text',
              label: 'Post Title',
              placeholder: 'Enter an attention-grabbing title',
              required: true
            },
            {
              type: 'select',
              label: 'Content Type',
              options: ['How-to Guide', 'List Post', 'Case Study', 'Opinion Piece', 'Industry News'],
              required: true
            },
            {
              type: 'text',
              label: 'Primary Keyword',
              placeholder: 'What is the main keyword to target?',
              required: true
            },
            {
              type: 'multiselect',
              label: 'Secondary Keywords',
              options: [],
              placeholder: 'Add secondary keywords'
            }
          ]
        },
        {
          title: 'Content Structure',
          description: 'Plan your blog post structure',
          fields: [
            {
              type: 'textarea',
              label: 'Introduction',
              placeholder: 'How will you hook the reader?',
              required: true
            },
            {
              type: 'textarea',
              label: 'Main Points',
              placeholder: 'List the main sections/points of your article',
              required: true
            },
            {
              type: 'textarea',
              label: 'Conclusion',
              placeholder: 'How will you summarize and include a call to action?',
              required: true
            }
          ]
        }
      ]
    }
  },
  {
    id: 'social-media-campaign',
    title: 'Social Media Campaign Bundle',
    description: 'Create a cohesive set of social posts across platforms',
    category: 'Content Creation',
    difficulty: 'Beginner',
    creator: 'Marketing Content Lab',
    templateContent: {
      sections: [
        {
          title: 'Campaign Basics',
          fields: [
            {
              type: 'text',
              label: 'Campaign Name',
              required: true
            },
            {
              type: 'textarea',
              label: 'Campaign Goal',
              required: true
            },
            {
              type: 'multiselect',
              label: 'Target Platforms',
              options: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Pinterest'],
              required: true
            }
          ]
        },
        {
          title: 'Content Plan',
          fields: [
            {
              type: 'textarea',
              label: 'Key Message',
              required: true
            },
            {
              type: 'textarea',
              label: 'Post Ideas (One per line)',
              required: true
            },
            {
              type: 'text',
              label: 'Hashtags',
              placeholder: 'Separate with commas'
            }
          ]
        }
      ]
    }
  },
  
  {
    id: 'email-newsletter',
    title: 'Email Newsletter Template',
    description: 'Design compelling email newsletters that convert',
    category: 'Content Creation',
    difficulty: 'Intermediate',
    creator: 'Marketing Content Lab',
    templateContent: {
      sections: [
        {
          title: 'Newsletter Basics',
          fields: [
            {
              type: 'text',
              label: 'Subject Line',
              required: true
            },
            {
              type: 'text',
              label: 'Preview Text',
              required: true
            },
            {
              type: 'select',
              label: 'Newsletter Type',
              options: ['Product Update', 'Educational Content', 'Industry News', 'Promotional'],
              required: true
            }
          ]
        },
        {
          title: 'Content Blocks',
          fields: [
            {
              type: 'textarea',
              label: 'Introduction',
              required: true
            },
            {
              type: 'textarea',
              label: 'Main Content Sections',
              required: true
            },
            {
              type: 'textarea',
              label: 'Call to Action',
              required: true
            }
          ]
        }
      ]
    }
  },
  
  {
    id: 'seo-content-audit',
    title: 'SEO Content Audit',
    description: 'Identify content gaps and optimization opportunities',
    category: 'SEO Optimization',
    difficulty: 'Advanced',
    creator: 'Marketing Content Lab',
    templateContent: {
      sections: [
        {
          title: 'Audit Setup',
          fields: [
            {
              type: 'text',
              label: 'Website URL',
              required: true
            },
            {
              type: 'multiselect',
              label: 'Focus Areas',
              options: ['Technical SEO', 'On-Page SEO', 'Content Quality', 'Keyword Gaps', 'Backlink Profile'],
              required: true
            }
          ]
        },
        {
          title: 'Competitor Analysis',
          fields: [
            {
              type: 'textarea',
              label: 'Top Competitors (One per line)',
              required: true
            },
            {
              type: 'textarea',
              label: 'Key Analysis Areas',
              required: true
            }
          ]
        }
      ]
    }
  },
  {
    id: 'case-study',
    title: 'Client Case Study Template',
    description: 'Create compelling case studies that showcase successful outcomes and attract new clients',
    category: 'Content Creation',
    difficulty: 'Intermediate',
    creator: 'Marketing Content Lab',
    templateContent: {
      sections: [
        {
          title: 'Case Study Overview',
          description: 'Define the basic information about this case study',
          fields: [
            {
              type: 'text',
              label: 'Client/Company Name',
              placeholder: 'Who is this case study about?',
              required: true
            },
            {
              type: 'text',
              label: 'Industry',
              placeholder: 'What industry is the client in?',
              required: true
            },
            {
              type: 'text',
              label: 'Case Study Title',
              placeholder: 'E.g., "How Company X Increased Conversions by 200%"',
              required: true
            },
            {
              type: 'select',
              label: 'Case Study Type',
              options: ['Success Story', 'Implementation Study', 'Problem-Solution', 'Transformation Story'],
              required: true
            }
          ]
        },
        {
          title: 'Client Background',
          description: 'Provide context about the client and their situation',
          fields: [
            {
              type: 'textarea',
              label: 'Client Background',
              placeholder: 'Brief description of the client, their business, and market position',
              required: true
            },
            {
              type: 'textarea',
              label: 'Client\'s Challenge',
              placeholder: 'What specific problems or challenges were they facing?',
              required: true
            },
            {
              type: 'textarea',
              label: 'Business Goals',
              placeholder: 'What were they trying to achieve?',
              required: true
            }
          ]
        },
        {
          title: 'Solution Details',
          description: 'Describe how you helped the client',
          fields: [
            {
              type: 'textarea',
              label: 'Solution Overview',
              placeholder: 'A high-level summary of the solution provided',
              required: true
            },
            {
              type: 'textarea',
              label: 'Implementation Process',
              placeholder: 'Key steps in implementing the solution (timeline, approach, etc.)',
              required: true
            },
            {
              type: 'textarea',
              label: 'Key Features/Services',
              placeholder: 'Specific aspects of your solution that addressed their challenges',
              required: true
            },
            {
              type: 'multiselect',
              label: 'Solution Categories',
              options: ['Strategy', 'Technology', 'Creative', 'Marketing', 'Training', 'Consulting', 'Implementation'],
              required: false
            }
          ]
        },
        {
          title: 'Results & Outcomes',
          description: 'Document the quantifiable results and benefits achieved',
          fields: [
            {
              type: 'textarea',
              label: 'Key Results',
              placeholder: 'The primary measurable outcomes (use specific numbers when possible)',
              required: true
            },
            {
              type: 'textarea',
              label: 'Additional Benefits',
              placeholder: 'Other positive outcomes, including unexpected benefits',
              required: false
            },
            {
              type: 'textarea',
              label: 'ROI/Business Impact',
              placeholder: 'Financial or business impact of the solution (e.g., "200% increase in lead generation")',
              required: true
            },
            {
              type: 'text',
              label: 'Timeframe',
              placeholder: 'How long did it take to achieve these results?',
              required: true
            }
          ]
        },
        {
          title: 'Supporting Elements',
          description: 'Add quotes, visuals, and other supporting material',
          fields: [
            {
              type: 'textarea',
              label: 'Client Testimonial',
              placeholder: 'A quote from the client about their experience and results',
              required: false
            },
            {
              type: 'textarea',
              label: 'Data Visualization Ideas',
              placeholder: 'What charts, graphs, or visuals would help tell this story?',
              required: false
            },
            {
              type: 'textarea',
              label: 'Team Members Involved',
              placeholder: 'Who from your team worked on this project?',
              required: false
            }
          ]
        },
        {
          title: 'Conclusion & CTA',
          description: 'Summarize the case study and include a compelling call to action',
          fields: [
            {
              type: 'textarea',
              label: 'Conclusion',
              placeholder: 'Summarize the key points and lessons learned',
              required: true
            },
            {
              type: 'textarea',
              label: 'Call to Action',
              placeholder: 'What should readers do after reading this case study?',
              required: true
            },
            {
              type: 'text',
              label: 'Related Services/Products',
              placeholder: 'What services or products does this case study promote?',
              required: false
            }
          ]
        }
      ]
    }
  }
];

// Helper functions to work with templates
export const getTemplatesByCategory = (category: Template['category']) => {
  return templates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(template => template.id === id);
};

export const getAllCategories = () => {
  return [...new Set(templates.map(template => template.category))];
};