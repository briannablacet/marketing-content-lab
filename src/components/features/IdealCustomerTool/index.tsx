// src/components/features/IdealCustomerGenerator/index.tsx
// ACTUALLY FIXED - Wide + No blank profiles

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Save, CheckCircle, Sparkles, Loader, AlertCircle } from 'lucide-react';
import StrategicDataService from '../../../services/StrategicDataService';

interface CustomerProfile {
    id: string;
    role: string;
    industry: string;
    challenges: string[];
}

const IdealCustomerGenerator: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [profiles, setProfiles] = useState<CustomerProfile[]>([]);
    const [activeProfile, setActiveProfile] = useState<string | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [hasLoadedData, setHasLoadedData] = useState(false);

    useEffect(() => {
        const loadExistingData = async () => {
            try {
                // Load product info
                const productData = StrategicDataService.getProductInfo();
                if (productData && productData.name) {
                    setProductName(productData.name);
                    if (productData.description) {
                        setProductDescription(productData.description);
                    }
                } else {
                    const savedProduct = localStorage.getItem('marketingProduct');
                    if (savedProduct) {
                        const parsedProduct = JSON.parse(savedProduct);
                        setProductName(parsedProduct.name || '');
                        setProductDescription(parsedProduct.description || parsedProduct.type || '');
                    }
                }

                // Load audiences
                const audiences = StrategicDataService.getTargetAudiences();
                let loadedProfiles: CustomerProfile[] = [];

                if (audiences && audiences.length > 0) {
                    loadedProfiles = audiences.map((audience: any, index: number) => ({
                        id: audience.id || `profile-${Date.now()}-${index}`,
                        role: audience.role || '',
                        industry: audience.industry || '',
                        challenges: Array.isArray(audience.challenges) ? audience.challenges : []
                    }));
                } else {
                    const savedAudiences = localStorage.getItem('marketingTargetAudiences');
                    if (savedAudiences) {
                        const parsedAudiences = JSON.parse(savedAudiences);
                        loadedProfiles = parsedAudiences.map((audience: any, index: number) => ({
                            id: `profile-${Date.now()}-${index}`,
                            role: audience.role || '',
                            industry: audience.industry || '',
                            challenges: Array.isArray(audience.challenges) ? audience.challenges : []
                        }));
                    }
                }

                // Only create new profile if NO profiles were loaded
                if (loadedProfiles.length === 0) {
                    loadedProfiles = [{
                        id: `profile-${Date.now()}`,
                        role: '',
                        industry: '',
                        challenges: ['']
                    }];
                }

                setProfiles(loadedProfiles);
                if (loadedProfiles.length > 0) {
                    setActiveProfile(loadedProfiles[0].id);
                }
                setHasLoadedData(true);

            } catch (error) {
                console.error('Error loading strategic data:', error);
                setHasLoadedData(true);
            }
        };

        loadExistingData();
    }, []);

    const createNewProfile = () => {
        const newProfile: CustomerProfile = {
            id: `profile-${Date.now()}`,
            role: '',
            industry: '',
            challenges: ['']
        };

        const updatedProfiles = [...profiles, newProfile];
        setProfiles(updatedProfiles);
        setActiveProfile(newProfile.id);
    };

    const deleteProfile = (profileId: string) => {
        if (profiles.length <= 1) {
            setSaveMessage('You must have at least one customer profile');
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }

        const updatedProfiles = profiles.filter(p => p.id !== profileId);
        setProfiles(updatedProfiles);

        if (activeProfile === profileId) {
            setActiveProfile(updatedProfiles[0]?.id || null);
        }
    };

    const updateProfile = (field: string, value: any) => {
        const updatedProfiles = profiles.map(profile => {
            if (profile.id === activeProfile) {
                return { ...profile, [field]: value };
            }
            return profile;
        });
        setProfiles(updatedProfiles);
    };

    const addChallenge = () => {
        const current = getCurrentProfile();
        if (current) {
            updateProfile('challenges', [...current.challenges, '']);
        }
    };

    const removeChallenge = (index: number) => {
        const current = getCurrentProfile();
        if (current && current.challenges.length > 1) {
            const newChallenges = current.challenges.filter((_, i) => i !== index);
            updateProfile('challenges', newChallenges);
        }
    };

    const updateChallenge = (index: number, value: string) => {
        const current = getCurrentProfile();
        if (current) {
            const newChallenges = [...current.challenges];
            newChallenges[index] = value;
            updateProfile('challenges', newChallenges);
        }
    };

    const getCurrentProfile = () => {
        return profiles.find(p => p.id === activeProfile) || null;
    };

    const handleAISuggestion = async () => {
        if (!productName.trim()) {
            setSaveMessage('Please enter a product name to generate suggestions');
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }

        setIsLoadingAI(true);

        try {
            const requestBody = {
                mode: 'personaGenerator',
                data: {
                    productName: productName.trim(),
                    productType: productDescription.trim() || '',
                    currentPersona: getCurrentProfile() ? {
                        role: getCurrentProfile()?.role,
                        industry: getCurrentProfile()?.industry,
                        challenges: getCurrentProfile()?.challenges?.filter(c => c.trim() !== '') || []
                    } : undefined,
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
                throw new Error(result.message || 'Failed to generate suggestions');
            }

            if (result.personas?.length) {
                setAiSuggestions(result.personas);
                setSaveMessage('Generated customer profile suggestions!');
                setTimeout(() => setSaveMessage(null), 3000);
            } else {
                setSaveMessage('No suggestions were generated. Please try again.');
                setTimeout(() => setSaveMessage(null), 3000);
            }
        } catch (err) {
            console.error('Error fetching AI suggestions:', err);
            setSaveMessage('Failed to generate suggestions. Please try again.');
            setTimeout(() => setSaveMessage(null), 3000);
        } finally {
            setIsLoadingAI(false);
        }
    };

    const applySuggestion = (suggestion: any, suggestionIndex: number) => {
        const newProfile: CustomerProfile = {
            id: `profile-${Date.now()}`,
            role: suggestion.role || '',
            industry: suggestion.industry || '',
            challenges: Array.isArray(suggestion.challenges) ? suggestion.challenges : ['']
        };

        // If there's only one profile and it's empty, replace it instead of adding a new one
        if (profiles.length === 1 && !profiles[0].role && !profiles[0].industry && profiles[0].challenges.length === 1 && !profiles[0].challenges[0]) {
            setProfiles([newProfile]);
            setActiveProfile(newProfile.id);
        } else {
            const updatedProfiles = [...profiles, newProfile];
            setProfiles(updatedProfiles);
            setActiveProfile(newProfile.id);
        }

        const updatedSuggestions = aiSuggestions.filter((_, index) => index !== suggestionIndex);
        setAiSuggestions(updatedSuggestions);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            StrategicDataService.setTargetAudiences(profiles);
            localStorage.setItem('marketingTargetAudiences', JSON.stringify(profiles));

            setSaveMessage('Customer profiles saved successfully!');
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            console.error('Error saving profiles:', error);
            setSaveMessage('Failed to save customer profiles. Please try again.');
            setTimeout(() => setSaveMessage(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const currentProfile = getCurrentProfile();

    if (!hasLoadedData) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                Ideal Customer Generator
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Define who your ideal customers are and what challenges they face
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save Profiles'}
                        </button>
                    </div>

                    {saveMessage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-800 text-sm">{saveMessage}</span>
                        </div>
                    )}
                </div>

                {aiSuggestions.length > 0 && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-900">AI-Generated Customer Profiles</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {aiSuggestions.map((suggestion, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                                    <div className="space-y-2 mb-3">
                                        <p><strong>Role:</strong> {suggestion.role}</p>
                                        <p><strong>Industry:</strong> {suggestion.industry}</p>
                                        <p><strong>Key Challenges:</strong> {suggestion.challenges?.join(', ')}</p>
                                    </div>
                                    <button
                                        onClick={() => applySuggestion(suggestion, index)}
                                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        + Add This Profile
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setAiSuggestions([])}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                        >
                            Clear Suggestions
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
                    <p className="text-gray-600 mb-6">
                        Tell us about your product to get AI-powered customer profile suggestions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Marketing Content Lab"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Description
                            </label>
                            <input
                                type="text"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., AI-powered marketing platform"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleAISuggestion}
                            disabled={isLoadingAI || !productName.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoadingAI ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5" />
                            )}
                            {isLoadingAI ? 'Finding Ideal Customers...' : 'Find My Ideal Customers'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Customer Profiles</h2>
                            <button
                                onClick={createNewProfile}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Profile
                            </button>
                        </div>
                    </div>

                    <div className="border-b">
                        <div className="flex overflow-x-auto">
                            {profiles.map((profile, index) => (
                                <button
                                    key={profile.id}
                                    onClick={() => setActiveProfile(profile.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap ${activeProfile === profile.id
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <span>{profile.role || `Customer ${index + 1}`}</span>
                                    {profiles.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteProfile(profile.id);
                                            }}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {currentProfile && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Role/Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentProfile.role}
                                        onChange={(e) => updateProfile('role', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Marketing Director, CEO"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Industry *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentProfile.industry}
                                        onChange={(e) => updateProfile('industry', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Technology, Healthcare"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Key Challenges
                                    </label>
                                    <button
                                        onClick={addChallenge}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Challenge
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.challenges.map((challenge, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={challenge}
                                                onChange={(e) => updateChallenge(index, e.target.value)}
                                                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="What problems do they face?"
                                            />
                                            {currentProfile.challenges.length > 1 && (
                                                <button
                                                    onClick={() => removeChallenge(index)}
                                                    className="text-red-500 hover:text-red-700 p-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Saving...' : 'Save Customer Profiles'}
                    </button>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900 mb-2">Tips for Better Customer Profiles</h4>
                            <ul className="text-blue-800 text-sm space-y-1">
                                <li>• Be specific - "Marketing Director at 50-person SaaS company" vs "Business person"</li>
                                <li>• Focus on job-related challenges rather than personal traits</li>
                                <li>• Think about what keeps them up at night professionally</li>
                                <li>• Consider both the problems they face and goals they want to achieve</li>
                                <li>• Use the AI suggestions as a starting point, then customize</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdealCustomerGenerator;