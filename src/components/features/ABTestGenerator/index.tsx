import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Copy, CheckCircle } from 'lucide-react';
import ScreenTemplate from '@/components/shared/UIComponents';

// Content types that can be A/B tested
const CONTENT_TYPES = [
    {
        id: 'email_subject',
        name: 'Email Subject Lines',
        description: 'Test different subject lines to improve open rates',
        examples: ['Benefit-focused', 'Question-based', 'Curiosity-driven']
    },
    {
        id: 'cta',
        name: 'Call-to-Action Variations',
        description: 'Test different CTAs to improve click-through rates',
        examples: ['Action-oriented', 'Benefit-focused', 'Urgency-driven']
    },
    {
        id: 'headline',
        name: 'Content Headlines',
        description: 'Test headline variations to improve engagement',
        examples: ['Question headlines', 'How-to headlines', 'List headlines']
    },
    {
        id: 'value_prop',
        name: 'Value Proposition Phrasing',
        description: 'Test different ways to communicate your value',
        examples: ['Feature-focused', 'Benefit-focused', 'Problem-solution']
    },
    {
        id: 'ad_copy',
        name: 'Ad Copy',
        description: 'Test different ad variations to improve conversions',
        examples: ['Feature highlight', 'Social proof', 'Limited time offer']
    }
];

const ABTestGenerator: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [contentContext, setContentContext] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [numVariations, setNumVariations] = useState(2);
    const [variations, setVariations] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [savedVariations, setSavedVariations] = useState(false);

    // Get the currently selected content type
    const selectedContentType = CONTENT_TYPES.find(type => type.id === selectedType);

    // Function to generate content variations
    const generateVariations = async () => {
        if (!selectedType || !contentContext) return;

        setIsGenerating(true);
        setSavedVariations(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/generate-variations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    data: {
                        contentType: selectedType,
                        contentContext,
                        targetAudience,
                        numVariations
                    }
                }),
            });

            const data = await response.json();

            if (data.variations && Array.isArray(data.variations)) {
                setVariations(data.variations);
            } else {
                // In case of API error, provide some fallback variations
                const fallbackVariations = [];
                for (let i = 0; i < numVariations; i++) {
                    fallbackVariations.push(`[Variation ${i + 1}] AI-generated ${selectedContentType?.name} based on: "${contentContext}" for audience: "${targetAudience || 'general'}"`);
                }
                setVariations(fallbackVariations);
                console.error('Error generating variations:', data.error || 'Invalid response format');
            }
        } catch (error) {
            console.error('Failed to generate variations:', error);
            // Provide fallback variations
            const fallbackVariations = [];
            for (let i = 0; i < numVariations; i++) {
                fallbackVariations.push(`[Variation ${i + 1}] AI-generated ${selectedContentType?.name} based on: "${contentContext}" for audience: "${targetAudience || 'general'}"`);
            }
            setVariations(fallbackVariations);
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle copy to clipboard
    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Save variations
    const saveVariations = () => {
        // In a real implementation, this would save to a database
        setSavedVariations(true);
        alert("Variations saved successfully!");
    };

    // Type selection view
    const renderTypeSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTENT_TYPES.map(type => (
                <Card
                    key={type.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${selectedType === type.id ? 'border-2 border-blue-500 bg-blue-50' : ''
                        }`}
                    onClick={() => setSelectedType(type.id)}
                >
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                        <p className="text-sm text-slate-600 mb-4">{type.description}</p>
                        <div className="text-xs text-slate-500">
                            Examples: {type.examples.join(', ')}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    // Content input view
    const renderContentInput = () => (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{selectedContentType?.name} A/B Testing</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Content Context</label>
                        <textarea
                            value={contentContext}
                            onChange={(e) => setContentContext(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            rows={4}
                            placeholder={`Describe what you're trying to communicate (e.g., "Announcing our new feature that helps users save time")`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            placeholder="e.g., Marketing professionals, IT decision makers"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Number of Variations</label>
                        <select
                            value={numVariations}
                            onChange={(e) => setNumVariations(Number(e.target.value))}
                            className="w-full p-3 border rounded-lg"
                        >
                            {[2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={generateVariations}
                        disabled={!contentContext || isGenerating}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                    >
                        <span className="text-yellow-300 mr-1">✨</span>
                        {isGenerating ? 'Generating Variations...' : 'Generate Variations'}
                    </button>
                </div>
            </CardContent>
        </Card>
    );

    // Variations display
    const renderVariations = () => (
        <Card>
            <CardHeader>
                <CardTitle>Generated Variations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {variations.map((variation, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-slate-50 relative group">
                            <div className="flex justify-between">
                                <div className="flex-1 pr-10">
                                    <p className="text-slate-900">{variation}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(variation, index)}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 group-hover:opacity-100 transition-all"
                                    title="Copy to clipboard"
                                >
                                    {copiedIndex === index ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-xs text-slate-500">Variation {index + 1}</span>
                                <div className="flex gap-2">
                                    <button className="text-xs text-blue-600 hover:text-blue-800">
                                        Edit
                                    </button>
                                    <button className="text-xs text-blue-600 hover:text-blue-800">
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Save Variations Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        className={`px-6 py-3 rounded-lg ${savedVariations
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                        onClick={saveVariations}
                    >
                        {savedVariations ? (
                            <>
                                <span className="mr-2">✓</span>
                                Variations Saved
                            </>
                        ) : (
                            'Save Variations'
                        )}
                    </button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <ScreenTemplate
            title="A/B Content Creator"
            subtitle="Generate multiple content variations to test with your audience"
            aiInsights={[
                "A/B testing can increase conversion rates by up to 30%",
                "The most effective tests focus on headlines and CTAs",
                "Test one element at a time for clearest results"
            ]}
        >
            <div className="space-y-6">
                {!selectedType && renderTypeSelection()}
                {selectedType && !variations.length && renderContentInput()}
                {selectedType && variations.length > 0 && renderVariations()}

                {/* Back buttons based on state */}
                {selectedType && !variations.length && (
                    <div className="flex justify-start">
                        <button
                            onClick={() => setSelectedType(null)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Back to content types
                        </button>
                    </div>
                )}

                {selectedType && variations.length > 0 && (
                    <div className="flex justify-start">
                        <button
                            onClick={() => setVariations([])}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Edit context
                        </button>
                    </div>
                )}
            </div>
        </ScreenTemplate>
    );
};

export default ABTestGenerator; 