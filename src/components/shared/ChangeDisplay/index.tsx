// src/components/shared/ChangeDisplay.tsx
// Component for displaying granular change details in an accordion format

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface Change {
    original: string;
    suggestion: string;
    reason: string;
    type: string;
}

interface ChangeDisplayProps {
    changes: Change[];
    title?: string;
    showByDefault?: boolean;
    className?: string;
}

const ChangeDisplay: React.FC<ChangeDisplayProps> = ({
    changes,
    title = "What Changed",
    showByDefault = false,
    className = ""
}) => {
    const [isExpanded, setIsExpanded] = useState(showByDefault);

    if (!changes || changes.length === 0) {
        return null;
    }

    return (
        <div className={`border border-gray-200 rounded-lg ${className}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
                    ) : (
                        <ChevronRight className="w-4 h-4 mr-2 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-800">{title}</span>
                    <span className="ml-2 text-sm text-gray-500">
                        ({changes.length} change{changes.length !== 1 ? 's' : ''})
                    </span>
                </div>
            </button>

            {isExpanded && (
                <div className="border-t border-gray-200 px-4 py-3 space-y-3">
                    {changes.map((change, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${change.type === 'improvement' ? 'bg-blue-100 text-blue-800' :
                                        change.type === 'addition' ? 'bg-green-100 text-green-800' :
                                            change.type === 'statistical' ? 'bg-purple-100 text-purple-800' :
                                                change.type === 'refinement' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                    {change.type}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-red-600">Before:</span>
                                    <div className="mt-1 p-2 bg-red-50 border-l-2 border-red-200 text-gray-700">
                                        "{change.original}"
                                    </div>
                                </div>

                                <div>
                                    <span className="font-medium text-green-600">After:</span>
                                    <div className="mt-1 p-2 bg-green-50 border-l-2 border-green-200 text-gray-700">
                                        "{change.suggestion}"
                                    </div>
                                </div>

                                <div>
                                    <span className="font-medium text-gray-600">Reason:</span>
                                    <div className="mt-1 text-gray-600">
                                        {change.reason}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChangeDisplay;