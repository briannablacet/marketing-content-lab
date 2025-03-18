// src/context/MessagingContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompetitorMessage {
  company: string;
  messages: string[];
  url: string;
  differentiators?: string[];
}

interface MessagingData {
  keyMessages: string[];
  uploadedMessagingDoc?: {
    name: string;
    content: string;
  };
  competitors: CompetitorMessage[];
  opportunities: string[];
  differentiators: string[];
}

interface MessagingContextType {
  messaging: MessagingData;
  updateKeyMessages: (messages: string[]) => void;
  uploadMessagingDoc: (doc: { name: string; content: string }) => void;
  removeMessagingDoc: () => void;
  addCompetitor: (competitor: CompetitorMessage) => void;
  removeCompetitor: (company: string) => void;
  updateOpportunities: (opportunities: string[]) => void;
  updateDifferentiators: (differentiators: string[]) => void;
  exportMessaging: () => string;
  importMessaging: (jsonData: string) => boolean;
  loading: boolean;
  error: string | null;
}

const defaultMessaging: MessagingData = {
  keyMessages: [],
  competitors: [],
  opportunities: [],
  differentiators: []
};

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// Local storage key
const STORAGE_KEY = 'marketing-content-lab-messaging';

// Helper function to safely parse JSON from localStorage
const getSavedMessagingData = (): MessagingData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading messaging from localStorage:', error);
  }
  return null;
};

// Helper function to safely save data to localStorage
const saveMessagingData = (data: MessagingData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving messaging to localStorage:', error);
  }
};

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [messaging, setMessaging] = useState<MessagingData>(defaultMessaging);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedData = getSavedMessagingData();
      if (savedData) {
        setMessaging(savedData);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load saved messaging settings');
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {  // Don't save during initial loading
      saveMessagingData(messaging);
    }
  }, [messaging, loading]);

  const updateKeyMessages = (messages: string[]) => {
    setMessaging(prev => ({ ...prev, keyMessages: messages }));
  };

  const uploadMessagingDoc = (doc: { name: string; content: string }) => {
    setMessaging(prev => ({ ...prev, uploadedMessagingDoc: doc }));
  };

  const removeMessagingDoc = () => {
    setMessaging(prev => {
      const { uploadedMessagingDoc, ...rest } = prev;
      return rest as MessagingData;
    });
  };

  const addCompetitor = (competitor: CompetitorMessage) => {
    setMessaging(prev => ({
      ...prev,
      competitors: [...prev.competitors, competitor]
    }));
  };

  const removeCompetitor = (company: string) => {
    setMessaging(prev => ({
      ...prev,
      competitors: prev.competitors.filter(c => c.company !== company)
    }));
  };

  const updateOpportunities = (opportunities: string[]) => {
    setMessaging(prev => ({ ...prev, opportunities }));
  };

  const updateDifferentiators = (differentiators: string[]) => {
    setMessaging(prev => ({ ...prev, differentiators }));
  };

  // Export settings as JSON string
  const exportMessaging = (): string => {
    return JSON.stringify(messaging, null, 2);
  };

  // Import settings from JSON string
  const importMessaging = (jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData) as MessagingData;
      // Basic validation
      if (!Array.isArray(parsedData.keyMessages) || !Array.isArray(parsedData.competitors)) {
        throw new Error('Invalid messaging data format');
      }
      setMessaging(parsedData);
      return true;
    } catch (err) {
      setError(`Failed to import settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  return (
    <MessagingContext.Provider 
      value={{ 
        messaging,
        updateKeyMessages,
        uploadMessagingDoc,
        removeMessagingDoc,
        addCompetitor,
        removeCompetitor,
        updateOpportunities,
        updateDifferentiators,
        exportMessaging,
        importMessaging,
        loading,
        error
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}