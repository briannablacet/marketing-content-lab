// src/context/MarketingProgramContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const MarketingProgramContext = createContext();

// Changed to export default
const MarketingProgramProvider = ({ children }) => {
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
}

// Exporting the hook separately
export const useMarketingProgram = () => {
  const context = useContext(MarketingProgramContext);
  if (!context) {
    throw new Error('useMarketingProgram must be used within a MarketingProgramProvider');
  }
  return context;
}

export default MarketingProgramProvider;