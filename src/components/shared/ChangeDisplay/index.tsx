// src/components/shared/ChangeDisplay/index.tsx
// Shared component for displaying content changes elegantly

import React, { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChangeDetail {
    original: string;
    suggestion: string;
    reason: string;
    type: string;
}

interface ChangeDisplayProps {
    changes: ChangeDetail[];
    title?: string;
    showByDefault?: boolean;
    className?: string;
}

const ChangeDisplay: React.FC<ChangeDisplayProps> = ({
    changes,
    title = "🎯 What I Changed",
    showByDefault = false,
    className = ""
}) => {
    const [showDetails, setShowDetails] = useState(showByDefault);

    if (!changes || changes.length === 0) {
        return null;
    }

    return (
        <Card className={`border-2 border-green-300 ${className}`}>
            <CardHeader className="bg-green-50 pb-6">
                <CardTitle className="flex items-center justify-between">
                    <span>{title}</span>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        {showDetails ? 'Hide Details' : 'Click to see the specifics'}
                        <ArrowDown className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                    </button>
                </CardTitle>
            </CardHeader>
            {showDetails && (
                <CardContent className="p-4">
                    <div className="space-y-4">
                        {changes.map((change, index) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                                        {change.type}
                                    </span>
                                    <span className="text-sm text-gray-600">{change.reason}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-xs font-medium text-red-700 mb-1">Original</p>
                                        <p className="text-sm text-red-800">{change.original}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-xs font-medium text-green-700 mb-1">Enhanced</p>
                                        <p className="text-sm text-green-800">{change.suggestion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

export default ChangeDisplay;