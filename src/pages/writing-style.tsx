//src/pages/writing-style.tsx
import React from 'react';
import WritingStyleModule from '../components/features/WritingStyleModule';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';

const WritingStylePage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-left">Writing Style Configuration</h1>
          <p className="text-gray-600 text-left mb-8">
            Define your brand's writing style and content guidelines
          </p>

          {/* Make sure to set isWalkthrough to false for standalone mode */}
          <WritingStyleModule isWalkthrough={false} />
        </div>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default WritingStylePage;