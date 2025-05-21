import React from 'react';
import { Lightbulb } from 'lucide-react';

interface AIAssistanceProps {
    text: string;
    linkText?: string;
    linkHref?: string;
    onClick?: () => void;
}

const AIAssistance: React.FC<AIAssistanceProps> = ({
    text,
    linkText,
    linkHref,
    onClick
}) => {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
                <p className="text-sm text-gray-700">
                    {text}{' '}
                    {linkText && (linkHref || onClick) && (
                        <button
                            onClick={onClick || (() => window.location.href = linkHref!)}
                            className="text-blue-600 hover:underline"
                        >
                            {linkText}
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AIAssistance; 