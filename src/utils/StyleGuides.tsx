// src/utils/StyleGuides.tsx
// Utility functions for applying writing styles consistently across components

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

export interface WritingStyle {
  styleGuide?: {
    primary?: string;
    customRules?: string[];
  };
  formatting?: {
    headingCase?: 'upper' | 'lower' | 'sentence' | 'title';
    numberFormat?: 'numerals' | 'words' | 'mixed';
    dateFormat?: 'american' | 'international' | 'iso';
    listStyle?: 'bullets' | 'numbers';
  };
  punctuation?: {
    oxfordComma?: boolean;
    quotationMarks?: 'double' | 'single';
    bulletPoints?: string;
    hyphenation?: string;
  };
  terminology?: {
    preferredTerms?: Record<string, string>;
    avoidedTerms?: string[];
  };
}

/**
 * Apply heading case formatting based on writing style
 */
export const applyHeadingCase = (text: string, headingCase?: string): string => {
  if (!text || !headingCase) return text;

  switch (headingCase) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'title':
    default:
      return text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  }
};

/**
 * Apply number formatting based on writing style
 */
export const applyNumberFormat = (text: string, numberFormat?: string): string => {
  if (!text || !numberFormat) return text;

  switch (numberFormat) {
    case 'numerals':
      // Convert spelled out numbers to numerals
      const numberMap: Record<string, string> = {
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
        'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
        'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
        'eighteen': '18', 'nineteen': '19', 'twenty': '20'
      };
      
      let formattedText = text;
      Object.entries(numberMap).forEach(([word, numeral]) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        formattedText = formattedText.replace(regex, numeral);
      });
      return formattedText;
      
    case 'words':
      // Convert numerals to spelled out words (for numbers under 10)
      return text.replace(/\b([0-9])\b/g, (match) => {
        const num = parseInt(match);
        if (num < 10) {
          const wordMap: Record<number, string> = {
            0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
            5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'
          };
          return wordMap[num] || match;
        }
        return match;
      });
      
    case 'mixed':
    default:
      return text; // Keep as is
  }
};

/**
 * Apply punctuation rules based on writing style
 */
export const applyPunctuationRules = (text: string, punctuation?: any): string => {
  if (!text || !punctuation) return text;

  let formattedText = text;

  // Apply Oxford comma rules
  if (punctuation.oxfordComma !== undefined) {
    if (punctuation.oxfordComma) {
      // Add Oxford comma where missing
      formattedText = formattedText.replace(/(\w+), (\w+) and (\w+)/g, '$1, $2, and $3');
    } else {
      // Remove Oxford comma
      formattedText = formattedText.replace(/(\w+), (\w+), and (\w+)/g, '$1, $2 and $3');
    }
  }

  // Apply quotation mark rules
  if (punctuation.quotationMarks) {
    if (punctuation.quotationMarks === 'single') {
      // Convert double quotes to single quotes
      formattedText = formattedText.replace(/"/g, "'");
    } else if (punctuation.quotationMarks === 'double') {
      // Convert single quotes to double quotes (for actual quotes, not apostrophes)
      formattedText = formattedText.replace(/(?<=\s)'([^']+)'(?=\s|$)/g, '"$1"');
    }
  }

  return formattedText;
};

/**
 * Apply terminology preferences based on writing style
 */
export const applyTerminologyRules = (text: string, terminology?: any): string => {
  if (!text || !terminology) return text;

  let formattedText = text;

  // Apply preferred terms
  if (terminology.preferredTerms) {
    Object.entries(terminology.preferredTerms).forEach(([term, replacement]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      formattedText = formattedText.replace(regex, replacement);
    });
  }

  // Apply avoided terms (replace with alternatives or flag)
  if (terminology.avoidedTerms) {
    terminology.avoidedTerms.forEach((term: string) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      // For now, just highlight avoided terms - could be enhanced to suggest alternatives
      formattedText = formattedText.replace(regex, `[AVOID: ${term}]`);
    });
  }

  return formattedText;
};

/**
 * Apply all writing style rules to content
 */
export const applyWritingStyle = (content: string, writingStyle?: WritingStyle): string => {
  if (!content || !writingStyle) return content;

  let formattedContent = content;

  // Apply heading case formatting to markdown headings
  if (writingStyle.formatting?.headingCase) {
    formattedContent = formattedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
      const formattedTitle = applyHeadingCase(title, writingStyle.formatting?.headingCase);
      return `${hashes} ${formattedTitle}`;
    });
  }

  // Apply number formatting
  if (writingStyle.formatting?.numberFormat) {
    formattedContent = applyNumberFormat(formattedContent, writingStyle.formatting.numberFormat);
  }

  // Apply punctuation rules
  if (writingStyle.punctuation) {
    formattedContent = applyPunctuationRules(formattedContent, writingStyle.punctuation);
  }

  // Apply terminology rules
  if (writingStyle.terminology) {
    formattedContent = applyTerminologyRules(formattedContent, writingStyle.terminology);
  }

  return formattedContent;
};

/**
 * Parse markdown content and apply writing style formatting
 */
export const parseMarkdownWithStyle = (markdown: string, writingStyle?: WritingStyle) => {
  if (!markdown) return { title: "", introduction: "", sections: [] };

  const lines = markdown.split("\n");
  let title = "";
  let introduction = "";
  const sections: Array<{ title: string; content: string }> = [];
  let currentSection = { title: "", content: "" };
  let inIntro = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("# ") && !title) {
      title = applyHeadingCase(line.substring(2).trim(), writingStyle?.formatting?.headingCase);
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("### ")) {
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      const headingText = line.replace(/^##+\s*/, "");
      currentSection = {
        title: applyHeadingCase(headingText.trim(), writingStyle?.formatting?.headingCase),
        content: "",
      };
      inIntro = false;
      continue;
    }

    if (inIntro) {
      introduction += line + "\n";
    } else {
      currentSection.content += line + "\n";
    }
  }

  if (currentSection.title) {
    sections.push(currentSection);
  }

  return { title, introduction: introduction.trim(), sections };
};

/**
 * Get style guide summary for display
 */
export const getStyleGuideSummary = (writingStyle?: WritingStyle): string => {
  if (!writingStyle) return "No style guide configured";

  const parts = [];

  if (writingStyle.styleGuide?.primary) {
    parts.push(`Style: ${writingStyle.styleGuide.primary}`);
  }

  if (writingStyle.formatting?.headingCase) {
    const headingCaseMap: Record<string, string> = {
      'upper': 'ALL CAPS',
      'lower': 'lowercase',
      'sentence': 'Sentence case',
      'title': 'Title Case'
    };
    parts.push(`Headings: ${headingCaseMap[writingStyle.formatting.headingCase] || writingStyle.formatting.headingCase}`);
  }

  if (writingStyle.formatting?.numberFormat) {
    const numberFormatMap: Record<string, string> = {
      'numerals': 'Always numerals',
      'words': 'Spell out under 10',
      'mixed': 'Mixed format'
    };
    parts.push(`Numbers: ${numberFormatMap[writingStyle.formatting.numberFormat] || writingStyle.formatting.numberFormat}`);
  }

  if (writingStyle.punctuation?.oxfordComma !== undefined) {
    parts.push(`Oxford comma: ${writingStyle.punctuation.oxfordComma ? 'Yes' : 'No'}`);
  }

  return parts.join(", ");
};