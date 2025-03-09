// src/pages/product.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ProductStep from '../components/features/MarketingWalkthrough/components/ProductStep';
import { ScreenTemplate } from '../components/shared/UIComponents';

const ProductPage = () => {
  const router = useRouter();

  const handleNext = () => {
    // Simulate the save operation before navigating
    const productInfoForm = document.querySelector('form');
    if (productInfoForm) {
      productInfoForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
    
    // Navigate to dashboard or homepage after saving
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <ScreenTemplate
      title="Define Your Product or Service"
      subtitle="Tell us about your offering so we can help you create the perfect content strategy"
      aiInsights={[
        "Clear product definition improves all content marketing efforts",
        "Your value proposition is the foundation of effective messaging",
        "Benefits that focus on customer outcomes perform best"
      ]}
      onNext={handleNext}
      onBack={handleBack}
      nextButtonText="Save Product Info →"
    >
      <ProductStep 
        onNext={handleNext}
        onBack={handleBack}
      />
    </ScreenTemplate>
  );
};

export default ProductPage;