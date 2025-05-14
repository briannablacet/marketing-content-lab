// src/components/features/ContentEditChat/index.tsx
// Enhanced ContentEditChat component that leverages strategic data

import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';
import { callApiWithStrategicData } from '../../../services/ApiStrategicConnector';

// Sample prompt suggestions based on content type
const PROMPT_SUGGESTIONS = {
    'blog-post': [
        'Make it more engaging',
        'Add more statistics and facts',
        'Optimize for SEO',
        'Add a compelling call-to-action'
    ],
    'social': [
        'Make it more concise',
        'Add hashtags',
        'Make it more engaging',
        'Add an emoji'
    ],
    'email': [
        'Improve the subject line',
        'Make it more personal',
        'Simplify the language',
        'Add a stronger call-to-action'
    ],
    'landing-page': [
        'Enhance the value proposition',
        'Make it more persuasive',
        'Add customer testimonials',
        'Improve the call-to-action'
    ],
    'default': [
        'Make it more engaging',
        'Simplify the language',
        'Add more specific examples',
        'Make it more persuasive'
    ]
};

const ContentEditChat = ({
    originalContent,
    originalTitle,
    contentType,
    onContentUpdate,
    strategicContext = null
}) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);
    const [loadedStrategicData, setLoadedStrategicData] = useState(null);
    const [error, setError] = useState(null); // Added error state

    const messagesEndRef = useRef(null);

    // Get prompt suggestions based on content type
    const getPromptSuggestions = () => {
        const contentKey = Object.keys(PROMPT_SUGGESTIONS).includes(contentType)
            ? contentType
            : 'default';
        return PROMPT_SUGGESTIONS[contentKey];
    };

    // Load strategic data when component mounts
    useEffect(() => {
        const loadStrategicData = async () => {
            try {
                const data = await StrategicDataService.getAllStrategicData();
                setLoadedStrategicData(data);
                console.log('Loaded strategic data for content chat:', data);
            } catch (error) {
                console.error('Error loading strategic data in ContentEditChat:', error);
            }
        };

        loadStrategicData();
    }, []);

    // Scroll to bottom of message list when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Clear error when user types
    useEffect(() => {
        if (error && inputValue) {
            setError(null);
        }
    }, [inputValue, error]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputValue.trim() && !selectedSuggestion) return;

        // Use input value or selected suggestion
        const userMessage = inputValue.trim() || selectedSuggestion;

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInputValue('');
        setSelectedSuggestion(null);
        setSuggestionIndex(0);
        setIsLoading(true);
        setStatusMessage({ type: 'info', text: 'Updating content...' });
        setError(null); // Clear any previous errors

        try {
            // Prepare request with original content and conversation history
            const requestData = {
                originalContent: originalContent,
                originalTitle: originalTitle,
                userRequest: userMessage,
                previousMessages: messages.slice(-6), // Send last 6 messages for context
                contentType: contentType || 'content'
            };

            // Gather strategic context - either from props or from loaded data
            const stratContext = strategicContext || {
                productName: loadedStrategicData?.product?.name,
                valueProposition: loadedStrategicData?.product?.valueProposition,
                audience: loadedStrategicData?.audiences?.[0]?.role,
                industry: loadedStrategicData?.audiences?.[0]?.industry,
                tone: loadedStrategicData?.brandVoice?.brandVoice?.tone,
                styleGuide: loadedStrategicData?.writingStyle?.styleGuide?.primary
            };

            // Add strategic context to request
            requestData.strategicContext = stratContext;

            console.log('Submitting content edit request with strategic context:', {
                request: userMessage,
                hasProductContext: !!stratContext.productName,
                hasAudienceContext: !!stratContext.audience,
                hasToneContext: !!stratContext.tone
            });

            // Direct API call to the same endpoint that's working for content generation
            // This ensures consistency with how other parts of the app call the API
            console.log('Making direct API call to /api/api_endpoints for modify-content');

            const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/api_endpoints`;

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'modify-content',
                    data: requestData,
                }),
            });

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Content edit API error:', response.status, errorText);
                throw new Error(`API error: ${response.status} - ${response.statusText}`);
            }

            // Parse the response
            const data = await response.json();
            console.log('Content edit API response:', data);

            if (data) {
                // Add assistant response to chat
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message || 'Content updated successfully.'
                }]);

                // Update the content in parent component
                if (data.updatedContent && onContentUpdate) {
                    onContentUpdate(
                        data.updatedContent,
                        data.updatedTitle || originalTitle
                    );

                    setStatusMessage({
                        type: 'success',
                        text: 'Content updated successfully!'
                    });

                    // Clear status after 3 seconds
                    setTimeout(() => setStatusMessage(null), 3000);
                }
            } else {
                throw new Error('No response data received from API');
            }
        } catch (error) {
            console.error('Error updating content:', error);

            // Add error message to chat
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I was unable to update the content. Please try again with a different request.'
            }]);

            // Set status message
            setStatusMessage({
                type: 'error',
                text: 'Failed to update content. Please try again.'
            });

            // Set error for display
            setError(`Error: ${error.message || 'Failed to update content'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle suggestion selection
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    const handleSuggestionClick = (suggestion) => {
        setSelectedSuggestion(suggestion);
        setInputValue(suggestion);
        handleSubmit({ preventDefault: () => { } });
    };

    return (
        <div className="flex flex-col h-96 pb-20">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Ask for specific improvements to your content!</p>
                        <p className="text-sm mt-2">For example, "Make it more persuasive" or "Add statistics"</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3/4 rounded-lg px-4 py-2 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm mx-4 mb-2">
                    <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {error}
                    </div>
                </div>
            )}

            {/* Status Message */}
            {statusMessage && (
                <div
                    className={`px-4 py-2 text-sm ${statusMessage.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : statusMessage.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                >
                    <div className="flex items-center">
                        {statusMessage.type === 'error' ? (
                            <AlertCircle className="w-4 h-4 mr-1" />
                        ) : statusMessage.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        )}
                        {statusMessage.text}
                    </div>
                </div>
            )}

            {/* Strategic Context Display */}
            {(strategicContext || loadedStrategicData) && (
                <div className="px-4 py-2 bg-green-50 text-green-800 text-xs border-t border-green-100">
                    <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Using your marketing program's strategic data for content improvements
                    </div>
                </div>
            )}

            {/* Suggestions */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <div className="flex overflow-x-auto gap-2 pb-2">
                    {getPromptSuggestions().map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-3 py-1.5 border rounded-full text-sm whitespace-nowrap ${selectedSuggestion === suggestion
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type a request to improve this content..."
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                        disabled={isLoading || (!inputValue.trim() && !selectedSuggestion)}
                    >
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContentEditChat;