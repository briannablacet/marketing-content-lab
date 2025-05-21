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
        {/* AI Insights Box */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Pro Tip</h3>
              <p className="text-blue-700">
                Use a template from our template gallery to help you get started. 
                <Link 
                  href="/templates" 
                  className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse templates
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <CreationHub />
      </WritingStyleProvider>
    </NotificationProvider>
  );
}