// src/components/features/MarketingWalkthrough/components/ValuePropStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, CheckCircle } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import StrategicDataService from '../../../../../services/StrategicDataService';

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

    // Load existing data from StrategicDataService and localStorage
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                // First try to get data from StrategicDataService
                const productData = await StrategicDataService.getProductInfo();
                if (productData) {
                    if (productData.name) {
                        setProductName(productData.name);
                        setFormData(prev => ({ ...prev, productName: productData.name }));
                    }
                    if (productData.description) {
                        setProductDescription(productData.description);
                        setFormData(prev => ({ ...prev, productDescription: productData.description }));
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

        // Save to StrategicDataService
        try {
            await StrategicDataService.setValueProposition(valueToSave);
            setIsAccepted(true);
            showNotification('Value proposition saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving value proposition:', error);
            showNotification('Error saving value proposition. Please try again.', 'error');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Build Your Value Proposition</h2>
                <p className="text-sm text-gray-600 mb-6">
                    A value proposition communicates what you do, who it's for, and why it matters—all in one powerful sentence. Don't worry if it's rough—we'll help you polish it.
                </p>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter your product name..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Product Description</label>
                        <textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Describe your product..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Enter your value proposition, if you've already created one. If not, fill in the other fields and we'll help you create one.</label>
                        <textarea
                            value={existingValueProp || paragraph}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (existingValueProp) {
                                    setExistingValueProp(val);
                                }
                                setParagraph(val);
                            }}
                            placeholder="Enter or paste your value proposition here..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                            rows={4}
                        />
                    </div>

                    {!existingValueProp && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Target Audience</label>
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Solution</label>
                                <input
                                    type="text"
                                    value={solution}
                                    onChange={(e) => setSolution(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Key Benefit</label>
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => setBenefit(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Proof</label>
                                <input
                                    type="text"
                                    value={proof}
                                    onChange={(e) => setProof(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleAIHelp}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate with AI
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!paragraph && !existingValueProp}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValuePropStep;
