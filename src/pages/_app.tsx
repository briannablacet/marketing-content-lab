/**
 * File: src/pages/_app.tsx
 * 
 * Application wrapper component that provides all necessary contexts
 */

import { AppProps } from 'next/app';
import '../styles/globals.css';
import { MarketingProvider } from '../context/MarketingContext';
import { WalkthroughProvider } from '../context/WalkthroughContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ContentProvider } from '../context/ContentContext';
import { DemoModeProvider } from '../context/DemoModeContext';
import { MessagingProvider } from '../context/MessagingContext';
import { StyleGuideProvider } from '../context/StyleGuideContext';
import { BrandVoiceProvider } from '../context/BrandVoiceContext';
import Navbar from '../components/shared/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
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
}

export default MyApp;