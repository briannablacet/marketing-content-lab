// src/context/WritingStyleContext.tsx
// FIXED: Eliminated infinite render loop by memoizing isStyleConfigured calculation

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import StrategicDataService from '../services/StrategicDataService';

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

// Load writing style from localStorage
const loadWritingStyle = () => {
  try {
    const saved = localStorage.getItem('marketing-content-lab-writing-style');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('📖 Loaded writing style from localStorage:', parsed);
      return parsed;
    }
    console.log('📖 No writing style found in localStorage');
    return null;
  } catch (error) {
    console.error('❌ Error loading writing style from localStorage:', error);
    return null;
  }
};

export const WritingStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [writingStyle, setWritingStyle] = useState<WritingStyle>(defaultWritingStyle);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeWritingStyle = async () => {
      console.log('🚀 WritingStyleContext: Initializing...');

      // Just use localStorage for now - no backend calls until dev approves
      const localData = loadWritingStyle();
      if (localData && localData.completed) {
        console.log('✅ Using saved writing style from localStorage');
        setWritingStyle(localData);
      } else {
        console.log('✅ Using default writing style (Chicago Manual of Style)');
        setWritingStyle(defaultWritingStyle);
      }

      setIsLoaded(true);
    };

    initializeWritingStyle();
  }, []); // Empty dependency array - only run once

  // Save writing style 
  const saveWritingStyle = async () => {
    try {
      const styleToSave = {
        ...writingStyle,
        completed: true, // Mark as completed when saving
      };

      // Just save to localStorage for now - no backend until dev approves
      localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(styleToSave));
      console.log('💾 Writing style saved to localStorage:', styleToSave);

      // CRITICAL: Update the state to trigger re-renders in all components
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

  // FIXED: Memoize isStyleConfigured to prevent recalculation on every render
  const isStyleConfigured = useMemo(() => {
    const result = isLoaded && (
      writingStyle.completed === true ||
      writingStyle.styleGuide.primary !== 'Chicago Manual of Style' ||
      writingStyle.formatting.headingCase !== 'title' ||
      writingStyle.formatting.numberFormat !== 'mixed' ||
      writingStyle.punctuation.oxfordComma !== true ||
      (writingStyle.styleGuide.customRules && writingStyle.styleGuide.customRules.length > 0)
    );

    // Only log when the result actually changes
    console.log('🔍 isStyleConfigured calculated:', {
      isLoaded,
      completed: writingStyle.completed,
      primary: writingStyle.styleGuide.primary,
      result
    });

    return result;
  }, [
    isLoaded,
    writingStyle.completed,
    writingStyle.styleGuide.primary,
    writingStyle.formatting.headingCase,
    writingStyle.formatting.numberFormat,
    writingStyle.punctuation.oxfordComma,
    writingStyle.styleGuide.customRules?.length
  ]);

  const value: WritingStyleContextType = useMemo(() => ({
    writingStyle,
    setWritingStyle,
    updateStyleGuide,
    updateFormatting,
    updatePunctuation,
    saveWritingStyle,
    loadWritingStyle,
    isStyleConfigured,
    resetWritingStyle,
  }), [
    writingStyle,
    isStyleConfigured
  ]);

  // Don't render children until we've loaded the data
  if (!isLoaded) {
    console.log('⏳ WritingStyleContext: Still loading...');
    return <div>Loading writing style...</div>;
  }

  console.log('🎯 WritingStyleContext: Providing context');
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