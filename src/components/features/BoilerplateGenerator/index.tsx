// src/components/features/BoilerplateGenerator/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import StrategicDataService from '../../../services/StrategicDataService';
import { useRouter } from 'next/router';
import { Loader2, FileText } from 'lucide-react';
import PageLayout from '../../shared/PageLayout';

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

const BoilerplateGenerator: React.FC = () => {
    const [audience, setAudience] = useState('');
    const [promise, setPromise] = useState('');
    const [product, setProduct] = useState('');
    const [tone, setTone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [differentiator, setDifferentiator] = useState('');
    const [positioning, setPositioning] = useState('');
    const [style, setStyle] = useState('visionary');
    const [generatedBoilerplates, setGeneratedBoilerplates] = useState<string[]>([]);
    const [customBoilerplate, setCustomBoilerplate] = useState<string>('');
    const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { brandVoice } = useBrandVoice();
    const router = useRouter();

    const generateBoilerplates = async () => {
        setIsGenerating(true);
        const payload = {
            businessName,
            description,
            product,
            audience,
            promise,
            tone,
            style,
            differentiator,
            positioning,
            archetype: brandVoice?.brandVoice?.archetype || '',
            personality: brandVoice?.brandVoice?.personality || []
        };

        try {
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'generateBoilerplates', data: payload })
            });

            if (!response.ok) {
                throw new Error('Failed to generate boilerplates');
            }

            const result = await response.json();
            setGeneratedBoilerplates(result);
            setCustomBoilerplate(result[0] || '');
        } catch (error) {
            console.error('Error generating boilerplates:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveAllBoilerplates = () => {
        const labelList = ['20 words', '50 words', '100 words'];
        const content = labelList.map((label, i) => {
            const text = generatedBoilerplates[i] || '';
            StrategicDataService.setStrategicDataValue(`boilerplate-${label}`, text);
            return `### ${label}:
${text.trim()}`;
        }).join('\n\n---\n\n');

        const filename = businessName
            ? `${businessName.toLowerCase().replace(/\s+/g, '-')}-boilerplates.txt`
            : 'boilerplates.txt';

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

            const missingCoreData =
                !brandVoice?.brandVoice?.tone ||
                !brandVoice?.brandVoice?.archetype ||
                !audiences.length ||
                !productData?.name ||
                !messaging?.valueProposition;

            if (missingCoreData) {
                setShowWalkthroughPrompt(true);
            }
        };

        fetchData();
    }, [brandVoice]);

    return (
        <PageLayout
        showHelpPrompt={showWalkthroughPrompt}
        helpPromptText="Need help? Let AI suggest a boilerplate based on your"
        helpPromptLink="/brand-personality"
        helpPromptLinkText="brand voice and strategic data"
    >

        
<div className="space-y-8 w-full">
    {/* BIG HEADER WITH ICON */}
    <div className="flex items-center gap-3 mb-2">
        <FileText className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Boilerplate Generator</h1>
    </div>
    <p className="text-gray-600 -mt-6">Generate three boilerplates shaped by your tone, positioning, and personality</p>
                <p className="text-gray-600 -mt-6">Generate three boilerplates shaped by your tone, positioning, and personality</p>

                {/* CONTENT */}
                <div className="grid gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tell us about your business</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Business name</label>
                                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Business description</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">What's your product or solution?</label>
                                <input type="text" value={product} onChange={e => setProduct(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ideal customer or audience</label>
                                <input type="text" value={audience} onChange={e => setAudience(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">What problem are you solving?</label>
                                <input type="text" value={promise} onChange={e => setPromise(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">How are you different from your competitors?</label>
                                <input type="text" value={differentiator} onChange={e => setDifferentiator(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Why are you uniquely positioned to solve this?</label>
                                <input type="text" value={positioning} onChange={e => setPositioning(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">What tone should it reflect?</label>
                                <select value={tone} onChange={e => setTone(e.target.value)} className="border border-gray-300 p-2 rounded w-full">
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
                                <select value={style} onChange={e => setStyle(e.target.value)} className="border border-gray-300 p-2 rounded w-full">
                                    <option value="visionary">Visionary</option>
                                    <option value="punchy">Punchy</option>
                                    <option value="straightforward">Straightforward</option>
                                </select>
                            </div>
                            <button
                                onClick={generateBoilerplates}
                                disabled={isGenerating}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Boilerplates'
                                )}
                            </button>
                        </div>
                    </div>

                    {generatedBoilerplates.length > 0 && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Your Boilerplate Options</h2>
                            <p className="text-sm font-medium text-gray-700">Choose from the following options:</p>
                            {['20 words', '50 words', '100 words'].map((label, i) => (
                                <div key={label} className="p-4 rounded-lg border space-y-2">
                                    <strong className="text-gray-900">{label}</strong>
                                    <textarea
                                        value={generatedBoilerplates[i] || ''}
                                        onChange={e => {
                                            const updated = [...generatedBoilerplates];
                                            updated[i] = e.target.value;
                                            setGeneratedBoilerplates(updated);
                                        }}
                                        className="w-full border border-gray-300 p-3 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(generatedBoilerplates[i])}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => {
                                                const updatedText = generatedBoilerplates[i];
                                                setCustomBoilerplate(updatedText);
                                                StrategicDataService.setStrategicDataValue('boilerplate', updatedText);

                                                const blob = new Blob([updatedText], { type: 'text/plain;charset=utf-8' });
                                                const link = document.createElement('a');
                                                link.href = URL.createObjectURL(blob);
                                                link.download = `boilerplate-${label.replace(/\s/g, '-')}.txt`;
                                                link.click();
                                            }}
                                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                                        >
                                            Save & Export
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4">
                                <button
                                    onClick={saveAllBoilerplates}
                                    className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
                                >
                                    Save and Download All
                                </button>
                            </div>
                        </div>
                    )}

                    {customBoilerplate && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-2">
                            <h2 className="text-lg font-semibold text-gray-900">Make it your own</h2>
                            <p className="text-sm font-medium text-gray-700">Make any final adjustments:</p>
                            <textarea
                                value={customBoilerplate}
                                onChange={e => setCustomBoilerplate(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default BoilerplateGenerator;