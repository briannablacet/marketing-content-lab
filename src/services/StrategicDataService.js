// src/services/StrategicDataService.js

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

const StrategicDataService = {
    getAllStrategicDataFromStorage: () => {
        const product = JSON.parse(localStorage.getItem('marketingProduct') || '{}');
        const audience = JSON.parse(localStorage.getItem('marketingTargetAudience') || '{}');
        const audiencesRaw = localStorage.getItem('marketingTargetAudiences');
        const audiences = audiencesRaw ? JSON.parse(audiencesRaw) : [];
        const brandVoice = JSON.parse(localStorage.getItem('marketing-content-lab-brand-voice') || '{}');
        const boilerplate = localStorage.getItem('marketingBoilerplate') || '';
        const valueProposition = localStorage.getItem('marketingValueProp') || '';

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

    // Product Info
    getProductInfo: () => strategicData.productInfo || {},
    setProductInfo: (data) => {
        strategicData.productInfo = data;
        localStorage.setItem('marketingProduct', JSON.stringify(data));
    },

    // Target Audiences
    getTargetAudiences: () => {
        // First try to get from in-memory state
        if (strategicData.audiences && strategicData.audiences.length > 0) {
            return strategicData.audiences;
        }

        // If not in memory, try to get from localStorage
        const audiencesRaw = localStorage.getItem('marketingTargetAudiences');
        if (audiencesRaw) {
            const audiences = JSON.parse(audiencesRaw);
            // Update in-memory state
            strategicData.audiences = audiences;
            return audiences;
        }

        // If no audiences in localStorage, try single audience
        const audienceRaw = localStorage.getItem('marketingTargetAudience');
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
        localStorage.setItem('marketingTargetAudiences', JSON.stringify(data));
        if (data.length > 0) {
            localStorage.setItem('marketingTargetAudience', JSON.stringify(data[0]));
        }
    },

    // Messaging
    getMessagingFramework: () => strategicData.messaging || {},
    setMessagingFramework: (data) => {
        strategicData.messaging = data;
        localStorage.setItem('messageFramework', JSON.stringify(data));
    },

    // Brand Voice
    getBrandVoice: () => strategicData.brandVoice || {},
    setBrandVoice: (data) => {
        strategicData.brandVoice = data;
        localStorage.setItem('marketing-content-lab-brand-voice', JSON.stringify(data));
    },

    // Vision
    getVision: () => {
        const storedVision = localStorage.getItem('brandVision');
        return storedVision || strategicData.vision || '';
    },
    setVision: (value) => {
        strategicData.vision = value;
        localStorage.setItem('brandVision', value);
    },

    // Mission
    getMission: () => {
        const storedMission = localStorage.getItem('brandMission');
        return storedMission || strategicData.mission || '';
    },
    setMission: (value) => {
        strategicData.mission = value;
        localStorage.setItem('brandMission', value);
    },

    // Value Proposition
    getValueProposition: () => strategicData.valueProposition || '',
    setValueProposition: (value) => {
        strategicData.valueProposition = value;
        localStorage.setItem('marketingValueProp', value);
    },

    // Differentiators
    getDifferentiators: () => strategicData.differentiators || [],
    setDifferentiators: (data) => {
        strategicData.differentiators = data;
        localStorage.setItem('marketingDifferentiators', JSON.stringify(data));
    },

    // Persona
    getPersona: () => strategicData.persona || {},
    setPersona: (data) => {
        strategicData.persona = data;
        localStorage.setItem('marketingPersona', JSON.stringify(data));
    },

    // Tagline
    getTagline: () => strategicData.tagline || '',
    setTagline: (value) => {
        strategicData.tagline = value;
        localStorage.setItem('brandTagline', value);
    },

    // Boilerplates
    getBoilerplates: () => strategicData.boilerplates || {},
    setBoilerplates: (data) => {
        strategicData.boilerplates = data;
        localStorage.setItem('brandBoilerplates', JSON.stringify(data));
    },

    // Brand Archetype
    getBrandArchetype: () => strategicData.brandArchetype || '',
    setBrandArchetype: (value) => {
        strategicData.brandArchetype = value;
        localStorage.setItem('brandArchetype', value);
    },

    // Competitive Analysis
    getCompetitiveAnalysis: () => strategicData.competitiveAnalysis || [],
    setCompetitiveAnalysis: (data) => {
        strategicData.competitiveAnalysis = data;
        localStorage.setItem('marketingCompetitors', JSON.stringify(data));
    },

    // Style Guide
    getStyleGuide: () => strategicData.styleGuide || {},
    setStyleGuide: (data) => {
        strategicData.styleGuide = data;
        localStorage.setItem('marketing-content-lab-writing-style', JSON.stringify(data));
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
            styleGuide: strategicData.styleGuide
        };

        // Load writing style from localStorage
        const writingStyleRaw = localStorage.getItem('marketing-content-lab-writing-style');
        if (writingStyleRaw) {
            const writingStyle = JSON.parse(writingStyleRaw);
            inMemoryData.writingStyle = writingStyle;
            strategicData.styleGuide = writingStyle;
        }

        // Load brand voice from localStorage
        const brandVoiceRaw = localStorage.getItem('marketing-content-lab-brand-voice');
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
        const audiencesRaw = localStorage.getItem('marketingTargetAudiences');
        if (audiencesRaw) {
            const audiences = JSON.parse(audiencesRaw);
            inMemoryData.audiences = audiences;
            strategicData.audiences = audiences;
        } else {
            // Try single audience format
            const audienceRaw = localStorage.getItem('marketingTargetAudience');
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