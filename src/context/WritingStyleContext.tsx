//src/context/WritingStyleContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStyleGuideRules, STYLE_GUIDE_RULES } from '../utils/StyleGuides';

// Define types for the writing style data
export interface WritingStyleData {
  styleGuide: {
    primary: string;
    overrides?: boolean;
    uploadedGuide?: string;
    customRules?: string[];
  };
  formatting: {
    headings?: string;
    headingCustom?: string;
    numbers?: string;
    dates?: string;
    lists?: string[];
  };
  punctuation: {
    oxfordComma?: boolean;
    bulletPoints?: string;
    quotes?: string;
    ellipsis?: string;
  };
  terminology?: {
    preferredTerms?: Record<string, string>;
    avoidedTerms?: string[];
  };
}

// Default writing style using Chicago Manual of Style
const DEFAULT_WRITING_STYLE: WritingStyleData = {
  styleGuide: {
    primary: 'Chicago Manual of Style',
    overrides: false
  },
  formatting: {
    headings: 'Title Case',
    numbers: 'Spell out numbers under 100',
    dates: 'Month DD, YYYY'
  },
  punctuation: {
    oxfordComma: true,
    bulletPoints: 'Period if complete sentence',
    quotes: 'Double quotes'
  },
  terminology: {
    preferredTerms: {},
    avoidedTerms: []
  }
};

// Create the context
interface WritingStyleContextType {
  writingStyle: WritingStyleData;
  updateWritingStyle: (updates: Partial<WritingStyleData>) => void;
  applyStyleGuideRules: (styleName: string) => void;
  resetToDefaultStyle: () => void;
  isStyleConfigured: boolean;
  saveStyleToStorage: () => void; // Added explicit save method
}

const WritingStyleContext = createContext<WritingStyleContextType | undefined>(undefined);

// Local storage key for persisting style preferences
const STORAGE_KEY = 'marketing-content-lab-writing-style';

export const WritingStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from local storage or default
  const [writingStyle, setWritingStyle] = useState<WritingStyleData>(() => {
    if (typeof window !== 'undefined') {
      const savedStyle = localStorage.getItem(STORAGE_KEY);
      if (savedStyle) {
        try {
          return JSON.parse(savedStyle);
        } catch (error) {
          console.error('Error parsing saved writing style:', error);
        }
      }
    }
    return DEFAULT_WRITING_STYLE;
  });

  // Determine if style has been actively configured by the user
  const isStyleConfigured = Boolean(
    writingStyle.styleGuide.primary &&
    writingStyle.styleGuide.primary !== ''
  );

  // Update writing style with partial data
  const updateWritingStyle = useCallback((updates: Partial<WritingStyleData>) => {
    setWritingStyle(prevStyle => {
      // Deep merge the updates with the previous state
      const newStyle = {
        ...prevStyle,
        ...updates,
        styleGuide: {
          ...prevStyle.styleGuide,
          ...(updates.styleGuide || {})
        },
        formatting: {
          ...prevStyle.formatting,
          ...(updates.formatting || {})
        },
        punctuation: {
          ...prevStyle.punctuation,
          ...(updates.punctuation || {})
        },
        terminology: {
          ...prevStyle.terminology,
          ...(updates.terminology || {})
        }
      };

      return newStyle;
    });
  }, []);

  // Apply rules from a predefined style guide
  const applyStyleGuideRules = useCallback((styleName: string) => {
    const guideRules = getStyleGuideRules(styleName);
    if (!guideRules) return;

    setWritingStyle(prevStyle => ({
      ...prevStyle,
      styleGuide: {
        ...prevStyle.styleGuide,
        primary: styleName,
        overrides: false
      },
      formatting: {
        ...prevStyle.formatting,
        ...guideRules.formatting
      },
      punctuation: {
        ...prevStyle.punctuation,
        ...guideRules.punctuation
      }
    }));
  }, []);

  // Reset to default Chicago style
  const resetToDefaultStyle = useCallback(() => {
    setWritingStyle(DEFAULT_WRITING_STYLE);
  }, []);

  // Explicit method to save style to local storage
  const saveStyleToStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(writingStyle));
    }
  }, []);

  // Save to local storage whenever the state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(writingStyle));
    }
  }, [writingStyle]);

  // Provide context value
  const value: WritingStyleContextType = {
    writingStyle,
    updateWritingStyle,
    applyStyleGuideRules,
    resetToDefaultStyle,
    isStyleConfigured,
    saveStyleToStorage
  };

  return (
    <WritingStyleContext.Provider value={value}>
      {children}
    </WritingStyleContext.Provider>
  );
};

// Custom hook for using the writing style context
export const useWritingStyle = (): WritingStyleContextType => {
  const context = useContext(WritingStyleContext);
  if (context === undefined) {
    throw new Error('useWritingStyle must be used within a WritingStyleProvider');
  }
  return context;
};