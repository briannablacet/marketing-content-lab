import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import StrategicDataService from '../../../services/StrategicDataService';
import { useRouter } from 'next/router';
import { Loader2, Lightbulb } from 'lucide-react';
import PageLayout from '../../shared/PageLayout';
import AIAssistance from '../../shared/AIAssistance';

// Add type definitions
interface ProductInfo {
    name?: string;
    product?: string;
    // add other fields as needed
}

interface MessagingFramework {
    valueProposition?: string;
    // add other fields as needed
}

const TaglineGenerator: React.FC = () => {
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [promise, setPromise] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('visionary');
    const [generatedTaglines, setGeneratedTaglines] = useState<string[]>([]);
    const [customTagline, setCustomTagline] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);

    const { brandVoice } = useBrandVoice();
    const router = useRouter();

    const generateTaglines = async () => {
        setIsGenerating(true);
        const payload = {
            businessName,
            description,
            product,
            audience,
            promise,
            tone,
            style,
            archetype: brandVoice?.brandVoice?.archetype || '',
            personality: brandVoice?.brandVoice?.personality || []
        };

        try {
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'generateTaglines', data: payload })
            });

            if (!response.ok) {
                throw new Error('Failed to generate taglines');
            }

            const result = await response.json();
            setGeneratedTaglines(result);
            setCustomTagline(result[0] || '');
        } catch (error) {
            console.error('Error generating taglines:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveAllTaglines = () => {
        const content = generatedTaglines.map((tagline, i) => {
            StrategicDataService.setStrategicDataValue(`tagline-${i + 1}`, tagline);
            return `### Tagline ${i + 1}:\n${tagline.trim()}`;
        }).join('\n\n---\n\n');

        const filename = businessName
            ? `${businessName.toLowerCase().replace(/\s+/g, '-')}-taglines.txt`
            : 'taglines.txt';

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    useEffect(() => {
        const fetchData = async () => {
            const [productDataRaw, audiences, messagingRaw] = await Promise.all([
                StrategicDataService.getProductInfo(),
                StrategicDataService.getTargetAudiences(),
                StrategicDataService.getMessagingFramework()
            ]);

            // Type assertion to help TypeScript
            const productData = productDataRaw as ProductInfo;
            const messaging = messagingRaw as MessagingFramework;

            if (!tone && brandVoice?.brandVoice?.tone) {
                setTone(brandVoice.brandVoice.tone);
            }

            if (!audience && audiences.length > 0) {
                setAudience(brandVoice?.brandVoice?.audience || audiences[0]);
            }

            if (!product && productData?.product) {
                setProduct(productData.product);
            }

            if (!businessName && productData?.name) {
                setBusinessName(productData.name);
            }

            if (!promise && messaging?.valueProposition) {
                setPromise(messaging.valueProposition);
            }
        };

        fetchData();
    }, [brandVoice]);

    useEffect(() => {
        const checkData = async () => {
            const [productData, audiences, messaging] = await Promise.all([
                StrategicDataService.getProductInfo(),
                StrategicDataService.getTargetAudiences(),
                StrategicDataService.getMessagingFramework()
            ]);

            const missingCoreData =
                !brandVoice?.brandVoice?.tone ||
                !brandVoice?.brandVoice?.archetype ||
                !audiences.length ||
                !productData?.name ||
                !messaging?.valueProposition;

            setShowWalkthroughPrompt(missingCoreData);
        };

        checkData();
    }, [brandVoice]);

    return (
        <PageLayout
            title="Tagline Generator"
            description="Create compelling taglines that capture your brand's essence and resonate with your target audience."
            showHelpPrompt={showWalkthroughPrompt}
            helpPromptText="Need help? Let AI suggest a tagline based on your"
            helpPromptLink="/brand-personality"
            helpPromptLinkText="brand voice and strategic data"
        >
            <div className="grid gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Details</h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Business name</label>
                            <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Business description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">What's your product or solution?</label>
                            <input
                                type="text"
                                value={product}
                                onChange={e => setProduct(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ideal customer or audience</label>
                            <input
                                type="text"
                                value={audience}
                                onChange={e => setAudience(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">What problem are you solving?</label>
                            <input
                                type="text"
                                value={promise}
                                onChange={e => setPromise(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">What tone should it reflect?</label>
                            <select
                                value={tone}
                                onChange={e => setTone(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select tone</option>
                                <option value="Formal">Formal</option>
                                <option value="Neutral">Neutral</option>
                                <option value="Conversational">Conversational</option>
                                <option value="Technical">Technical</option>
                                <option value="Inspirational">Inspirational</option>
                                <option value="Educational">Educational</option>
                                <option value="Persuasive">Persuasive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Writing style</label>
                            <select
                                value={style}
                                onChange={e => setStyle(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="visionary">Visionary</option>
                                <option value="punchy">Punchy</option>
                                <option value="straightforward">Straightforward</option>
                            </select>
                        </div>
                        <button
                            onClick={generateTaglines}
                            disabled={isGenerating}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Taglines'
                            )}
                        </button>
                    </div>
                </div>

                {generatedTaglines.length > 0 && (
                    <>
                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Generated Tagline Options</h2>
                            <p className="text-sm font-medium text-gray-700">Choose from the following options:</p>
                            {generatedTaglines.map((tagline, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-lg border space-y-2">
                                    <strong className="text-gray-900">Tagline {i + 1}</strong>
                                    <textarea
                                        value={tagline}
                                        onChange={e => {
                                            const updated = [...generatedTaglines];
                                            updated[i] = e.target.value;
                                            setGeneratedTaglines(updated);
                                        }}
                                        className="w-full border border-gray-300 p-3 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(tagline)}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => {
                                                StrategicDataService.setStrategicDataValue(`tagline-${i + 1}`, tagline);
                                                const blob = new Blob([tagline], { type: 'text/plain;charset=utf-8' });
                                                const link = document.createElement('a');
                                                link.href = URL.createObjectURL(blob);
                                                link.download = `tagline-${i + 1}.txt`;
                                                link.click();
                                            }}
                                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                                        >
                                            Save & Export
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={saveAllTaglines}
                                className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
                            >
                                Save and Download All
                            </button>
                        </div>
                    </>
                )}

                {customTagline && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Editable Version:</p>
                        <textarea
                            value={customTagline}
                            onChange={e => setCustomTagline(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                        />
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default TaglineGenerator; 