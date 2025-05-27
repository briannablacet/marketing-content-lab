// src/pages/brand-compass.tsx
import React from 'react';
import BrandCompass from '../components/features/BrandCompass/index';
import { useRouter } from 'next/router';
import ScreenTemplate from '../components/shared/UIComponents';

const BrandCompassPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <ScreenTemplate
                title="Brand Compass"
                subtitle="Use the Branding Wizard or standalone tools to fill out these content categories and display them in a format you can export as a North Star"
            >
                <BrandCompass />
            </ScreenTemplate>
        </div>
    );
};

export default BrandCompassPage;