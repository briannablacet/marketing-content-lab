//src/pages/writing-style.tsx
import React from 'react';
import WritingStyleModule from '../components/features/WritingStyleModule';
import { NotificationProvider } from '../context/NotificationContext';
import ScreenTemplate from '../components/shared/UIComponents';

const WritingStylePage: React.FC = () => {
  return (
    <NotificationProvider>
      {/* REMOVED: WritingStyleProvider - this should be in _app.tsx */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScreenTemplate
            title="Style Guide Builder"
            subtitle="Define your brand's writing style and content guidelines to ensure consistent messaging across all channels."
            isWalkthrough={false}
            hideNavigation={true}
            currentStep={1}
            totalSteps={1}
            onNext={() => { }}
            onBack={() => { }}
            onSkip={() => { }}
            onExit={() => { }}
          >
            <WritingStyleModule isWalkthrough={false} />
          </ScreenTemplate>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default WritingStylePage;