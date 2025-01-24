// src/context/WalkthroughContext.tsx
import React, { createContext, useContext, useState } from 'react';

const WalkthroughContext = createContext({
  data: {
    goals: {},
    persona: {},
    channels: { selected: [] },
    budget: { allocations: [] },
    content: { types: [] }
  },
  updateStep: (step: string, data: any) => {}
});

export const useWalkthrough = () => useContext(WalkthroughContext);

export const WalkthroughProvider = ({ children }) => {
  const [data, setData] = useState({
    goals: {},
    persona: {},
    channels: { selected: [] },
    budget: { allocations: [] },
    content: { types: [] }
  });

  const updateStep = (step: string, newData: any) => {
    setData(prev => ({ ...prev, [step]: newData }));
  };

  return (
    <WalkthroughContext.Provider value={{ data, updateStep }}>
      {children}
    </WalkthroughContext.Provider>
  );
};