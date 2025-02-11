// src/pages/writing-style.tsx
import React from 'react';
import WritingStyleModule from '../components/features/WritingStyleModule';

const WritingStylePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Writing Style Guide</h1>
      <WritingStyleModule />
    </div>
  );
};

export default WritingStylePage;