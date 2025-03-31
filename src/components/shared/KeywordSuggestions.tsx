// src/components/shared/KeywordSuggestions.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, X, Plus, Clipboard } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface KeywordSuggestionsProps {
    contentTopic: string;
    contentType?: string;
    initialKeywords?: string;
    onKeywordsChange?: (keywords: string) => void;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
    contentTopic,
    contentType = 'blog-post',
    initialKeywords = '',
    onKeywordsChange
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
            // Call the API to generate keywords
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: 'generate-keywords',
                    data: {
                        context: {
                            topic: contentTopic,
                            contentType: contentType,
                            messages: [contentTopic],
                            personas: ['Content marketer']
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();

            // Extract keywords from the response
            let extractedKeywords: string[] = [];

            // Try to get primary keywords
            if (data.primaryKeywords && Array.isArray(data.primaryKeywords)) {
                extractedKeywords = extractedKeywords.concat(
                    data.primaryKeywords.map((kw: any) =>
                        typeof kw === 'string' ? kw : kw.term || ''
                    )
                );
            }

            // Add secondary keywords
            if (data.secondaryKeywords && Array.isArray(data.secondaryKeywords)) {
                extractedKeywords = extractedKeywords.concat(
                    data.secondaryKeywords.map((kw: any) =>
                        typeof kw === 'string' ? kw : kw.term || ''
                    )
                );
            }

            // Filter out keywords that are already selected
            const filteredKeywords = [...new Set(extractedKeywords)]
                .filter(kw => kw.trim() && !selectedKeywords.includes(kw));

            setSuggestedKeywords(filteredKeywords);
            showNotification('success', 'Keywords generated successfully');
        } catch (err) {
            console.error('Error generating keywords:', err);
            setError('Failed to generate keyword suggestions');

            // Fallback keywords based on topic
            const words = contentTopic.toLowerCase().split(/\s+/);
            const fallbackKeywords = [
                contentTopic,
                ...words.filter(word => word.length > 3).map(w => `${w} ${contentType}`),
                `${contentType} guide`,
                `best ${contentType} practices`,
                `${contentType} tips`,
                `${contentType} examples`
            ].filter(kw => kw.trim());

            const filteredFallbacks = [...new Set(fallbackKeywords)]
                .filter(kw => !selectedKeywords.includes(kw));

            setSuggestedKeywords(filteredFallbacks);
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

        showNotification('success', `Added "${keyword}" to your keywords`);
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

        showNotification('info', `Removed "${keyword}" from your keywords`);
    };

    // Copy all keywords to clipboard
    const copyToClipboard = () => {
        if (selectedKeywords.length === 0) return;

        navigator.clipboard.writeText(selectedKeywords.join(', '));
        showNotification('success', 'Keywords copied to clipboard');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 my-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                    Keywords for Your Content
                </h3>
            </div>

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
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center hover:bg-gray-200"
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