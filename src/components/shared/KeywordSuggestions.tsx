// src/components/shared/KeywordSuggestions.tsx
// FIXED: Clean, simple keyword suggestions for ContentCreator

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Plus, Clipboard } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface KeywordSuggestionsProps {
    contentTopic: string;
    contentType?: string;
    initialKeywords?: string;
    onKeywordsChange?: (keywords: string) => void;
    showSelectionInstructions?: boolean;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
    contentTopic,
    contentType = 'blog-post',
    initialKeywords = '',
    onKeywordsChange,
    showSelectionInstructions = false
}) => {
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [customKeyword, setCustomKeyword] = useState('');
    const [error, setError] = useState('');

    // Parse initial keywords on component mount
    useEffect(() => {
        if (initialKeywords) {
            const keywordArray = initialKeywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k !== '');

            setSelectedKeywords(keywordArray);
        }
    }, [initialKeywords]);

    // Generate keywords based on content topic
    const generateKeywords = async () => {
        if (!contentTopic || contentTopic.trim() === '') {
            setError('Please enter a topic before generating keywords');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('🔍 Generating keywords for:', contentTopic);

            // FIXED: Use the correct local API endpoint
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    mode: 'keywords',
                    data: {
                        contentTopic: contentTopic,
                        contentType: contentType
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Keywords API response:', result);

            // The result should have { keywords: ["keyword1", "keyword2", ...] }
            const extractedKeywords = result.keywords || [];

            console.log('📝 Extracted keywords:', extractedKeywords);

            // Filter out keywords that are already selected
            const filteredKeywords = extractedKeywords.filter((kw: string) =>
                kw && kw.trim() && !selectedKeywords.includes(kw.trim())
            );

            setSuggestedKeywords(filteredKeywords);
            showNotification('Keywords generated successfully', 'success');

        } catch (err) {
            console.error('❌ Error generating keywords:', err);
            setError('Failed to generate keyword suggestions');

            // Improved fallback keywords based on topic
            const topicWords = contentTopic.toLowerCase()
                .split(/\s+/)
                .filter(word => word.length > 3 && !['create', 'blog', 'post', 'content'].includes(word));

            const fallbackKeywords = [
                ...topicWords,
                ...topicWords.map(word => `${word} tips`),
                ...topicWords.map(word => `best ${word}`),
                ...topicWords.map(word => `${word} strategy`),
                `${contentType} guide`,
                `${contentType} best practices`,
                `how to ${contentTopic.toLowerCase().split('\n')[0]}`,
                ...(contentType ? [`${contentType} examples`, `${contentType} ideas`] : [])
            ].filter(kw => kw.trim() && kw.length > 3);

            const filteredFallbacks = [...new Set(fallbackKeywords)]
                .filter(kw => !selectedKeywords.includes(kw))
                .slice(0, 15);

            setSuggestedKeywords(filteredFallbacks);
            showNotification('Using fallback keywords due to API error', 'warning');
        } finally {
            setIsLoading(false);
        }
    };

    // Add a keyword to the selected list
    const addKeyword = (keyword: string) => {
        if (!keyword.trim()) return;
        if (selectedKeywords.includes(keyword)) return;

        const newSelectedKeywords = [...selectedKeywords, keyword];
        setSelectedKeywords(newSelectedKeywords);

        // Remove from suggestions if it was there
        if (suggestedKeywords.includes(keyword)) {
            setSuggestedKeywords(suggestedKeywords.filter(k => k !== keyword));
        }

        // Notify parent component
        if (onKeywordsChange) {
            onKeywordsChange(newSelectedKeywords.join(', '));
        }

        showNotification(`Added "${keyword}" to your keywords`, 'success');
    };

    // Add a custom keyword
    const handleAddCustomKeyword = () => {
        if (!customKeyword.trim()) return;
        addKeyword(customKeyword.trim());
        setCustomKeyword('');
    };

    // Handle key press in custom keyword input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && customKeyword.trim()) {
            e.preventDefault();
            handleAddCustomKeyword();
        }
    };

    // Remove a keyword from selection
    const removeKeyword = (keyword: string) => {
        const newSelectedKeywords = selectedKeywords.filter(k => k !== keyword);
        setSelectedKeywords(newSelectedKeywords);

        // Notify parent component
        if (onKeywordsChange) {
            onKeywordsChange(newSelectedKeywords.join(', '));
        }

        // Add back to suggestions
        if (!suggestedKeywords.includes(keyword)) {
            setSuggestedKeywords([...suggestedKeywords, keyword]);
        }

        showNotification(`Removed "${keyword}" from your keywords`, 'info');
    };

    // Copy all keywords to clipboard
    const copyToClipboard = () => {
        if (selectedKeywords.length === 0) return;

        navigator.clipboard.writeText(selectedKeywords.join(', '));
        showNotification('Keywords copied to clipboard', 'success');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 my-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                    Keywords for Your Content
                </h3>
            </div>

            {showSelectionInstructions && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>Click on a keyword to add it</strong> to your content. Selected keywords will be highlighted and can be removed by clicking the X.
                    </p>
                </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
                Select keywords to optimize your content. These will help search engines understand what your content is about.
            </p>

            {/* Keywords Generation Controls */}
            <div className="mb-5">
                <button
                    onClick={generateKeywords}
                    disabled={isLoading || !contentTopic.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Keywords...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Keywords
                        </>
                    )}
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
            </div>

            {/* Selected Keywords */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Selected Keywords:</h4>
                    {selectedKeywords.length > 0 && (
                        <button
                            onClick={copyToClipboard}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <Clipboard className="w-3 h-3 mr-1" />
                            Copy all
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3 min-h-[30px]">
                    {selectedKeywords.length > 0 ? (
                        selectedKeywords.map(keyword => (
                            <div key={keyword} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                                {keyword}
                                <button
                                    onClick={() => removeKeyword(keyword)}
                                    className="ml-1 text-blue-400 hover:text-blue-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No keywords selected yet</p>
                    )}
                </div>

                {/* Custom Keyword Input */}
                <div className="flex gap-2 mt-3">
                    <input
                        type="text"
                        value={customKeyword}
                        onChange={(e) => setCustomKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add your own keyword"
                        className="flex-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                        onClick={handleAddCustomKeyword}
                        disabled={!customKeyword.trim()}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border text-sm disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Suggested Keywords */}
            {suggestedKeywords.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                        {suggestedKeywords.map(keyword => (
                            <button
                                key={keyword}
                                onClick={() => addKeyword(keyword)}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center hover:bg-gray-200 transition-colors"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {keyword}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-xs text-gray-500 mt-5">
                Tip: Good keywords are specific, relevant to your topic, and match what your audience is searching for.
            </div>
        </div>
    );
};

export default KeywordSuggestions;