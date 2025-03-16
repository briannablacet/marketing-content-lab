// src/components/features/StyleCompliance/index.tsx
import React, { useState } from 'react';
import WritingStyleModule from '../WritingStyleModule';
import { Card } from '@/components/ui/card';
import StyleComplianceChecker from '../StyleCompliance';
import { useWritingStyle } from '../../../context/WritingStyleContext';

interface StyleGuideStepProps {
  onNext: () => void;
  onBack: () => void;
  isWalkthrough?: boolean;
}

const StyleGuideStep: React.FC<StyleGuideStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const { writingStyle } = useWritingStyle();
  const [showStyleChecker, setShowStyleChecker] = useState(false);

  // This function is passed to WritingStyleModule as onNext
  const continueFromStyleGuide = () => {
    // When in walkthrough, go directly to next step without style checker
    if (isWalkthrough) {
      onNext(); // Call the parent onNext to continue the walkthrough
    } else {
      // Only for standalone use - show style checker
      setShowStyleChecker(true);
    }
  };

  // This function is used for the button in the style checker panel
  const continueToNextStep = () => {
    // Go to the next step regardless of whether we're in walkthrough or not
    onNext();
  };

  return (
    <div className="space-y-6">
      {!showStyleChecker ? (
        // First show the style guide selection/upload
        <WritingStyleModule 
          isWalkthrough={isWalkthrough}
          onNext={continueFromStyleGuide} // <-- Use the function that checks for walkthrough mode
          onBack={onBack}
        />
      ) : (
        // This only shows in standalone mode now
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Test Your Style Guide</h3>
            <p className="text-gray-600 mb-6">
              Let's make sure your style guide works as expected. Here's a sample piece of content - 
              use the Style Guardian below to check it against your style guide rules.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <p className="text-sm">Sample content to check:</p>
              <div className="mt-2 text-gray-700">
                ACME SOFTWARE INTRODUCES NEW FEATURE{'\n\n'}
                Acme Software, the leading provider of AI solutions announced today a groundbreaking feature. The new capability combines machine learning artificial intelligence and automation to deliver results.{'\n\n'}
                Key benefits include
                • Increased efficiency
                • Better results
                • Enhanced productivity
              </div>
            </div>
          </Card>

          <StyleComplianceChecker />

          <div className="flex justify-end mt-6">
            <button
              onClick={continueToNextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue to Next Step →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleGuideStep;