// /src/components/features/MarketingWalkthrough/components/ValuePropStep/index.tsx

import React, { useEffect, useState } from "react";

interface ValuePropStepProps {
    onNext: () => void;
    onBack: () => void;
    isWalkthrough?: boolean;
    formData: {
        productName: string;
        benefits: string[];
        targetAudience: string;
        valueProp: string;
    };
    setFormData: (data: any) => void;
}

const ValuePropStep: React.FC<ValuePropStepProps> = ({
    onNext,
    onBack,
    formData,
    setFormData,
}) => {
    const [solution, setSolution] = useState(formData.productName || "");
    const [audience, setAudience] = useState(formData.targetAudience || "");
    const [benefits, setBenefits] = useState(formData.benefits.join(", ") || "");
    const [proof, setProof] = useState("");
    const [finalValueProp, setFinalValueProp] = useState("");

    useEffect(() => {
        const draft = `We help ${audience} by providing ${solution} that ${benefits}. What sets us apart is ${proof}.`;
        setFinalValueProp(draft);
    }, [audience, solution, benefits, proof]);

    const handleSave = () => {
        const updatedValueProp = {
            ...formData,
            targetAudience: audience,
            productName: solution,
            benefits: benefits.split(",").map((b) => b.trim()),
            valueProp: finalValueProp,
        };
        setFormData(updatedValueProp);
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Value Proposition</h2>
            <p className="text-gray-600">
                A value proposition communicates what you do, who it’s for, and why it matters—all in one powerful sentence.
                Don’t worry if it’s rough—we’ll help you polish it.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Who is your target audience?</label>
                    <input
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="E.g. early-stage SaaS startups, enterprise security teams"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">What do you provide?</label>
                    <input
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="E.g. a streamlined analytics platform"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">What benefit does this bring?</label>
                    <input
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="E.g. saves time, boosts productivity"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Why should people believe you?</label>
                    <input
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="E.g. backed by years of research, trusted by 500+ companies"
                    />
                </div>
            </div>

            <div className="mt-6 p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded">
                <h3 className="font-semibold text-indigo-700 mb-1">Your Value Prop Preview</h3>
                <p className="text-gray-800">{finalValueProp}</p>
            </div>

            
        </div>
    );
};

export default ValuePropStep;
