// src/pages/creation-hub.tsx
import React from 'react';
import CreationHub from '../components/features/CreationHub';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { NotificationProvider } from '../context/NotificationContext';
import Link from 'next/link';
import { Lightbulb, ExternalLink } from 'lucide-react';

export default function CreationHubPage() {
  return (
    <NotificationProvider>
      <WritingStyleProvider>


        <CreationHub />
      </WritingStyleProvider>
    </NotificationProvider>
  );
}