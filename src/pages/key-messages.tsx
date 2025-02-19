// src/pages/key-messages.tsx
import React from 'react';
import { useRouter } from 'next/router';
import MessagingStep from '../components/features/MarketingWalkthrough/components/MessagingStep';

const KeyMessagesPage = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Key Messages
        </h1>
        <p className="text-gray-600">
          Craft compelling messages that communicate your value and resonate with your audience.
        </p>
      </div>

      <MessagingStep 
        onNext={() => router.push('/')}
        onBack={() => router.push('/')}
      />
    </div>
  );
};

export default KeyMessagesPage;