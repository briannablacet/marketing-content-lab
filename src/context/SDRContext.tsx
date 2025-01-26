// src/context/SDRContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Lead {
  id: string;
  name: string;
  company: string;
  status: string;
}

interface SDRContextType {
  leadQueue: Lead[];
  addToQueue: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: string) => void;
}

const SDRContext = createContext<SDRContextType | undefined>(undefined);

export const useSDR = () => {
  const context = useContext(SDRContext);
  if (!context) throw new Error('useSDR must be used within SDRProvider');
  return context;
};

export const SDRProvider = ({ children }) => {
  const [leadQueue, setLeadQueue] = useState<Lead[]>([]);

  const addToQueue = (lead: Lead) => {
    setLeadQueue([...leadQueue, lead]);
  };

  const updateLeadStatus = (id: string, status: string) => {
    setLeadQueue(leads => 
      leads.map(lead => 
        lead.id === id ? {...lead, status} : lead
      )
    );
  };

  return (
    <SDRContext.Provider value={{ leadQueue, addToQueue, updateLeadStatus }}>
      {children}
    </SDRContext.Provider>
  );
};