// src/components/features/MarketingWalkthrough/components/ValuePropStep/index.tsx
// FIXED VERSION - Proper headers like WelcomeStep

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, CheckCircle, Target } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import StrategicDataService from '../../../../../services/StrategicDataService';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface ValuePropStepProps {
    onNext?: () => void;
    onBack?: () => void;
    formData?: any;
    setFormData?: (data: any) => void;
}

const ValuePropStep: React.FC<ValuePropStepProps> = ({ onNext, onBack, formData = {}, setFormData = () => { } }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [target, setTarget] = useState('');
    const [solution, setSolution] = useState('');
    const [benefit, setBenefit] = useState('');
    const [proof, setProof] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [existingValueProp, setExistingValueProp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const { showNotification } = useNotification();
    const [tagline, setTagline] = useState('');
    const [productType, setProductType] = useState('');
    const [keyBenefits, setKeyBenefits] = useState(['']);

    // Load existing data from StrategicDataService and localStorage
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                // First try to get data from StrategicDataService
                const productData = await StrategicDataService.getProductInfo();
                if (productData && (productData.name || productData.description)) {
                    if (productData.name) {
                        setProductName(productData.name);
                        setFormData(prev => ({ ...prev, productName: productData.name }));
                    }
                    if (productData.description) {
                        setProductDescription(productData.description);
                        setFormData(prev => ({ ...prev, productDescription: productData.description }));
                    }
                } else {
                    // Fallback to localStorage
                    const savedProduct = localStorage.getItem('marketingProduct');
                    if (savedProduct) {
                        const parsedProduct = JSON.parse(savedProduct);
                        if (parsedProduct.name) {
                            setProductName(parsedProduct.name);
                            setFormData(prev => ({ ...prev, productName: parsedProduct.name }));
                        }
                        if (parsedProduct.description || parsedProduct.type) {
                            setProductDescription(parsedProduct.description || parsedProduct.type);
                            setFormData(prev => ({ ...prev, productDescription: parsedProduct.description || parsedProduct.type }));
                        }
                    }
                }

                // Then try to get value prop from localStorage
                const marketingValueProp = localStorage.getItem('marketingValueProp');
                if (marketingValueProp) {
                    setExistingValueProp(marketingValueProp);
                    setParagraph(marketingValueProp);
                    setFormData(prev => ({ ...prev, valueProp: marketingValueProp }));
                }

                // Load target audience from personas if available
                const personas = formData.personas || [];
                if (personas.length > 0) {
                    const targetAudience = personas[0].role || '';
                    setTarget(targetAudience);
                    setFormData(prev => ({ ...prev, targetAudience }));
                }

                // Load solution and benefit if available
                const messagingFramework = await StrategicDataService.getMessagingFramework();
                if (messagingFramework) {
                    if (messagingFramework.solution) {
                        setSolution(messagingFramework.solution);
                        setFormData(prev => ({ ...prev, solution: messagingFramework.solution }));
                    }
                    if (messagingFramework.benefit) {
                        setBenefit(messagingFramework.benefit);
                        setFormData(prev => ({ ...prev, benefit: messagingFramework.benefit }));
                    }
                }

                // Load value proposition from StrategicDataService
                try {
                    const valueProp = await StrategicDataService.getValueProposition();
                    if (valueProp) {
                        setExistingValueProp(valueProp);
                        setParagraph(valueProp);
                        setFormData(prev => ({ ...prev, valueProp }));
                    }
                } catch (error) {
                    console.log('No value proposition found in StrategicDataService');
                }
            } catch (error) {
                console.error('Error loading existing data:', error);
                showNotification('Error loading existing data. Please try again.', 'error');
            }
        };

        loadExistingData();
    }, []);

    // Update formData when local state changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            productName,
            productDescription,
            targetAudience: target,
            solution,
            benefit,
            proof,
            valueProp: existingValueProp || paragraph
        }));
    }, [productName, productDescription, target, solution, benefit, proof, existingValueProp, paragraph]);

    const handleAIHelp = async () => {
        if (!productName) {
            showNotification('Please provide a product name', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const requestBody = {
                type: 'valueProposition',
                data: {
                    productInfo: {
                        name: productName,
                        description: productDescription || '',
                        targetAudience: target || '',
                        benefits: [solution, benefit].filter(Boolean),
                        proof: proof || ''
                    },
                    competitors: [],
                    industry: 'technology',
                    focusAreas: ['user', 'business'],
                    tone: 'professional',
                    currentFramework: {
                        valueProposition: existingValueProp || paragraph,
                        solution: solution,
                        benefit: benefit,
                        proof: proof
                    }
                }
            };

            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to generate value proposition');
            }

            if (result.valueProposition) {
                setParagraph(result.valueProposition);
                setFormData(prev => ({ ...prev, valueProp: result.valueProposition }));
                showNotification('Value proposition generated successfully!', 'success');
            } else {
                showNotification('No value proposition was generated. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error generating value prop:', error);
            showNotification(error.message || 'Failed to generate value proposition. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const valueToSave = existingValueProp || paragraph;
        setFormData(prev => ({ ...prev, valueProp: valueToSave }));

        // Save to localStorage
        localStorage.setItem('marketingValueProp', valueToSave);

        // Try to save to StrategicDataService if the method exists
        try {
            if (StrategicDataService.setValueProposition && typeof StrategicDataService.setValueProposition === 'function') {
                await StrategicDataService.setValueProposition(valueToSave);
            } else {
                console.log('StrategicDataService.setValueProposition method not available');
            }
            setIsAccepted(true);
            showNotification('Value proposition saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving value proposition to StrategicDataService:', error);
            // Still show success since localStorage save worked
            setIsAccepted(true);
            showNotification('Value proposition saved successfully!', 'success');
        }
    };

    const addBenefit = () => {
        setKeyBenefits([...keyBenefits, '']);
    };

    return (
        <div className="w-full max-w-none space-y-6">
            <Card className="p-6">
                {/* SMALLER HEADLINE ON WHITE CARD BACKGROUND */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Tell us about your business</h2>
                    <p className="text-gray-600 mt-2">We'll use this information to create your value proposition</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">What's the name of your business?</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter your business or brand name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you already have a tagline? (Optional)</label>
                        <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g., No more crappy content"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Share a description of your business. Don't worry if it's not perfect.</label>
                        <textarea
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            placeholder="Describe the services or products you offer."
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">What are the main benefits for your clients?</label>
                        <p className="text-sm text-gray-600 mb-4">
                            List the top benefits your clients or customers receive
                        </p>
                        <div className="space-y-3">
                            {keyBenefits.map((benefit, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => {
                                            const updated = [...keyBenefits];
                                            updated[index] = e.target.value;
                                            setKeyBenefits(updated);
                                        }}
                                        placeholder="e.g., Pain relief, Better sleep, Increased confidence"
                                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {keyBenefits.length > 1 && (
                                        <button
                                            onClick={() => setKeyBenefits(keyBenefits.filter((_, i) => i !== index))}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addBenefit}
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Benefit
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* AI Help Section */}
            <Card className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Generate Your Value Proposition</h2>
                    <p className="text-gray-600 mt-2">Let AI help you craft a compelling value proposition</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Value Proposition</label>
                        <textarea
                            value={paragraph}
                            onChange={(e) => setParagraph(e.target.value)}
                            placeholder="Your value proposition will appear here..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleAIHelp}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate with AI
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ValuePropStep;