// src/utils/StyleGuides.tsx
import React from 'react';
import { WritingStyleData } from '../types/WritingStyle';

interface StyleGuideRules {
  formatting: Partial<WritingStyleData['formatting']>;
  punctuation: Partial<WritingStyleData['punctuation']>;
}

export const STYLE_GUIDE_RULES: Record<string, StyleGuideRules> = {
  'AP Style': {
    formatting: {
      headings: 'Sentence case',
      numbers: 'Spell out numbers under 10',
      dates: 'Month DD, YYYY',
    },
    punctuation: {
      oxfordComma: false,
      bulletPoints: 'No punctuation',
      quotes: 'Double quotes',
    },
  },
  'Chicago Manual of Style': {
    formatting: {
      headings: 'Title Case',
      numbers: 'Spell out numbers under 100',
      dates: 'Month DD, YYYY',
    },
    punctuation: {
      oxfordComma: true,
      bulletPoints: 'Period if complete sentence',
      quotes: 'Double quotes',
    },
  },
  'APA Style': {
    formatting: {
      headings: 'Title Case',
      numbers: 'Always use numerals',
      dates: 'YYYY-MM-DD',
    },
    punctuation: {
      oxfordComma: true,
      bulletPoints: 'Period if complete sentence',
      quotes: 'Double quotes',
    },
  },
  'MLA Style': {
    formatting: {
      headings: 'Title Case',
      numbers: 'Spell out numbers under 100',
      dates: 'DD Month YYYY',
    },
    punctuation: {
      oxfordComma: true,
      bulletPoints: 'No punctuation',
      quotes: 'Double quotes',
    },
  },
};

export const getStyleGuideRules = (styleName: string): StyleGuideRules | null => {
  return STYLE_GUIDE_RULES[styleName] || null;
};

export const checkStyleGuideOverrides = (
  currentSettings: WritingStyleData,
  styleName: string
): boolean => {
  const guideRules = getStyleGuideRules(styleName);
  if (!guideRules) return true;

  // Check formatting rules
  for (const [key, value] of Object.entries(guideRules.formatting)) {
    if (currentSettings.formatting[key as keyof WritingStyleData['formatting']] !== value) {
      return true;
    }
  }

  // Check punctuation rules
  for (const [key, value] of Object.entries(guideRules.punctuation)) {
    if (currentSettings.punctuation[key as keyof WritingStyleData['punctuation']] !== value) {
      return true;
    }
  }

  return false;
};

export const StyleGuideTooltip: React.FC<{ guideName: string }> = ({ guideName }) => {
  const tooltipContent = {
    'AP Style': 'Associated Press style guide, commonly used in journalism',
    'Chicago Manual of Style': 'Comprehensive style guide for American English',
    'APA Style': 'Academic writing style by American Psychological Association',
    'MLA Style': 'Modern Language Association style, often used in humanities',
  }[guideName] || 'Custom style guide settings';

  return <span className="text-sm text-gray-500">{tooltipContent}</span>;
};