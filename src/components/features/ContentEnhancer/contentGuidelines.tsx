// src/components/features/ContentEnhancer/contentGuidelines.ts

import React from 'react';

export const CONTENT_GUIDELINES = {
    structure: {
      narrative: {
        required: true,
        principles: [
          'Maintain clear story flow',
          'Use natural transitions between ideas',
          'Build logical progression',
          'Connect paragraphs smoothly'
        ]
      },
      lists: {
        appropriate: [
          'Feature comparisons',
          'Technical specifications',
          'Quick reference items',
          'Step-by-step instructions'
        ],
        inappropriate: [
          'Main content body',
          'Conceptual explanations',
          'Topic introductions',
          'Complex ideas requiring context'
        ],
        maxListsPerSection: 2
      }
    },
    transitions: [
      'Building on this foundation',
      'This leads us to',
      'Understanding this concept',
      'Taking this further',
      'This reveals why',
      'Here's how this works'
    ]
  };
  
  export const validateContent = (content: string) => {
    const listCount = (content.match(/^[-*•]\s/gm) || []).length;
    const sections = content.split(/#{1,3}\s/);
    
    return {
      hasNarrativeFlow: sections.every(s => s.length > 100),
      listPercentage: listCount / content.length,
      needsRevision: listCount / content.length > 0.3
    };
  };
  
  export const enhanceContent = (content: string) => {
    // Content enhancement logic
    const enhanced = content
      .replace(/^[-*•]\s(.+)$/gm, (match, p1) => {
        // Convert inappropriate lists to narrative paragraphs
        return `${p1} fits into the broader picture by...`;
      })
      .replace(/\n\n[-*•]/g, '\n\nFurthermore, ');
  
    return enhanced;
  };