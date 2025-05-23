// src/pages/brand-compass.tsx
import React from 'react';
import BrandCompass from '../components/features/BrandCompass/index';
import { useRouter } from 'next/router';

const BrandCompassPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => router.push('/review-program')}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Review
                </button>
                <BrandCompass />
            </div>
        </div>
    );
};

export default BrandCompassPage;