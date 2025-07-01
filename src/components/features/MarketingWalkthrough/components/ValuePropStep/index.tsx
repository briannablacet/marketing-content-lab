// src/components/features/MarketingWalkthrough/components/ValuePropStep/index.tsx
// FIXED: Now pulls tagline and other data from all possible sources like Brand Compass does

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

    // FIXED: Comprehensive data loading like Brand Compass
    useEffect(() => {
        const loadExistingData = async () => {
            setIsLoading(true);
            try {
                console.log('🔍 ValuePropStep: Loading data from all sources...');

                // 1. Get all strategic data like Brand Compass does
                const allData: any = StrategicDataService.getAllStrategicData();
                console.log('📊 All strategic data:', allData);

                // 2. Get localStorage data like Brand Compass does
                const productInfo: any = JSON.parse(localStorage.getItem('marketingProduct') || '{}');
                const messageFramework: any = JSON.parse(localStorage.getItem('messageFramework') || '{}');
                console.log('💾 Product info from localStorage:', productInfo);
                console.log('💾 Message framework from localStorage:', messageFramework);

                // 3. Check ALL possible locations for tagline (like Brand Compass does)
                const foundTagline = localStorage.getItem('brandTagline') ||
                    allData.tagline ||
                    productInfo.tagline ||
                    StrategicDataService.getTagline() ||
                    formData.tagline ||
                    '';

                console.log('🏷️ Found tagline:', foundTagline);

                // 4. Check ALL possible locations for mission and vision
                const mission = localStorage.getItem('brandMission') ||
                    allData.mission ||
                    StrategicDataService.getMission() ||
                    '';

                const vision = localStorage.getItem('brandVision') ||
                    allData.vision ||
                    StrategicDataService.getVision() ||
                    '';

                // 5. Get product name from all sources
                const foundProductName = formData.productName ||
                    productInfo?.name ||
                    allData.product?.name ||
                    '';

                // 6. Get product description from all sources
                const foundProductDescription = formData.productDescription ||
                    productInfo?.description ||
                    productInfo?.type ||
                    allData.product?.description ||
                    '';

                // 7. Get value proposition from all sources
                const foundValueProp = formData.valueProp ||
                    localStorage.getItem('marketingValueProp') ||
                    messageFramework?.valueProposition ||
                    allData.messaging?.valueProposition ||
                    productInfo?.valueProposition ||
                    '';

                // 8. Get target audience from all sources
                const idealCustomer = StrategicDataService.getAllStrategicDataFromStorage().idealCustomer;
                const foundTarget = formData.personas?.[0]?.role ||
                    (typeof idealCustomer === 'string' ? idealCustomer :
                        Array.isArray(idealCustomer) ? idealCustomer[0] :
                            idealCustomer?.role || '') ||
                    target;

                // 9. Get benefits from all sources
                const foundBenefits = messageFramework?.keyBenefits ||
                    allData.messaging?.keyBenefits ||
                    (keyBenefits.filter(Boolean).length > 1 ? keyBenefits : ['']);

                // 10. Set all the state with found data
                if (foundTagline) {
                    console.log('✅ Setting tagline:', foundTagline);
                    setTagline(foundTagline);
                }

                if (foundProductName) {
                    console.log('✅ Setting product name:', foundProductName);
                    setProductName(foundProductName);
                }

                if (foundProductDescription) {
                    console.log('✅ Setting product description:', foundProductDescription);
                    setProductDescription(foundProductDescription);
                    setProductType(foundProductDescription);
                }

                if (foundValueProp) {
                    console.log('✅ Setting value prop:', foundValueProp);
                    setExistingValueProp(foundValueProp);
                    setParagraph(foundValueProp);
                }

                if (foundTarget) {
                    console.log('✅ Setting target:', foundTarget);
                    setTarget(foundTarget);
                }

                if (foundBenefits && Array.isArray(foundBenefits)) {
                    console.log('✅ Setting benefits:', foundBenefits);
                    setKeyBenefits(foundBenefits.length > 0 ? foundBenefits : ['']);
                }

                // 11. Load messaging framework data
                const messagingFramework = await StrategicDataService.getMessagingFramework();
                if (messagingFramework) {
                    if (messagingFramework.solution && !solution) {
                        setSolution(messagingFramework.solution);
                    }
                    if (messagingFramework.benefit && !benefit) {
                        setBenefit(messagingFramework.benefit);
                    }
                }

                // 12. Update formData with all found values
                setFormData(prev => ({
                    ...prev,
                    productName: foundProductName || prev.productName,
                    productDescription: foundProductDescription || prev.productDescription,
                    tagline: foundTagline || prev.tagline,
                    valueProp: foundValueProp || prev.valueProp,
                    solution: messagingFramework?.solution || prev.solution,
                    benefit: messagingFramework?.benefit || prev.benefit
                }));

                console.log('🎉 ValuePropStep: Data loading complete');
            } catch (error) {
                console.error('❌ Error loading existing data:', error);
                showNotification('Error loading existing data. Please try again.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, []); // Only run once on mount

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
            valueProp: existingValueProp || paragraph,
            tagline
        }));
    }, [productName, productDescription, target, solution, benefit, proof, existingValueProp, paragraph, tagline]);

    // FIXED AI HELP FUNCTION with preview
    const handleAIHelp = async () => {
        if (!productName) {
            showNotification('Please provide a product name', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            console.log('🤖 Calling AI for value proposition generation...');
            console.log('📝 Request data:', {
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

            console.log('📡 API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ API error response:', errorData);
                throw new Error(errorData.message || `API error: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ AI result:', result);

            if (result.valueProposition) {
                setGeneratedValueProp(result.valueProposition);
                setShowPreview(true);
                showNotification('Value proposition generated successfully!', 'success');
            } else {
                console.error('❌ No value proposition in response:', result);
                throw new Error('No value proposition in response');
            }
        } catch (error) {
            console.error('❌ Error generating value prop:', error);
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
            console.error('❌ Error saving value proposition to StrategicDataService:', error);
            setIsAccepted(true);
            showNotification('Value proposition saved successfully!', 'success');
        }
    };

    // FIXED: Handle Next button with data saving
    const handleNext = () => {
        const currentValueProp = paragraph || existingValueProp;
        if (currentValueProp) {
            setFormData(prev => ({
                ...prev,
                valueProp: currentValueProp,
                productName,
                productDescription,
                tagline
            }));
            // Small delay to ensure state is updated
            setTimeout(() => {
                onNext();
            }, 100);
        } else {
            showNotification('Please create a value proposition before continuing', 'error');
        }
    };

    // FIXED: Add benefit function
    const addBenefit = () => {
        setKeyBenefits([...keyBenefits, '']);
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
                            onChange={(e) => {
                                setTagline(e.target.value);
                                setFormData(prev => ({ ...prev, tagline: e.target.value }));
                            }}
                            placeholder="e.g., No more crappy content"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Share a description of your business. Don't worry if it's not perfect.</label>
                        <textarea
                            value={productType}
                            onChange={(e) => {
                                setProductType(e.target.value);
                                setProductDescription(e.target.value);
                            }}
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