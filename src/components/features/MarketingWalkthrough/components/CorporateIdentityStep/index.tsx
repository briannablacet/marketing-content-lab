// src/components/features/MarketingWalkthrough/components/CorporateIdentityStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
    Sparkles,
    Heart,
    Target,
    FileText,
    Hash,
    RefreshCw,
    CheckCircle,
    Copy,
    Wand2,
    Loader2
} from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import StrategicDataService from '../../../../../services/StrategicDataService';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface BoilerplateData {
    '20word'?: string;
    '50word'?: string;
    '100word'?: string;
    short?: string;
    medium?: string;
    long?: string;
}

interface WalkthroughFormData {
    productName?: string;
    productDescription?: string;
    valueProp?: string | any;
    targetAudience?: string;
    brandVoice?: any;
    mission?: string;
    vision?: string;
    tagline?: string;
    boilerplates?: {
        short: string;
        medium: string;
        long: string;
    };
    [key: string]: any;
}

interface CorporateIdentityStepProps {
    onNext: () => void;
    onBack: () => void;
    formData: WalkthroughFormData;
    setFormData: (data: WalkthroughFormData) => void;
}

const CorporateIdentityStep: React.FC<CorporateIdentityStepProps> = ({
    onNext,
    onBack,
    formData,
    setFormData
}) => {
    const { showNotification } = useNotification();

    // State for each section
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [currentTagline, setCurrentTagline] = useState('');
    const [taglineOptions, setTaglineOptions] = useState<string[]>([]);

    // Boilerplate state for all three lengths
    const [boilerplates, setBoilerplates] = useState<{
        short: string;
        medium: string;
        long: string;
    }>({
        short: '',
        medium: '',
        long: ''
    });

    // Loading states for each boilerplate length
    const [boilerplateLoading, setBoilerplateLoading] = useState<{
        short: boolean;
        medium: boolean;
        long: boolean;
    }>({
        short: false,
        medium: false,
        long: false
    });

    // Copied states for copy buttons
    const [copied, setCopied] = useState<{
        short: boolean;
        medium: boolean;
        long: boolean;
    }>({
        short: false,
        medium: false,
        long: false
    });

    // UI state
    const [isGenerating, setIsGenerating] = useState<{
        mission: boolean;
        vision: boolean;
        taglines: boolean;
    }>({
        mission: false,
        vision: false,
        taglines: false
    });

    const [showTaglineOptions, setShowTaglineOptions] = useState(false);

    // Safe localStorage getter
    const getFromLocalStorage = (key: string) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    };

    // Load existing data on mount
    useEffect(() => {
        loadExistingData();
    }, []);

    const loadExistingData = async () => {
        try {
            // First check formData for all values
            if (formData.tagline) {
                setCurrentTagline(formData.tagline);
            }
            if (formData.mission) {
                setMission(formData.mission);
            }
            if (formData.vision) {
                setVision(formData.vision);
            }
            if (formData.boilerplates) {
                setBoilerplates({
                    short: formData.boilerplates.short || '',
                    medium: formData.boilerplates.medium || '',
                    long: formData.boilerplates.long || ''
                });
            }

            // Only load from StrategicDataService if not already set from formData
            if (!formData.mission) {
                const existingMission = StrategicDataService.getMission();
                if (existingMission) setMission(existingMission);
            }
            if (!formData.vision) {
                const existingVision = StrategicDataService.getVision();
                if (existingVision) setVision(existingVision);
            }
            if (!formData.tagline) {
                const existingTagline = StrategicDataService.getTagline();
                if (existingTagline) setCurrentTagline(existingTagline);
            }
            if (!formData.boilerplates) {
                const existingBoilerplates = StrategicDataService.getBoilerplates() as BoilerplateData | string[] | null;
                if (existingBoilerplates) {
                    if (typeof existingBoilerplates === 'object' && !Array.isArray(existingBoilerplates)) {
                        setBoilerplates({
                            short: existingBoilerplates['20word'] || existingBoilerplates['short'] || '',
                            medium: existingBoilerplates['50word'] || existingBoilerplates['medium'] || '',
                            long: existingBoilerplates['100word'] || existingBoilerplates['long'] || ''
                        });
                    } else if (Array.isArray(existingBoilerplates) && existingBoilerplates.length > 0) {
                        setBoilerplates({
                            short: existingBoilerplates[0] || '',
                            medium: existingBoilerplates[1] || '',
                            long: existingBoilerplates[2] || ''
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error loading corporate identity data:', error);
        }
    };

    // Save data whenever values change
    useEffect(() => {
        if (mission || vision || currentTagline || boilerplates.short || boilerplates.medium || boilerplates.long) {
            // Save to StrategicDataService
            if (mission) StrategicDataService.setMission(mission);
            if (vision) StrategicDataService.setVision(vision);
            if (currentTagline) StrategicDataService.setTagline(currentTagline);
            if (boilerplates.short || boilerplates.medium || boilerplates.long) {
                StrategicDataService.setBoilerplates({
                    short: boilerplates.short || '',
                    medium: boilerplates.medium || '',
                    long: boilerplates.long || ''
                });
            }

            // Also save to localStorage for redundancy
            if (mission) localStorage.setItem('brandMission', mission);
            if (vision) localStorage.setItem('brandVision', vision);
            if (currentTagline) localStorage.setItem('brandTagline', currentTagline);
            if (boilerplates.short || boilerplates.medium || boilerplates.long) {
                localStorage.setItem('brandBoilerplates', JSON.stringify([
                    boilerplates.short || '',
                    boilerplates.medium || '',
                    boilerplates.long || ''
                ]));
            }

            // Update parent's formData
            setFormData({
                ...formData,
                mission: mission || formData.mission,
                vision: vision || formData.vision,
                tagline: currentTagline || formData.tagline,
                boilerplates: {
                    short: boilerplates.short || (formData.boilerplates?.short || ''),
                    medium: boilerplates.medium || (formData.boilerplates?.medium || ''),
                    long: boilerplates.long || (formData.boilerplates?.long || '')
                }
            });
        }
    }, [mission, vision, currentTagline, boilerplates, setFormData]);

    // Generate Mission & Vision
    const generateMissionVision = async () => {
        console.log('🔍 formData:', formData);
        console.log('🔍 productName in localStorage:', localStorage.getItem('marketingProduct'));
        console.log('🔍 valueProp in localStorage:', localStorage.getItem('marketingValueProp'));

        setIsGenerating(prev => ({ ...prev, mission: true, vision: true }));

        try {
            // Get data from multiple sources
            const productData = getFromLocalStorage('marketingProduct');
            const valuePropFromStorage = localStorage.getItem('marketingValueProp');

            const companyName = formData.productName?.trim() || productData?.name || '';
            const description = formData.productDescription?.trim() || productData?.description || productData?.type || '';
            const audience = formData.targetAudience?.trim() || 'target customers';
            const valueProp = (typeof formData.valueProp === 'string' ? formData.valueProp.trim() : formData.valueProp?.promise?.trim()) || valuePropFromStorage || '';

            // Validate required data
            if (!companyName) {
                showNotification('Please enter your product name in Step 2 (Product Information)', 'error');
                return;
            }

            if (!description) {
                showNotification('Please enter your product description in Step 2 (Product Information)', 'error');
                return;
            }

            // Debug logging
            console.log('API Request Data:', {
                companyName,
                audience,
                valueProp,
                additionalContext: description
            });

            const requestBody = {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                mode: 'missionVision',
=======
                mode: 'mission-vision',
>>>>>>> Stashed changes
=======
                mode: 'mission-vision',
>>>>>>> Stashed changes
=======
                mode: 'mission-vision',
>>>>>>> Stashed changes
=======
                mode: 'mission-vision',
>>>>>>> Stashed changes
                data: {
                    companyName,
                    audience,
                    valueProp,
                    additionalContext: description
                }
            };

            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error Response:', errorData);
                throw new Error(errorData?.message || 'Failed to generate mission and vision');
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.mission) {
                setMission(result.mission);
                showNotification('Mission generated! ✨', 'success');
            }
            if (result.vision) {
                setVision(result.vision);
                showNotification('Vision generated! ✨', 'success');
            }
        } catch (error) {
            console.error('Error generating mission/vision:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to generate mission and vision', 'error');
        } finally {
            setIsGenerating(prev => ({ ...prev, mission: false, vision: false }));
        }
    };

    const generateMission = async () => {
        setIsGenerating(prev => ({ ...prev, mission: true }));
        await generateMissionVision();
    };

    const generateVision = async () => {
        setIsGenerating(prev => ({ ...prev, vision: true }));
        await generateMissionVision();
    };

    // Generate specific boilerplate length
    const generateBoilerplate = async (length: 'short' | 'medium' | 'long') => {
        setBoilerplateLoading(prev => ({ ...prev, [length]: true }));

        try {
            // Get data from multiple sources
            const productData = getFromLocalStorage('marketingProduct');
            const valuePropFromStorage = localStorage.getItem('marketingValueProp');

            const businessName = formData.productName?.trim() || productData?.name || '';
            const description = formData.productDescription?.trim() || productData?.description || productData?.type || '';
            const audience = formData.targetAudience?.trim() || 'target customers';
            const valueProp = (typeof formData.valueProp === 'string' ? formData.valueProp.trim() : formData.valueProp?.promise?.trim()) || valuePropFromStorage || '';

            // Validate required data
            if (!businessName) {
                showNotification('Please enter your product name in Step 2 (Product Information)', 'error');
                return;
            }

            if (!description) {
                showNotification('Please enter your product description in Step 2 (Product Information)', 'error');
                return;
            }

            const wordCount = length === 'short' ? 20 : length === 'medium' ? 50 : 100;

            console.log('🔍 Final valueProp being used:', valueProp);
            console.log('🔍 localStorage value:', valuePropFromStorage);
            console.log('🔍 formData.valueProp:', formData.valueProp);

            const requestBody = {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                mode: 'adaptBoilerplate',
=======
                mode: 'adapt-boilerplate',
>>>>>>> Stashed changes
=======
                mode: 'adapt-boilerplate',
>>>>>>> Stashed changes
=======
                mode: 'adapt-boilerplate',
>>>>>>> Stashed changes
=======
                mode: 'adapt-boilerplate',
>>>>>>> Stashed changes
                data: {
                    businessName,
                    description,
                    product: description,
                    audience,
                    promise: valueProp,
                    tone: formData.brandVoice?.tone || 'professional',
                    style: 'clear and compelling',
                    differentiator: typeof formData.valueProp === 'object' ? formData.valueProp.differentiator?.trim() || '' : '',
                    positioning: typeof formData.valueProp === 'object' ? formData.valueProp.positioning?.trim() || '' : '',
                    archetype: 'Professional',
                    personality: formData.brandVoice?.personality || ['authentic', 'reliable'],
                    wordCount,
                    numOptions: 1
                }
            };

            console.log('Sending request:', requestBody);

            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error Response:', errorData);
                throw new Error(errorData?.message || 'Failed to generate boilerplate');
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (Array.isArray(result) && result.length > 0) {
                const newBoilerplate = result[0];
                setBoilerplates(prev => ({
                    ...prev,
                    [length]: newBoilerplate
                }));

                showNotification(`${length} boilerplate generated! ✨`, 'success');
            }
        } catch (error) {
            console.error('Error generating boilerplate:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to generate boilerplate', 'error');
        } finally {
            setBoilerplateLoading(prev => ({ ...prev, [length]: false }));
        }
    };

    // Generate Taglines
    const generateTaglines = async () => {
        console.log('🔍 Starting tagline generation...');
        setIsGenerating(prev => ({ ...prev, taglines: true }));

        try {
            console.log('🔍 Inside try block...');
            // Get data from multiple sources
            const productData = getFromLocalStorage('marketingProduct');
            const valuePropFromStorage = localStorage.getItem('marketingValueProp');

            const businessName = formData.productName?.trim() || productData?.name || '';
            const description = formData.productDescription?.trim() || productData?.description || productData?.type || '';
            const audience = formData.targetAudience?.trim() || 'target customers';
            const valueProp = (typeof formData.valueProp === 'string' ? formData.valueProp.trim() : formData.valueProp?.promise?.trim()) || valuePropFromStorage || '';

            // Validate required data
            if (!businessName) {
                showNotification('Please enter your product name in Step 2 (Product Information)', 'error');
                return;
            }

            if (!description) {
                showNotification('Please enter your product description in Step 2 (Product Information)', 'error');
                return;
            }

            const requestBody = {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                mode: 'tagline',
=======
                mode: 'taglines',
>>>>>>> Stashed changes
=======
                mode: 'taglines',
>>>>>>> Stashed changes
=======
                mode: 'taglines',
>>>>>>> Stashed changes
=======
                mode: 'taglines',
>>>>>>> Stashed changes
                data: {
                    businessName,
                    description,
                    product: description,
                    audience,
                    promise: valueProp,
                    tone: formData.brandVoice?.tone || 'professional',
                    style: 'clear and compelling',
                    archetype: 'Professional',
                    personality: formData.brandVoice?.personality || ['authentic', 'reliable']
                }
            };

            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log('🔍 Got response, status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error Response:', errorData);
                throw new Error(errorData?.message || 'Failed to generate taglines');
            }
            const result = await response.json();
            console.log('Taglines API Response:', result);

            if (Array.isArray(result) && result.length > 0) {
                setTaglineOptions(result);
                setShowTaglineOptions(true);
                showNotification('Taglines generated! ✨', 'success');
            } else {
                throw new Error('No taglines were generated');
            }
        } catch (error) {
            console.error('Error generating taglines:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to generate taglines', 'error');
        } finally {
            setIsGenerating(prev => ({ ...prev, taglines: false }));
        }
    };

    const chooseTagline = (tagline: string) => {
        setCurrentTagline(tagline);
        setShowTaglineOptions(false);
        showNotification('Tagline selected! ✨', 'success');
    };

    const copyToClipboard = async (text: string, length: 'short' | 'medium' | 'long') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(prev => ({ ...prev, [length]: true }));
            setTimeout(() => {
                setCopied(prev => ({ ...prev, [length]: false }));
            }, 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    const countWords = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const updateBoilerplate = (length: 'short' | 'medium' | 'long', value: string) => {
        setBoilerplates(prev => ({
            ...prev,
            [length]: value
        }));
    };

    return (
        <div className="w-full max-w-none space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Corporate Identity</h1>
                </div>
                <p className="text-lg text-gray-600">
                    Create your official brand statements (all optional)
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Skip any sections you don't need - every element is completely optional
                </p>
            </div>

            {/* Mission Statement Section */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-red-500" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Mission Statement</h2>
                            <p className="text-sm text-gray-600">What your company does today and why it exists</p>
                        </div>
                    </div>
                    <button
                        onClick={generateMission}
                        disabled={isGenerating.mission}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isGenerating.mission ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Mission
                            </>
                        )}
                    </button>
                </div>

                <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-800 bg-white"
                    rows={3}
                    placeholder="Enter your mission statement or click Generate to create one automatically..."
                />

                {mission && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Mission saved automatically
                    </div>
                )}
            </Card>

            {/* Vision Statement Section */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-blue-500" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Vision Statement</h2>
                            <p className="text-sm text-gray-600">The better future your company wants to help create</p>
                        </div>
                    </div>
                    <button
                        onClick={generateVision}
                        disabled={isGenerating.vision}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isGenerating.vision ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Vision
                            </>
                        )}
                    </button>
                </div>

                <textarea
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                    rows={3}
                    placeholder="Enter your vision statement or click Generate to create one automatically..."
                />

                {vision && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Vision saved automatically
                    </div>
                )}
            </Card>

            {/* Brand Boilerplate Section - Three Independent Boxes */}
            <Card className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-green-500" />
                        <h2 className="text-xl font-semibold text-gray-900">Brand Boilerplates</h2>
                    </div>
                    <p className="text-sm text-gray-600">Generate professional company descriptions in different lengths</p>
                </div>

                <div className="space-y-6">
                    {/* 20-Word Boilerplate */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">20-Word Boilerplate</h3>
                                <p className="text-sm text-gray-500">Perfect for bios and quick introductions</p>
                            </div>
                            <button
                                onClick={() => generateBoilerplate('short')}
                                disabled={boilerplateLoading.short}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {boilerplateLoading.short ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4" />
                                )}
                                {boilerplateLoading.short ? 'Generating...' : 'Generate'}
                            </button>
                        </div>

                        <div className="relative">
                            <textarea
                                value={boilerplates.short}
                                onChange={(e) => updateBoilerplate('short', e.target.value)}
                                placeholder="Your crisp 20-word company description will appear here..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={2}
                            />

                            {boilerplates.short && (
                                <button
                                    onClick={() => copyToClipboard(boilerplates.short, 'short')}
                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                                    title="Copy to clipboard"
                                >
                                    {copied.short ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>

                        {boilerplates.short && (
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                <span>Word count: {countWords(boilerplates.short)} words</span>
                                {countWords(boilerplates.short) >= 18 && countWords(boilerplates.short) <= 22 && (
                                    <span className="text-green-600 font-medium">✓ Perfect length</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 50-Word Boilerplate */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">50-Word Boilerplate</h3>
                                <p className="text-sm text-gray-500">Ideal for website about pages and marketing materials</p>
                            </div>
                            <button
                                onClick={() => generateBoilerplate('medium')}
                                disabled={boilerplateLoading.medium}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {boilerplateLoading.medium ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4" />
                                )}
                                {boilerplateLoading.medium ? 'Generating...' : 'Generate'}
                            </button>
                        </div>

                        <div className="relative">
                            <textarea
                                value={boilerplates.medium}
                                onChange={(e) => updateBoilerplate('medium', e.target.value)}
                                placeholder="Your detailed 50-word company description will appear here..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                            />

                            {boilerplates.medium && (
                                <button
                                    onClick={() => copyToClipboard(boilerplates.medium, 'medium')}
                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                                    title="Copy to clipboard"
                                >
                                    {copied.medium ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>

                        {boilerplates.medium && (
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                <span>Word count: {countWords(boilerplates.medium)} words</span>
                                {countWords(boilerplates.medium) >= 45 && countWords(boilerplates.medium) <= 55 && (
                                    <span className="text-green-600 font-medium">✓ Perfect length</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 100-Word Boilerplate */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">100-Word Boilerplate</h3>
                                <p className="text-sm text-gray-500">Great for press releases and comprehensive overviews</p>
                            </div>
                            <button
                                onClick={() => generateBoilerplate('long')}
                                disabled={boilerplateLoading.long}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {boilerplateLoading.long ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4" />
                                )}
                                {boilerplateLoading.long ? 'Generating...' : 'Generate'}
                            </button>
                        </div>

                        <div className="relative">
                            <textarea
                                value={boilerplates.long}
                                onChange={(e) => updateBoilerplate('long', e.target.value)}
                                placeholder="Your comprehensive 100-word company description will appear here..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                            />

                            {boilerplates.long && (
                                <button
                                    onClick={() => copyToClipboard(boilerplates.long, 'long')}
                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                                    title="Copy to clipboard"
                                >
                                    {copied.long ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>

                        {boilerplates.long && (
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                <span>Word count: {countWords(boilerplates.long)} words</span>
                                {countWords(boilerplates.long) >= 95 && countWords(boilerplates.long) <= 105 && (
                                    <span className="text-green-600 font-medium">✓ Perfect length</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Auto-save indicator for boilerplates */}
                {(boilerplates.short || boilerplates.medium || boilerplates.long) && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        All boilerplates saved automatically
                    </div>
                )}
            </Card>

            {/* Taglines Section */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Hash className="w-6 h-6 text-yellow-500" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Brand Tagline</h2>
                            <p className="text-sm text-gray-600">A memorable phrase that captures your brand essence</p>
                        </div>
                    </div>
                    <button
                        onClick={generateTaglines}
                        disabled={isGenerating.taglines}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isGenerating.taglines ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Options
                            </>
                        )}
                    </button>
                </div>

                <input
                    type="text"
                    value={currentTagline}
                    onChange={(e) => setCurrentTagline(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 bg-white"
                    placeholder="Enter your tagline or click Generate Options to see suggestions..."
                />

                {currentTagline && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Tagline saved automatically
                    </div>
                )}

                {/* Tagline Options */}
                {showTaglineOptions && taglineOptions.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Choose your favorite:</h3>
                        {taglineOptions.map((tagline, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <span className="text-gray-800">{tagline}</span>
                                <button
                                    onClick={() => chooseTagline(tagline)}
                                    className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                                >
                                    Choose This
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Progress Summary */}
            <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Corporate Identity Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className={`text-sm ${mission ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            Mission {mission ? '✓' : '○'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm ${vision ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            Vision {vision ? '✓' : '○'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        <span className={`text-sm ${(boilerplates.short || boilerplates.medium || boilerplates.long) ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            Boilerplates {(boilerplates.short || boilerplates.medium || boilerplates.long) ? '✓' : '○'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm ${currentTagline ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            Tagline {currentTagline ? '✓' : '○'}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    All sections are optional. Complete only the ones you need for your brand.
                </p>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CorporateIdentityStep;