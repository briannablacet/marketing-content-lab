// src/pages/prose-perfector.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';

// Use dynamic import with SSR disabled to prevent SSR-related issues with file handling
const ProsePerfector = dynamic(() => import('../components/features/ProsePerfector'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Prose Perfector...</div>
});

const ProsePerfectorPage: React.FC = () => {
  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <ProsePerfector />
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default ProsePerfectorPage;