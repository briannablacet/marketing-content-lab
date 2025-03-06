// src/pages/review-program.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ReviewStep from '../components/features/MarketingWalkthrough/components/ReviewStep';
import { ContentProvider } from '../context/ContentContext';
import { MarketingProvider } from '../context/MarketingContext';
import { NotificationProvider } from '../context/NotificationContext';

const ReviewProgramPage = () => {
  const router = useRouter();

  return (
    <NotificationProvider>
      <MarketingProvider>
        <ContentProvider>
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your Marketing Program
              </h1>
              <p className="text-gray-600">
                Review and manage your content marketing strategy.
              </p>
            </div>

            <ReviewStep 
              onNext={() => router.push('/creation-hub')}
              onBack={() => router.push('/')}
            />

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => router.push('/walkthrough/1')}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Edit Program
              </button>
              <button
                onClick={() => router.push('/creation-hub')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Content
              </button>
            </div>
          </div>
        </ContentProvider>
      </MarketingProvider>
    </NotificationProvider>
  );
};

export default ReviewProgramPage;