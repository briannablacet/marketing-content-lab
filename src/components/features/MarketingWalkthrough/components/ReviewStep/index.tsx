// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
// Review component that displays all collected strategy data (like complete page but cleaner)

import React, { useState, useEffect } from 'react';
import { Card } from '../../../../shared/ui/card';
import {
    Users, Target, MessageSquare, TrendingUp, Eye, CheckCircle, FileText
} from 'lucide-react';

interface ProductInfo {
    name?: string;
    type?: string;
    valueProposition?: string;
    keyBenefits?: string[];
}

interface TargetAudience {
    role?: string;
    industry?: string;
    challenges?: string[];
}

interface MessageFramework {
    valueProposition?: string;
    pillar1?: string;
    pillar2?: string;
    pillar3?: string;
    keyBenefits?: string[];
}

interface Competitor {
    name?: string;
    description?: string;
    knownMessages?: string[];
    strengths?: string[];
    weaknesses?: string[];
}

interface BrandVoice {
    archetype?: string;
    tone?: string;
    personality?: string[];
    voiceCharacteristics?: string[];
}

interface ReviewStepProps {
    onNext?: () => void;
    onBack?: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onNext, onBack }) => {
    // State for all the strategy data
    const [productInfo, setProductInfo] = useState<ProductInfo>({});
    const [targetAudiences, setTargetAudiences] = useState<TargetAudience[]>([]);
    const [messageFramework, setMessageFramework] = useState<MessageFramework>({});
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [brandVoice, setBrandVoice] = useState<BrandVoice>({});
    const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load all strategy data from localStorage (same as complete page)
    useEffect(() => {
        try {
            // Product Info
            const savedProduct = localStorage.getItem('marketingProduct');
            if (savedProduct) {
                setProductInfo(JSON.parse(savedProduct));
            }

            // Target Audiences
            const savedAudiences = localStorage.getItem('marketingTargetAudiences');
            if (savedAudiences) {
                setTargetAudiences(JSON.parse(savedAudiences));
            }

            // Message Framework
            const savedFramework = localStorage.getItem('messageFramework');
            if (savedFramework) {
                setMessageFramework(JSON.parse(savedFramework));
            }

            // Competitors
            const savedCompetitors = localStorage.getItem('marketingCompetitors');
            if (savedCompetitors) {
                setCompetitors(JSON.parse(savedCompetitors));
            }

            // Brand Voice
            const savedBrandVoice = localStorage.getItem('brandVoice');
            if (savedBrandVoice) {
                setBrandVoice(JSON.parse(savedBrandVoice));
            }

            // Content Types
            const savedContentTypes = localStorage.getItem('selectedContentTypes');
            if (savedContentTypes) {
                setSelectedContentTypes(JSON.parse(savedContentTypes));
            }

        } catch (error) {
            console.error('Error loading strategy data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="text-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading your marketing strategy...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Your Marketing Strategy Overview</h2>
                <p className="text-gray-600">
                    Review your complete strategic foundation and make any needed adjustments.
                </p>
            </div>

            {/* Strategy Summary Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Business Info */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">Business Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Product/Service</p>
                            <p className="text-gray-600">{productInfo.name || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Description</p>
                            <p className="text-gray-600 text-sm">{productInfo.type || 'Not specified'}</p>
                        </div>
                    </div>
                </Card>

                {/* Value Proposition */}
                <Card className="p-6 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold">Value Proposition</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {messageFramework.valueProposition || productInfo.valueProposition || 'Not yet defined'}
                    </p>
                </Card>

                {/* Target Audiences */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">Target Audiences</h3>
                    </div>
                    <div className="space-y-4">
                        {targetAudiences.length > 0 ? (
                            targetAudiences.map((audience, index) => (
                                <div key={index} className="border-l-4 border-purple-200 pl-3">
                                    <p className="font-medium text-sm">{audience.role}</p>
                                    <p className="text-gray-600 text-sm">{audience.industry}</p>
                                    {audience.challenges && audience.challenges.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {audience.challenges[0]}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No target audiences defined</p>
                        )}
                    </div>
                </Card>

                {/* Message Pillars */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold">Message Pillars</h3>
                    </div>
                    <div className="space-y-3">
                        {messageFramework.pillar1 && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Pillar 1</p>
                                <p className="text-gray-600 text-sm">{messageFramework.pillar1}</p>
                            </div>
                        )}
                        {messageFramework.pillar2 && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Pillar 2</p>
                                <p className="text-gray-600 text-sm">{messageFramework.pillar2}</p>
                            </div>
                        )}
                        {messageFramework.pillar3 && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Pillar 3</p>
                                <p className="text-gray-600 text-sm">{messageFramework.pillar3}</p>
                            </div>
                        )}
                        {!messageFramework.pillar1 && !messageFramework.pillar2 && !messageFramework.pillar3 && (
                            <p className="text-gray-500 text-sm">No message pillars defined</p>
                        )}
                    </div>
                </Card>

                {/* Brand Voice */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-100 rounded-lg">
                            <Eye className="w-5 h-5 text-pink-600" />
                        </div>
                        <h3 className="font-semibold">Brand Voice</h3>
                    </div>
                    <div className="space-y-3">
                        {brandVoice.archetype && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Archetype</p>
                                <p className="text-gray-600">{brandVoice.archetype}</p>
                            </div>
                        )}
                        {brandVoice.tone && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Tone</p>
                                <p className="text-gray-600">{brandVoice.tone}</p>
                            </div>
                        )}
                        {!brandVoice.archetype && !brandVoice.tone && (
                            <p className="text-gray-500 text-sm">Brand voice not yet defined</p>
                        )}
                    </div>
                </Card>

                {/* Key Benefits */}
                {messageFramework.keyBenefits && messageFramework.keyBenefits.length > 0 && (
                    <Card className="p-6 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold">Key Benefits</h3>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                            {messageFramework.keyBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 text-sm">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Competitors */}
                {competitors.length > 0 && (
                    <Card className="p-6 md:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="font-semibold">Competitive Analysis</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {competitors.map((competitor, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                    <h4 className="font-medium mb-2">{competitor.name}</h4>
                                    {competitor.description && (
                                        <p className="text-gray-600 text-sm mb-2">{competitor.description}</p>
                                    )}
                                    {competitor.knownMessages && competitor.knownMessages.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-700 mb-1">Key Messages:</p>
                                            <p className="text-xs text-gray-600">{competitor.knownMessages[0]}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Content Types */}
                {selectedContentTypes.length > 0 && (
                    <Card className="p-6 md:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold">Selected Content Types</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedContentTypes.map(type => (
                                <span key={type} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ReviewStep;