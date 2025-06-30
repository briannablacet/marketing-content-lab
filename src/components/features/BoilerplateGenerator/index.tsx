// src/components/features/BoilerplateGenerator/index.tsx
// Fixed with: three separate boxes, individual accept buttons, better auto-population, removed writing style

import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { useBrandVoice } from '../../../context/BrandVoiceContext';
import StrategicDataService from '../../../services/StrategicDataService';
import { useRouter } from 'next/router';
import { Loader2, FileText, CheckCircle, Save, Plus, X, Sparkles, Copy, Users, Target, Lightbulb } from 'lucide-react';
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

    // NEW: Simplified state for three versions
    const [generatedVersions, setGeneratedVersions] = useState<{
        short: string;
        medium: string;
        long: string;
    }>({ short: '', medium: '', long: '' });

    const [editableVersions, setEditableVersions] = useState<{
        short: string;
        medium: string;
        long: string;
    }>({ short: '', medium: '', long: '' });

    const [acceptedVersions, setAcceptedVersions] = useState<{
        short: boolean;
        medium: boolean;
        long: boolean;
    }>({ short: false, medium: false, long: false });

    const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [archetype, setArchetype] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const { brandVoice } = useBrandVoice();
    const router = useRouter();

    // Enhanced copy functionality
    const handleCopy = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(label);
            setTimeout(() => setCopySuccess(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Enhanced auto-populate with better field detection
    useEffect(() => {
        const {
            productName,
            productDescription,
            idealCustomer,
            brandArchetype,
            valueProposition,
            messaging
        } = StrategicDataService.getAllStrategicDataFromStorage();

        // Populate business name
        if (productName) setBusinessName(productName);

        // Populate description 
        if (productDescription) setDescription(productDescription);

        // Populate ideal customer/audiences with better handling
        if (idealCustomer) {
            if (Array.isArray(idealCustomer)) {
                setAudiences(idealCustomer.length > 0 ? idealCustomer : ['']);
            } else {
                setAudiences([idealCustomer]);
            }
        }

        // Populate value proposition from multiple sources
        if (valueProposition) setPositioning(valueProposition);
        if (messaging?.valueProposition) setPositioning(messaging.valueProposition);

        // Set archetype and tone from brand voice with fallback
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

        // Load existing saved boilerplates if they exist
        const savedBoilerplates = JSON.parse(localStorage.getItem('brandBoilerplates') || '[]');
        if (savedBoilerplates && savedBoilerplates.length >= 3) {
            setEditableVersions({
                short: savedBoilerplates[0] || '',
                medium: savedBoilerplates[1] || '',
                long: savedBoilerplates[2] || ''
            });
            setShowResults(true);
        }
    }, [brandVoice]);

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

    const handleArchetypeChange = (value: string) => {
        setArchetype(value);
        const selected = BRAND_ARCHETYPES.find(a => a.name === value);
        if (selected) {
            setTone(selected.defaultTone);
        }
    };

    // NEW: Generate all three versions at once
    const generateBoilerplates = async () => {
        setIsGenerating(true);
        setError(null);

        const payload = {
            businessName,
            description,
            product,
            audiences: audiences.filter(a => a.trim() !== ''),
            promise,
            tone,
            differentiator,
            positioning,
            archetype: brandVoice?.brandVoice?.archetype || archetype,
            personality: brandVoice?.brandVoice?.personality || [],
        };

        try {
            // Generate all three versions simultaneously
            const [shortResponse, mediumResponse, longResponse] = await Promise.all([
                fetch('/api/api_endpoints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: 'boilerplate',
                        data: { ...payload, wordCount: '20', numOptions: 1 }
                    })
                }),
                fetch('/api/api_endpoints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: 'boilerplate',
                        data: { ...payload, wordCount: '50', numOptions: 1 }
                    })
                }),
                fetch('/api/api_endpoints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: 'boilerplate',
                        data: { ...payload, wordCount: '100', numOptions: 1 }
                    })
                })
            ]);

            if (!shortResponse.ok || !mediumResponse.ok || !longResponse.ok) {
                throw new Error('Failed to generate boilerplates');
            }

            const [shortResult, mediumResult, longResult] = await Promise.all([
                shortResponse.json(),
                mediumResponse.json(),
                longResponse.json()
            ]);

            const newVersions = {
                short: shortResult[0] || '',
                medium: mediumResult[0] || '',
                long: longResult[0] || ''
            };

            setGeneratedVersions(newVersions);
            setEditableVersions(newVersions);
            setShowResults(true);
            setAcceptedVersions({ short: false, medium: false, long: false });

        } catch (error) {
            console.error('Error generating boilerplates:', error);
            setError('Failed to generate boilerplates. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // NEW: Accept individual versions
    const acceptVersion = async (version: 'short' | 'medium' | 'long') => {
        setAcceptedVersions(prev => ({ ...prev, [version]: true }));

        // Save to localStorage and StrategicDataService
        const orderedBoilerplates = [
            editableVersions.short,
            editableVersions.medium,
            editableVersions.long
        ];

        localStorage.setItem('brandBoilerplates', JSON.stringify(orderedBoilerplates));

        try {
            await StrategicDataService.setStrategicDataValue('boilerplates', orderedBoilerplates);
            await StrategicDataService.setStrategicDataValue('boilerplate20', editableVersions.short);
            await StrategicDataService.setStrategicDataValue('boilerplate50', editableVersions.medium);
            await StrategicDataService.setStrategicDataValue('boilerplate100', editableVersions.long);
        } catch (error) {
            console.error('Error saving boilerplate:', error);
        }
    };

    // NEW: Update individual versions
    const updateVersion = (version: 'short' | 'medium' | 'long', text: string) => {
        setEditableVersions(prev => ({ ...prev, [version]: text }));
        // Reset accepted status when editing
        setAcceptedVersions(prev => ({ ...prev, [version]: false }));
    };

    // NEW: Clean reset
    const handleReset = () => {
        setGeneratedVersions({ short: '', medium: '', long: '' });
        setEditableVersions({ short: '', medium: '', long: '' });
        setAcceptedVersions({ short: false, medium: false, long: false });
        setShowResults(false);
        setError(null);
        localStorage.removeItem('brandBoilerplates');
    };

    return (
        <PageLayout
            title=""
            description=""
            showHelpPrompt={showWalkthroughPrompt}
            helpPromptText="Need help? Let AI suggest a boilerplate based on your"
            helpPromptLink="/brand-voice"
            helpPromptLinkText="brand voice and strategic data"
        >
            <div className="space-y-8 w-full">
                <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Craft Your Boilerplate</h1>
                </div>
                <p className="text-gray-600">Generate three boilerplate versions (20, 50, and 100 words) shaped by your tone, positioning, and personality</p>

                <div className="grid gap-4">
                    {/* MAIN INPUT CARD */}
                    <Card className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Let's create your boilerplate</h2>
                            <p className="text-gray-600 mt-2">We'll use this information to generate three versions that match your brand</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business name
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={e => setBusinessName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your business name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business description
                                    {description && <span className="text-green-600 ml-2">✓ Auto-filled</span>}
                                </label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                    placeholder="Describe what your business does"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Ideal customers or audiences
                                    {audiences.some(a => a.trim()) && <span className="text-green-600 ml-2">✓ Auto-filled</span>}
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Target className="w-4 h-4 inline mr-1" />
                                    What problem are you solving?
                                </label>
                                <input
                                    type="text"
                                    value={promise}
                                    onChange={e => setPromise(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What key problem does your business solve?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Lightbulb className="w-4 h-4 inline mr-1" />
                                    Key differentiator
                                </label>
                                <input
                                    type="text"
                                    value={differentiator}
                                    onChange={e => setDifferentiator(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What makes you different from competitors?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Value Proposition
                                    {positioning && <span className="text-green-600 ml-2">✓ Auto-filled</span>}
                                </label>
                                <input
                                    type="text"
                                    value={positioning}
                                    onChange={e => setPositioning(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What unique value do you provide to your customers?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand Archetype
                                    {archetype && <span className="text-green-600 ml-2">✓ Auto-filled</span>}
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    What tone should it reflect?
                                    {tone && <span className="text-green-600 ml-2">✓ Auto-filled</span>}
                                </label>
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

                            {/* REMOVED: Writing style section as requested */}

                            <button
                                onClick={generateBoilerplates}
                                disabled={isGenerating || !businessName || !description}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Three Versions...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Three Boilerplate Versions
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* NEW: Three Separate Result Boxes */}
                    {showResults && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-gray-900">Your Boilerplate Versions</h2>
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                    Start Over
                                </button>
                            </div>

                            {/* 20-Word Version */}
                            <Card className="p-6 border-l-4 border-l-green-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">20-Word Version (Short)</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(editableVersions.short, 'short')}
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copySuccess === 'short' ? 'Copied!' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={() => acceptVersion('short')}
                                            disabled={acceptedVersions.short}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${acceptedVersions.short
                                                    ? 'bg-green-100 text-green-700 cursor-default'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                        >
                                            {acceptedVersions.short ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                                    Accepted
                                                </>
                                            ) : (
                                                'Accept This Version'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={editableVersions.short}
                                    onChange={(e) => updateVersion('short', e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                    rows={3}
                                    placeholder="Your 20-word boilerplate will appear here..."
                                />
                            </Card>

                            {/* 50-Word Version */}
                            <Card className="p-6 border-l-4 border-l-blue-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">50-Word Version (Standard)</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(editableVersions.medium, 'medium')}
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copySuccess === 'medium' ? 'Copied!' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={() => acceptVersion('medium')}
                                            disabled={acceptedVersions.medium}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${acceptedVersions.medium
                                                    ? 'bg-green-100 text-green-700 cursor-default'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                        >
                                            {acceptedVersions.medium ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                                    Accepted
                                                </>
                                            ) : (
                                                'Accept This Version'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={editableVersions.medium}
                                    onChange={(e) => updateVersion('medium', e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                    rows={4}
                                    placeholder="Your 50-word boilerplate will appear here..."
                                />
                            </Card>

                            {/* 100-Word Version */}
                            <Card className="p-6 border-l-4 border-l-purple-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">100-Word Version (Detailed)</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(editableVersions.long, 'long')}
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copySuccess === 'long' ? 'Copied!' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={() => acceptVersion('long')}
                                            disabled={acceptedVersions.long}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${acceptedVersions.long
                                                    ? 'bg-green-100 text-green-700 cursor-default'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                        >
                                            {acceptedVersions.long ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                                    Accepted
                                                </>
                                            ) : (
                                                'Accept This Version'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={editableVersions.long}
                                    onChange={(e) => updateVersion('long', e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                                    rows={6}
                                    placeholder="Your 100-word boilerplate will appear here..."
                                />
                            </Card>

                            {/* Summary Status */}
                            <Card className="p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <div className="flex gap-4">
                                            <span className={`text-sm ${acceptedVersions.short ? 'text-green-600' : 'text-gray-400'}`}>
                                                {acceptedVersions.short ? '✓' : '○'} Short
                                            </span>
                                            <span className={`text-sm ${acceptedVersions.medium ? 'text-green-600' : 'text-gray-400'}`}>
                                                {acceptedVersions.medium ? '✓' : '○'} Standard
                                            </span>
                                            <span className={`text-sm ${acceptedVersions.long ? 'text-green-600' : 'text-gray-400'}`}>
                                                {acceptedVersions.long ? '✓' : '○'} Detailed
                                            </span>
                                        </div>
                                    </div>
                                    {(acceptedVersions.short || acceptedVersions.medium || acceptedVersions.long) && (
                                        <span className="text-sm text-green-600 font-medium">
                                            Saved to your brand assets!
                                        </span>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default BoilerplateGenerator;