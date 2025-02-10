// src/context/BrandVoiceContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface for brand voice data structure
interface BrandVoiceData {
  brandVoice: {
    tone: string;
    style: string;
    audience: string;
    archetype: string;
  };
  contentGuidelines: {
    preferred: string;
    avoided: string;
    terminology: Record<string, string>;
  };
  uploadedGuides: Array<{
    name: string;
    content: string;
    type: string;
  }>;
}

// Interface for context value including update functions
interface BrandVoiceContextType {
  brandVoice: BrandVoiceData;
  updateBrandVoice: (updates: Partial<BrandVoiceData>) => void;
  addUploadedGuide: (guide: { name: string; content: string; type: string }) => void;
  removeUploadedGuide: (name: string) => void;
}

// Default values for brand voice data
const defaultBrandVoice: BrandVoiceData = {
  brandVoice: {
    tone: '',
    style: '',
    audience: '',
    archetype: '',
  },
  contentGuidelines: {
    preferred: '',
    avoided: '',
    terminology: {},
  },
  uploadedGuides: [],
};

// Create the context
const BrandVoiceContext = createContext<BrandVoiceContextType | undefined>(undefined);

// Provider component
export function BrandVoiceProvider({ children }: { children: ReactNode }) {
  const [brandVoice, setBrandVoice] = useState<BrandVoiceData>(defaultBrandVoice);

  // Update brand voice data
  const updateBrandVoice = (updates: Partial<BrandVoiceData>) => {
    setBrandVoice(prev => ({
      ...prev,
      ...updates,
    }));
  };

  // Add a new uploaded guide
  const addUploadedGuide = (guide: { name: string; content: string; type: string }) => {
    setBrandVoice(prev => ({
      ...prev,
      uploadedGuides: [...prev.uploadedGuides, guide],
    }));
  };

  // Remove an uploaded guide
  const removeUploadedGuide = (name: string) => {
    setBrandVoice(prev => ({
      ...prev,
      uploadedGuides: prev.uploadedGuides.filter(guide => guide.name !== name),
    }));
  };

  // Return the provider with all values and functions
  return (
    <BrandVoiceContext.Provider 
      value={{ 
        brandVoice, 
        updateBrandVoice, 
        addUploadedGuide, 
        removeUploadedGuide 
      }}
    >
      {children}
    </BrandVoiceContext.Provider>
  );
}

// Hook for using the brand voice context
export function useBrandVoice() {
  const context = useContext(BrandVoiceContext);
  if (context === undefined) {
    throw new Error('useBrandVoice must be used within a BrandVoiceProvider');
  }
  return context;
}