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
};

export default StrategicDataService;
