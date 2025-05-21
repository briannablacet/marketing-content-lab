// src/components/shared/DemoModeToggle.tsx
import React from 'react';
import { useDemoMode } from '../../context/DemoModeContext';

export const DemoModeToggle = () => {
  const { isDemoMode, setIsDemoMode } = useDemoMode();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isDemoMode}
          onChange={(e) => setIsDemoMode(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-slate-600">Demo Mode</span>
      </label>
    </div>
  );
};