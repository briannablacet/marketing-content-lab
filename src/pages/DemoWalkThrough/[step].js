// src/pages/demo/[step].js
import React from 'react';
import dynamic from 'next/dynamic';

// Import the DemoWalkthrough component
const DemoWalkthrough = dynamic(
  () => import('../../components/features/DemoWalkthrough').then(mod => mod.default),
  { ssr: false }
);

export default function DemoPage() {
  return <DemoWalkthrough />;
}