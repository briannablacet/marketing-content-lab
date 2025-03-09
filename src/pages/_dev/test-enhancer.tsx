// pages/dev/test-enhancer.tsx
import React from 'react';
import { StyleGuideProvider } from '../../context/StyleGuideContext';
import { ContentEnhancer } from '../../components/features/ContentEnhancer';

const TestEnhancerPage = () => {
  return (
    <StyleGuideProvider>
      <div className="max-w-screen-xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Content Enhancer Test Page</h1>
        <ContentEnhancer />
      </div>
    </StyleGuideProvider>
  );
};

export default TestEnhancerPage;