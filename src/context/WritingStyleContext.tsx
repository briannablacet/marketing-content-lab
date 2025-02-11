// src/context/WritingStyleContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { WritingStyleData } from '../types/WritingStyle';
import { getStyleGuideRules } from '../utils/StyleGuides';

interface WritingStyleContextType {
  writingStyle: WritingStyleData;
  updateWritingStyle: (updates: Partial<WritingStyleData>) => void;
  applyStyleGuideRules: (styleName: string) => void;
}

const defaultWritingStyle: WritingStyleData = {
  styleGuide: {
    primary: '',
    overrides: false,
  },
  formatting: {
    headings: 'Sentence case',
    numbers: 'Spell out numbers under 10',
    dates: 'MM/DD/YYYY',
    lists: 'Bullet points',
  },
  punctuation: {
    oxfordComma: true,
    bulletPoints: 'No punctuation',
    quotes: 'Double quotes',
  },
};

const WritingStyleContext = createContext<WritingStyleContextType | undefined>(undefined);

export const WritingStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [writingStyle, setWritingStyle] = useState<WritingStyleData>(defaultWritingStyle);

  const updateWritingStyle = useCallback((updates: Partial<WritingStyleData>) => {
    setWritingStyle(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const applyStyleGuideRules = useCallback((styleName: string) => {
    const rules = getStyleGuideRules(styleName);
    if (rules) {
      setWritingStyle(prev => ({
        ...prev,
        styleGuide: {
          primary: styleName,
          overrides: false,
        },
        formatting: {
          ...prev.formatting,
          ...rules.formatting,
        },
        punctuation: {
          ...prev.punctuation,
          ...rules.punctuation,
        },
      }));
    }
  }, []);

  return (
    <WritingStyleContext.Provider 
      value={{ 
        writingStyle, 
        updateWritingStyle,
        applyStyleGuideRules,
      }}
    >
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