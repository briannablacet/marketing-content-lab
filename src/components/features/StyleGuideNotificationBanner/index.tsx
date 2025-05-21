// src/components/features/StyleGuideNotificationBanner/index.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Settings, X } from 'lucide-react';

// Simplified version that always shows up
const StyleGuideNotificationBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  // Only hide if explicitly dismissed
  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="w-full bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-800 font-medium">No Writing Style Configured</p>
            <p className="text-amber-700 text-sm mt-1">
              Using Chicago Manual of Style as default. For best results, configure your brand's 
              writing style guidelines or upload your style guide document.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-4">
          <Link 
            href="/writing-style" 
            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded flex items-center"
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Configure Style
          </Link>
          
          <button 
            onClick={handleDismiss}
            className="text-amber-500 hover:text-amber-700"
            aria-label="Dismiss notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleGuideNotificationBanner;