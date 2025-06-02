// src/pages/settings.tsx
import React from 'react';
import ScreenTemplate from '@/components/shared/UIComponents';
import ConfigImportExport from '@/components/features/ConfigImportExport';
import { NotificationProvider } from '@/context/NotificationContext';
import { WritingStyleProvider } from '@/context/WritingStyleContext';
import { BrandVoiceProvider } from '@/context/BrandVoiceContext';
import { MessagingProvider } from '@/context/MessagingContext';
import { ContentProvider } from '@/context/ContentContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Type, MessageSquare, FileText, Save, Trash } from 'lucide-react';
import { useRouter } from 'next/router';

const SettingsPage: React.FC = () => {
  const router = useRouter();

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      // Clear all localStorage items related to the app
      const keysToRemove = [
        // Core settings
        'marketing-content-lab-writing-style',
        'marketing-content-lab-brand-voice',
        'marketing-content-lab-messaging',
        'marketing-content-lab-content-settings',

        // Boilerplates
        'brandBoilerplates',
        'savedBoilerplates',
        'marketingBoilerplate',
        'marketingBoilerplate20',
        'marketingBoilerplate50',
        'marketingBoilerplate100',

        // Product and audience
        'marketingProduct',
        'marketingTargetAudience',
        'marketingTargetAudiences',
        'marketingValueProp',

        // Brand
        'brandVision',
        'brandMission',

        // Messaging specific
        'marketingMessaging',
        'marketingMessages',
        'messageFramework',
        'marketingCompetitors',
        'marketingCompetitorAnalysis',

        // Walkthrough flags
        'content-creator-walkthrough-completed',
        'walkthrough-completed',
        'writing-style-completed',
        'marketing-content-lab-walkthrough'
      ];

      // Remove all specified keys
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Also clear any other potential items that might contain marketing data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('marketing') ||
          key.includes('content') ||
          key.includes('brand') ||
          key.includes('boilerplate') ||
          key.includes('message') ||
          key.includes('competitor')
        )) {
          localStorage.removeItem(key);
        }
      }

      // Reload the page to apply changes
      window.location.reload();
    }
  };

  return (
    <NotificationProvider>
      <WritingStyleProvider>
        <BrandVoiceProvider>
          <MessagingProvider>
            <ContentProvider>
              <ScreenTemplate
                title="Settings"
                subtitle="Manage your Marketing Content Lab configuration"
                hideNavigation={false}
              >
                <div className="mb-6">
                  <p className="text-gray-600">
                    Export your settings to back them up or import previously saved settings.
                    You can export each configuration section separately or reset all data.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                      <Type className="w-5 h-5 text-blue-600" />
                      <CardTitle>Writing Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Export or import your writing style guide preferences, formatting rules, and punctuation settings.
                      </p>
                      <ConfigImportExport
                        title="Writing Style"
                        configType="writing-style"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <CardTitle>Brand Voice</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Export or import your brand voice, tone, archetype, and content guidelines.
                      </p>
                      <ConfigImportExport
                        title="Brand Voice"
                        configType="brand-voice"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <CardTitle>Messaging</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Export or import your key messages, competitors, and differentiators.
                      </p>
                      <ConfigImportExport
                        title="Messaging"
                        configType="messaging"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <CardTitle>Content Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Export or import your content type preferences and settings.
                      </p>
                      <ConfigImportExport
                        title="Content Settings"
                        configType="content"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Data Management</h2>

                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-start">
                      <Trash className="w-6 h-6 text-red-600 mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Reset All Data</h3>
                        <p className="text-gray-700 mb-4">
                          This will reset all your data and configurations to default values. This action cannot be undone.
                        </p>
                        <button
                          onClick={handleResetAllData}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reset All Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </ScreenTemplate>
            </ContentProvider>
          </MessagingProvider>
        </BrandVoiceProvider>
      </WritingStyleProvider>
    </NotificationProvider>
  );
};

export default SettingsPage;