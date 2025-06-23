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
  saveWritingStyle: () => void;
  loadWritingStyle: () => void;
  isStyleConfigured: boolean;
  resetWritingStyle: () => void;
}

// Default writing style - fallback when nothing is saved
const defaultWritingStyle: WritingStyle = {
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

const WritingStyleContext = createContext<WritingStyleContextType | undefined>(undefined);

export const WritingStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [writingStyle, setWritingStyle] = useState<WritingStyle>(defaultWritingStyle);
  const [isLoaded, setIsLoaded] = useState(false);

  // FIXED: Load writing style from localStorage on mount
  useEffect(() => {
    console.log('🔄 WritingStyleContext: Loading from localStorage...');
    loadWritingStyle();
  }, []);

  // Load writing style from localStorage
  const loadWritingStyle = () => {
    console.log('🔄 LoadWritingStyle called!');
    try {
      const saved = localStorage.getItem('marketing-content-lab-writing-style');
      console.log('📦 Raw localStorage in loadWritingStyle:', saved);

      if (saved) {
        console.log('🔍 Found saved data, parsing...');
        const parsedStyle = JSON.parse(saved);
        console.log('🔍 Parsed data before merging:', parsedStyle);

        console.log('✅ Loading saved style in loadWritingStyle:', parsedStyle);

        // Merge with defaults to ensure all properties exist
        const mergedStyle: WritingStyle = {
          styleGuide: {
            ...defaultWritingStyle.styleGuide,
            ...parsedStyle.styleGuide,
          },
          formatting: {
            ...defaultWritingStyle.formatting,
            ...parsedStyle.formatting,
          },
          punctuation: {
            ...defaultWritingStyle.punctuation,
            ...parsedStyle.punctuation,
          },
          completed: parsedStyle.completed || false,
        };

        console.log('✅ Merged writing style:', mergedStyle);
        setWritingStyle(mergedStyle);
      } else {
        console.log('❌ No saved writing style, using defaults');
        setWritingStyle(defaultWritingStyle);
      }
    } catch (error) {
      console.error('❌ Error loading writing style:', error);
      setWritingStyle(defaultWritingStyle);
    } finally {
      setIsLoaded(true);
      console.log('✅ WritingStyleContext: Loading complete');
    }
  };

  // Save writing style to localStorage
  const saveWritingStyle = () => {
    try {
      const styleToSave = {
        ...writingStyle,
        completed: true, // Mark as completed when saving
      };
      localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(styleToSave));
      console.log('💾 Writing style saved:', styleToSave);
      setWritingStyle(styleToSave);
    } catch (error) {
      console.error('❌ Error saving writing style:', error);
    }
  };

  // Update style guide
  const updateStyleGuide = (guide: Partial<StyleGuide>) => {
    setWritingStyle(prev => ({
      ...prev,
      styleGuide: {
        ...prev.styleGuide,
        ...guide,
      },
    }));
  };

  // Update formatting rules
  const updateFormatting = (formatting: Partial<FormattingRules>) => {
    setWritingStyle(prev => ({
      ...prev,
      formatting: {
        ...prev.formatting,
        ...formatting,
      },
    }));
  };

  // Update punctuation rules
  const updatePunctuation = (punctuation: Partial<PunctuationRules>) => {
    setWritingStyle(prev => ({
      ...prev,
      punctuation: {
        ...prev.punctuation,
        ...punctuation,
      },
    }));
  };

  // Reset to defaults
  const resetWritingStyle = () => {
    setWritingStyle(defaultWritingStyle);
    localStorage.removeItem('marketing-content-lab-writing-style');
    console.log('🔄 Writing style reset to defaults');
  };

  // Check if style is configured (not using defaults)
  const isStyleConfigured = isLoaded && (
    writingStyle.completed === true ||
    writingStyle.styleGuide.primary !== 'Chicago Manual of Style' ||
    writingStyle.formatting.headingCase !== 'title' ||
    Object.keys(writingStyle.styleGuide.customRules || []).length > 0
  );

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

  // Don't render children until we've loaded the data
  if (!isLoaded) {
    console.log('⏳ WritingStyleContext: Still loading...');
    return <div>Loading writing style...</div>;
  }

  console.log('🎯 WritingStyleContext: Providing context with style:', writingStyle);
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