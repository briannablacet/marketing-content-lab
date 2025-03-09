/**
 * File: src/components/ClientApp.tsx
 * 
 * Client-side only component that provides all application contexts
 */

import React from 'react';
import { AppProps } from 'next/app';
import { MarketingProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ContentProvider } from '../context/ContentContext';
import { DemoModeProvider } from '../context/DemoModeContext';
import { MessagingProvider } from '../context/MessagingContext';
import { StyleGuideProvider } from '../context/StyleGuideContext';
import { BrandVoiceProvider } from '../context/BrandVoiceContext';
import Navbar from '../components/shared/Navbar';

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
              <StyleGuideProvider>
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
              </StyleGuideProvider>
            </MessagingProvider>
          </ContentProvider>
        </MarketingProvider>
      </DemoModeProvider>
    </NotificationProvider>
  );
};

export default ClientApp;