// src/pages/product.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ProductStep from '../components/features/MarketingWalkthrough/components/ProductStep';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { NotificationProvider } from '../context/NotificationContext';
import { MarketingProvider } from '../context/MarketingContext';

const ProductPage = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <NotificationProvider>
      <MarketingProvider>
        <ScreenTemplate
          title="Define Your Product or Service"
          subtitle="Tell us about your offering so we can help you create the perfect content strategy."
          aiInsights={[
            "Clear product definition improves content relevance by up to 40%",
            "Value propositions that focus on customer outcomes get better engagement",
            "Quantified benefits in your messaging increase conversion rates"
          ]}
          hideNavigation={true}
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