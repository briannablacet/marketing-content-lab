// src/contexts/AppContext.tsx
import React, { useState, useEffect } from 'react';
import { MarketingProgramProvider } from './MarketingContext';
import { SDRProvider } from './SDRContext';
import { TimelineProvider } from './TimelineContext';

// Main application context combining all features
export const AppProvider = ({ children }) => {
  return (
    <MarketingProgramProvider>
      <SDRProvider>
        <TimelineProvider>
          {children}
        </TimelineProvider>
      </SDRProvider>
    </MarketingProgramProvider>
  );
};

// Root state provider with persistence
export const RootProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load saved state from localStorage
    const savedState = localStorage.getItem('marketingProgram');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Initialize providers with saved state
    }
    setInitialized(true);
  }, []);

  // Auto-save state changes
  const handleStateChange = (newState) => {
    localStorage.setItem('marketingProgram', JSON.stringify(newState));
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

export const useApp = () => {
  // Hook for accessing app-wide state and functions
  return {
    initialized: true,
    version: '1.0.0'
  };
};
