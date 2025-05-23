// src/services/ApiStrategicConnector.js
// Enhanced version with robust error handling and no fallbacks

import  enrichContentRequest  from './StrategicDataService';
import  getAllStrategicData  from './StrategicDataService';

/**
 * Strategic API endpoints that should use the strategic data
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
    // Start with the original data
    let requestData = { ...data };

    // Flag to track if we managed to enrich the data
    let wasEnriched = false;

    // Only try to enrich if it's a strategic endpoint
    if (STRATEGIC_ENDPOINTS.includes(endpoint)) {
        try {
            // Enrich the data with strategic elements before sending
            const enrichedData = await enrichContentRequest(data);

            // Update the request data and set flag
            requestData = enrichedData;
            wasEnriched = true;

            console.log(`Enriched ${endpoint} request with strategic data`, {
                originalDataSize: JSON.stringify(data).length,
                enrichedDataSize: JSON.stringify(enrichedData).length,
                endpoint
            });
        } catch (error) {
            // Log but continue with original data - don't prevent the API call
            console.error(`Error enriching ${endpoint} request:`, error);
        }
    }

    // Make the API call with either enriched or original data
    const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || '/api'}`;

    try {
        console.log(`Making API call to ${endpoint}${wasEnriched ? ' with enriched data' : ''}`);

        // Setup fetch options with proper timeout and error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({
                endpoint,
                data: requestData,
            }),
            signal: controller.signal
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        // Check if response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error (${response.status}):`, errorText);
            throw new Error(`API responded with status ${response.status}: ${errorText || 'No error details'}`);
        }

        // Try to parse JSON response
        let jsonData;
        try {
            jsonData = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse API response as JSON:', jsonError);
            throw new Error('Invalid JSON response from API');
        }

        // Verify we got a valid response
        if (!jsonData) {
            throw new Error('API returned empty response');
        }

        return jsonData;
    } catch (error) {
        // Check for specific error types
        if (error.name === 'AbortError') {
            throw new Error('API request timed out. Please try again.');
        }

        console.error(`Error calling ${endpoint}:`, error);
        throw error; // Re-throw to let caller handle it
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