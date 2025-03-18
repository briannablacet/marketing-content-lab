// src/context/ContentContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContentContextType {
  selectedContentTypes: string[];
  setSelectedContentTypes: (types: string[]) => void;
  exportContentSettings: () => string;
  importContentSettings: (jsonData: string) => boolean;
  loading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Local storage key
const STORAGE_KEY = 'marketing-content-lab-content-settings';

// Helper function to safely parse JSON from localStorage
const getSavedContentData = (): { selectedContentTypes: string[] } | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading content settings from localStorage:', error);
  }
  return null;
};

// Helper function to safely save data to localStorage
const saveContentData = (data: { selectedContentTypes: string[] }): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving content settings to localStorage:', error);
  }
};

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedData = getSavedContentData();
      if (savedData) {
        setSelectedContentTypes(savedData.selectedContentTypes);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load saved content settings');
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {  // Don't save during initial loading
      saveContentData({ selectedContentTypes });
    }
  }, [selectedContentTypes, loading]);

  // Export settings as JSON string
  const exportContentSettings = (): string => {
    return JSON.stringify({ selectedContentTypes }, null, 2);
  };

  // Import settings from JSON string
  const importContentSettings = (jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData);
      // Basic validation
      if (!parsedData.selectedContentTypes || !Array.isArray(parsedData.selectedContentTypes)) {
        throw new Error('Invalid content settings format');
      }
      setSelectedContentTypes(parsedData.selectedContentTypes);
      return true;
    } catch (err) {
      setError(`Failed to import settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  return (
    <ContentContext.Provider 
      value={{ 
        selectedContentTypes, 
        setSelectedContentTypes,
        exportContentSettings,
        importContentSettings,
        loading,
        error
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};