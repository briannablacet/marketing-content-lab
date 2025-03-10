// src/pages/product.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ProductStep from '../components/features/MarketingWalkthrough/components/ProductStep';

const ProductPage = () => {
  const router = useRouter();

  // This wrapper component provides navigation when viewing standalone
  const handleSave = () => {
    // Save logic if needed
    router.push('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Define Your Product or Service
        </h1>
        <p className="text-gray-600">
          Tell us about your offering so we can help you create the perfect content strategy.
        </p>
      </div>

      <ProductStep 
        onNext={handleSave}
        onBack={() => router.push('/')}
      />
      
      {/* Add standalone navigation here */}
      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProductPage;