// src/components/features/MissionVisionGenerator/index.tsx
// ACTUALLY WIDE VERSION - max-w-7xl

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, Save, CheckCircle, Target, Eye, AlertCircle } from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';

const MissionVisionGenerator: React.FC = () => {
    // Form inputs
    const [companyName, setCompanyName] = useState('');
    const [audience, setAudience] = useState('');
    const [differentiator, setDifferentiator] = useState('');
    const [valueProp, setValueProp] = useState('');
    const [tagline, setTagline] = useState('');
    const [boilerplate, setBoilerplate] = useState('');
    const [additionalContext, setAdditionalContext] = useState('');

    // Generated results
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Load existing data on mount
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const productData = StrategicDataService.getProductInfo();
                if (productData && productData.name) {
                    setCompanyName(productData.name);
                } else {
                    const savedProduct = localStorage.getItem('marketingProduct');
                    if (savedProduct) {
                        const parsedProduct = JSON.parse(savedProduct);
                        setCompanyName(parsedProduct.name || '');
                    }
                }

                // Load value proposition
                const valueProposition = StrategicDataService.getValueProposition();
                if (valueProposition) {
                    setValueProp(valueProposition);
                } else {
                    const messageFramework = JSON.parse(localStorage.getItem('messageFramework') || '{}');
                    if (messageFramework.valueProposition) {
                        setValueProp(messageFramework.valueProposition);
                    }
                }

                // Load target audience
                const audiences = StrategicDataService.getTargetAudiences();
                if (audiences && audiences.length > 0) {
                    const audienceWithRole = audiences.find(a => a.role && a.role.trim() !== '');
                    if (audienceWithRole) {
                        setAudience(audienceWithRole.role);
                    }
                }

                // Load tagline
                const existingTagline = StrategicDataService.getTagline();
                if (existingTagline) {
                    setTagline(existingTagline);
                }

                const existingMission = StrategicDataService.getMission();
                const existingVision = StrategicDataService.getVision();

                if (existingMission) {
                    setMission(existingMission);
                    setHasGenerated(true);
                }
                if (existingVision) {
                    setVision(existingVision);
                    setHasGenerated(true);
                }

            } catch (error) {
                console.error('Error loading strategic data:', error);
            }
        };

        loadExistingData();
    }, []);

    const handleGenerate = async () => {
        if (!companyName && !audience && !differentiator && !additionalContext) {
            setSaveMessage('Please provide at least some information to generate mission and vision');
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }

        setIsLoading(true);
        try {
            const requestBody = {
                type: 'missionVision',
                data: {
                    companyName,
                    audience,
                    differentiator,
                    valueProp,
                    tagline,
                    boilerplate,
                    additionalContext
                }
            };

            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to generate mission and vision');
            }

            if (result.mission || result.vision) {
                setMission(result.mission || '');
                setVision(result.vision || '');
                setHasGenerated(true);
                setSaveMessage('Mission and vision generated successfully!');
                setTimeout(() => setSaveMessage(null), 3000);
            }
        } catch (error) {
            console.error('Generation error:', error);
            setSaveMessage('Failed to generate mission and vision. Please try again.');
            setTimeout(() => setSaveMessage(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!mission && !vision) {
            setSaveMessage('Please generate mission and vision first');
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }

        setIsSaving(true);
        try {
            if (mission) {
                StrategicDataService.setMission(mission);
            }
            if (vision) {
                StrategicDataService.setVision(vision);
            }

            setSaveMessage('Mission and vision saved successfully!');
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            console.error('Error saving mission and vision:', error);
            setSaveMessage('Failed to save mission and vision. Please try again.');
            setTimeout(() => setSaveMessage(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Target className="w-8 h-8 text-blue-600" />
                                Mission & Vision Generator
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Define your company's purpose and aspirational future
                            </p>
                        </div>
                        {hasGenerated && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving || (!mission && !vision)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Results'}
                            </button>
                        )}
                    </div>

                    {saveMessage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-800 text-sm">{saveMessage}</span>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
                    <p className="text-gray-600 mb-6">
                        Fill out what you can below. We'll use your existing strategic data where available.
                    </p>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Audience
                                </label>
                                <input
                                    type="text"
                                    value={audience}
                                    onChange={(e) => setAudience(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Who do you serve?"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Key Differentiator
                                </label>
                                <input
                                    type="text"
                                    value={differentiator}
                                    onChange={(e) => setDifferentiator(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="What makes you unique?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Value Proposition
                                </label>
                                <input
                                    type="text"
                                    value={valueProp}
                                    onChange={(e) => setValueProp(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your value proposition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Context
                            </label>
                            <textarea
                                value={additionalContext}
                                onChange={(e) => setAdditionalContext(e.target.value)}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Any additional context, goals, or specific requirements..."
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5" />
                            )}
                            {isLoading ? 'Generating Mission & Vision...' : 'Generate Mission & Vision'}
                        </button>
                    </div>
                </div>

                {(mission || vision) && (
                    <div className="space-y-6">
                        {mission && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-xl font-semibold text-gray-900">Mission Statement</h3>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <textarea
                                        value={mission}
                                        onChange={(e) => setMission(e.target.value)}
                                        rows={3}
                                        className="w-full p-3 bg-transparent border-none resize-none focus:outline-none text-gray-800 text-lg leading-relaxed"
                                        placeholder="Your mission statement will appear here..."
                                    />
                                </div>
                            </div>
                        )}

                        {vision && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Eye className="w-6 h-6 text-purple-600" />
                                    <h3 className="text-xl font-semibold text-gray-900">Vision Statement</h3>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <textarea
                                        value={vision}
                                        onChange={(e) => setVision(e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-transparent border-none resize-none focus:outline-none text-gray-800 text-lg leading-relaxed"
                                        placeholder="Your vision statement will appear here..."
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Save Mission & Vision'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionVisionGenerator;