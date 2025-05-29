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
    strategicData[key] = value;
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
    setProductInfo: (data) => strategicData.productInfo = data,

    // Target Audiences
    getTargetAudiences: () => strategicData.audiences || [],
    setTargetAudiences: (data) => strategicData.audiences = data,

    // Messaging
    getMessagingFramework: () => strategicData.messaging || {},
    setMessagingFramework: (data) => strategicData.messaging = data,

    // Brand Voice
    getBrandVoice: () => strategicData.brandVoice || {},
    setBrandVoice: (data) => strategicData.brandVoice = data,

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

    // Value Proposition - NEWLY ADDED
    getValueProposition: () => strategicData.valueProposition || '',
    setValueProposition: (value) => strategicData.valueProposition = value,

    // Differentiators
    getDifferentiators: () => strategicData.differentiators || [],
    setDifferentiators: (data) => strategicData.differentiators = data,

    // Persona
    getPersona: () => strategicData.persona || {},
    setPersona: (data) => strategicData.persona = data,

    // Tagline
    getTagline: () => strategicData.tagline || '',
    setTagline: (value) => strategicData.tagline = value,

    // Boilerplates
    getBoilerplates: () => strategicData.boilerplates || {},
    setBoilerplates: (data) => strategicData.boilerplates = data,

    // Brand Archetype
    getBrandArchetype: () => strategicData.brandArchetype || '',
    setBrandArchetype: (value) => strategicData.brandArchetype = value,

    // Competitive Analysis
    getCompetitiveAnalysis: () => strategicData.competitiveAnalysis || [],
    setCompetitiveAnalysis: (data) => strategicData.competitiveAnalysis = data,

    // Style Guide
    getStyleGuide: () => strategicData.styleGuide || {},
    setStyleGuide: (data) => strategicData.styleGuide = data,

    // Helper method to get all strategic data at once
    getAllStrategicData: () => {
        return {
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