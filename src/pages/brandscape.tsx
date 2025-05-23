// src/pages/brandscape.tsx
// Brandscape hub page - placeholder for testing navbar links

import React from 'react';
import Navbar from '../components/shared/Navbar';
import BrandscapeHub from '../components/features/Brandscape';

const BrandscapePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <BrandscapeHub />
        </div>
    );
};

export default BrandscapePage;