// src/contexts/SDRContext.tsx
import React, { createContext, useContext, useState } from 'react';

const SDRContext = createContext();

export const SDRProvider = ({ children }) => {
  const [leadQueue, setLeadQueue] = useState([]);
  const [handoffHistory, setHandoffHistory] = useState([]);
  const [templates, setTemplates] = useState({
    email: {},
    phone: {},
    objections: {}
  });

  const addToQueue = (lead) => {
    // Check if lead should be fast-tracked
    const isFastTrack = checkFastTrackCriteria(lead);
    
    setLeadQueue(prev => [...prev, {
      ...lead,
      priority: isFastTrack ? 'high' : 'normal',
      addedAt: new Date().toISOString(),
      status: 'new'
    }]);
  };

  const updateLeadStatus = (leadId, status) => {
    setLeadQueue(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
    
    if (['qualified', 'disqualified'].includes(status)) {
      const lead = leadQueue.find(l => l.id === leadId);
      setHandoffHistory(prev => [...prev, {
        ...lead,
        statusUpdatedAt: new Date().toISOString(),
        finalStatus: status
      }]);
    }
  };

  return (
    <SDRContext.Provider value={{
      leadQueue,
      handoffHistory,
      templates,
      addToQueue,
      updateLeadStatus
    }}>
      {children}
    </SDRContext.Provider>
  );
};

export const useSDR = () => useContext(SDRContext);
