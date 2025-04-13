// src/pages/key-messages.tsx
import React from 'react';
import { useRouter } from 'next/router';
import MessagingStep from '../components/features/MarketingWalkthrough/components/MessagingStep';
import { NotificationProvider } from '../context/NotificationContext';

const KeyMessagesPage = () => {
  const router = useRouter();

  return (
    <NotificationProvider>
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Key Messages
          </h1>
          <p className="text-gray-600">
            Craft compelling messages that communicate your value and resonate with your audience.
          </p>
        </div>

        <MessagingStep
          isWalkthrough={false}
          onNext={() => router.push('/')}
          onBack={() => router.push('/')}
        />
      </div>
    </NotificationProvider>
  );
};

export default KeyMessagesPage;