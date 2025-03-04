// src/pages/creation-hub.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled to prevent SSR-related issues
const CreationHub = dynamic(() => import('../components/features/CreationHub'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Creation Hub...</div>
});

export default function CreationHubPage() {
  return <CreationHub />;
}