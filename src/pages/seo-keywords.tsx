// src/pages/seo-keywords.tsx
import React from 'react';
import { useRouter } from 'next/router';
import SeoKeywordsStep from '../components/features/MarketingWalkthrough/components/SeoKeywordsStep';

const SeoKeywordsPage = () => {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto p-8">   
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          SEO Keywords
        </h1>
        <p className="text-gray-600">
          Define and organize your SEO keywords to help your content reach the right audience.
        </p>
      </div>

      <SeoKeywordsStep 
        onNext={() => router.push('/')}
        onBack={() => router.push('/')}
        showSubmitButton={true}
        onSave={async (data) => {
          // TODO: Implement save functionality
          console.log('Saving SEO keywords:', data);
          // Simulate saving with a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          router.push('/');
        }}
      />
    </div>
  );
};

export default SeoKeywordsPage;