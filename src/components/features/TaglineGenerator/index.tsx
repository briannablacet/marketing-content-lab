import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sparkles, Loader2, Plus, X, CheckCircle, Save } from 'lucide-react';
import PageLayout from '../../shared/PageLayout';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import StrategicDataService from '../../../services/StrategicDataService';
import { Card } from '../../ui/card';

// Update type definitions
interface ProductInfo {
    name?: string;
    product?: string;
    valueProposition?: string;
    description?: string;
}

interface MessagingFramework {
    valueProposition?: string;
    keyDifferentiators?: string[];
    positioning?: string;
}

interface Audience {
    role?: string;
    industry?: string;
    description?: string;
}

const BRAND_ARCHETYPES = [
    { name: 'The Creator', description: 'Innovative, artistic, striving for authentic self-expression', example: 'Adobe, Lego, Apple', defaultTone: 'Inspirational', defaultPersonality: ['Innovative', 'Empathetic', 'Playful'] },
    { name: 'The Caregiver', description: 'Nurturing, compassionate, focused on helping others', example: 'Johnson & Johnson, UNICEF, Cleveland Clinic', defaultTone: 'Empathetic', defaultPersonality: ['Empathetic', 'Trustworthy', 'Friendly'] },
    { name: 'The Ruler', description: 'Authoritative, responsible, providing structure and control', example: 'Microsoft, Mercedes-Benz, American Express', defaultTone: 'Formal', defaultPersonality: ['Authoritative', 'Professional', 'Trustworthy'] },
    { name: 'The Jester', description: 'Playful, humorous, living in the moment', example: 'Old Spice, Dollar Shave Club, M&Ms', defaultTone: 'Conversational', defaultPersonality: ['Playful', 'Bold', 'Friendly'] },
    { name: 'The Regular Guy/Gal', description: 'Relatable, authentic, down-to-earth values', example: 'IKEA, Target, Budweiser', defaultTone: 'Neutral', defaultPersonality: ['Friendly', 'Trustworthy', 'Professional'] },
    { name: 'The Lover', description: 'Passionate, sensual, focused on relationships and experiences', example: "Victoria's Secret, Godiva, Häagen-Dazs", defaultTone: 'Inspirational', defaultPersonality: ['Empathetic', 'Bold', 'Playful'] },
    { name: 'The Hero', description: 'Brave, determined, overcoming challenges and adversity', example: 'Nike, FedEx, U.S. Army', defaultTone: 'Persuasive', defaultPersonality: ['Bold', 'Authoritative', 'Inspirational'] },
    { name: 'The Outlaw', description: 'Rebellious, disruptive, challenging the status quo', example: 'Harley-Davidson, Virgin, Red Bull', defaultTone: 'Bold', defaultPersonality: ['Bold', 'Rebellious', 'Playful'] },
    { name: 'The Magician', description: 'Visionary, transformative, making dreams reality', example: 'Disney, Tesla, Dyson', defaultTone: 'Inspirational', defaultPersonality: ['Innovative', 'Bold', 'Professional'] },
    { name: 'The Innocent', description: 'Optimistic, pure, honest and straightforward', example: 'Coca-Cola, Dove, Whole Foods', defaultTone: 'Conversational', defaultPersonality: ['Friendly', 'Empathetic', 'Trustworthy'] },
    { name: 'The Explorer', description: 'Adventurous, independent, seeking discovery and freedom', example: 'Jeep, Patagonia, National Geographic', defaultTone: 'Inspirational', defaultPersonality: ['Bold', 'Professional', 'Empathetic'] },
    { name: 'The Sage', description: 'Knowledgeable, wise, sharing expertise and insight', example: 'Google, BBC, The Economist', defaultTone: 'Educational', defaultPersonality: ['Professional', 'Authoritative', 'Trustworthy'] }
];

const TONE_OPTIONS = ['Formal', 'Neutral', 'Conversational', 'Technical', 'Inspirational', 'Educational', 'Persuasive'];

const TaglineGenerator: React.FC = () => {
    const [description, setDescription] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [audiences, setAudiences] = useState<string[]>(['']);
    const [promise, setPromise] = useState('');
    const [tone, setTone] = useState('');
    const [style, setStyle] = useState('visionary');
    const [generatedTaglines, setGeneratedTaglines] = useState<string[]>([]);
    const [customTagline, setCustomTagline] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);
    const [boilerplates, setBoilerplates] = useState([]);
    const [archetype, setArchetype] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTagline, setSelectedTagline] = useState<string | null>(null);

    const { brandVoice } = useBrandVoice();
    const router = useRouter();

    useEffect(() => {
        const {
            productName,
            productDescription,
            idealCustomer,
            brandArchetype,
            tagline
        } = StrategicDataService.getAllStrategicDataFromStorage();

        if (productName) setBusinessName(productName);
        if (productDescription) setDescription(productDescription);
        if (idealCustomer) {
            // Handle both string and array of ideal customers
            if (Array.isArray(idealCustomer)) {
                setAudiences(idealCustomer.length > 0 ? idealCustomer : ['']);
            } else {
                setAudiences([idealCustomer]);
            }
        }
        if (tagline) setCustomTagline(tagline);

        // Set archetype and tone from brand voice if available
        if (brandVoice?.brandVoice?.archetype) {
            setArchetype(brandVoice.brandVoice.archetype);
            if (brandVoice.brandVoice.tone) {
                setTone(brandVoice.brandVoice.tone);
            } else {
                const selectedArchetype = BRAND_ARCHETYPES.find(a => a.name === brandVoice.brandVoice.archetype);
                if (selectedArchetype) {
                    setTone(selectedArchetype.defaultTone);
                }
            }
        }
    }, [brandVoice]);

    // Load saved tagline when component mounts
    useEffect(() => {
        const savedTagline = localStorage.getItem('brandTagline');
        if (savedTagline) {
            setSelectedTagline(savedTagline);
            setCustomTagline(savedTagline);
        }
    }, []);

    const handleArchetypeChange = (value: string) => {
        setArchetype(value);
        const selected = BRAND_ARCHETYPES.find(a => a.name === value);
        if (selected) {
            setTone(selected.defaultTone);
        }
    };

    const addAudience = () => {
        setAudiences([...audiences, '']);
    };

    const removeAudience = (index: number) => {
        const newAudiences = audiences.filter((_, i) => i !== index);
        setAudiences(newAudiences.length > 0 ? newAudiences : ['']);
    };

    const updateAudience = (index: number, value: string) => {
        const newAudiences = [...audiences];
        newAudiences[index] = value;
        setAudiences(newAudiences);
    };

    const generateTaglines = async () => {
        setIsGenerating(true);
        const payload = {
            businessName,
            description,
            audiences: audiences.filter(a => a.trim() !== ''),
            promise,
            tone,
            style,
            archetype: archetype || brandVoice?.brandVoice?.archetype || '',
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
            setShowPreview(true);
        } catch (error) {
            console.error('Error generating taglines:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAcceptGenerated = (tagline: string) => {
        setCustomTagline(tagline);
        setShowPreview(false);
        handleSave(tagline);
    };

    const handleSave = async (valueToSave: string | null = null) => {
        const finalValue = valueToSave || customTagline;

        if (!finalValue) {
            return;
        }

        // Save to localStorage with the correct key
        localStorage.setItem('brandTagline', finalValue);

        // Save to StrategicDataService
        try {
            StrategicDataService.setTagline(finalValue);
            setIsAccepted(true);
        } catch (error) {
            console.error('Error saving tagline to StrategicDataService:', error);
            setIsAccepted(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productDataRaw, audiences, messagingRaw] = await Promise.all([
                    StrategicDataService.getProductInfo(),
                    StrategicDataService.getTargetAudiences(),
                    StrategicDataService.getMessagingFramework()
                ]);

                const productData = productDataRaw as ProductInfo;
                const messaging = messagingRaw as MessagingFramework;
                const audienceData = audiences as Audience[];

                if (!tone && brandVoice?.brandVoice?.tone) {
                    setTone(brandVoice.brandVoice.tone);
                }

                if (!promise) {
                    if (messaging?.valueProposition) {
                        setPromise(messaging.valueProposition);
                    } else if (productData?.valueProposition) {
                        setPromise(productData.valueProposition);
                    }
                }

                const hasCoreData =
                    (productData?.name || businessName) &&
                    (audienceData.length > 0 || audiences.length > 0) &&
                    (messaging?.valueProposition || promise);

                setShowWalkthroughPrompt(!hasCoreData);
            } catch (error) {
                console.error('Error fetching strategic data:', error);
                setShowWalkthroughPrompt(true);
            }
        };

        fetchData();
    }, [brandVoice, businessName, audiences, promise]);

    return (
        <PageLayout
            title=""
            description=""
            showHelpPrompt={showWalkthroughPrompt}
            helpPromptText="Need help? Let AI suggest a tagline based on your"
            helpPromptLink="/brand-personality"
            helpPromptLinkText="brand voice and strategic data"
        >
            <div className="space-y-8 w-full">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Craft Your Tagline</h1>
                </div>
                <p className="text-gray-600">Create compelling taglines that capture your brand's essence</p>

                <div className="grid gap-4">
                    {/* SAVED TAGLINE DISPLAY */}
                    {customTagline && !showPreview && (
                        <Card className="p-6 bg-white-50 border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Your Tagline</h2>
                            </div>
                            <textarea
                                value={customTagline}
                                onChange={(e) => setCustomTagline(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                rows={4}
                                placeholder="Edit your tagline here..."
                            />
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleSave()}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Save className="w-4 h-4" />
                                    Edit or Save
                                </button>
                                {isAccepted && (
                                    <span className="flex items-center gap-1 text-blue-600 text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        Saved!
                                    </span>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* MAIN INPUT CARD */}
                    <Card className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Let's create your tagline</h2>
                            <p className="text-gray-600 mt-2">We'll use this information to generate taglines that match your brand</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={e => setBusinessName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ideal customers or audiences</label>
                                <div className="space-y-3">
                                    {audiences.map((audience, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={audience}
                                                onChange={e => updateAudience(index, e.target.value)}
                                                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter ideal customer or audience"
                                            />
                                            {audiences.length > 1 && (
                                                <button
                                                    onClick={() => removeAudience(index)}
                                                    className="text-red-500 hover:text-red-700 p-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addAudience}
                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add another audience
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">What problem are you solving?</label>
                                <input
                                    type="text"
                                    value={promise}
                                    onChange={e => setPromise(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Archetype</label>
                                <select
                                    value={archetype}
                                    onChange={e => handleArchetypeChange(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select archetype</option>
                                    {BRAND_ARCHETYPES.map(a => (
                                        <option key={a.name} value={a.name}>{a.name}</option>
                                    ))}
                                </select>
                                {archetype && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {BRAND_ARCHETYPES.find(a => a.name === archetype)?.description}<br />
                                        <span className="text-gray-500">Examples: {BRAND_ARCHETYPES.find(a => a.name === archetype)?.example}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">What tone should it reflect?</label>
                                <select
                                    value={tone}
                                    onChange={e => setTone(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select tone</option>
                                    {TONE_OPTIONS.map(tone => (
                                        <option key={tone} value={tone}>{tone}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Writing style</label>
                                <select
                                    value={style}
                                    onChange={e => setStyle(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="visionary">Visionary</option>
                                    <option value="punchy">Punchy</option>
                                    <option value="straightforward">Straightforward</option>
                                </select>
                            </div>

                            <button
                                onClick={generateTaglines}
                                disabled={isGenerating}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    </Card>

                    {/* PREVIEW OF GENERATED OPTIONS */}
                    {showPreview && generatedTaglines.length > 0 && (
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Tagline Options</h2>
                            <div className="space-y-4">
                                {generatedTaglines.map((tagline, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg border space-y-2">
                                        <strong className="text-gray-900">Option {i + 1}</strong>
                                        <p className="text-gray-800">{tagline}</p>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(tagline)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Copy
                                            </button>
                                            <button
                                                onClick={() => handleAcceptGenerated(tagline)}
                                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                Use This Version
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default TaglineGenerator;