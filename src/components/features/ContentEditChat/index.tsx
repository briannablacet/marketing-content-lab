// src/components/features/ContentEditChat/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ContentEditChatProps {
    contentType: string;
    generatedContent: string;
    generatedTitle: string;
    onContentUpdate: (newContent: string, newTitle: string) => void;
}

const ContentEditChat: React.FC<ContentEditChatProps> = ({
    contentType,
    generatedContent,
    generatedTitle,
    onContentUpdate
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'How would you like to improve this content? I can help make specific changes or additions.',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage: Message = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputMessage('');
        setIsProcessing(true);

        try {
            // Call the API with the user's request
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'modify-content',
                    data: {
                        contentType,
                        originalContent: generatedContent,
                        originalTitle: generatedTitle,
                        userRequest: inputMessage,
                        previousMessages: messages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Add AI response to chat
            const aiResponse: Message = {
                role: 'assistant',
                content: data.message || 'I\'ve made those changes for you.',
                timestamp: new Date()
            };

            setMessages(prevMessages => [...prevMessages, aiResponse]);

            // Update the content if the API returned new content
            if (data.updatedContent) {
                onContentUpdate(data.updatedContent, data.updatedTitle || generatedTitle);
            }

        } catch (error) {
            console.error('Error in chat:', error);

            // Add error message
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I had trouble processing your request. Please try again.',
                timestamp: new Date()
            };

            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-3 bg-blue-50 border-b flex items-center">
                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Content Refinement Assistant</h3>
            </div>

            {/* Messages Container */}
            <div className="h-64 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-3/4 rounded-lg px-4 py-2 ${message.role === 'user'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-3 flex items-center">
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me to revise or improve specific parts..."
                    className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                    disabled={isProcessing}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isProcessing}
                    className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default ContentEditChat;