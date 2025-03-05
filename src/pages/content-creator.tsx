// src/pages/content-creator.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Use dynamic import with SSR disabled to prevent SSR-related issues
const ContentCreator = dynamic(() => import('../components/features/ContentCreator'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Content Creator...</div>
});

export default function ContentCreatorPage() {
  const router = useRouter();
  const { type } = router.query;
  
  // Get content type from URL or default to 'Blog Post'
  const contentType = typeof type === 'string' ? type : 'Blog Post';
  
  return <ContentCreator contentType={contentType} />;
}