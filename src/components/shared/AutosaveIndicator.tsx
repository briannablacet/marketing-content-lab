// src/components/shared/AutosaveIndicator.tsx
import React, { useState, useEffect } from 'react';

export const AutosaveIndicator = () => {
  const [saveState, setSaveState] = useState<'saved' | 'saving'>('saved');

  // Demo the saving state whenever the component mounts
  useEffect(() => {
    setSaveState('saving');
    const timer = setTimeout(() => {
      setSaveState('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <div className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
        {saveState === 'saving' ? (
          <>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Saving changes...</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">All changes saved</span>
          </>
        )}
      </div>
    </div>
  );
};