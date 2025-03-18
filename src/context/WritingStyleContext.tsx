// src/context/WritingStyleContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of the writing style data
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

// Define the shape of the context
interface WritingStyleContextType {
  writingStyle: WritingStyleData;
  updateWritingStyle: (updates: Partial<WritingStyleData>) => void;
  applyStyleGuideRules: (styleName: string) => void;
  resetToDefaultStyle: () => void;
  isStyleConfigured: boolean;
  exportStyleSettings: () => string;
  importStyleSettings: (jsonData: string) => boolean;
  loading: boolean;
  error: string | null;
}

// Create the context
const WritingStyleContext = createContext<WritingStyleContextType | undefined>(undefined);

// Local storage key for persisting style preferences
const STORAGE_KEY = 'marketing-content-lab-writing-style';

// Helper function to safely parse JSON from localStorage
const getSavedStyleData = (): WritingStyleData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading writing style from localStorage:', error);
  }
  return null;
};

// Helper function to safely save data to localStorage
const saveStyleData = (data: WritingStyleData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving writing style to localStorage:', error);
  }
};

// Provider component
export const WritingStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [writingStyle, setWritingStyle] = useState<WritingStyleData>(DEFAULT_WRITING_STYLE);

  // Load saved data on initial mount
  useEffect(() => {
    try {
      const savedData = getSavedStyleData();
      if (savedData) {
        setWritingStyle(savedData);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load saved writing style settings');
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever writing style changes
  useEffect(() => {
    if (!loading) {  // Don't save during initial loading
      saveStyleData(writingStyle);
    }
  }, [writingStyle, loading]);

  // Determine if style has been actively configured by the user
  const isStyleConfigured = Boolean(
    writingStyle.styleGuide.primary && 
    writingStyle.styleGuide.primary !== ''
  );

  // Update writing style with partial data
  const updateWritingStyle = (updates: Partial<WritingStyleData>) => {
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
  };

  // Apply rules from a predefined style guide
  const applyStyleGuideRules = (styleName: string) => {
    // This would typically fetch rules from a style guide definition
    // For now we'll use a simplified approach
    setWritingStyle(prevStyle => ({
      ...prevStyle,
      styleGuide: {
        ...prevStyle.styleGuide,
        primary: styleName,
        overrides: false
      },
      // Add logic to set specific formatting and punctuation based on style
    }));
  };

  // Reset to default Chicago style
  const resetToDefaultStyle = () => {
    setWritingStyle(DEFAULT_WRITING_STYLE);
  };

  // Export settings as JSON string
  const exportStyleSettings = (): string => {
    return JSON.stringify(writingStyle, null, 2);
  };

  // Import settings from JSON string
  const importStyleSettings = (jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData) as WritingStyleData;
      // Validate the data structure (basic check)
      if (!parsedData.styleGuide || !parsedData.formatting || !parsedData.punctuation) {
        throw new Error('Invalid writing style data format');
      }
      setWritingStyle(parsedData);
      return true;
    } catch (err) {
      setError(`Failed to import settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  // Provide context value
  const value: WritingStyleContextType = {
    writingStyle,
    updateWritingStyle,
    applyStyleGuideRules,
    resetToDefaultStyle,
    isStyleConfigured,
    exportStyleSettings,
    importStyleSettings,
    loading,
    error
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