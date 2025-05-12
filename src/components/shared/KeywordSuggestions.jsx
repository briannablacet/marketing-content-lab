// src/components/shared/KeywordSuggestions.jsx
// Enhanced KeywordSuggestions component that leverages strategic data

import React, { useState, useEffect } from 'react';
import { Sparkles, Search, RefreshCw, Plus, CheckCircle } from 'lucide-react';
import StrategicDataService from '../../services/StrategicDataService';
import { callApiWithStrategicData } from '../../services/ApiStrategicConnector';

const KeywordSuggestions = ({
    contentTopic,
    contentType,
    initialKeywords = '',
    onKeywordsChange,
    showSelectionInstructions = false
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [keywords, setKeywords] = useState({
        primaryKeywords: [],
        secondaryKeywords: [],
        keywordGroups: []
    });
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [error, setError] = useState(null);
    const [strategicData, setStrategicData] = useState(null);

    // Initialize selected keywords from initialKeywords prop
    useEffect(() => {
        if (initialKeywords) {
            setSelectedKeywords(
                initialKeywords.split(',')
                    .map(k => k.trim())
                    .filter(k => k)
            );
        }
    }, [initialKeywords]);

    // Load strategic data when component mounts
    useEffect(() => {
        const loadStrategicData = async () => {
            try {
                const data = await StrategicDataService.getAllStrategicData();
                setStrategicData(data);

                // If strategic data has keywords, pre-populate them
                if (data?.seoKeywords?.primaryKeywords?.length > 0) {
                    // Convert objects to strings if necessary
                    const primaryTerms = data.seoKeywords.primaryKeywords
                        .map(k => typeof k === 'string' ? k : k.term)
                        .filter(Boolean);

                    const secondaryTerms = data.seoKeywords.secondaryKeywords
                        ? data.seoKeywords.secondaryKeywords
                            .map(k => typeof k === 'string' ? k : k.term)
                            .filter(Boolean)
                        : [];

                    // Update the keywords state with strategic data
                    setKeywords(prev => ({
                        ...prev,
                        primaryKeywords: primaryTerms,
                        secondaryKeywords: secondaryTerms
                    }));
                }
            } catch (error) {
                console.error('Error loading strategic data in KeywordSuggestions:', error);
            }
        };

        loadStrategicData();
    }, []);

    // Generate keyword suggestions from the API
    const generateKeywords = async () => {
        if (!contentTopic && !contentType) {
            setError('Please provide a content topic or type to generate keywords.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare request with context from both inputs and strategic data
            const requestData = {
                context: {
                    messages: contentTopic || '',
                    contentType: contentType || 'blog-post',
                    personas: strategicData?.audiences?.map(a => a.role) || [],
                    productInfo: strategicData?.product || {}
                }
            };

            // Log what we're using
            console.log('Generating keywords using strategic context:', {
                contentTopic,
                contentType,
                hasProduct: !!strategicData?.product?.name,
                hasAudiences: strategicData?.audiences?.length > 0
            });

            // Call the API with strategic data
            const response = await callApiWithStrategicData('generate-keywords', requestData);

            if (response) {
                console.log('Keyword API response:', response);

                // Update state with the new keywords
                setKeywords({
                    primaryKeywords: response.primaryKeywords || [],
                    secondaryKeywords: response.secondaryKeywords || [],
                    keywordGroups: response.keywordGroups || []
                });

                // If no keywords were selected yet, auto-select the first 3 primary keywords
                if (selectedKeywords.length === 0 && response.primaryKeywords?.length > 0) {
                    const initialSelections = response.primaryKeywords.slice(0, 3);
                    setSelectedKeywords(initialSelections);

                    // Notify parent component
                    if (onKeywordsChange) {
                        onKeywordsChange(initialSelections.join(', '));
                    }
                }
            }
        } catch (error) {
            console.error('Error generating keywords:', error);
            setError('Failed to generate keywords. Please try again.');

            // Set some fallback keywords
            setKeywords({
                primaryKeywords: ['content marketing', 'digital strategy', 'blog writing'],
                secondaryKeywords: ['SEO', 'content creation', 'marketing tips', 'social media'],
                keywordGroups: [
                    {
                        category: 'Content Types',
                        keywords: ['blog posts', 'social media', 'email newsletters']
                    }
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle keyword selection
    const toggleKeyword = (keyword) => {
        let updatedSelection;

        if (selectedKeywords.includes(keyword)) {
            // Remove keyword if already selected
            updatedSelection = selectedKeywords.filter(k => k !== keyword);
        } else {
            // Add keyword if not already selected
            updatedSelection = [...selectedKeywords, keyword];
        }

        setSelectedKeywords(updatedSelection);

        // Notify parent component of change
        if (onKeywordsChange) {
            onKeywordsChange(updatedSelection.join(', '));
        }
    };

    // Run keyword generation once when component mounts
    useEffect(() => {
        // Don't generate if there's no content topic yet or if we already have strategic keywords
        if ((contentTopic || contentType) &&
            (!keywords.primaryKeywords.length || keywords.primaryKeywords.length < 3)) {
            generateKeywords();
        }
    }, [contentTopic, contentType]);

    return (
        <div className="space-y-6">
            {/* Generate Keywords Button */}
            <div className="flex flex-wrap gap-2 items-center mb-4">
                <button
                    onClick={generateKeywords}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center text-sm"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-1.5" />
                            <span>Generate Keywords</span>
                        </>
                    )}
                </button>

                <span className="text-sm text-gray-500">
                    {contentTopic ? `for "${contentTopic.substring(0, 30)}${contentTopic.length > 30 ? '...' : ''}"` : ''}
                </span>
            </div>

            {/* Selection Instructions */}
            {showSelectionInstructions && (
                <div className="text-sm text-gray-600 mb-3">
                    <p>Click on a keyword to add it to your selection.</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Strategic Data Notice */}
            {strategicData?.seoKeywords?.primaryKeywords?.length > 0 && (
                <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md mb-4">
                    Using keywords from your marketing program's SEO strategy.
                </div>
            )}

            {/* Primary Keywords */}
            {keywords.primaryKeywords.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Primary Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.primaryKeywords.map((keyword, index) => (
                            <button
                                key={`primary-${index}`}
                                onClick={() => toggleKeyword(keyword)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${selectedKeywords.includes(keyword)
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {selectedKeywords.includes(keyword) ? (
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                ) : (
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                )}
                                {keyword}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Secondary Keywords */}
            {keywords.secondaryKeywords.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Secondary Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.secondaryKeywords.map((keyword, index) => (
                            <button
                                key={`secondary-${index}`}
                                onClick={() => toggleKeyword(keyword)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${selectedKeywords.includes(keyword)
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {selectedKeywords.includes(keyword) ? (
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                ) : (
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                )}
                                {keyword}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Keyword Groups */}
            {keywords.keywordGroups.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Keyword Groups</h3>
                    <div className="space-y-3">
                        {keywords.keywordGroups.map((group, groupIndex) => (
                            <div key={`group-${groupIndex}`}>
                                <h4 className="text-xs font-medium text-gray-600 mb-1.5">{group.category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {group.keywords.map((keyword, keywordIndex) => (
                                        <button
                                            key={`group-${groupIndex}-${keywordIndex}`}
                                            onClick={() => toggleKeyword(keyword)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${selectedKeywords.includes(keyword)
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                        >
                                            {selectedKeywords.includes(keyword) ? (
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                            ) : (
                                                <Plus className="w-3.5 h-3.5 mr-1" />
                                            )}
                                            {keyword}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && !keywords.primaryKeywords.length && (
                <div className="py-6 text-center">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Loading keyword suggestions...</p>
                </div>
            )}
        </div>
    );
};

export default KeywordSuggestions;