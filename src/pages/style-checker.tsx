// src/pages/style-checker.tsx
import React from 'react';
import StyleComplianceChecker from '../components/features/StyleCompliance';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';

const StyleCheckerPage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <div className="max-w-6xl mx-auto p-8">  // Changed to max-w-6xl and added p-8
          <h1 className="text-2xl font-bold mb-8">Style Guardian</h1>
          <p className="text-gray-600 mb-8">
            Automatically verify your content against your brand style guidelines
          </p>
          <StyleComplianceChecker />
        </div>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default StyleCheckerPage;