/**
 * File: src/components/ClientApp.tsx
 * 
 * Client-side only component that provides all application contexts
 */

import React from 'react';
import { AppProps } from 'next/app';
import { MarketingProvider } from '../src/context/MarketingContext';
import { WalkthroughProvider } from '../src/context/WalkthroughContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { ContentProvider } from '../src/context/ContentContext';
import { DemoModeProvider } from '../src/context/DemoModeContext';
import { MessagingProvider } from '../src/context/MessagingContext';
import { WritingStyleProvider } from '../src/context/WritingStyleContext';
import { BrandVoiceProvider } from '../src/context/BrandVoiceContext';
import Navbar from '../src/components/shared/Navbar';

interface ClientAppProps extends AppProps {
  router: any;
}

const ClientApp: React.FC<ClientAppProps> = ({ Component, pageProps, router }) => {
  return (
    // Wrap providers in order of dependency
    <NotificationProvider>
      <DemoModeProvider>
        <MarketingProvider>
          <ContentProvider>
            <MessagingProvider>
              <WritingStyleProvider>
                <BrandVoiceProvider>
                  <WalkthroughProvider>
                    <div className="min-h-screen bg-gray-50">
                      <Navbar />
                      <main className="container mx-auto px-4 py-8">
                        <Component {...pageProps} />
                      </main>
                    </div>
                  </WalkthroughProvider>
                </BrandVoiceProvider>
              </WritingStyleProvider>
            </MessagingProvider>
          </ContentProvider>
        </MarketingProvider>
      </DemoModeProvider>
    </NotificationProvider>
  );
};

export default ClientApp;