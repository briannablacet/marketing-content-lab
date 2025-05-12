// src/services/StrategicDataService.js

/**
 * This service retrieves and provides strategic data across the application.
 * It centralizes access to product, persona, messaging, and style guide data.
 */

// Helper function to safely get localStorage items
const getLocalStorageItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error retrieving ${key} from localStorage:`, error);
        return defaultValue;
    }
};

/**
 * Get all product information
 */
export const getProductInfo = async () => {
    // First check localStorage (for backward compatibility)
    const localProduct = getLocalStorageItem('marketingProduct');

    if (localProduct) {
        return localProduct;
    }

    // TODO: If not in localStorage, fetch from backend
    // const response = await fetch('/api/product-info');
    // return response.json();

    // Fallback to empty object
    return {
        name: '',
        type: '',
        valueProposition: '',
        keyBenefits: []
    };
};

/**
 * Get target audience personas
 */
export const getTargetAudiences = async () => {
    const localAudiences = getLocalStorageItem('marketingTargetAudiences', []);

    if (localAudiences && localAudiences.length > 0) {
        return localAudiences;
    }

    // Check old format
    const singleAudience = getLocalStorageItem('marketingTargetAudience');
    if (singleAudience) {
        return [singleAudience];
    }

    // TODO: If not in localStorage, fetch from backend
    // const response = await fetch('/api/target-audiences');
    // return response.json();

    return [];
};

/**
 * Get messaging framework
 */
export const getMessagingFramework = async () => {
    // Try different storage locations
    const messagingFramework = getLocalStorageItem('messageFramework') ||
        getLocalStorageItem('marketing-content-lab-messaging') ||
        getLocalStorageItem('marketingMessaging');

    if (messagingFramework) {
        return messagingFramework;
    }

    // TODO: If not in localStorage, fetch from backend
    // const response = await fetch('/api/messaging-framework');
    // return response.json();

    return {
        valueProposition: '',
        keyDifferentiators: [],
        targetedMessages: []
    };
};

/**
 * Get competition analysis
 */
export const getCompetitorAnalysis = async () => {
    const competitors = getLocalStorageItem('marketingCompetitors', []);

    if (competitors.length > 0) {
        return competitors;
    }

    // TODO: If not in localStorage, fetch from backend
    // const response = await fetch('/api/competitors');
    // return response.json();

    return [];
};

/**
 * Get writing style guide
 */
export const getWritingStyle = async () => {
    const writingStyle = getLocalStorageItem('marketing-content-lab-writing-style');

    if (writingStyle) {
        return writingStyle;
    }

    // TODO: If not in localStorage, fetch from backend
    // const response = await fetch('/api/writing-style');
    // return response.json();

    return {
        styleGuide: {
            primary: 'Chicago Manual of Style'
        },
        formatting: {},
        punctuation: {},
        terminology: {}
    };
};

/**
 * Get brand voice
 */
export const getBrandVoice = async () => {
    const brandVoice = getLocalStorageItem('marketing-content-lab-brand-voice');

    if (brandVoice) {
        return brandVoice;
    }

    // TODO: If not in localStorage, fetch from backend  
    // const response = await fetch('/api/brand-voice');
    // return response.json();

    return {
        brandVoice: {
            tone: '',
            style: '',
            audience: '',
            archetype: ''
        },
        contentGuidelines: {
            preferred: '',
            avoided: '',
            terminology: {}
        }
    };
};

/**
 * Get SEO keywords
 */
export const getSeoKeywords = async () => {
    const keywords = getLocalStorageItem('marketingSeoKeywords');

    if (keywords) {
        return keywords;
    }

    // TODO: If not in localStorage, fetch from backend
    // const response = await fetch('/api/seo-keywords');
    // return response.json();

    return {
        primaryKeywords: [],
        secondaryKeywords: [],
        keywordGroups: []
    };
};

/**
 * Get all strategic data in one call
 */
export const getAllStrategicData = async () => {
    try {
        const [
            product,
            audiences,
            messaging,
            competitors,
            writingStyle,
            brandVoice,
            seoKeywords
        ] = await Promise.all([
            getProductInfo(),
            getTargetAudiences(),
            getMessagingFramework(),
            getCompetitorAnalysis(),
            getWritingStyle(),
            getBrandVoice(),
            getSeoKeywords()
        ]);

        return {
            product,
            audiences,
            messaging,
            competitors,
            writingStyle,
            brandVoice,
            seoKeywords,
            isComplete: Boolean(
                product?.name &&
                audiences?.length > 0 &&
                messaging?.valueProposition &&
                competitors?.length > 0
            )
        };
    } catch (error) {
        console.error('Error retrieving strategic data:', error);
        return {
            isComplete: false,
            error: 'Failed to retrieve strategic data'
        };
    }
};

/**
 * Enriches content creation parameters with strategic data
 */
export const enrichContentRequest = async (baseRequest) => {
    const strategicData = await getAllStrategicData();

    // Start with the base request
    const enrichedRequest = { ...baseRequest };

    // Add product information
    if (strategicData.product) {
        enrichedRequest.productInfo = strategicData.product;
    }

    // Add target audience
    if (strategicData.audiences && strategicData.audiences.length > 0) {
        enrichedRequest.targetAudience = strategicData.audiences[0]; // Use primary audience
        enrichedRequest.allAudiences = strategicData.audiences;
    }

    // Add messaging
    if (strategicData.messaging) {
        enrichedRequest.messaging = strategicData.messaging;

        // If no tone specified in base request but exists in brand voice
        if (!enrichedRequest.tone && strategicData.brandVoice?.brandVoice?.tone) {
            enrichedRequest.tone = strategicData.brandVoice.brandVoice.tone;
        }
    }

    // Add writing style preferences
    if (strategicData.writingStyle) {
        enrichedRequest.styleGuide = strategicData.writingStyle;
    }

    // Add brand voice 
    if (strategicData.brandVoice) {
        enrichedRequest.brandVoice = strategicData.brandVoice;
    }

    // Add SEO keywords if relevant
    if (strategicData.seoKeywords &&
        (baseRequest.includeKeywords ||
            baseRequest.contentType === 'blog-post' ||
            baseRequest.contentType === 'web-page')) {

        const keywords = [
            ...(strategicData.seoKeywords.primaryKeywords || []).map(k => k.term),
            ...(strategicData.seoKeywords.secondaryKeywords || []).map(k => k.term)
        ].filter(Boolean);

        enrichedRequest.keywords = (enrichedRequest.keywords || []).concat(keywords);
    }

    return enrichedRequest;
};

export default {
    getProductInfo,
    getTargetAudiences,
    getMessagingFramework,
    getCompetitorAnalysis,
    getWritingStyle,
    getBrandVoice,
    getSeoKeywords,
    getAllStrategicData,
    enrichContentRequest
};