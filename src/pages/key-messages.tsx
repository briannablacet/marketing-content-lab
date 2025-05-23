// src/pages/key-messages.tsx
import React from 'react';
import { useRouter } from 'next/router';
import MessagingStep from '../components/features/MarketingWalkthrough/components/MessagingStep';
import { NotificationProvider } from '../context/NotificationContext';
import ScreenTemplate from '../components/shared/UIComponents';

const KeyMessagesPage = () => {
  const router = useRouter();

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScreenTemplate
            title="Key Messages"
            subtitle="Craft compelling messages that communicate your value and resonate with your audience."
            isWalkthrough={false}
            hideNavigation={true}
          >
            <MessagingStep
              isWalkthrough={false}
              onNext={() => router.push('/')}
              onBack={() => router.push('/')}
            />
          </ScreenTemplate>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default KeyMessagesPage;