// src/pages/product.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ProductStep from '../components/features/MarketingWalkthrough/components/ProductStep';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { NotificationProvider } from '../context/NotificationContext';
import { MarketingProvider } from '../context/MarketingContext';
import { Package } from 'lucide-react';

const ProductPage = () => {
  const router = useRouter();

  return (
    <NotificationProvider>
      <MarketingProvider>
        <ScreenTemplate
          hideNavigation={true}
          title={
            <div className="text-center">
              <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Product Information
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tell us about your business, product, or service
              </p>
            </div>
          }
        >
          <ProductStep
            isWalkthrough={false}
          />
        </ScreenTemplate>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default ProductPage;