// src/context/MarketingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MarketingProgramData {
  title?: string;
  description?: string;
  targetPersona?: string;
  keyMessages?: string[];
  contentTypes?: string[];
  // Add other fields as needed
}

interface MarketingContextType {
  programData: MarketingProgramData;
  setProgramData: (data: MarketingProgramData) => void;
}

const defaultProgramData: MarketingProgramData = {
  title: '',
  description: '',
  targetPersona: '',
  keyMessages: [],
  contentTypes: []
};

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export function MarketingProgramProvider({ children }: { children: ReactNode }) {
  const [programData, setProgramData] = useState<MarketingProgramData>(defaultProgramData);

  return (
    <MarketingContext.Provider value={{ programData, setProgramData }}>
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketingProgram() {
  const context = useContext(MarketingContext);
  if (context === undefined) {
    throw new Error('useMarketingProgram must be used within a MarketingProgramProvider');
  }
  return context;
}