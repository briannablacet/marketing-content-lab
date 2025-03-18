// src/pages/style-checker.tsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { NotificationProvider } from '../context/NotificationContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ScreenTemplate } from '../components/shared/UIComponents';
import { Check, Settings } from 'lucide-react';

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
          subtitle="Check your content against style guidelines and improve consistency"
          aiInsights={[
            "Consistent brand style increases content recognition by up to 23%",
            "Organizations with style compliance show 35% stronger brand perception",
            "Fixing style inconsistencies can improve readability by up to 42%"
          ]}
        >
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => setActiveView('check')}
                className={`px-6 py-2 text-sm font-medium flex items-center ${
                  activeView === 'check'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Style Checker
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`px-6 py-2 text-sm font-medium flex items-center ${
                  activeView === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Style Settings
              </button>
            </div>
          </div>

          {/* Feature Info Cards */}
          {activeView === 'check' && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-blue-800 mb-2">Check Content</h3>
                    <p className="text-sm text-blue-700">
                      Paste text or upload documents to analyze for style compliance issues
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-green-800 mb-2">Fix Issues</h3>
                    <p className="text-sm text-green-700">
                      Get recommendations to fix style inconsistencies in your content
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-100">
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-purple-800 mb-2">Maintain Consistency</h3>
                    <p className="text-sm text-purple-700">
                      Keep your brand voice consistent across all marketing materials
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Main Content */}
          {activeView === 'check' ? (
            <StyleComplianceChecker />
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