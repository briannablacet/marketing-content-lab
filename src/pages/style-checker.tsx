//src/pages/style-checker.tsx
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { NotificationProvider } from '@/context/NotificationContext';
import { WritingStyleProvider } from '@/context/WritingStyleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScreenTemplate } from '@/components/shared/UIComponents';
import { Check, Settings } from 'lucide-react';

// Dynamic imports with SSR disabled to prevent issues with file handling
const StyleComplianceChecker = dynamic(() => import('../components/features/StyleCompliance'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading Style Guide Compliance Checker...</div>
});

const WritingStyleModule = dynamic(() => import('../components/features/WritingStyleModule'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading Writing Style Module...</div>
});

const StyleCheckerPage: React.FC = () => {
  const router = useRouter();
  const { view } = router.query;
  const [activeView, setActiveView] = useState<'check' | 'settings'>(
    view === 'settings' ? 'settings' : 'check'
  );

  // Update active view when query parameter changes
  useEffect(() => {
    if (view === 'settings') {
      setActiveView('settings');
    } else {
      setActiveView('check');
    }
  }, [view]);

  // Handle tab changes with URL updates
  const handleTabChange = (tab: 'check' | 'settings') => {
    setActiveView(tab);
    router.push({
      pathname: '/style-checker',
      query: tab === 'settings' ? { view: 'settings' } : {}
    }, undefined, { shallow: true });
  };

  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <ScreenTemplate
          title="Style Guide Compliance Checker"
          subtitle="Check your content against style guidelines and improve consistency"
          aiInsights={[
            "Consistent brand style increases content recognition by up to 23%",
            "Organizations with style compliance show 35% stronger brand perception",
            "Fixing style inconsistencies can improve readability by up to 42%"
          ]}
          // IMPORTANT: Do not include any walkthrough navigation props
          isWalkthrough={false}
        >
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => handleTabChange('check')}
                className={`px-6 py-2 text-sm font-medium flex items-center ${activeView === 'check'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Style Checker
              </button>
              <button
                onClick={() => handleTabChange('settings')}
                className={`px-6 py-2 text-sm font-medium flex items-center ${activeView === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Style Settings
              </button>
            </div>
          </div>

          {/* Feature Info Cards - Only show in check view */}
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
            // Explicitly set isWalkthrough to false for the checker
            <StyleComplianceChecker isWalkthrough={false} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Configure Your Style Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Explicitly set isWalkthrough to false and provide returnTo prop */}
                <WritingStyleModule
                  isWalkthrough={false}
                  returnTo="/style-checker"
                />
              </CardContent>
            </Card>
          )}
        </ScreenTemplate>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default StyleCheckerPage;