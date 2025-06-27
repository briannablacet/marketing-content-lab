// src/components/features/BoilerplateGenerator/index.tsx


import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import { useWritingStyle } from '../../../context/WritingStyleContext';
import StrategicDataService from '../../../services/StrategicDataService';
import { useRouter } from 'next/router';
import { Loader2, FileText, CheckCircle, Save, Plus, X, Sparkles } from 'lucide-react';
import PageLayout from '../../shared/PageLayout';

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

const BoilerplateGenerator: React.FC = () => {
    const [audiences, setAudiences] = useState<string[]>(['']);
    const [promise, setPromise] = useState('');
    const [product, setProduct] = useState('');
    const [tone, setTone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [differentiator, setDifferentiator] = useState('');
    const [positioning, setPositioning] = useState('');
    const [style, setStyle] = useState('visionary');
    const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
    const [selectedBoilerplate, setSelectedBoilerplate] = useState<string | null>(null);
    const [otherLengths, setOtherLengths] = useState<Record<string, string>>({});
    const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [selectedWordCount, setSelectedWordCount] = useState<'20' | '50' | '100'>('20');
    const [showOtherLengths, setShowOtherLengths] = useState(false);
    const [archetype, setArchetype] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editableBoilerplates, setEditableBoilerplates] = useState<{
        [key: string]: string;
    }>({});
    const [generationStep, setGenerationStep] = useState<'initial' | 'adapting'>('initial');

    const { brandVoice } = useBrandVoice();
    const { writingStyle } = useWritingStyle();
    const router = useRouter();

    // Load saved boilerplates when component mounts
    useEffect(() => {
        const savedBoilerplates = JSON.parse(localStorage.getItem('brandBoilerplates') || '[]');
        if (savedBoilerplates && savedBoilerplates.length > 0) {
            // Map saved boilerplates to target lengths (20, 50, 100)
            const targetLengths = ['20', '50', '100'];
            const mappedBoilerplates: Record<string, string> = {};

            // Only take the first three boilerplates
            savedBoilerplates.slice(0, 3).forEach((text: string, index: number) => {
                if (index < targetLengths.length) {
                    mappedBoilerplates[targetLengths[index]] = text;
                }
            });

            // Set the selected boilerplate based on selectedWordCount
            if (mappedBoilerplates[selectedWordCount]) {
                setSelectedBoilerplate(mappedBoilerplates[selectedWordCount]);
            }

            // Set other lengths
            const otherLengths: Record<string, string> = {};
            Object.entries(mappedBoilerplates).forEach(([count, text]) => {
                if (count !== selectedWordCount) {
                    otherLengths[count] = text;
                }
            });

            setOtherLengths(otherLengths);
            setEditableBoilerplates(mappedBoilerplates);
            setShowOtherLengths(true);
        }
    }, [selectedWordCount]);

    useEffect(() => {
        const savedBoilerplates = localStorage.getItem('savedBoilerplates');
        if (savedBoilerplates) {
            setEditableBoilerplates(JSON.parse(savedBoilerplates));
        }
    }, []);

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

    const handleReset = () => {
        setGeneratedOptions([]);
        setSelectedBoilerplate(null);
        setOtherLengths({});
        setEditableBoilerplates({});
        setShowPreview(false);
        setShowOtherLengths(false);
        setGenerationStep('initial');
        localStorage.removeItem('savedBoilerplates');
    };

    const generateBoilerplates = async () => {
        setIsGenerating(true);
        setGenerationStep('initial');
        const payload = {
            businessName,
            description,
            product,
            audiences: audiences.filter(a => a.trim() !== ''),
            promise,
            tone,
            style,
            differentiator,
            positioning,
            archetype: brandVoice?.brandVoice?.archetype || '',
            personality: brandVoice?.brandVoice?.personality || [],
            wordCount: selectedWordCount,
            numOptions: 3,  // Request 3 different options
            writingStyle: writingStyle || null,
            strategicData: await StrategicDataService.getAllStrategicData()
        };

        try {
            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'boilerplate', data: payload })
            });

            if (!response.ok) {
                throw new Error('Failed to generate boilerplates');
            }

            const result = await response.json();
            setGeneratedOptions(result);
            setShowPreview(true);
        } catch (error) {
            console.error('Error generating boilerplates:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateOtherLengths = async (baseBoilerplate: string) => {
        setIsGenerating(true);
        const otherCounts = ['20', '50', '100'].filter(count => count !== selectedWordCount);

        try {
            for (const count of otherCounts) {
                const payload = {
                    businessName,
                    description,
                    product,
                    audiences: audiences.filter(a => a.trim() !== ''),
                    promise,
                    tone,
                    style,
                    differentiator,
                    positioning,
                    archetype: brandVoice?.brandVoice?.archetype || '',
                    personality: brandVoice?.brandVoice?.personality || [],
                    wordCount: count,
                    baseBoilerplate,  // Pass the selected boilerplate to adapt
                    writingStyle: writingStyle || null,
                    strategicData: await StrategicDataService.getAllStrategicData()
                };

                const response = await fetch('/api/api_endpoints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mode: 'adaptBoilerplate', data: payload })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate adapted boilerplate');
                }

                const result = await response.json();
                setOtherLengths(prev => ({
                    ...prev,
                    [count]: result[0] || ''
                }));
            }
            setShowOtherLengths(true);
        } catch (error) {
            console.error('Error generating other lengths:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAcceptGenerated = async (boilerplate: string) => {
        setSelectedBoilerplate(boilerplate);
        setIsGenerating(true);
        setGenerationStep('adapting');

        try {
            // Generate other lengths - only 50 and 100 if we're starting with 20
            const otherCounts = selectedWordCount === '20' ? ['50', '100'] :
                selectedWordCount === '50' ? ['20', '100'] :
                    ['20', '50'];

            const newOtherLengths: { [key: string]: string } = {};

            for (const count of otherCounts) {
                const payload = {
                    businessName,
                    description,
                    product,
                    audiences: audiences.filter(a => a.trim() !== ''),
                    promise,
                    tone,
                    style,
                    differentiator,
                    positioning,
                    archetype: brandVoice?.brandVoice?.archetype || '',
                    personality: brandVoice?.brandVoice?.personality || [],
                    wordCount: count,
                    baseBoilerplate: boilerplate
                };

                const response = await fetch('/api/api_endpoints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mode: 'adaptBoilerplate', data: payload })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate adapted boilerplate');
                }

                const result = await response.json();
                newOtherLengths[count] = result[0] || '';
            }

            // Save all versions to editable state
            const allBoilerplates = {
                [selectedWordCount]: boilerplate,
                ...newOtherLengths
            };
            setEditableBoilerplates(allBoilerplates);
            localStorage.setItem('savedBoilerplates', JSON.stringify(allBoilerplates));

            setOtherLengths(newOtherLengths);
            setShowOtherLengths(true);
        } catch (error) {
            console.error('Error generating other lengths:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBoilerplateEdit = (wordCount: string, newText: string) => {
        const updatedBoilerplates = {
            ...editableBoilerplates,
            [wordCount]: newText
        };
        setEditableBoilerplates(updatedBoilerplates);
        localStorage.setItem('savedBoilerplates', JSON.stringify(updatedBoilerplates));
    };

    const handleSave = async () => {
        if (!selectedBoilerplate) return;

        // Get the boilerplates in the correct order (20, 50, 100)
        const orderedBoilerplates = [
            editableBoilerplates['20'] || '',
            editableBoilerplates['50'] || '',
            editableBoilerplates['100'] || ''
        ].filter(Boolean).slice(0, 3); // Ensure only three versions

        console.log('Saving boilerplates:', {
            orderedBoilerplates
        });

        // Save to localStorage as an array
        localStorage.setItem('brandBoilerplates', JSON.stringify(orderedBoilerplates));
        console.log('Saved to localStorage:', localStorage.getItem('brandBoilerplates'));

        // Save individual versions to localStorage for backward compatibility
        Object.entries(editableBoilerplates).forEach(([count, text]) => {
            localStorage.setItem(`marketingBoilerplate${count}`, text);
        });

        // Save to StrategicDataService
        try {
            await StrategicDataService.setStrategicDataValue('boilerplates', orderedBoilerplates);
            Object.entries(editableBoilerplates).forEach(async ([count, text]) => {
                await StrategicDataService.setStrategicDataValue(`boilerplate${count}`, text);
            });
            console.log('Saved to StrategicDataService');
            setIsAccepted(true);
        } catch (error) {
            console.error('Error saving boilerplates:', error);
            setIsAccepted(true);
        }
    };

    useEffect(() => {
        const {
            productName,
            productDescription,
            idealCustomer,
            brandArchetype,
            boilerplate,
            valueProposition
        } = StrategicDataService.getAllStrategicDataFromStorage();

        if (productName) setBusinessName(productName);
        if (productDescription) setDescription(productDescription);
        if (idealCustomer) {
            if (Array.isArray(idealCustomer)) {
                setAudiences(idealCustomer.length > 0 ? idealCustomer : ['']);
            } else {
                setAudiences([idealCustomer]);
            }
        }
        if (boilerplate) setSelectedBoilerplate(boilerplate);
        if (valueProposition) setPositioning(valueProposition);

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

    const handleArchetypeChange = (value: string) => {
        setArchetype(value);
        const selected = BRAND_ARCHETYPES.find(a => a.name === value);
        if (selected) {
            setTone(selected.defaultTone);
        }
    };

    return (
        <PageLayout
            title=""
            description=""
            showHelpPrompt={showWalkthroughPrompt}
            helpPromptText="Need help? Let AI suggest a boilerplate based on your"
            helpPromptLink="/brand-personality"
            helpPromptLinkText="brand voice and strategic data"
        >
            <div className="space-y-8 w-full">
                <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Craft Your Boilerplate</h1>
                </div>
                <p className="text-gray-600">Generate boilerplates shaped by your tone, positioning, and personality</p>

                <div className="grid gap-4">
                    {/* SAVED BOILERPLATE DISPLAY */}
                    {selectedBoilerplate && !showPreview && (
                        <Card className="p-6 bg-white-50 border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Your Boilerplate</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-700">{selectedWordCount}-Word Version</h3>
                                    <textarea
                                        value={selectedBoilerplate}
                                        onChange={(e) => setSelectedBoilerplate(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                        rows={4}
                                    />
                                </div>
                                {showOtherLengths && Object.entries(otherLengths)
                                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                    .map(([count, text]) => (
                                        <div key={count} className="space-y-2">
                                            <h3 className="text-sm font-medium text-gray-700">{count}-Word Version</h3>
                                            <textarea
                                                value={text}
                                                onChange={(e) => {
                                                    setOtherLengths(prev => ({
                                                        ...prev,
                                                        [count]: e.target.value
                                                    }));
                                                }}
                                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                                rows={4}
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <Save className="w-4 h-4" />
                                    Edit and Save
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
                            <h2 className="text-2xl font-semibold text-gray-900">Let's create your boilerplate</h2>
                            <p className="text-gray-600 mt-2">We'll use this information to generate boilerplates that match your brand</p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Key differentiator</label>
                                <input
                                    type="text"
                                    value={differentiator}
                                    onChange={e => setDifferentiator(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Value Proposition</label>
                                <input
                                    type="text"
                                    value={positioning}
                                    onChange={e => setPositioning(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What unique value do you provide to your customers?"
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Word Count</label>
                                <select
                                    value={selectedWordCount}
                                    onChange={e => setSelectedWordCount(e.target.value as '20' | '50' | '100')}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="20">20 Words (Short)</option>
                                    <option value="50">50 Words (Standard)</option>
                                    <option value="100">100 Words (Detailed)</option>
                                </select>
                                <p className="mt-2 text-sm text-gray-600">
                                    Choose your favorite 20-word option and we'll expand it into 50- and 100-word versions.
                                </p>
                            </div>

                            <button
                                onClick={generateBoilerplates}
                                disabled={isGenerating}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {generationStep === 'initial'
                                            ? 'Generating Initial Options...'
                                            : 'Generating Multiple Length Options...'}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 text-white" />
                                        {`Generate ${selectedWordCount}-Word Options`}
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>

                    {/* PREVIEW OF GENERATED OPTIONS */}
                    {showPreview && (
                        <Card className="p-6">
                            {!selectedBoilerplate ? (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Boilerplate Options</h2>
                                    <p className="text-gray-600 mb-4">
                                        Choose your favorite option below. We'll automatically generate 50-word and 100-word versions of your selection.
                                    </p>
                                    <div className="space-y-4">
                                        {generatedOptions.map((boilerplate, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-lg border space-y-2">
                                                <strong className="text-gray-900">Option {i + 1}</strong>
                                                <p className="text-gray-800">{boilerplate}</p>
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(boilerplate)}
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() => handleAcceptGenerated(boilerplate)}
                                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                                    >
                                                        Use This Version
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Boilerplate Versions</h2>
                                    <p className="text-gray-600 mb-4">
                                        Review and edit all versions of your boilerplate. Click "Save" when you're happy with your changes.
                                    </p>
                                    <div className="space-y-4">
                                        {Object.entries(editableBoilerplates)
                                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                            .map(([count, text]) => (
                                                <div key={count} className="bg-gray-50 p-4 rounded-lg border space-y-2">
                                                    <strong className="text-gray-900">{count} Words</strong>
                                                    <textarea
                                                        value={text}
                                                        onChange={(e) => handleBoilerplateEdit(count, e.target.value)}
                                                        className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                                        rows={4}
                                                    />
                                                </div>
                                            ))}
                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                onClick={handleReset}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                            >
                                                <X className="w-4 h-4" />
                                                Reset Options
                                            </button>
                                            <button
                                                onClick={generateBoilerplates}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Generate Again
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save
                                            </button>
                                            {isAccepted && (
                                                <span className="flex items-center gap-1 text-blue-600 text-sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Saved!
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default BoilerplateGenerator;