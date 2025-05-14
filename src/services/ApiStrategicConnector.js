// src/services/ApiStrategicConnector.js


import { enrichContentRequest, getAllStrategicData } from './StrategicDataService';

/**
 * Strategic API endpoints that should use the strategic data
 * Add any new endpoints here to ensure they use strategic data
 */
const STRATEGIC_ENDPOINTS = [
    'generate-content',
    'content-humanizer',
    'prose-perfector',
    'style-checker',
    'content-repurposer',
    'modify-content',
    'generate-keywords',
    'analyze-competitors'
];

/**
 * Makes an API call with strategic data automatically included
 * @param {string} endpoint - The API endpoint name
 * @param {object} data - The request data
 * @returns {Promise<object>} - The API response
 */
export const callApiWithStrategicData = async (endpoint, data) => {
    // Don't modify if not a strategic endpoint
    if (!STRATEGIC_ENDPOINTS.includes(endpoint)) {
        return callApiDirectly(endpoint, data);
    }

    try {
        // Enrich the data with strategic elements before sending
        const enrichedData = await enrichContentRequest(data);
        console.log(`Enriched ${endpoint} request with strategic data`, {
            originalDataSize: JSON.stringify(data).length,
            enrichedDataSize: JSON.stringify(enrichedData).length,
            endpoint
        });

        // Make the API call with enriched data
        return callApiDirectly(endpoint, enrichedData);
    } catch (error) {
        console.error(`Error enriching ${endpoint} request with strategic data:`, error);
        // Fall back to the original request if enrichment fails
        return callApiDirectly(endpoint, data);
    }
};

/**
 * Makes a direct API call without any modifications
 * @param {string} endpoint - The API endpoint name
 * @param {object} data - The request data
 * @returns {Promise<object>} - The API response
 */
const callApiDirectly = async (endpoint, data) => {
    // IMPORTANT: Always use the relative path for API calls
    // This ensures requests go to the correct endpoint regardless of environment
    const apiEndpoint = '/api/api_endpoints';

    console.log(`Making API call to ${apiEndpoint} for endpoint: ${endpoint}`);

    // Add this console log to debug the API URL
    console.log(`Making API call to ${apiEndpoint} for endpoint: ${endpoint}`);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint,
                data,
            }),
        });

        if (!response.ok) {
            // Use a try/catch for parsing JSON in case the response isn't valid JSON
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Checks if all necessary strategic data is available
 * @returns {Promise<boolean>} - True if all essential strategic data is available
 */
export const isStrategicDataReady = async () => {
    try {
        const data = await getAllStrategicData();

        return !!(
            data &&
            data.product?.name &&
            data.audiences?.length > 0 &&
            data.messaging?.valueProposition
        );
    } catch (error) {
        console.error('Error checking strategic data readiness:', error);
        return false;
    }
};

/**
 * Gets a status report of available strategic data
 * @returns {Promise<object>} - Status of each strategic data type
 */
export const getStrategicDataStatus = async () => {
    try {
        const data = await getAllStrategicData();

        return {
            hasProduct: !!(data?.product?.name),
            hasTargetAudience: !!(data?.audiences?.length > 0),
            hasMessaging: !!(data?.messaging?.valueProposition),
            hasCompetitors: !!(data?.competitors?.length > 0),
            hasWritingStyle: !!(data?.writingStyle?.styleGuide?.primary),
            hasBrandVoice: !!(data?.brandVoice?.brandVoice?.tone),
            hasKeywords: !!(data?.seoKeywords?.primaryKeywords?.length > 0),
            isComplete: data?.isComplete || false
        };
    } catch (error) {
        console.error('Error getting strategic data status:', error);
        return {
            hasProduct: false,
            hasTargetAudience: false,
            hasMessaging: false,
            hasCompetitors: false,
            hasWritingStyle: false,
            hasBrandVoice: false,
            hasKeywords: false,
            isComplete: false
        };
    }
};

export default {
    callApiWithStrategicData,
    isStrategicDataReady,
    getStrategicDataStatus
};