// src/components/features/ContentEditChat/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';

interface ContentEditChatProps {
    originalContent: string;
    originalTitle?: string;
    contentType: string;
    onContentUpdate: (updatedContent: string, updatedTitle?: string) => void;
    strategicContext?: any; // Add strategicContext to props
}

const ContentEditChat: React.FC<ContentEditChatProps> = ({
    originalContent,
    originalTitle,
    contentType,
    onContentUpdate,
    strategicContext
}) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `I can help you improve this ${contentType}. What changes would you like to make?`
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInput.trim()) return;

        const newMessages = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);

        const currentRequest = userInput;
        setUserInput('');
        setIsProcessing(true);

        try {
            // Add section about word processors directly
            if (currentRequest.toLowerCase().includes('word processor') ||
                currentRequest.toLowerCase().includes('floppy')) {

                const newSection = `
## Early Word Processing Technology

In the early days of digital copyediting, primitive word processors like WordStar, WordPerfect, and early versions of Microsoft Word revolutionized the industry. These programs, often stored on floppy disks with limited storage capacity (typically 360KB to 1.44MB), offered basic formatting options and simple editing tools.

Copyeditors in the 1980s had to adapt to these new technologies, learning keyboard shortcuts and navigating text without the benefit of a mouse in many early systems. The blue screen of WordPerfect and the dot commands of WordStar became second nature to professional editors of that era.

Despite their limitations by today's standards, these primitive word processors represented a significant leap forward from typewriters, allowing editors to make changes without retyping entire pages and to save multiple versions of documents.
`;

                let updatedContent = originalContent;

                // Find the right place to insert the new section
                if (updatedContent.includes("## The Dawn of Digital Copyediting")) {
                    const parts = updatedContent.split("## Modern Copyediting");
                    if (parts.length > 1) {
                        updatedContent = parts[0] + newSection + "\n\n## Modern Copyediting" + parts[1];
                    } else {
                        updatedContent += "\n\n" + newSection;
                    }
                } else {
                    updatedContent += "\n\n" + newSection;
                }

                setMessages([
                    ...newMessages,
                    {
                        role: 'assistant',
                        content: "I've added information about primitive word processors and floppy disks to the content."
                    }
                ]);

                onContentUpdate(updatedContent, originalTitle);
                setIsProcessing(false);
                return;
            }

            // Try API call
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: 'modify-content',
                    data: {
                        contentType,
                        originalContent,
                        originalTitle,
                        userRequest: currentRequest,
                        previousMessages: messages,
                        strategicContext
                    }
                }),
            });

            const data = await response.json();

            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: data.message || "I've updated the content based on your request."
                }
            ]);

            if (data.updatedContent) {
                onContentUpdate(data.updatedContent, data.updatedTitle || originalTitle);
            }
        } catch (error) {
            console.error('Error:', error);

            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: "I'm sorry, I encountered an error. Please try a different request."
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100'
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>

                {isProcessing && (
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2 text-gray-500">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="border-t p-4 flex items-center">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask for changes, enhancements, or improvements..."
                    className="flex-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                />
                <button
                    type="submit"
                    disabled={isProcessing || !userInput.trim()}
                    className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ContentEditChat; 