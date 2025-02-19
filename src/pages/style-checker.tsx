import React from 'react';
import StyleComplianceChecker from '../components/features/StyleCompliance';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';

const StyleCheckerPage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Style Guardian</h1>
          <p className="text-gray-600 text-center mb-8">
            Automatically verify your content against your brand style guidelines
          </p>
          <StyleComplianceChecker />
        </div>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default StyleCheckerPage;