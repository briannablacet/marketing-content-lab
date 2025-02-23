//src/components/features/MarketingWalkthrough/components/StyleGuideStep.tsx
// 
import React, { useState } from 'react';
import WritingStyleModule from '../../../WritingStyleModule';
import { Card } from '@/components/ui/card';
import StyleComplianceChecker from '../../../StyleCompliance';
import { useWritingStyle } from '../../../../../context/WritingStyleContext';

interface StyleGuideStepProps {
  onNext: () => void;
  onBack: () => void;
  isWalkthrough?: boolean;
}

const StyleGuideStep: React.FC<StyleGuideStepProps> = ({ onNext, onBack, isWalkthrough = true }) => {
  const { writingStyle } = useWritingStyle();
  const [showStyleChecker, setShowStyleChecker] = useState(false);

  const handleStyleGuideComplete = async () => {
    if (!showStyleChecker) {
      // After setting up style guide, show the checker
      setShowStyleChecker(true);
    } else {
      // After using the checker, proceed to next step
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {!showStyleChecker ? (
        // First show the style guide selection/upload
        <WritingStyleModule 
          isWalkthrough={true}
          onNext={handleStyleGuideComplete}
          onBack={onBack}
        />
      ) : (
        // Then show the style checker with a sample
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
              onClick={handleStyleGuideComplete}
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