// src/pages/ab-testing-dashboard.tsx
import React, { useState } from 'react';
import { ScreenTemplate } from '../components/shared/UIComponents';
import ABTesting from './ab-testing';
import ABTestResultsTracker from '../components/features/ABTestResultsTracker';
import { Tab } from '@headlessui/react';
import { NotificationProvider } from '../context/NotificationContext';

const ABTestingDashboard: React.FC = () => {
  return (
    <NotificationProvider>
      <ScreenTemplate
        title="A/B Testing Dashboard"
        subtitle="Create, manage, and analyze your A/B tests"
        aiInsights={[
          "A/B testing can increase conversion rates by up to 30%",
          "Most successful teams run 2-3 A/B tests simultaneously",
          "Test for at least one full business cycle to account for day-of-week variations"
        ]}
      >
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-6">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                }`
              }
            >
              Create Tests
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                }`
              }
            >
              Test Results
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ABTesting />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ABTestResultsTracker />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </ScreenTemplate>
    </NotificationProvider>
  );
};

export default ABTestingDashboard;