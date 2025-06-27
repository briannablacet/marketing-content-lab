// src/services/StrategicDataService.js

const safeLocalStorage = {
    getItem: (key) => {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`Error getting ${key} from localStorage:`, error);
            return null;
        }
    },
    setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error setting ${key} in localStorage:`, error);
        }
    }
};

const strategicData = {
    productInfo: {},
    audiences: [],
    messaging: {},
    brandVoice: {},
    vision: '',
    mission: '',
    differentiators: [],
    persona: {},
    tagline: '',
    boilerplates: {},
    brandArchetype: '',
    competitiveAnalysis: [],  // Added for competitor data
    styleGuide: {},           // Added for style guide data
    valueProposition: '',     // Added for value proposition
};

const getStrategicData = () => strategicData;

const setStrategicDataValue = (key, value) => {
    if (key in strategicData) {
        strategicData[key] = value;
        return true;
    }
    return false;
};

// FIXED: Add the missing enrichContentRequest function
const enrichContentRequest = async (requestData) => {
    try {
        console.log('🔄 Enriching content request with strategic data...');
        
        // Get all strategic data
        const allStrategicData = StrategicDataService.getAllStrategicData();
        
        // Get writing style from localStorage
        const writingStyleRaw = safeLocalStorage.getItem('marketing-content-lab-writing-style');
        const writingStyle = writingStyleRaw ? JSON.parse(writingStyleRaw) : null;
        
        // Get brand voice from localStorage
        const brandVoiceRaw = safeLocalStorage.getItem('marketing-content-lab-brand-voice');
        const brandVoice = brandVoiceRaw ? JSON.parse(brandVoiceRaw) : null;
        
        // Get messaging framework
        const messagingRaw = safeLocalStorage.getItem('messageFramework');
        const messaging = messagingRaw ? JSON.parse(messagingRaw) : null;
        
        console.log('📦 Writing style found:', writingStyle);
        console.log('📦 Brand voice found:', brandVoice);
        console.log('📦 Messaging found:', messaging);
        
        // Enrich the request data with strategic information
        const enrichedData = {
            ...requestData,
            strategicData: {
                product: allStrategicData.product || {},
                audiences: allStrategicData.audiences || [],
                messaging: messaging || allStrategicData.messaging || {},
                brandVoice: brandVoice || allStrategicData.brandVoice || {},
                writingStyle: writingStyle || allStrategicData.styleGuide || {},
                vision: allStrategicData.vision || '',
                mission: allStrategicData.mission || '',
                valueProposition: allStrategicData.valueProposition || '',
                differentiators: allStrategicData.differentiators || [],
                persona: allStrategicData.persona || {},
                tagline: allStrategicData.tagline || '',
                boilerplates: allStrategicData.boilerplates || {},
                brandArchetype: allStrategicData.brandArchetype || '',
                competitiveAnalysis: allStrategicData.competitiveAnalysis || []
            }
        };
        
        // If the request already has writingStyle, merge it with the strategic data
        if (requestData.writingStyle && writingStyle) {
            enrichedData.writingStyle = {
                ...writingStyle,
                ...requestData.writingStyle
            };
        } else if (writingStyle) {
            enrichedData.writingStyle = writingStyle;
        }
        
        // If the request already has brandVoice, merge it with the strategic data
        if (requestData.brandVoice && brandVoice) {
            enrichedData.brandVoice = {
                ...brandVoice,
                ...requestData.brandVoice
            };
        } else if (brandVoice) {
            enrichedData.brandVoice = brandVoice;
        }
        
        // If the request already has messaging, merge it with the strategic data
        if (requestData.messaging && messaging) {
            enrichedData.messaging = {
                ...messaging,
                ...requestData.messaging
            };
        } else if (messaging) {
            enrichedData.messaging = messaging;
        }
        
        console.log('✅ Enriched request data:', enrichedData);
        return enrichedData;
        
    } catch (error) {
        console.error('❌ Error enriching content request:', error);
        // Return original data if enrichment fails
        return requestData;
    }
};

const StrategicDataService = {
    getAllStrategicDataFromStorage: () => {
        const product = JSON.parse(safeLocalStorage.getItem('marketingProduct') || '{}');
        const audience = JSON.parse(safeLocalStorage.getItem('marketingTargetAudience') || '{}');
        const audiencesRaw = safeLocalStorage.getItem('marketingTargetAudiences');
        const audiences = audiencesRaw ? JSON.parse(audiencesRaw) : [];
        const brandVoice = JSON.parse(safeLocalStorage.getItem('marketing-content-lab-brand-voice') || '{}');
        const boilerplate = safeLocalStorage.getItem('marketingBoilerplate') || '';
        const valueProposition = safeLocalStorage.getItem('marketingValueProp') || '';

        console.log('Raw audience data from localStorage:', audience);
        console.log('Raw audiences data from localStorage:', audiences);
        console.log('All localStorage keys:', Object.keys(localStorage));

        // Extract roles from audience objects
        const audienceRoles = audiences.map(a => a.role || '').filter(role => role);
        console.log('Extracted roles:', audienceRoles);

        // Get all audiences from the audience data
        const allAudiences = audienceRoles.length > 0 ? audienceRoles : (audience.role ? [audience.role] : []);
        console.log('Final allAudiences:', allAudiences);

        return {
            productName: product.name || '',
            productDescription: product.type || '',
            idealCustomer: allAudiences,
            brandArchetype: brandVoice?.brandVoice?.archetype || '',
            tagline: product.tagline || '',
            boilerplate: boilerplate,
            valueProposition: valueProposition
        };
    },

    get: getStrategicData,
    setStrategicDataValue,
    enrichContentRequest, // FIXED: Export the enrichContentRequest function

    // Product Info
    getProductInfo: () => strategicData.productInfo || {},
    setProductInfo: (data) => {
        strategicData.productInfo = data;
        safeLocalStorage.setItem('marketingProduct', JSON.stringify(data));
    },

    // Target Audiences
    getTargetAudiences: () => {
        // First try to get from in-memory state
        if (strategicData.audiences && strategicData.audiences.length > 0) {
            return strategicData.audiences;
        }

        // If not in memory, try to get from localStorage
        const audiencesRaw = safeLocalStorage.getItem('marketingTargetAudiences');
        if (audiencesRaw) {
            const audiences = JSON.parse(audiencesRaw);
            // Update in-memory state
            strategicData.audiences = audiences;
            return audiences;
        }

        // If no audiences in localStorage, try single audience
        const audienceRaw = safeLocalStorage.getItem('marketingTargetAudience');
        if (audienceRaw) {
            const audience = JSON.parse(audienceRaw);
            const audiences = [audience];
            // Update in-memory state
            strategicData.audiences = audiences;
            return audiences;
        }

        return [];
    },
    setTargetAudiences: (data) => {
        strategicData.audiences = data;
        // Save to both localStorage keys for compatibility
        safeLocalStorage.setItem('marketingTargetAudiences', JSON.stringify(data));
        if (data.length > 0) {
            safeLocalStorage.setItem('marketingTargetAudience', JSON.stringify(data[0]));
        }
    },

    // Messaging
    getMessagingFramework: () => strategicData.messaging || {},
    setMessagingFramework: (data) => {
        strategicData.messaging = data;
        safeLocalStorage.setItem('messageFramework', JSON.stringify(data));
    },

    // Brand Voice
    getBrandVoice: () => strategicData.brandVoice || {},
    setBrandVoice: (data) => {
        strategicData.brandVoice = data;
        safeLocalStorage.setItem('marketing-content-lab-brand-voice', JSON.stringify(data));
    },

    // Vision
    getVision: () => {
        const storedVision = safeLocalStorage.getItem('brandVision');
        return storedVision || strategicData.vision || '';
    },
    setVision: (value) => {
        strategicData.vision = value;
        safeLocalStorage.setItem('brandVision', value);
    },

    // Mission
    getMission: () => {
        const storedMission = safeLocalStorage.getItem('brandMission');
        return storedMission || strategicData.mission || '';
    },
    setMission: (value) => {
        strategicData.mission = value;
        safeLocalStorage.setItem('brandMission', value);
    },

    // Value Proposition
    getValueProposition: () => strategicData.valueProposition || '',
    setValueProposition: (value) => {
        strategicData.valueProposition = value;
        safeLocalStorage.setItem('marketingValueProp', value);
    },

    // Differentiators
    getDifferentiators: () => strategicData.differentiators || [],
    setDifferentiators: (data) => {
        strategicData.differentiators = data;
        safeLocalStorage.setItem('marketingDifferentiators', JSON.stringify(data));
    },

    // Persona
    getPersona: () => strategicData.persona || {},
    setPersona: (data) => {
        strategicData.persona = data;
        safeLocalStorage.setItem('marketingPersona', JSON.stringify(data));
    },

    // Tagline
    getTagline: () => strategicData.tagline || '',
    setTagline: (value) => {
        strategicData.tagline = value;
        safeLocalStorage.setItem('brandTagline', value);
    },

    // Boilerplates
    getBoilerplates: () => strategicData.boilerplates || {},
    setBoilerplates: (data) => {
        strategicData.boilerplates = data;
        safeLocalStorage.setItem('brandBoilerplates', JSON.stringify(data));
    },

    // Brand Archetype
    getBrandArchetype: () => strategicData.brandArchetype || '',
    setBrandArchetype: (value) => {
        strategicData.brandArchetype = value;
        safeLocalStorage.setItem('brandArchetype', value);
    },

    // Competitive Analysis
    getCompetitiveAnalysis: () => strategicData.competitiveAnalysis || [],
    setCompetitiveAnalysis: (data) => {
        strategicData.competitiveAnalysis = data;
        safeLocalStorage.setItem('marketingCompetitors', JSON.stringify(data));
    },

    // Style Guide
    getStyleGuide: () => strategicData.styleGuide || {},
    setStyleGuide: (data) => {
        strategicData.styleGuide = data;
        safeLocalStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(data));
    },

    // Helper method to get all strategic data at once
    getAllStrategicData: () => {
        // First try to get from in-memory state
        const inMemoryData = {
            product: strategicData.productInfo,
            audiences: strategicData.audiences,
            messaging: strategicData.messaging,
            brandVoice: strategicData.brandVoice,
            vision: strategicData.vision,
            mission: strategicData.mission,
            valueProposition: strategicData.valueProposition,
            differentiators: strategicData.differentiators,
            persona: strategicData.persona,
            tagline: strategicData.tagline,
            boilerplates: strategicData.boilerplates,
            brandArchetype: strategicData.brandArchetype,
            competitiveAnalysis: strategicData.competitiveAnalysis,
            styleGuide: strategicData.styleGuide,
            writingStyle: null // FIXED: Initialize writingStyle property
        };

        // Load writing style from localStorage
        const writingStyleRaw = safeLocalStorage.getItem('marketing-content-lab-writing-style');
        if (writingStyleRaw) {
            const writingStyle = JSON.parse(writingStyleRaw);
            inMemoryData.writingStyle = writingStyle;
            strategicData.styleGuide = writingStyle;
        }

        // Load brand voice from localStorage
        const brandVoiceRaw = safeLocalStorage.getItem('marketing-content-lab-brand-voice');
        if (brandVoiceRaw) {
            const brandVoice = JSON.parse(brandVoiceRaw);
            inMemoryData.brandVoice = brandVoice;
            strategicData.brandVoice = brandVoice;
        }

        // If we have audiences in memory, return the data
        if (inMemoryData.audiences && inMemoryData.audiences.length > 0) {
            return inMemoryData;
        }

        // If no audiences in memory, try to load from localStorage
        const audiencesRaw = safeLocalStorage.getItem('marketingTargetAudiences');
        if (audiencesRaw) {
            const audiences = JSON.parse(audiencesRaw);
            inMemoryData.audiences = audiences;
            strategicData.audiences = audiences;
        } else {
            // Try single audience format
            const audienceRaw = safeLocalStorage.getItem('marketingTargetAudience');
            if (audienceRaw) {
                const audience = JSON.parse(audienceRaw);
                inMemoryData.audiences = [audience];
                strategicData.audiences = [audience];
            }
        }

        return inMemoryData;
    },

    // Helper method to clear all data
    clearAllData: () => {
        strategicData.productInfo = {};
        strategicData.audiences = [];
        strategicData.messaging = {};
        strategicData.brandVoice = {};
        strategicData.vision = '';
        strategicData.mission = '';
        strategicData.valueProposition = '';
        strategicData.differentiators = [];
        strategicData.persona = {};
        strategicData.tagline = '';
        strategicData.boilerplates = {};
        strategicData.brandArchetype = '';
        strategicData.competitiveAnalysis = [];
        strategicData.styleGuide = {};
    }
};

export default StrategicDataService;