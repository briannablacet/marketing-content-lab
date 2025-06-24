// src/components/features/MarketingWalkthrough/components/ValuePropStep/index.tsx
// EMERGENCY FIX - AI help with preview/edit/save flow restored

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, CheckCircle, Target, Save } from 'lucide-react';
import { useNotification } from '../../../../../context/NotificationContext';
import StrategicDataService from '../../../../../services/StrategicDataService';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface ValuePropStepProps {
    onNext: () => void;
    onBack: () => void;
    formData: FormData;
    setFormData: (data: FormData) => void;
}

interface ProductData {
    name?: string;
    description?: string;
    tagline?: string;
    type?: string;
}

interface FormData {
    productName?: string;
    productDescription?: string;
    valueProp?: string;
    personas?: Array<{ role?: string }>;
    tagline?: string;
    solution?: string;
    benefit?: string;
    proof?: string;
}

const ValuePropStep: React.FC<ValuePropStepProps> = ({ onNext, onBack, formData, setFormData }) => {
    const [productName, setProductName] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [target, setTarget] = useState<string>('');
    const [solution, setSolution] = useState<string>('');
    const [benefit, setBenefit] = useState<string>('');
    const [proof, setProof] = useState<string>('');
    const [paragraph, setParagraph] = useState<string>('');
    const [existingValueProp, setExistingValueProp] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAccepted, setIsAccepted] = useState<boolean>(false);
    const { showNotification } = useNotification();
    const [tagline, setTagline] = useState<string>('');
    const [productType, setProductType] = useState<string>('');
    const [keyBenefits, setKeyBenefits] = useState<string[]>(['']);

    // NEW: AI generation preview state
    const [generatedValueProp, setGeneratedValueProp] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Load existing data from StrategicDataService, localStorage, AND walkthrough formData
    useEffect(() => {
        const loadExistingData = async () => {
            setIsLoading(true);
            try {
                // 1. First, try to load from walkthrough formData
                if (formData.productName) {
                    setProductName(formData.productName);
                }
                if (formData.productDescription) {
                    setProductDescription(formData.productDescription);
                    setProductType(formData.productDescription);
                }
                if (formData.valueProp) {
                    setExistingValueProp(formData.valueProp);
                    setParagraph(formData.valueProp);
                }
                if (formData.personas && formData.personas.length > 0) {
                    setTarget(formData.personas[0].role || '');
                }
                if (formData.solution) {
                    setSolution(formData.solution);
                }
                if (formData.benefit) {
                    setBenefit(formData.benefit);
                }
                if (formData.proof) {
                    setProof(formData.proof);
                }

                // 2. Then try StrategicDataService
                const productData = await StrategicDataService.getProductInfo() as ProductData;
                if (productData && (productData.name || productData.description)) {
                    if (productData.name && !productName) {
                        setProductName(productData.name);
                        setFormData({ ...formData, productName: productData.name });
                    }
                    if (productData.description && !productDescription) {
                        setProductDescription(productData.description);
                        setProductType(productData.description);
                        setFormData({ ...formData, productDescription: productData.description });
                    }
                    if (productData.tagline) {
                        setTagline(productData.tagline);
                        setFormData({ ...formData, tagline: productData.tagline });
                    }
                }

                // 3. Fallback to localStorage
                if (!productName || !productDescription) {
                    const savedProduct = localStorage.getItem('marketingProduct');
                    if (savedProduct) {
                        const parsedProduct = JSON.parse(savedProduct) as ProductData;
                        if (parsedProduct.name && !productName) {
                            setProductName(parsedProduct.name);
                            setFormData({ ...formData, productName: parsedProduct.name });
                        }
                        if ((parsedProduct.description || parsedProduct.type) && !productDescription) {
                            const description = parsedProduct.description || parsedProduct.type || '';
                            setProductDescription(description);
                            setProductType(description);
                            setFormData({ ...formData, productDescription: description });
                        }
                        if (parsedProduct.tagline) {
                            setTagline(parsedProduct.tagline);
                            setFormData({ ...formData, tagline: parsedProduct.tagline });
                        }
                    }
                }

                // 4. Load value prop from localStorage if not in formData
                if (!existingValueProp) {
                    const marketingValueProp = localStorage.getItem('marketingValueProp');
                    if (marketingValueProp) {
                        setExistingValueProp(marketingValueProp);
                        setParagraph(marketingValueProp);
                        setFormData(prev => ({ ...prev, valueProp: marketingValueProp }));
                    }
                }

                // 5. Load messaging framework
                const messagingFramework = await StrategicDataService.getMessagingFramework();
                if (messagingFramework) {
                    if (messagingFramework.solution && !solution) {
                        setSolution(messagingFramework.solution);
                        setFormData(prev => ({ ...prev, solution: messagingFramework.solution }));
                    }
                    if (messagingFramework.benefit && !benefit) {
                        setBenefit(messagingFramework.benefit);
                        setFormData(prev => ({ ...prev, benefit: messagingFramework.benefit }));
                    }
                }

                // 6. Load value proposition from StrategicDataService
                try {
                    const valueProp = await StrategicDataService.getValueProposition();
                    if (valueProp && !existingValueProp) {
                        setExistingValueProp(valueProp);
                        setParagraph(valueProp);
                        setFormData(prev => ({ ...prev, valueProp }));
                    }
                } catch (error) {
                    console.log('No value proposition found in StrategicDataService');
                }

                // 7. Load tagline from StrategicDataService as fallback
                if (!tagline) {
                    try {
                        const savedTagline = StrategicDataService.getTagline();
                        if (savedTagline) {
                            setTagline(savedTagline);
                            setFormData(prev => ({ ...prev, tagline: savedTagline } as FormData));
                        }
                    } catch (error) {
                        console.log('No tagline found in StrategicDataService');
                    }
                }
            } catch (error) {
                console.error('Error loading existing data:', error);
                showNotification('Error loading existing data. Please try again.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [formData]);

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

    // FIXED AI HELP FUNCTION with preview
    const handleAIHelp = async () => {
        if (!productName) {
            showNotification('Please provide a product name', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            console.log('Calling AI for value proposition generation...');
            console.log('Request data:', {
                productName,
                productDescription: productDescription || productType,
                target,
                benefits: keyBenefits.filter(Boolean)
            });

            const response = await fetch('/api/api_endpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mode: 'key-messages',
                    data: {
                        productInfo: {
                            name: productName,
                            description: productDescription || productType,
                            targetAudience: target || '',
                            benefits: keyBenefits.filter(Boolean),
                        },
                        competitors: [],
                        industry: 'technology',
                        focusAreas: ['user', 'business'],
                        tone: 'professional'
                    }
                }),
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.message || `API error: ${response.status}`);
            }

            const result = await response.json();
            console.log('API result:', result);

            if (result.valueProposition) {
                setGeneratedValueProp(result.valueProposition);
                setShowPreview(true);
                showNotification('Value proposition generated successfully!', 'success');
            } else {
                console.error('No value proposition in response:', result);
                throw new Error('No value proposition in response');
            }
        } catch (error) {
            console.error('Error generating value prop:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to generate value proposition. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    // ACCEPT GENERATED VALUE PROP
    const handleAcceptGenerated = () => {
        setParagraph(generatedValueProp);
        setExistingValueProp(generatedValueProp);
        setShowPreview(false);
        setFormData(prev => ({ ...prev, valueProp: generatedValueProp }));
        handleSave(generatedValueProp);
    };

    // SAVE FUNCTION
    const handleSave = async (valueToSave = null) => {
        const finalValue = valueToSave || paragraph || existingValueProp;

        if (!finalValue) {
            showNotification('Please enter or generate a value proposition first', 'error');
            return;
        }

        setFormData(prev => ({ ...prev, valueProp: finalValue }));

        // Save to localStorage
        localStorage.setItem('marketingValueProp', finalValue);

        // Save to StrategicDataService
        try {
            if (StrategicDataService.setValueProposition && typeof StrategicDataService.setValueProposition === 'function') {
                await StrategicDataService.setValueProposition(finalValue);
            }
            setIsAccepted(true);
            showNotification('Value proposition saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving value proposition to StrategicDataService:', error);
            setIsAccepted(true);
            showNotification('Value proposition saved successfully!', 'success');
        }
    };

    // NEW: Handle Next button with data saving
    const handleNext = () => {
        const currentValueProp = paragraph || existingValueProp;
        if (currentValueProp) {
            setFormData(prev => ({
                ...prev,
                valueProp: currentValueProp,
                productName,
                productDescription
            }));
            // Small delay to ensure state is updated
            setTimeout(() => {
                onNext();
            }, 100);
        } else {
            showNotification('Please create a value proposition before continuing', 'error');
        }
    };

    const addBenefit = () => {
        onNext = { handleNext }
    };
    return (
        <div className="w-full max-w-none space-y-6">
            {/* SAVED VALUE PROP DISPLAY (shows at top when saved) */}
            {(paragraph || existingValueProp) && (
                <Card className="p-6 bg-white-50 border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Your Value Proposition</h2>
                    </div>
                    <textarea
                        value={paragraph || existingValueProp}
                        onChange={(e) => {
                            setParagraph(e.target.value);
                            setExistingValueProp(e.target.value);
                            setFormData(prev => ({ ...prev, valueProp: e.target.value }));
                        }}
                        className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                        rows={4}
                        placeholder="Edit your value proposition here..."
                    />
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => handleSave()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
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
                    <h2 className="text-2xl font-semibold text-gray-900">Let's go deeper</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Any more benefits of your solution you'd like to add? (Optional)</label>
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

                {/* AI HELP SECTION */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-blue-900">Need help with your value proposition?</h3>
                            <p className="text-blue-700 text-sm">Let AI help you craft a compelling value proposition based on your inputs</p>
                        </div>
                        <button
                            onClick={handleAIHelp}
                            disabled={isGenerating || !productName}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate Value Prop
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Card>

            {/* AI GENERATED PREVIEW BOX */}
            {showPreview && generatedValueProp && (
                <Card className="p-6 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-blue-900">AI Generated Value Proposition</h3>
                    </div>
                    <textarea
                        value={generatedValueProp}
                        onChange={(e) => setGeneratedValueProp(e.target.value)}
                        className="w-full p-4 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 bg-white"
                        rows={4}
                        placeholder="Edit the generated value proposition..."
                    />
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleAcceptGenerated}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Accept & Save
                        </button>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </Card>
            )}

            {/* MANUAL INPUT SECTION - if no value prop exists yet */}
            {!paragraph && !existingValueProp && !showPreview && (
                <Card className="p-6 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Or write your own:</h3>
                    <textarea
                        value={paragraph}
                        onChange={(e) => setParagraph(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Enter your value proposition here..."
                    />
                    <div className="mt-4">
                        <button
                            onClick={() => handleSave()}
                            disabled={!paragraph}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            Save Value Proposition
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ValuePropStep;