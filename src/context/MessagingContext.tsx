//src/context/MessagingContext.tsx

// src/context/MessagingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const defaultMessaging: MessagingData = {
  keyMessages: [],
  competitors: [],
  opportunities: [],
  differentiators: []
};

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [messaging, setMessaging] = useState<MessagingData>(defaultMessaging);

  const updateKeyMessages = (messages: string[]) => {
    setMessaging(prev => ({ ...prev, keyMessages: messages }));
  };

  const uploadMessagingDoc = (doc: { name: string; content: string }) => {
    setMessaging(prev => ({ ...prev, uploadedMessagingDoc: doc }));
  };

  const removeMessagingDoc = () => {
    setMessaging(prev => {
      const { uploadedMessagingDoc, ...rest } = prev;
      return rest;
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
        updateDifferentiators
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