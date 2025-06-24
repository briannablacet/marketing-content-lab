// src/context/WritingStyleContext.tsx
// FIXED: Properly loads saved writing style data from localStorage on mount
// ADDED: Debug logging to track when context resets

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StyleGuide {
  primary: string;
  customRules: string[];
  completed?: boolean;
}

interface FormattingRules {
  headingCase?: string;
  numberFormat?: string;
  dateFormat?: string;
  listStyle?: string;
}

interface PunctuationRules {
  oxfordComma?: boolean;
  quotationMarks?: string;
  hyphenation?: string;
}

interface WritingStyle {
  styleGuide: StyleGuide;
  formatting: FormattingRules;
  punctuation: PunctuationRules;
  completed?: boolean;
}

interface WritingStyleContextType {
  writingStyle: WritingStyle;
  setWritingStyle: (style: WritingStyle) => void;
  updateStyleGuide: (guide: Partial<StyleGuide>) => void;
  updateFormatting: (formatting: Partial<FormattingRules>) => void;
  updatePunctuation: (punctuation: Partial<PunctuationRules>) => void;
  saveWritingStyle: (style: WritingStyle) => void;
  loadWritingStyle: () => WritingStyle;
  isStyleConfigured: boolean;
  resetWritingStyle: () => void;
  isLoaded: boolean;
}

const WritingStyleContext = createContext<WritingStyleContextType | undefined>(undefined);

export const WritingStyleProvider = ({ children }: { children: ReactNode }) => {
  const defaultStyle: WritingStyle = {
    styleGuide: {
      primary: 'Chicago Manual of Style',
      customRules: [],
      completed: false,
    },
    formatting: {
      headingCase: 'title',
      numberFormat: 'mixed',
      dateFormat: 'american',
      listStyle: 'bullets',
    },
    punctuation: {
      oxfordComma: true,
      quotationMarks: 'double',
      hyphenation: 'standard',
    },
    completed: false,
  };

  const [writingStyle, setWritingStyle] = useState<WritingStyle>(defaultStyle);
  const [isLoaded, setIsLoaded] = useState(false);

  // Only run on client
  useEffect(() => {
    // Prevent SSR mismatch: only run on client
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('marketing-content-lab-writing-style');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.styleGuide && parsed.formatting) {
          setWritingStyle(parsed);
        }
      } catch (e) {
        // Ignore parse errors, fallback to default
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when writingStyle changes and isLoaded
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(writingStyle));
    }
  }, [writingStyle, isLoaded]);

  // Only provide context after loading is complete
  if (!isLoaded) {
    return null;
  }

  const isStyleConfigured = isLoaded && writingStyle?.completed === true;

  const updateStyleGuide = (updates: Partial<StyleGuide>) => {
    setWritingStyle(prev => ({
      ...prev,
      styleGuide: { ...prev.styleGuide, ...updates }
    }));
  };

  const updateFormatting = (updates: Partial<FormattingRules>) => {
    setWritingStyle(prev => ({
      ...prev,
      formatting: { ...prev.formatting, ...updates }
    }));
  };

  const updatePunctuation = (updates: Partial<PunctuationRules>) => {
    setWritingStyle(prev => ({
      ...prev,
      punctuation: { ...prev.punctuation, ...updates }
    }));
  };

  const saveWritingStyle = (style: WritingStyle) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(style));
    }
    setWritingStyle(style);
  };

  const loadWritingStyle = () => {
    if (typeof window === 'undefined') return defaultStyle;

    try {
      const saved = localStorage.getItem('marketing-content-lab-writing-style');
      return saved ? JSON.parse(saved) : defaultStyle;
    } catch (error) {
      console.error('Error loading writing style:', error);
      return defaultStyle;
    }
  };

  const resetWritingStyle = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('marketing-content-lab-writing-style');
    }
    setWritingStyle(defaultStyle);
  };

  const value: WritingStyleContextType = {
    writingStyle,
    setWritingStyle,
    updateStyleGuide,
    updateFormatting,
    updatePunctuation,
    saveWritingStyle,
    loadWritingStyle,
    isStyleConfigured,
    resetWritingStyle,
    isLoaded,
  };

  return (
    <WritingStyleContext.Provider value={value}>
      {children}
    </WritingStyleContext.Provider>
  );
};

export const useWritingStyle = () => {
  const context = useContext(WritingStyleContext);
  if (context === undefined) {
    throw new Error('useWritingStyle must be used within a WritingStyleProvider');
  }
  return context;
};