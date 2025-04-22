// src/utils/dataManager.js

/**
 * Utility for managing data across different steps of the Marketing Content Lab application
 * This handles storage and retrieval from localStorage with consistent keys
 */

// Keys for localStorage
const STORAGE_KEYS = {
    AUDIENCE: 'marketingAudience',
    MESSAGING: 'marketingMessaging',
    COMPETITORS: 'marketingCompetitors',
    PRODUCT_INFO: 'marketingProductInfo',
    CONTENT_PLAN: 'marketingContentPlan'
};

/**
 * Save audience data to localStorage
 * @param {Object} audienceData - The audience data to save
 */
export const saveAudienceData = (audienceData) => {
    try {
        localStorage.setItem(STORAGE_KEYS.AUDIENCE, JSON.stringify(audienceData));
        return true;
    } catch (error) {
        console.error('Error saving audience data:', error);
        return false;
    }
};

/**
 * Get audience data from localStorage
 * @returns {Object|null} The audience data or null if not found
 */
export const getAudienceData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.AUDIENCE);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving audience data:', error);
        return null;
    }
};

/**
 * Save messaging data to localStorage
 * @param {Object} messagingData - The messaging data to save
 */
export const saveMessagingData = (messagingData) => {
    try {
        localStorage.setItem(STORAGE_KEYS.MESSAGING, JSON.stringify(messagingData));
        return true;
    } catch (error) {
        console.error('Error saving messaging data:', error);
        return false;
    }
};

/**
 * Get messaging data from localStorage
 * @returns {Object|null} The messaging data or null if not found
 */
export const getMessagingData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.MESSAGING);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving messaging data:', error);
        return null;
    }
};

/**
 * Save competitor data to localStorage
 * @param {Array} competitorData - The competitor data to save
 */
export const saveCompetitorData = (competitorData) => {
    try {
        localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(competitorData));
        return true;
    } catch (error) {
        console.error('Error saving competitor data:', error);
        return false;
    }
};

/**
 * Get competitor data from localStorage
 * @returns {Array|null} The competitor data or null if not found
 */
export const getCompetitorData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving competitor data:', error);
        return null;
    }
};

/**
 * Save product info to localStorage
 * @param {Object} productData - The product data to save
 */
export const saveProductData = (productData) => {
    try {
        localStorage.setItem(STORAGE_KEYS.PRODUCT_INFO, JSON.stringify(productData));
        return true;
    } catch (error) {
        console.error('Error saving product data:', error);
        return false;
    }
};

/**
 * Get product info from localStorage
 * @returns {Object|null} The product data or null if not found
 */
export const getProductData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCT_INFO);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving product data:', error);
        return null;
    }
};

/**
 * Get all marketing data from localStorage
 * @returns {Object} All marketing data
 */
export const getAllMarketingData = () => {
    return {
        audience: getAudienceData(),
        messaging: getMessagingData(),
        competitors: getCompetitorData(),
        productInfo: getProductData()
    };
};

/**
 * Clear all marketing data from localStorage
 */
export const clearAllMarketingData = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing marketing data:', error);
        return false;
    }
};

export default {
    saveAudienceData,
    getAudienceData,
    saveMessagingData,
    getMessagingData,
    saveCompetitorData,
    getCompetitorData,
    saveProductData,
    getProductData,
    getAllMarketingData,
    clearAllMarketingData
};