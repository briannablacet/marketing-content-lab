import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Sparkles } from 'lucide-react';
import ScreenTemplate from '../components/shared/UIComponents';
import ValuePropStep from '../components/features/MarketingWalkthrough/components/ValuePropStep';

const ValuePropPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({});

    const handleNext = () => {
        router.push('/ideal-customer');
    };

    const handleBack = () => {
        router.push('/product');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-8">
                <div className="space-y-8 w-full">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-indigo-500" />
                            <h1 className="text-2xl font-semibold text-gray-900">Craft your value proposition</h1>
                        </div>
                        <p className="text-gray-600">Create a compelling statement that explains why customers choose you</p>
                    </div>
                </div>
                <ScreenTemplate
                    title="Value Proposition"
                    subtitle="Create a compelling statement that explains why customers choose you"
                    onNext={handleNext}
                    onBack={handleBack}
                    isWalkthrough={true}
                >
                    <ValuePropStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />
                </ScreenTemplate>
            </div>
        </div>
    );
};

export default ValuePropPage; 