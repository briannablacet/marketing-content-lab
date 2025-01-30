// src/context/ContentContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContentContextType {
  selectedContentTypes: string[];
  setSelectedContentTypes: (types: string[]) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);

  // Move localStorage operations to useEffect to ensure they only run client-side
  useEffect(() => {
    // Load initial state from localStorage
    const saved = localStorage.getItem('selectedContentTypes');
    if (saved) {
      setSelectedContentTypes(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (selectedContentTypes.length > 0) {
      localStorage.setItem('selectedContentTypes', JSON.stringify(selectedContentTypes));
    }
  }, [selectedContentTypes]);

  return (
    <ContentContext.Provider value={{ selectedContentTypes, setSelectedContentTypes }}>
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