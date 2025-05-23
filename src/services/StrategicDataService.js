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
};

const getStrategicData = () => strategicData;

const setStrategicDataValue = (key, value) => {
    strategicData[key] = value;
};

const StrategicDataService = {
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
    getVision: () => strategicData.vision || '',
    setVision: (value) => strategicData.vision = value,

    // Mission
    getMission: () => strategicData.mission || '',
    setMission: (value) => strategicData.mission = value,

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

    // Competitive Analysis - NEWLY ADDED
    getCompetitiveAnalysis: () => strategicData.competitiveAnalysis || [],
    setCompetitiveAnalysis: (data) => strategicData.competitiveAnalysis = data,

    // Style Guide - NEWLY ADDED
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