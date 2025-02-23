import React, { createContext, useState, useContext, ReactNode } from 'react';

interface StyleRule {
  name: string;
  pattern: string;
  suggestion?: string;
}

interface StyleGuide {
  id: string;
  name: string;
  rules: StyleRule[];
}

interface WritingStyleContextType {
  styleGuide: StyleGuide | null;
  styleRules: StyleRule[];
  setStyleGuide: (guide: StyleGuide) => void;
  updateRules: (rules: StyleRule[]) => void;
}

const defaultContext: WritingStyleContextType = {
  styleGuide: null,
  styleRules: [],
  setStyleGuide: () => {},
  updateRules: () => {}
};

export const WritingStyleContext = createContext<WritingStyleContextType>(defaultContext);

interface WritingStyleProviderProps {
  children: ReactNode;
}

export const WritingStyleProvider: React.FC<WritingStyleProviderProps> = ({ children }) => {
  const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null);
  const [styleRules, setStyleRules] = useState<StyleRule[]>([]);

  const updateRules = (rules: StyleRule[]) => {
    setStyleRules(rules);
  };

  return (
    <WritingStyleContext.Provider 
      value={{
        styleGuide,
        styleRules,
        setStyleGuide,
        updateRules
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