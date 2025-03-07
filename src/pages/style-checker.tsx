// src/pages/style-checker.tsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ScreenTemplate } from '../components/shared/UIComponents';

// Dynamic imports with SSR disabled to prevent issues with file handling
const StyleComplianceChecker = dynamic(() => import('../components/features/StyleCompliance'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading Style Compliance Checker...</div>
});

const WritingStyleModule = dynamic(() => import('../components/features/WritingStyleModule'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading Writing Style Module...</div>
});

const StyleCheckerPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'check' | 'settings'>('check');

  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <ScreenTemplate
          title="Style Guardian"
          subtitle="Set your brand style guidelines and check content for compliance"
          aiInsights={[
            "Consistent style guidelines improve brand perception by up to 30%",
            "Companies with strict style compliance show higher content engagement metrics"
          ]}
        >
          {/* Simple toggle buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => setActiveView('check')}
                className={`px-6 py-2 text-sm font-medium ${
                  activeView === 'check'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Check Content
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`px-6 py-2 text-sm font-medium ${
                  activeView === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Style Settings
              </button>
            </div>
          </div>

          {/* Content container */}
          {activeView === 'check' ? (
            <Card>
              <CardHeader>
                <CardTitle>Check Content Against Style Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <StyleComplianceChecker />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Configure Your Style Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <WritingStyleModule isWalkthrough={false} />
              </CardContent>
            </Card>
          )}
        </ScreenTemplate>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default StyleCheckerPage;