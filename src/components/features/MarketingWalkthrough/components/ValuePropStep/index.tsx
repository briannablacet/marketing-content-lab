// src/components/features/MarketingWalkthrough/components/ValuePropStep/index.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ValuePropStepProps {
    onNext: () => void;
    onBack: () => void;
    formData: any;
    setFormData: (data: any) => void;
}

const ValuePropStep: React.FC<ValuePropStepProps> = ({ onNext, onBack, formData, setFormData }) => {
    const [existingValueProp, setExistingValueProp] = useState('');
    const [target, setTarget] = useState('');
    const [solution, setSolution] = useState('');
    const [benefit, setBenefit] = useState('');
    const [proof, setProof] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const personas = formData.personas || [];
        if (personas.length) {
            setTarget(personas[0].role || '');
        }
    }, [formData]);

    useEffect(() => {
        if (!existingValueProp) {
            const vp = `We help ${target} by providing ${solution}, that ${benefit}. What sets us apart is ${proof}.`;
            setParagraph(vp);
            setFormData({ ...formData, valueProp: vp });
        }
    }, [target, solution, benefit, proof, existingValueProp]);

    const handleAIHelp = async () => {
        const productData = localStorage.getItem('marketingProduct');
        if (!productData) return;

        setIsLoading(true);
        try {
            const { name, type, description, benefits } = JSON.parse(productData);
            const requestBody = {
                endpoint: 'value-prop-generator',
                data: {
                    productName: name,
                    productType: type,
                    productDescription: description,
                    productBenefits: benefits,
                },
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
            if (result.valueProp) {
                const { target, solution, benefit, proof } = result.valueProp;
                setTarget(target);
                setSolution(solution);
                setBenefit(benefit);
                setProof(proof);
            }
        } catch (err) {
            console.error('Error generating value prop:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <h2 className="text-xl font-semibold">Value Proposition</h2>
            <p className="text-sm text-gray-600">
                A value proposition communicates what you do, who it’s for, and why it matters—all in one powerful sentence. Don’t worry if it’s rough—we’ll help you polish it.
            </p>

            <div className="grid gap-4">
                <div>
                    <label className="block font-medium mb-1">Already have a value proposition? Paste it here:</label>
                    <textarea
                        value={existingValueProp}
                        onChange={(e) => {
                            const val = e.target.value;
                            setExistingValueProp(val);
                            setParagraph(val);
                            setFormData({ ...formData, valueProp: val });
                        }}
                        placeholder="Paste your value proposition here..."
                        className="w-full p-2 border rounded"
                        rows={2}
                    />
                </div>

                {!existingValueProp && (
                    <>
                        <div>
                            <label className="block font-medium mb-1">Who is your target audience?</label>
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">What do you provide?</label>
                            <input
                                type="text"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">What benefit does this bring?</label>
                            <input
                                type="text"
                                value={benefit}
                                onChange={(e) => setBenefit(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Why should people believe you?</label>
                            <input
                                type="text"
                                value={proof}
                                onChange={(e) => setProof(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </>
                )}

                <div className="text-blue-600 hover:underline inline-flex items-center text-sm cursor-pointer" onClick={handleAIHelp}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {isLoading ? '✨ Drafting your value prop...' : '✨ Let AI suggest your value proposition'}
                </div>

                <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold mb-2 text-gray-800">Edit Your Final Value Proposition</h3>
                    <textarea
                        value={paragraph}
                        onChange={(e) => {
                            setParagraph(e.target.value);
                            setFormData({ ...formData, valueProp: e.target.value });
                        }}
                        className="w-full p-2 border rounded"
                        rows={4}
                    />
                </div>
            </div>
        </div>
    );
};

export default ValuePropStep;
