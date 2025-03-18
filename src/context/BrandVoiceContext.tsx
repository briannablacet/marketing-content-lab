// src/context/BrandVoiceContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  exportBrandVoice: () => string;
  importBrandVoice: (jsonData: string) => boolean;
  loading: boolean;
  error: string | null;
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

// Local storage key
const STORAGE_KEY = 'marketing-content-lab-brand-voice';

// Helper function to safely parse JSON from localStorage
const getSavedBrandVoiceData = (): BrandVoiceData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading brand voice from localStorage:', error);
  }
  return null;
};

// Helper function to safely save data to localStorage
const saveBrandVoiceData = (data: BrandVoiceData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving brand voice to localStorage:', error);
  }
};

// Provider component
export function BrandVoiceProvider({ children }: { children: ReactNode }) {
  const [brandVoice, setBrandVoice] = useState<BrandVoiceData>(defaultBrandVoice);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedData = getSavedBrandVoiceData();
      if (savedData) {
        setBrandVoice(savedData);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load saved brand voice settings');
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {  // Don't save during initial loading
      saveBrandVoiceData(brandVoice);
    }
  }, [brandVoice, loading]);

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

  // Export settings as JSON string
  const exportBrandVoice = (): string => {
    return JSON.stringify(brandVoice, null, 2);
  };

  // Import settings from JSON string
  const importBrandVoice = (jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData) as BrandVoiceData;
      // Basic validation
      if (!parsedData.brandVoice || !parsedData.contentGuidelines) {
        throw new Error('Invalid brand voice data format');
      }
      setBrandVoice(parsedData);
      return true;
    } catch (err) {
      setError(`Failed to import settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  // Return the provider with all values and functions
  return (
    <BrandVoiceContext.Provider 
      value={{ 
        brandVoice, 
        updateBrandVoice, 
        addUploadedGuide, 
        removeUploadedGuide,
        exportBrandVoice,
        importBrandVoice,
        loading,
        error
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