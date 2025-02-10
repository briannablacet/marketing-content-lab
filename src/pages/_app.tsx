// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.css';
import { DemoModeProvider } from '../context/DemoModeContext';
import { MarketingProgramProvider } from '../context/MarketingContext';
import { ContentProvider } from '../context/ContentContext';
import { BrandVoiceProvider } from '../context/BrandVoiceContext';
import Navbar from '../components/shared/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MarketingProgramProvider>
      <DemoModeProvider>
        <BrandVoiceProvider>
          <ContentProvider>
            <Navbar />
            <Component {...pageProps} />
          </ContentProvider>
        </BrandVoiceProvider>
      </DemoModeProvider>
    </MarketingProgramProvider>
  );
}

export default MyApp;