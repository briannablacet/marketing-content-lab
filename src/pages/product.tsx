// src/pages/product.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ProductStep from '../components/features/MarketingWalkthrough/components/ProductStep';

const ProductPage = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Define Your Product or Service
        </h1>
        <p className="text-gray-600">
          Tell us about your offering so we can help you create the perfect content strategy.
        </p>
      </div>

      <ProductStep 
        onNext={() => router.push('/')}
        onBack={() => router.push('/')}
      />
    </div>
  );
};

export default ProductPage;