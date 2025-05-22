// src/components/features/ContentEditChat/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';

const PROMPT_SUGGESTIONS = {
    'blog-post': ['Make it more engaging', 'Add more statistics and facts', 'Optimize for SEO', 'Add a compelling call-to-action'],
    'social': ['Make it more concise', 'Add hashtags', 'Make it more engaging', 'Add an emoji'],
    'email': ['Improve the subject line', 'Make it more personal', 'Simplify the language', 'Add a stronger call-to-action'],
    'landing-page': ['Enhance the value proposition', 'Make it more persuasive', 'Add customer testimonials', 'Improve the call-to-action'],
    'default': ['Make it more engaging', 'Simplify the language', 'Add more specific examples', 'Make it more persuasive']
};

const ContentEditChat = ({ originalContent, originalTitle, contentType, onContentUpdate, strategicContext = null }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);
    const [loadedStrategicData, setLoadedStrategicData] = useState(null);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    const getPromptSuggestions = () => PROMPT_SUGGESTIONS[contentType] || PROMPT_SUGGESTIONS['default'];

    useEffect(() => {
        const loadStrategicData = async () => {
            try {
                const data = await StrategicDataService.getAllStrategicData();
                setLoadedStrategicData(data);
                console.log('📊 Loaded strategic data for content chat:', data);
            } catch (error) {
                console.error('❌ Error loading strategic data:', error);
            }
        };
        loadStrategicData();
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => { if (error && inputValue) setError(null); }, [inputValue, error]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() && !selectedSuggestion) return;

        const userMessage = inputValue.trim() || selectedSuggestion;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInputValue('');
        setSelectedSuggestion(null);
        setSuggestionIndex(0);
        setIsLoading(true);
        setStatusMessage({ type: 'info', text: 'Updating content...' });
        setError(null);

        try {
            const baseRequest = {
                originalContent,
                originalTitle,
                userRequest: userMessage,
                previousMessages: messages.slice(-6),
                contentType: contentType || 'content'
            };

            if (strategicContext || loadedStrategicData) {
                const stratContext = strategicContext || {
                    productName: loadedStrategicData?.product?.name,
                    valueProposition: loadedStrategicData?.product?.valueProposition,
                    audience: loadedStrategicData?.audiences?.[0]?.role,
                    industry: loadedStrategicData?.audiences?.[0]?.industry,
                    tone: loadedStrategicData?.brandVoice?.brandVoice?.tone,
                    styleGuide: loadedStrategicData?.writingStyle?.styleGuide?.primary
                };
                baseRequest.strategicContext = stratContext;
                console.log('🧠 Strategic Context:', stratContext);
            }

            const payload = {
                data: baseRequest
            };

            console.log('🚀 SUBMITTING with payload:', JSON.stringify(payload).slice(0, 500));
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/modify`, {

                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                 },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❗ Response not OK:', response.status, errorText);
                throw new Error(`API error ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ SUCCESSFUL response:', data);

            setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Content updated successfully.' }]);

            if (data.updatedContent && onContentUpdate) {
                onContentUpdate(data.updatedContent, data.updatedTitle || originalTitle);
                setStatusMessage({ type: 'success', text: 'Content updated successfully!' });
                setTimeout(() => setStatusMessage(null), 3000);
            }
        } catch (error) {
            console.error('💥 Error updating content:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I was unable to update the content.' }]);
            setStatusMessage({ type: 'error', text: 'Failed to update content.' });
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleSuggestionClick = (suggestion) => {
        setSelectedSuggestion(suggestion);
        setInputValue(suggestion);
        handleSubmit();
    };

    return (
        <div className="flex flex-col h-96 pb-20">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Ask for specific improvements to your content!</p>
                        <p className="text-sm mt-2">For example, "Make it more persuasive" or "Add statistics"</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-3/4 rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{message.content}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {error && (
                <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm mx-4 mb-2">
                    <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />{error}
                    </div>
                </div>
            )}

            {statusMessage && (
                <div className={`px-4 py-2 text-sm ${statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    <div className="flex items-center">
                        {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 mr-1" /> : statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 mr-1" /> : <RefreshCw className="w-4 h-4 mr-1 animate-spin" />}
                        {statusMessage.text}
                    </div>
                </div>
            )}

            {(strategicContext || loadedStrategicData) && (
                <div className="px-4 py-2 bg-green-50 text-green-800 text-xs border-t border-green-100">
                    <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Using your marketing program's strategic data for content improvements
                    </div>
                </div>
            )}

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <div className="flex overflow-x-auto gap-2 pb-2">
                    {getPromptSuggestions().map((suggestion, index) => (
                        <button key={index} onClick={() => handleSuggestionClick(suggestion)} className={`px-3 py-1.5 border rounded-full text-sm whitespace-nowrap ${selectedSuggestion === suggestion ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 hover:bg-gray-100'}`}>{suggestion}</button>
                    ))}
                </div>
            </div>

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
                        {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContentEditChat;
