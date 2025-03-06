// src/pages/style-checker.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';

// Use dynamic import with SSR disabled to prevent SSR-related issues with file handling
const StyleComplianceChecker = dynamic(() => import('../components/features/StyleCompliance'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Style Compliance Checker...</div>
});

const StyleCheckerPage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <StyleComplianceChecker />
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default StyleCheckerPage;