// src/pages/boilerplate-generator.tsx
import React from 'react';
import BoilerplateGenerator from '../components/features/BoilerplateGenerator';
import { NotificationProvider } from '../context/NotificationContext';
import { MessagingProvider } from '../context/MessagingContext';

const BoilerplateGeneratorPage: React.FC = () => {
    return (
        <NotificationProvider>
            <MessagingProvider>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <BoilerplateGenerator />
                </div>
            </MessagingProvider>
        </NotificationProvider>
    );
};

export default BoilerplateGeneratorPage;
