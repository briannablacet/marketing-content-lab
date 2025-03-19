// src/components/features/MarketingWalkthrough/components/StyleGuideStep/index.tsx
import React from 'react';
import WritingStyleModule from '../../../WritingStyleModule';
import { useWritingStyle } from '../../../../../context/WritingStyleContext';

const StyleGuideStep = ({ onNext, onBack }) => {
  const { writingStyle } = useWritingStyle();

  return (
    <div className="space-y-6">
      {/* The WritingStyleModule with isWalkthrough=true will use the walkthrough navigation */}
      <WritingStyleModule 
        isWalkthrough={true}
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
};

export default StyleGuideStep;