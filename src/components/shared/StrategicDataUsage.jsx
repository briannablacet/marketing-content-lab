// src/components/shared/StrategicDataUsage.jsx
import React from 'react';
import { FileCheck, Info } from 'lucide-react';

const StrategicDataUsage = ({ strategicData, showDetails = false }) => {
    if (!strategicData || !strategicData.isComplete) {
        return null;
    }

    return (
        <div className="border-2 border-green-200 rounded-lg overflow-hidden">
            <div className="bg-green-50 border-b px-4 py-3 flex items-center">
                <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-medium">Using Your Marketing Program</h3>
            </div>

            {showDetails ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product info */}
                    {strategicData.product?.name && (
                        <div>
                            <h4 className="font-medium mb-1">Product</h4>
                            <p className="text-sm">{strategicData.product.name}</p>
                            {strategicData.product.valueProposition && (
                                <p className="text-xs italic mt-1 text-gray-600">
                                    "{strategicData.product.valueProposition.substring(0, 80)}..."
                                </p>
                            )}
                        </div>
                    )}

                    {/* Audience info */}
                    {strategicData.audiences?.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-1">Target Audience</h4>
                            <p className="text-sm">{strategicData.audiences[0].role}</p>
                            {strategicData.audiences[0].industry && (
                                <p className="text-xs mt-1 text-gray-600">Industry: {strategicData.audiences[0].industry}</p>
                            )}
                        </div>
                    )}

                    {/* Brand voice */}
                    {strategicData.brandVoice?.brandVoice?.tone && (
                        <div>
                            <h4 className="font-medium mb-1">Brand Voice</h4>
                            <p className="text-sm">{strategicData.brandVoice.brandVoice.tone}</p>
                        </div>
                    )}

                    {/* Style guide */}
                    {strategicData.writingStyle?.styleGuide?.primary && (
                        <div>
                            <h4 className="font-medium mb-1">Style Guide</h4>
                            <p className="text-sm">{strategicData.writingStyle.styleGuide.primary}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4">
                    <p className="text-sm text-gray-700">
                        Creating content using your product profile, target audience, messaging framework, and brand voice.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StrategicDataUsage;