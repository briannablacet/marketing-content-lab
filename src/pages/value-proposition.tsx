// src/pages/value-proposition.tsx
// Standalone Value Proposition page using existing ValuePropStep component with context providers

import React from 'react';
import ValuePropStep from '../components/features/MarketingWalkthrough/components/ValuePropStep';
import { NotificationProvider } from '../context/NotificationContext';

const ValuePropositionPage: React.FC = () => {
    return (
        <NotificationProvider>
            <ValuePropStep />
        </NotificationProvider>
    );
};

export default ValuePropositionPage;