import React, { createContext, useContext, useState } from 'react';

interface BrandVoice {
    archetype: string;
    tone: string;
    personality: string[];
}

interface BrandVoiceContextType {
    brandVoice: {
        brandVoice: BrandVoice;
    };
    setBrandVoice: (brandVoice: { brandVoice: BrandVoice }) => void;
}

const BrandVoiceContext = createContext<BrandVoiceContextType | undefined>(undefined);

export const BrandVoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brandVoice, setBrandVoice] = useState<{ brandVoice: BrandVoice }>({
        brandVoice: {
            archetype: '',
            tone: '',
            personality: []
        }
    });

    return (
        <BrandVoiceContext.Provider value={{ brandVoice, setBrandVoice }}>
            {children}
        </BrandVoiceContext.Provider>
    );
};

export const useBrandVoice = () => {
    const context = useContext(BrandVoiceContext);
    if (context === undefined) {
        throw new Error('useBrandVoice must be used within a BrandVoiceProvider');
    }
    return context;
}; 