// src/contexts/MarketingContext.tsx
import React, { createContext, useContext, useState } from 'react';

const MarketingProgramContext = createContext<{
  programData: any;
  updateData: (screen: string, newData: any) => void;
  getAISuggestions: (screen: string) => string[];
} | undefined>(undefined);



export const MarketingProgramProvider = ({ children }) => {
  const [programData, setProgramData] = useState({
    goals: {
      targetRevenue: '',
      timeframe: '',
      pipelineTarget: ''
    },
    persona: {
      role: '',
      industry: '',
      challenges: [],
      buyingCriteria: []
    },
    competition: {
      primaryCompetitor: '',
      otherCompetitors: [],
      winRates: {}
    },
    messaging: {
      valueProposition: '',
      differentiators: []
    },
    budget: {
      totalBudget: '',
      channelAllocation: {},
      expectedROI: ''
    },
    pipeline: {
      leadScoring: {
        criteria: [],
        weights: {}
      },
      projections: {
        monthly: [],
        quarterly: [],
        conversion: {}
      }
    },
    events: {
      planned: [],
      budget: {
        allocated: 0,
        spent: 0,
        projected: 0
      },
      metrics: {
        attendance: 0,
        leads: 0,
        opportunities: 0
      }
    }
  });

  const updateData = (screen, newData) => {
    setProgramData(prev => ({
      ...prev,
      [screen]: { ...prev[screen], ...newData }
    }));
  };

  const getAISuggestions = (screen) => {
    switch(screen) {
      case 'messaging':
        return programData.competition.primaryCompetitor 
          ? [`Differentiate from ${programData.competition.primaryCompetitor} by focusing on...`]
          : ['Add competitor information to get targeted suggestions'];
      case 'budget':
        return programData.goals.targetRevenue
          ? [`Recommended budget based on ${programData.goals.targetRevenue} target...`]
          : ['Set revenue goals to get budget recommendations'];
      default:
        return [];
    }
  };

  return (
    <MarketingProgramContext.Provider value={{
      programData,
      updateData,
      getAISuggestions
    }}>
      {children}
    </MarketingProgramContext.Provider>
  );
};

export const useMarketingProgram = () => useContext(MarketingProgramContext);
