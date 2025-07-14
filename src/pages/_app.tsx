/**
 * File: src/pages/_app.tsx
 * 
 * Application wrapper component that provides all necessary contexts
 * Removed extraneous writing style
 */

import { AppProps } from 'next/app';
import '@/styles/globals.css';
import { MarketingProvider } from '@/context/MarketingContext';
import { WalkthroughProvider } from '@/context/WalkthroughContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ContentProvider } from '@/context/ContentContext';
import { DemoModeProvider } from '@/context/DemoModeContext';
import { MessagingProvider } from '@/context/MessagingContext';
import { WritingStyleProvider } from '../context/WritingStyleContext';
import { BrandVoiceProvider } from '@/context/BrandVoiceContext';
import { AuthProvider } from '@/context/AuthContext';
import { ContentLibraryProvider } from '@/context/ContentLibraryContext'; // ADD THIS IMPORT
import Navbar from '@/components/shared/Navbar';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Wrap providers in order of dependency
    <NotificationProvider>
      <DemoModeProvider>
        <MarketingProvider>
          <ContentProvider>
            <ContentLibraryProvider> {/* ADD THIS PROVIDER */}
              <MessagingProvider>
                <WritingStyleProvider>
                  <BrandVoiceProvider>
                    <WalkthroughProvider>
                      <AuthProvider>
                        <div className="min-h-screen bg-gray-50">
                          <Navbar />
                          <main className="container mx-auto px-4 py-8">
                            <Component {...pageProps} />
                          </main>
                          <Toaster position="top-right" />
                        </div>
                      </AuthProvider>
                    </WalkthroughProvider>
                  </BrandVoiceProvider>
                </WritingStyleProvider>
              </MessagingProvider>
            </ContentLibraryProvider> {/* CLOSE THE PROVIDER */}
          </ContentProvider>
        </MarketingProvider>
      </DemoModeProvider>
    </NotificationProvider>
  );
}

export default MyApp;