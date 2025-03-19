// src/components/features/MarketingWalkthrough/components/StyleGuideStep/index.tsx
import React from 'react';
import WritingStyleModule from '../../../WritingStyleModule';
import { useWritingStyle } from '../../../../../context/WritingStyleContext';

const StyleGuideStep = ({ onNext, onBack }) => {
  const { writingStyle } = useWritingStyle();

  // This function gets called when the WritingStyleModule would normally navigate
  // But we'll just do nothing since navigation is handled by the walkthrough
  const handleStyleComplete = () => {
    // Do nothing - navigation is handled by walkthrough buttons
    console.log("Style configuration completed");
  };

  return (
    <div className="space-y-6">
      {/* Pass isWalkthrough=true to hide its own navigation buttons */}
      <WritingStyleModule 
        isWalkthrough={true}
        onNext={handleStyleComplete}
        onBack={onBack}
      />
    </div>
  );
};

export default StyleGuideStep;