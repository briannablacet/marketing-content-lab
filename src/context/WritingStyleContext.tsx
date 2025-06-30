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

  useEffect(() => {
    const initializeWritingStyle = async () => {
      console.log('🚀 WritingStyleContext: Initializing...');

      // First try to load from localStorage
      const localData = loadWritingStyle();

      // If no local data or incomplete, try to fetch from backend
      if (!localData || !localData.completed) {
        try {
          console.log('📡 Fetching writing style from StrategicDataService...');
          const backendData = await StrategicDataService.getWritingStyle();

          if (backendData && backendData.completed) {
            console.log('✅ Found writing style in backend:', backendData);
            setWritingStyle(backendData);
            localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(backendData));
          } else {
            console.error('❌ No writing style found in localStorage OR backend');
            // Don't set anything - let it error
          }
        } catch (error) {
          console.error('❌ Error fetching writing style from backend:', error);
          // Don't set anything - let it error
        }
      } else {
        console.log('✅ Using local writing style');
        setWritingStyle(localData);
      }

      setIsLoaded(true);
    };

    initializeWritingStyle();
  }, []);
  // Save writing style 
  const saveWritingStyle = async () => {
    try {
      const styleToSave = {
        ...writingStyle,
        completed: true, // Mark as completed when saving
      };

      // Save to localStorage
      localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(styleToSave));
      console.log('💾 Writing style saved to localStorage:', styleToSave);

      // Save to backend StrategicDataService
      await StrategicDataService.setWritingStyle(styleToSave);
      console.log('📡 Writing style saved to backend');

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
    writingStyle.formatting.numberFormat !== 'mixed' ||
    writingStyle.punctuation.oxfordComma !== true ||
    Object.keys(writingStyle.styleGuide.customRules || []).length > 0
  );

  console.log('🔍 isStyleConfigured calculation:', {
    isLoaded,
    completed: writingStyle.completed,
    primary: writingStyle.styleGuide.primary,
    headingCase: writingStyle.formatting.headingCase,
    numberFormat: writingStyle.formatting.numberFormat,
    oxfordComma: writingStyle.punctuation.oxfordComma,
    customRulesLength: Object.keys(writingStyle.styleGuide.customRules || []).length,
    result: isStyleConfigured
  });

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