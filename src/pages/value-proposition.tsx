// src/pages/value-proposition.tsx
// Standalone Value Proposition page using existing ValuePropStep component with context providers

import React from 'react';
import ValuePropStep from '../components/features/MarketingWalkthrough/components/ValuePropStep';
import { NotificationProvider } from '../context/NotificationContext';

const ValuePropositionPage: React.FC = () => {
    return (
        <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Proposition Builder</h1>
                        <p className="text-gray-600">Craft compelling value propositions that resonate with your audience</p>
                    </div>

                    <ValuePropStep />
                </div>
            </div>
        </NotificationProvider>
    );
};

export default ValuePropositionPage;