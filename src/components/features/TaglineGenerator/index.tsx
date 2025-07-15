// src/components/features/TaglineGenerator/index.tsx
// DEBUGGING VERSION - Let's figure out what's happening!

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sparkles, Loader2, Plus, X, CheckCircle, Save, Wand2 } from 'lucide-react';
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
    const [customTagline, setCustomTagline] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);
    const [archetype, setArchetype] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false); // Simple flag for saved status
    const [taglineOptions, setTaglineOptions] = useState<string[]>([]); // Multiple options
    const [selectedTaglineIndex, setSelectedTaglineIndex] = useState(0); // Which one is selected

    // Simple improvement flow state
    const [improvementRequest, setImprovementRequest] = useState('');
    const [isImproving, setIsImproving] = useState(false);
    const [suggestedTagline, setSuggestedTagline] = useState('');
    const [showSuggestion, setShowSuggestion] = useState(false);

    const { brandVoice } = useBrandVoice();
    const router = useRouter();

    // DEBUG: Log state changes
    useEffect(() => {
        console.log('🔍 State Debug:', {
            customTagline,
            isSaved,
            isAccepted,
            showAtTop: customTagline && isSaved,
            showAtBottom: customTagline && !isSaved
        });
    }, [customTagline, isSaved, isAccepted]);

    // Function to clean tagline content
    const cleanTaglineContent = (content: string): string => {
        if (!content) return content;

        let cleaned = content.trim();
        cleaned = cleaned.replace(/^[;:\-\*\•\►\→\▸\‣\⁃\–\—\"\'\`\,\.!]+\s*/g, '');
        cleaned = cleaned.replace(/\s*[;:\-\*\•\►\→\▸\‣\⁃\–\—\"\'\`\,]+$/g, '');
        cleaned = cleaned.replace(/^['"]|['"]$/g, '');
        cleaned = cleaned.replace(/^(Tagline|Tag)\s*[:]\s*/i, '');
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        return cleaned;
    };

    // Handle tagline improvement
    const handleImproveTagline = async () => {
        if (!improvementRequest.trim()) return;

        setIsImproving(true);
        try {
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'improve-tagline',
                    data: {
                        content: customTagline,
                        instructions: `USER REQUEST: ${improvementRequest}\n\nPlease apply this request to improve the tagline while keeping it concise and impactful. Return only the improved tagline, nothing else.`,
                        strategicContext: {
                            productName: businessName,
                            audience: audiences.filter(a => a.trim()).join(', '),
                            tone: tone,
                            archetype: archetype,
                            promise: promise
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to improve tagline');
            }

            const result = await response.json();
            const improvedTagline = cleanTaglineContent(result.content || result);
            setSuggestedTagline(improvedTagline);
            setShowSuggestion(true);
        } catch (error) {
            console.error('Error improving tagline:', error);
        } finally {
            setIsImproving(false);
        }
    };

    // Accept the suggestion
    const handleAcceptSuggestion = () => {
        console.log('🎯 Accepting suggestion:', suggestedTagline);
        setCustomTagline(suggestedTagline);
        setTaglineOptions([suggestedTagline]); // Replace options with just the suggestion
        setSelectedTaglineIndex(0);
        setIsSaved(false); // New tagline, not saved yet
        setShowSuggestion(false);
        setImprovementRequest('');
    };

    // Handle selecting a different tagline option
    const handleSelectTagline = (index: number) => {
        setSelectedTaglineIndex(index);
        setCustomTagline(taglineOptions[index]);
    };

    // Handle manual tagline editing
    const handleManualEdit = (newTagline: string) => {
        setCustomTagline(newTagline);
        setIsSaved(false); // Manual edit means it's not saved yet
    };

    // Generate new taglines (for "Generate Again" button)
    const handleGenerateAgain = () => {
        setIsSaved(false); // Reset to generation mode
        generateTaglines();
    };

    // Reject the suggestion
    const handleRejectSuggestion = () => {
        setShowSuggestion(false);
        setImprovementRequest('');
    };

    // Load data from database on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                const {
                    productName,
                    productDescription,
                    idealCustomer,
                    brandArchetype,
                    tagline
                } = StrategicDataService.getAllStrategicDataFromStorage();

                if (productName) setBusinessName(productName);
                if (productDescription) setDescription(productDescription);
                if (tagline) {
                    console.log('🔍 Loading tagline from DB:', tagline);
                    setCustomTagline(tagline);
                    setIsSaved(true); // If from DB, consider it saved
                }

                if (idealCustomer) {
                    if (Array.isArray(idealCustomer)) {
                        setAudiences(idealCustomer.length > 0 ? idealCustomer : ['']);
                    } else {
                        setAudiences([idealCustomer]);
                    }
                }

                let savedArchetype = '';
                if (brandArchetype) {
                    savedArchetype = brandArchetype;
                } else if (brandVoice?.brandVoice?.archetype) {
                    savedArchetype = brandVoice.brandVoice.archetype;
                } else {
                    try {
                        const storedArchetype = localStorage.getItem('brandArchetype');
                        if (storedArchetype) {
                            savedArchetype = storedArchetype;
                        }
                    } catch (localStorageError) {
                        console.error('Error loading archetype from localStorage:', localStorageError);
                    }
                }

                if (savedArchetype) {
                    setArchetype(savedArchetype);
                    const selectedArchetype = BRAND_ARCHETYPES.find(a => a.name === savedArchetype);
                    if (selectedArchetype && !tone) {
                        setTone(selectedArchetype.defaultTone);
                    }
                }

                if (!tone && brandVoice?.brandVoice?.tone) {
                    setTone(brandVoice.brandVoice.tone);
                }

                try {
                    if (!tagline) {
                        const savedTagline = localStorage.getItem('brandTagline');
                        if (savedTagline) {
                            console.log('🔍 Loading tagline from localStorage:', savedTagline);
                            const cleanedTagline = cleanTaglineContent(savedTagline);
                            setCustomTagline(cleanedTagline);
                            setIsSaved(true); // If from localStorage, consider it saved
                        }
                    }
                } catch (localStorageError) {
                    console.error('Error loading tagline from localStorage:', localStorageError);
                }

            } catch (error) {
                console.error("Error loading data from database:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [brandVoice, tone]);

    // Handle archetype change with database save
    const handleArchetypeChange = async (value: string) => {
        setArchetype(value);

        try {
            await StrategicDataService.setStrategicDataValue('brandArchetype', value);
            localStorage.setItem('brandArchetype', value);
        } catch (error) {
            console.error('Error saving archetype to database:', error);
        }

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
        console.log('🚀 Generating tagline...');
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
            // REMOVED: numOptions, temperature, requestVariety - let API handle it naturally
        };

        try {
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'taglines', data: payload })
            });

            if (!response.ok) {
                throw new Error('Failed to generate taglines');
            }

            const result = await response.json();
            const cleanedTaglines = result.map((tagline: string) => cleanTaglineContent(tagline));

            console.log('✅ Generated taglines:', cleanedTaglines);
            setTaglineOptions(cleanedTaglines);
            setSelectedTaglineIndex(0);
            setCustomTagline(cleanedTaglines[0] || '');
            setIsSaved(false); // Newly generated, not saved yet
            setIsAccepted(false);
        } catch (error) {
            console.error('Error generating taglines:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Save tagline to database
    const handleSave = async (valueToSave: string | null = null) => {
        const finalValue = valueToSave || customTagline;
        console.log('💾 Saving tagline:', finalValue);

        if (!finalValue) {
            return;
        }

        try {
            await StrategicDataService.setStrategicDataValue('tagline', finalValue);
            localStorage.setItem('brandTagline', finalValue);

            setIsAccepted(true);
            setIsSaved(true); // Mark as saved - this should move it to top!
            console.log('✅ Tagline saved! Should move to top now.');
        } catch (error) {
            console.error('Error saving tagline to database:', error);
            setIsAccepted(true);
            setIsSaved(true);
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

        if (!isLoading) {
            fetchData();
        }
    }, [brandVoice, businessName, audiences, promise, isLoading]);

    if (isLoading) {
        return (
            <PageLayout title="" description="">
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                        <p className="text-gray-600">Loading your tagline information...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

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

                {/* 🎯 SAVED TAGLINE AT TOP - Only shows when saved */}
                {customTagline && isSaved && (
                    <Card className="p-6 bg-green-50 border-green-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Your Saved Tagline</h2>
                            </div>
                            <button
                                onClick={handleGenerateAgain}
                                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generate Again
                            </button>
                        </div>

                        <div className="bg-white border-2 border-green-300 rounded-lg p-6 mb-6">
                            <input
                                type="text"
                                value={customTagline}
                                onChange={(e) => {
                                    handleManualEdit(e.target.value);
                                    handleSave(e.target.value); // Auto-save on edit
                                }}
                                className="w-full text-2xl font-bold text-gray-900 text-center bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
                                placeholder="Enter your tagline..."
                            />
                        </div>

                        <div className="flex gap-2 mb-4">
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Saved to your account
                            </span>
                        </div>

                        {/* Need further changes button */}
                        <div className="border-t pt-4">
                            <button
                                onClick={() => setIsSaved(false)}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                            >
                                <Wand2 className="w-4 h-4" />
                                Need further changes?
                            </button>
                        </div>
                    </Card>
                )}

                <div className="grid gap-4">
                    {/* MAIN INPUT CARD */}
                    <Card className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Let's create your tagline</h2>
                            <p className="text-gray-600 mt-2">We'll use this information to generate taglines that match your brand</p>
                            <p className="text-sm text-gray-500 mt-1">Changes are automatically saved to your account</p>
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
                                    rows={2}
                                    placeholder="Brief description of your business or services"
                                />
                            </div>

                            {/* Add this guidance box here - after business description but before the generate button */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Wand2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-blue-800 mb-2">💡 Human-AI Collaboration</h4>
                                        <p className="text-sm text-blue-700">
                                            We generate strong tagline foundations that you can easily refine and polish. The best results come from combining AI efficiency with human creativity — so feel free to edit and improve any suggestions!
                                        </p>
                                    </div>
                                </div>
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
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 text-white" />
                                        Generate Tagline
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>

                    {/* 🎯 NEW/UNSAVED TAGLINE AT BOTTOM */}
                    {customTagline && !isSaved && (
                        <Card className="p-6 bg-blue-50 border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Choose Your Tagline</h2>
                            </div>

                            {/* Multiple tagline options with manual editing */}
                            {taglineOptions.length > 1 && (
                                <div className="mb-6">
                                   <p className="text-sm text-gray-600 mb-3">Select and edit your favorite option. These are foundations — polish them to perfection:</p>
                                    <div className="space-y-3">
                                        {taglineOptions.map((option, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 border-2 rounded-lg transition-all ${selectedTaglineIndex === index
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleSelectTagline(index)}
                                                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedTaglineIndex === index
                                                                ? 'border-blue-500 bg-blue-500'
                                                                : 'border-gray-300'
                                                            }`}
                                                    >
                                                        {selectedTaglineIndex === index && (
                                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                        )}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={selectedTaglineIndex === index ? customTagline : option}
                                                        onChange={(e) => {
                                                            if (selectedTaglineIndex === index) {
                                                                setCustomTagline(e.target.value);
                                                            } else {
                                                                // If editing a non-selected option, select it first
                                                                handleSelectTagline(index);
                                                                setCustomTagline(e.target.value);
                                                            }
                                                        }}
                                                        className="flex-1 text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                                                        placeholder="Edit this tagline..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected tagline display */}
                            <div className="bg-white border-2 border-blue-300 rounded-lg p-6 mb-6">
                                <div className="text-2xl font-bold text-gray-900 text-center">
                                    "{customTagline}"
                                </div>
                            </div>

                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => handleSave()}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Save className="w-4 h-4" />
                                    Save This Tagline
                                </button>
                                <button
                                    onClick={handleGenerateAgain}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate New Options
                                </button>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask for Improvements</h3>
                                <p className="text-gray-600 mb-4">Want to refine your selected tagline? Tell us what you'd like to change.</p>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={improvementRequest}
                                        onChange={(e) => setImprovementRequest(e.target.value)}
                                        placeholder="e.g., Make it catchier, Shorter and punchier, More emotional..."
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isImproving}
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleImproveTagline}
                                            disabled={isImproving || !improvementRequest.trim()}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isImproving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Improving...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-4 h-4" />
                                                    Improve Selected Tagline
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {showSuggestion && (
                                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                                        <h4 className="font-semibold text-yellow-900 mb-3">Suggested Improvement</h4>
                                        <div className="bg-white border border-yellow-300 rounded-lg p-4 mb-4">
                                            <div className="text-xl font-bold text-gray-900 text-center">
                                                "{suggestedTagline}"
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleAcceptSuggestion}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Accept This Version
                                            </button>
                                            <button
                                                onClick={handleRejectSuggestion}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                            >
                                                <X className="w-4 h-4" />
                                                Keep Original
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default TaglineGenerator;