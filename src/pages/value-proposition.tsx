// src/pages/value-proposition.tsx
// Standalone Value Proposition page using existing ValuePropStep component with context providers

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Sparkles } from 'lucide-react';
import ScreenTemplate from '../components/shared/UIComponents';
import ValuePropStep from '../components/features/MarketingWalkthrough/components/ValuePropStep';
import { NotificationProvider } from '../context/NotificationContext';

const ValuePropositionPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({});

    const handleNext = () => {
        router.push('/ideal-customer');
    };

    const handleBack = () => {
        router.push('/product');
    };

    return (
        <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ScreenTemplate
                        title="Craft Your Value Proposition"
                        subtitle="Create a compelling statement that explains why customers choose you"
                        onNext={handleNext}
                        onBack={handleBack}
                        isWalkthrough={false}
                        currentStep={1}
                        totalSteps={1}
                        onSkip={() => { }}
                        onExit={() => router.push('/')}
                        hideNavigation={true}
                    >
                        <ValuePropStep onNext={handleNext} onBack={handleBack} formData={formData} setFormData={setFormData} />
                    </ScreenTemplate>
                </div>
            </div>
        </NotificationProvider>
    );
};

export default ValuePropositionPage;