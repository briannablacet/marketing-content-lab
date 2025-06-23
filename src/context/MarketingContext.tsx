//src

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define all the types for our marketing program data
interface ProductInfo {
  name: string;
  type: string;
  valueProposition: string;
  keyBenefits: string[];
}

interface Persona {
  name: string;
  description: string;
  problems: string[];
}

interface Competitor {
  name: string;
  website?: string;
  keyMessages: string[];
  differentiators: string[];
}

interface ContentStrategy {
  selectedTypes: string[];
  topics: string[];
  keywords: string[];
}

interface MarketingProgramData {
  productInfo: ProductInfo;
  targetPersonas: Persona[];
  competitors: Competitor[];
  contentStrategy: ContentStrategy;
  currentStep: number;
  completedSteps: number[];
}

// Define action types for our reducer
type ActionType =
  | { type: 'SET_PRODUCT_INFO'; payload: ProductInfo }
  | { type: 'SET_PERSONAS'; payload: Persona[] }
  | { type: 'SET_COMPETITORS'; payload: Competitor[] }
  | { type: 'SET_CONTENT_STRATEGY'; payload: ContentStrategy }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'LOAD_SAVED_STATE'; payload: MarketingProgramData };

// Initial state
const initialState: MarketingProgramData = {
  productInfo: {
    name: '',
    type: '',
    valueProposition: '',
    keyBenefits: [],
  },
  targetPersonas: [],
  competitors: [],
  contentStrategy: {
    selectedTypes: [],
    topics: [],
    keywords: [],
  },
  currentStep: 1,
  completedSteps: [],
};

// Create the context
const MarketingContext = createContext<{
  state: MarketingProgramData;
  dispatch: React.Dispatch<ActionType>;
} | undefined>(undefined);

// Reducer function to handle state updates
function marketingReducer(state: MarketingProgramData, action: ActionType): MarketingProgramData {
  switch (action.type) {
    case 'SET_PRODUCT_INFO':
      return { ...state, productInfo: action.payload };
    case 'SET_PERSONAS':
      return { ...state, targetPersonas: action.payload };
    case 'SET_COMPETITORS':
      return { ...state, competitors: action.payload };
    case 'SET_CONTENT_STRATEGY':
      return { ...state, contentStrategy: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: [...new Set([...state.completedSteps, action.payload])],
      };
    case 'LOAD_SAVED_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Provider component
export function MarketingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(marketingReducer, initialState);

  // Load saved state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedState = localStorage.getItem('marketingProgramState');
      if (savedState) {
        dispatch({ type: 'LOAD_SAVED_STATE', payload: JSON.parse(savedState) });
      }
    } catch (error) {
      console.error('Error loading marketing program state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('marketingProgramState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving marketing program state:', error);
    }
  }, [state]);

  return (
    <MarketingContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketingContext.Provider>
  );
}

// Custom hook to use the marketing context
export function useMarketing() {
  const context = useContext(MarketingContext);
  if (context === undefined) {
    throw new Error('useMarketing must be used within a MarketingProvider');
  }
  return context;
}

// Helper functions for common operations
export function useMarketingActions() {
  const { dispatch } = useMarketing();

  return {
    setProductInfo: (productInfo: ProductInfo) =>
      dispatch({ type: 'SET_PRODUCT_INFO', payload: productInfo }),
    
    setPersonas: (personas: Persona[]) =>
      dispatch({ type: 'SET_PERSONAS', payload: personas }),
    
    setCompetitors: (competitors: Competitor[]) =>
      dispatch({ type: 'SET_COMPETITORS', payload: competitors }),
    
    setContentStrategy: (strategy: ContentStrategy) =>
      dispatch({ type: 'SET_CONTENT_STRATEGY', payload: strategy }),
    
    setCurrentStep: (step: number) =>
      dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    
    completeStep: (step: number) =>
      dispatch({ type: 'COMPLETE_STEP', payload: step }),
  };
}

export type { ProductInfo, Persona, Competitor, ContentStrategy, MarketingProgramData };